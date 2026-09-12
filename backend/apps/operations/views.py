from io import BytesIO
from datetime import datetime
from calendar import month_abbr, month_name
import re

from django.db.models import Q
from django.core.exceptions import ValidationError as DjangoValidationError
from django.http import HttpResponse
from django.utils.dateparse import parse_time
from django.utils import timezone
from openpyxl import Workbook, load_workbook
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from apps.core.api import OrganizationScopedViewSet
from apps.core.permissions import OperationsAccessPermission
from apps.sales.models import Booking
from .models import CalendarEvent, PhotographerDetail


CREW_FIELDS = ("photo", "video", "candid", "cinematic", "drone", "assistant", "bts")
PENDING_CREW_VALUES = {"", "X", "XX"}


def normalized_text(value):
    return re.sub(r"[^a-z0-9]+", "", str(value or "").casefold())


def normalized_phone(value):
    digits = "".join(filter(str.isdigit, str(value or "")))
    return digits[-10:] if len(digits) >= 10 else digits


def confirmed_bookings_for_organization(organization):
    """Return only bookings that are safe targets for automatic event linking."""
    return list(
        Booking.objects.filter(
            organization=organization,
            status__iexact="Confirmed",
            lead__status__iexact="Confirmed",
        ).select_related("customer", "lead")
    )


def matching_confirmed_bookings(values, organization, bookings=None):
    """Find unambiguous confirmed bookings from an event's client identity.

    A couple-name match is sufficient only when it yields one confirmed booking.
    Otherwise, both client name and phone must match. This deliberately avoids
    linking an event based on a common client name alone.
    """
    client_name = normalized_text(values.get("client_name"))
    couple_name = normalized_text(values.get("couple_name"))
    contact_no = normalized_phone(values.get("contact_no"))
    if not couple_name and not (client_name and contact_no):
        return []

    matches = []
    for booking in bookings if bookings is not None else confirmed_bookings_for_organization(organization):
        lead = booking.lead
        customer = booking.customer
        couple_match = bool(couple_name and couple_name == normalized_text(lead.couple_name))
        name_match = bool(
            client_name
            and client_name
            in {
                normalized_text(lead.name),
                normalized_text(lead.client_name),
                normalized_text(customer.name),
            }
        )
        phone_match = bool(
            contact_no
            and contact_no
            in {
                normalized_phone(lead.mobile),
                normalized_phone(lead.client_mobile),
                normalized_phone(customer.phone),
            }
        )
        if couple_match or (name_match and phone_match):
            matches.append(booking)
    return matches


def event_identity(event):
    return {
        "client_name": event.client_name,
        "couple_name": event.couple_name,
        "contact_no": event.contact_no,
    }


def normalize_excel_time(value):
    """Return an Excel time in API format, or None when it is a free-text note."""
    if value is None or value == "":
        return value
    if hasattr(value, "strftime"):
        return value.strftime("%H:%M:%S")
    if not isinstance(value, str):
        return value

    candidate = value.strip()
    if not candidate:
        return ""
    parsed = parse_time(candidate)
    if parsed:
        return parsed.strftime("%H:%M:%S")
    for time_format in ("%I:%M %p", "%I:%M%p", "%I %p"):
        try:
            return datetime.strptime(candidate.upper(), time_format).strftime("%H:%M:%S")
        except ValueError:
            pass
    return None


def normalize_tbd_date(value):
    """Convert legacy values such as ``TBD - December`` to YYYY-MM."""
    if not isinstance(value, str) or "TBD" not in value.upper():
        return None
    normalized = value.upper()
    month = next(
        (
            number
            for number in range(1, 13)
            if re.search(rf"\b{month_name[number].upper()}\b|\b{month_abbr[number].upper()}\b", normalized)
        ),
        None,
    )
    if not month:
        return ""
    year_match = re.search(r"\b(20\d{2})\b", normalized)
    year = int(year_match.group(1)) if year_match else timezone.localdate().year
    if not year_match and month < timezone.localdate().month:
        year += 1
    return f"{year:04d}-{month:02d}"


