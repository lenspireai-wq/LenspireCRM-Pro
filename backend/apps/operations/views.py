from io import BytesIO
from datetime import datetime

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
from .models import CalendarEvent, PhotographerDetail


CREW_FIELDS = ("photo", "video", "candid", "cinematic", "drone", "assistant", "bts")
PENDING_CREW_VALUES = {"", "X", "XX"}


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
        return queryset

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
                    raise serializers.ValidationError({"id": f"Invalid Event ID: {event_id!r}"})
            else:
                # Older exports did not contain an Event ID.  Match those rows
                # using the same organization-scoped identity used by the
                # serializer, but only update when the match is unambiguous.
                identity_fields = ("client_name", "contact_no", "event_type", "start_date", "start_time", "tbd_month")
                defaults = {"client_name": "", "contact_no": "", "event_type": "Shoot", "start_date": None, "start_time": None, "tbd_month": ""}
                identity = {
                    field: payload.get(field, defaults[field]) or defaults[field]
                    for field in identity_fields
                }
                candidates = CalendarEvent.objects.filter(
                    organization=request.user.organization,
                    is_archived=False,
                    **identity,
                )
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
                candidates = CalendarEvent.objects.filter(
                    is_archived=False,
                    **secondary_identity,
                )
                # An old workbook has no Event ID.  When it maps to duplicate
                # copies of the exact same event, update every copy instead of
                # rejecting the entire import.  Nothing is deleted.
                instances = list(candidates)
            if not instances:
                serializer = self.get_serializer(data=payload)
                if not serializer.is_valid():
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
                            "allow_duplicate_identity": len(instances) > 1,
                        },
                    )
                    if not serializer.is_valid():
                        return Response(
                            {"detail": f"Row {row_number}: {serializer.errors}"},
                            status=400,
                        )
                    self.perform_update(serializer)
                    updated += 1
        return Response({"created": created, "updated": updated}, status=201)


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