def automatic_event_status(values, current_status: str | None = None) -> str:
    """Derive the operational status from date and assignment readiness."""
    current_status = current_status or str(getattr(values, "status", "Scheduled"))
    if current_status == "Cancelled":
        return "Cancelled"

    def value(field, default=""):
        if isinstance(values, dict):
            return values.get(field, default)
        return getattr(values, field, default)

    start_date = value("start_date", None)
    today = timezone.localdate()
    if start_date and start_date < today:
        return "Completed"
    if start_date == today:
        return "In Progress"
    if not start_date:
        return "Scheduled"

    crew_values = [str(value(field) or "").strip() for field in CREW_FIELDS]
    actual_crew = [item for item in crew_values if item.upper() != "NA"]
    crew_resolved = all(
        item.upper() not in PENDING_CREW_VALUES
        and (item.upper() == "NA" or len("".join(filter(str.isdigit, item))) >= 10)
        for item in crew_values
    )
    details_ready = all(
        (
            str(value("city") or "").strip(),
            value("start_time", None),
            str(value("notes") or "").strip(),
            actual_crew,
        )
    )
    return "Confirmed" if crew_resolved and details_ready else "Scheduled"


class CalendarEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarEvent
        fields = "__all__"
        read_only_fields = ("organization",)

    def validate(self, attrs):
        request = self.context["request"]
        date_status = attrs.get("date_status", getattr(self.instance, "date_status", "Confirmed"))
        start_date = attrs.get("start_date", getattr(self.instance, "start_date", None))
        tbd_month = attrs.get("tbd_month", getattr(self.instance, "tbd_month", ""))
        if date_status == "Confirmed" and not start_date:
            raise serializers.ValidationError({"start_date": "A confirmed event needs a date."})
        if date_status == "TBD Month" and not tbd_month:
            raise serializers.ValidationError({"tbd_month": "Select the expected month."})
        current_status = attrs.get("status", getattr(self.instance, "status", "Scheduled"))
        lifecycle_values = {
            field: attrs.get(field, getattr(self.instance, field, None))
            for field in ("start_date", "start_time", "city", "notes", *CREW_FIELDS)
        }
        attrs["status"] = automatic_event_status(lifecycle_values, current_status)

        # Manual events are linked only when their client identity maps to one
        # confirmed booking. Explicitly supplied customer/booking values and
        # existing links are never replaced automatically.
        current_booking = getattr(self.instance, "booking", None)
        current_customer = getattr(self.instance, "customer", None)
        has_explicit_link = "booking" in attrs or "customer" in attrs
        if not current_booking and not current_customer and not has_explicit_link:
            identity_values = {
                "client_name": attrs.get("client_name", ""),
                "couple_name": attrs.get("couple_name", ""),
                "contact_no": attrs.get("contact_no", ""),
            }
            matches = matching_confirmed_bookings(identity_values, request.user.organization)
            if len(matches) == 1:
                attrs["booking"] = matches[0]
                attrs["customer"] = matches[0].customer

        identity_fields = ("client_name", "contact_no", "event_type", "start_date", "start_time", "tbd_month")
        defaults = {"client_name": "", "contact_no": "", "event_type": "Shoot", "start_date": None, "start_time": None, "tbd_month": ""}
        identity = {field: attrs.get(field, getattr(self.instance, field, defaults[field])) for field in identity_fields}
        duplicate = CalendarEvent.objects.filter(
            organization=request.user.organization,
            is_archived=False,
            **identity,
        )
        if self.instance:
            duplicate = duplicate.exclude(pk=self.instance.pk)
        if duplicate.exists() and not self.context.get("allow_duplicate_identity", False):
            raise serializers.ValidationError({"detail": "This event already exists. Change the client, contact, event type, date, or time before saving."})
        return attrs

class CalendarEventViewSet(OrganizationScopedViewSet):
    queryset = CalendarEvent.objects.filter(is_archived=False).order_by("start_date", "start_time")
    serializer_class = CalendarEventSerializer
    permission_classes = (OperationsAccessPermission,)
    filterset_fields = {"status": ["exact", "in"], "event_type": ["exact", "in"], "date_status": ["exact", "in"], "city": ["exact", "icontains"], "start_date": ["exact", "gte", "lte"], "assigned_user": ["exact"], "tbd_month": ["exact", "icontains"]}
    search_fields = ("title", "client_name", "couple_name", "contact_no", "city", "notes", "handled_by", "photo", "video", "candid", "cinematic", "drone", "assistant", "bts")
    ordering_fields = ("start_date", "start_time", "status")

    def get_queryset(self):
        queryset = super().get_queryset()
        today = timezone.localdate()
        # Lifecycle readiness is calculated when an event is saved.  On reads,
        # only date-driven transitions need updating; doing this in SQL avoids
        # loading every event before returning a paginated response.
        queryset.filter(start_date__lt=today).exclude(
            status__in=("Cancelled", "Completed")
        ).update(status="Completed")
        queryset.filter(start_date=today).exclude(
            status__in=("Cancelled", "In Progress")
        ).update(status="In Progress")
        changed = []
        for event in queryset.filter(status__in=("Completed", "In Progress")).exclude(
            start_date__lte=today
        ):
            event.status = automatic_event_status(event)
            changed.append(event)
        if changed:
            CalendarEvent.objects.bulk_update(changed, ("status",))

        # Calendar screens need both dated events in their visible grid and
        # date-TBD events assigned to the selected month.  These parameters
        # intentionally bypass the normal AND-only filter combination.
        calendar_from = self.request.query_params.get("calendar_from")
        calendar_to = self.request.query_params.get("calendar_to")
        calendar_month = self.request.query_params.get("calendar_month")
        if calendar_from and calendar_to and calendar_month:
            try:
                start = datetime.strptime(calendar_from, "%Y-%m-%d").date()
                end = datetime.strptime(calendar_to, "%Y-%m-%d").date()
                datetime.strptime(calendar_month, "%Y-%m")
            except ValueError:
                pass
            else:
                queryset = queryset.filter(
                    Q(start_date__gte=start, start_date__lte=end)
                    | Q(date_status="TBD Month", tbd_month=calendar_month)
                )
        return queryset

    @action(detail=False, methods=["get", "post"], url_path="link-confirmed-bookings")
    def link_confirmed_bookings(self, request):
        """Preview, then optionally repair, unlinked events with a safe match.

        GET is always read-only. POST requires ``{"apply": true}`` and links
        only events with exactly one confirmed booking match.
        """
        organization = request.user.organization
        bookings = confirmed_bookings_for_organization(organization)
        events = CalendarEvent.objects.filter(
            organization=organization,
            is_archived=False,
            booking__isnull=True,
            customer__isnull=True,
        ).order_by("id")
        preview = []
        eligible = []
        for event in events:
            matches = matching_confirmed_bookings(event_identity(event), organization, bookings)
            match_data = [
                {
                    "booking_id": booking.id,
                    "booking_code": booking.booking_code,
                    "lead_id": booking.lead_id,
                    "couple_name": booking.lead.couple_name,
                }
                for booking in matches
            ]
            outcome = "eligible" if len(matches) == 1 else "ambiguous" if matches else "unmatched"
            item = {
                "event_id": event.id,
                "title": event.title,
                "client_name": event.client_name,
                "couple_name": event.couple_name,
                "contact_no": event.contact_no,
                "outcome": outcome,
                "matches": match_data,
            }
            preview.append(item)
            if outcome == "eligible":
                eligible.append((event, matches[0]))

        apply = request.method == "POST" and request.data.get("apply") is True
        linked = 0
        if apply:
            for event, booking in eligible:
                linked += CalendarEvent.objects.filter(
                    pk=event.id,
                    organization=organization,
                    booking__isnull=True,
                    customer__isnull=True,
                ).update(booking=booking, customer=booking.customer)

        return Response(
            {
                "dry_run": not apply,
                "summary": {
                    "total_unlinked": len(preview),
                    "eligible": len(eligible),
                    "ambiguous": sum(item["outcome"] == "ambiguous" for item in preview),
                    "unmatched": sum(item["outcome"] == "unmatched" for item in preview),
                    "linked": linked,
                },
                "events": preview,
            }
        )

    @action(detail=False, methods=["get"])
    def export(self, request):
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Upcoming Events"
        # Keep the primary key in the workbook so importing an edited export can
        # update the same event instead of creating a second one.
        fields = ["id", "title", "client_name", "event_type", "start_date", "start_time", "city", "status", "handled_by", "couple_name", "contact_no", "photo", "video", "candid", "cinematic", "drone", "assistant", "bts", "notes"]
        sheet.append(fields)
        for event in self.get_queryset():
            sheet.append([getattr(event, field) for field in fields])
        stream = BytesIO()
        workbook.save(stream)
        response = HttpResponse(stream.getvalue(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response["Content-Disposition"] = 'attachment; filename="upcoming-events.xlsx"'
        return response

    @action(
        detail=False,
        methods=["post"],
        url_path="import",
        parser_classes=[MultiPartParser, FormParser],
    )
    def import_events(self, request):
        content_type = (request.content_type or "").lower()
        if content_type.startswith("multipart/"):
            upload = request.FILES.get("file")
        else:
            # The web application can send the workbook as a direct binary
            # body, avoiding proxies which incorrectly discard multipart files.
            upload = BytesIO(request.body) if request.body else None
        if not upload:
            return Response({"detail": "Choose an Excel file."}, status=400)
        sheet = load_workbook(upload, data_only=True).active
        worksheet_rows = sheet.iter_rows(values_only=True)
        headers = [str(value or "").strip() for value in next(worksheet_rows)]
        created = 0
        updated = 0
        skipped = 0
        for row_number, values in enumerate(worksheet_rows, start=2):
            row = dict(zip(headers, values))
            if not row.get("title"):
                continue
            editable_fields = {field.name for field in CalendarEvent._meta.fields if field.editable and not field.auto_created} - {"id", "organization", "created_at", "updated_at"}
            payload = {key: row.get(key) for key in headers if key in editable_fields}
            # openpyxl returns None for an empty cell.  CalendarEvent's text
            # fields are optional (blank=True), but they are not nullable;
            # passing None to the serializer therefore rejects otherwise valid
            # completed-event workbooks with blank City or Notes columns.
            text_fields = {
                field.name
                for field in CalendarEvent._meta.fields
                if field.name in editable_fields and field.get_internal_type() in {"CharField", "TextField"}
            }
            for field in text_fields:
                if field not in payload:
                    continue
                if payload[field] is None:
                    payload[field] = ""
                elif not isinstance(payload[field], str):
                    payload[field] = str(payload[field])
            # Older operational workbooks use "TBD" directly in the Date
            # column.  It is an intentional undated event, not a date value
            # for Django to parse. Keep it visible as TBD without requiring a
            # month that is not present in the workbook.
            raw_start_date = payload.get("start_date")
            tbd_month = normalize_tbd_date(raw_start_date)
            if tbd_month:
                payload["start_date"] = None
                payload["date_status"] = "TBD Month"
                payload["tbd_month"] = tbd_month
            elif isinstance(raw_start_date, str) and raw_start_date.strip().upper() in {"TBD", "TBC", "TO BE DECIDED"}:
                payload["start_date"] = None
                payload["date_status"] = "TBD"
            if payload.get("start_date") and hasattr(payload["start_date"], "strftime"):
                payload["start_date"] = payload["start_date"].strftime("%Y-%m-%d")
            invalid_start_time = False
            for field in ("start_time", "end_time"):
                if field not in payload:
                    continue
                normalized_time = normalize_excel_time(payload[field])
                if normalized_time is None:
                    if field == "start_time":
                        invalid_start_time = True
                        time_note = str(payload[field]).strip()
                        existing_notes = str(payload.get("notes") or "").strip()
                        payload["notes"] = f"{existing_notes}\nTime details: {time_note}".strip()
                    payload.pop(field)
                else:
                    payload[field] = normalized_time
            event_id = row.get("id")
            instances = []
            if event_id not in (None, ""):
                try:
                    instance = CalendarEvent.objects.filter(
                        organization=request.user.organization,
                        pk=int(event_id),
                    ).first()
                    if instance:
                        instances = [instance]
                except (TypeError, ValueError):
                    return Response(
                        {"detail": f"Row {row_number}: Invalid Event ID: {event_id!r}"},
                        status=400,
                    )
            else:
                # Older exports did not contain an Event ID.  Match those rows
                # using the same organization-scoped identity used by the
                # serializer, but only update when the match is unambiguous.
                identity_fields = ("client_name", "contact_no", "event_type", "start_date", "start_time", "tbd_month")
                defaults = {"client_name": "", "contact_no": "", "event_type": "Shoot", "start_date": None, "start_time": None, "tbd_month": ""}
                identity = {
                    # Keep explicit blank values exactly as the serializer
                    # does. Converting a blank event type to "Shoot" here
                    # makes the lookup miss an existing blank-valued row,
                    # which is then rejected as a duplicate on create.
                    field: payload[field] if field in payload else defaults[field]
                    for field in identity_fields
                }
                try:
                    candidates = CalendarEvent.objects.filter(
                        organization=request.user.organization,
                        is_archived=False,
                        **identity,
                    )
                    instances = list(candidates)
                except (DjangoValidationError, TypeError, ValueError) as exc:
                    return Response(
                        {"detail": f"Row {row_number}: Invalid event data: {exc}"},
                        status=400,
                    )
                # An old workbook has no Event ID. When it maps to duplicate
                # copies of the exact same event, update every copy instead of
                # rejecting the entire import. Nothing is deleted.
                # Older workbooks commonly store phone numbers as numbers or
                # with spaces.  In that case the otherwise identical record
                # cannot be found by the contact-number identity above.  The
                # exported title, date and time form a safe secondary key for
                # the completed-events workbook supplied by users.
                if not candidates.exists() and payload.get("title"):
                    secondary_identity = {
                        "organization": request.user.organization,
                        "title__iexact": str(payload["title"]).strip(),
                        "start_date": payload.get("start_date"),
                    }
                    if not invalid_start_time:
                        secondary_identity["start_time"] = payload.get("start_time")
                    try:
                        candidates = CalendarEvent.objects.filter(
                            is_archived=False,
                            **secondary_identity,
                        )
                        instances = list(candidates)
                    except (DjangoValidationError, TypeError, ValueError) as exc:
                        return Response(
                            {"detail": f"Row {row_number}: Invalid event data: {exc}"},
                            status=400,
                        )
            if not instances:
                serializer = self.get_serializer(data=payload)
                if not serializer.is_valid():
                    detail_errors = serializer.errors.get("detail", [])
                    if any("already exists" in str(error).lower() for error in detail_errors):
                        # A legacy row can be equivalent to an existing event
                        # while differing in formatting that prevents a safe
                        # deterministic match. It is already present, so do
                        # not block the rest of the import or create a copy.
                        skipped += 1
                        continue
                    return Response(
                        {"detail": f"Row {row_number}: {serializer.errors}"},
                        status=400,
                    )
                self.perform_create(serializer)
                created += 1
            else:
                for instance in instances:
                    serializer = self.get_serializer(
                        instance,
                        data=payload,
                        partial=True,
                        context={
                            **self.get_serializer_context(),
                            # A workbook row that matched an existing event
                            # is an update, not a new duplicate. Existing
                            # historical imports can legitimately contain
                            # repeated identities, so preserve them.
                            "allow_duplicate_identity": True,
                        },
                    )
                    if not serializer.is_valid():
                        return Response(
                            {"detail": f"Row {row_number}: {serializer.errors}"},
                            status=400,
                        )
                    self.perform_update(serializer)
                    updated += 1
        result = {"created": created, "updated": updated}
        if skipped:
            result["skipped"] = skipped
        return Response(result, status=201)


class PhotographerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhotographerDetail
        fields = "__all__"
        read_only_fields = ("organization",)

    def validate(self, attrs):
        request = self.context["request"]
        name = str(attrs.get("name", getattr(self.instance, "name", ""))).strip()
        mobile = "".join(character for character in str(attrs.get("mobile", getattr(self.instance, "mobile", ""))) if character.isdigit())[-10:]
        candidates = PhotographerDetail.objects.filter(organization=request.user.organization)
        if self.instance:
            candidates = candidates.exclude(pk=self.instance.pk)
        duplicate = next(
            (
                person
                for person in candidates.only("id", "name", "mobile")
                if (mobile and "".join(character for character in person.mobile if character.isdigit())[-10:] == mobile)
                or (not mobile and person.name.strip().casefold() == name.casefold())
            ),
            None,
        )
        if duplicate:
            field = "mobile" if mobile else "name"
            raise serializers.ValidationError({field: f"This photographer already exists as {duplicate.name}."})
        return attrs


class PhotographerDetailViewSet(OrganizationScopedViewSet):
    queryset = PhotographerDetail.objects.all()
    serializer_class = PhotographerDetailSerializer
    permission_classes = (OperationsAccessPermission,)
    filterset_fields = {"status": ["exact", "in"], "work": ["exact", "icontains"], "living_in": ["exact", "icontains"]}
    search_fields = ("name", "mobile", "work", "living_in")
    ordering_fields = ("name", "status")

    def get_queryset(self):
        # Crew is a studio-owned resource.  Even a platform administrator
        # working inside a studio should see that studio's crew total rather
        # than the combined total from every organization.
        return PhotographerDetail.objects.filter(organization=self.request.user.organization)
