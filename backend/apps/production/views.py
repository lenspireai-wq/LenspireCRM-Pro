from io import BytesIO
from decimal import Decimal

from django.http import HttpResponse
from django.db.models import (
    Case,
    DecimalField,
    Exists,
    ExpressionWrapper,
    F,
    OuterRef,
    Q,
    Sum,
    Value,
    When,
)
from django.db.models.functions import Coalesce
from django.utils import timezone
from openpyxl import Workbook
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.core.api import OrganizationScopedViewSet
from apps.core.permissions import ProductionAccessPermission
from apps.users.models import User
from apps.operations.models import CalendarEvent
from .models import ClientPortalAccess, ClientPortalActivity, ProductionActivity, ProductionDeliverable, ProductionJob


DELIVERABLE_STATUSES = {
    "Unassigned",
    "Assigned",
    "In Progress",
    "Submitted for Review",
    "Revision Required",
    "Approved",
    "Sent to Client",
    "Client Changes",
    "Client Approved",
}


class ProductionDeliverableSerializer(serializers.ModelSerializer):
    editor_name = serializers.SerializerMethodField()
    editor_mobile = serializers.SerializerMethodField()

    class Meta:
        model = ProductionDeliverable
        fields = "__all__"
        read_only_fields = ("organization", "job", "submitted_at", "approved_at")

    def get_editor_name(self, obj):
        return (obj.editor.display_name or obj.editor.username) if obj.editor else ""

    def get_editor_mobile(self, obj):
        return getattr(obj.editor, "mobile", "") if obj.editor else ""

    def validate(self, attrs):
        request = self.context.get("request")
        editor = attrs.get("editor", getattr(self.instance, "editor", None))
        if editor and request and editor.organization_id != request.user.organization_id:
            raise serializers.ValidationError(
                {"editor": "Select an editor from this organization."}
            )
        status = attrs.get("status", getattr(self.instance, "status", "Unassigned"))
        if status not in DELIVERABLE_STATUSES:
            raise serializers.ValidationError({"status": "Select a valid status."})
        revision_notes = attrs.get(
            "revision_notes", getattr(self.instance, "revision_notes", "")
        )
        if status in {"Revision Required", "Client Changes"} and not str(
            revision_notes
        ).strip():
            raise serializers.ValidationError(
                {"revision_notes": "Add instructions before returning work to the editor."}
            )
        return attrs


class ProductionActivitySerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="job.customer.name", read_only=True)
    booking_code = serializers.CharField(source="job.booking.booking_code", read_only=True)
    event_type = serializers.CharField(source="job.booking.event_type", read_only=True)
    editor_id = serializers.IntegerField(source="job.editor_id", read_only=True)
    editor_name = serializers.SerializerMethodField()

    class Meta:
        model = ProductionActivity
        fields = "__all__"
        read_only_fields = ("organization", "job")

    def get_editor_name(self, obj):
        if not obj.job.editor:
            return ""
        return obj.job.editor.display_name or obj.job.editor.username


class ProductionJobSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="customer.name", read_only=True)
    booking_code = serializers.CharField(source="booking.booking_code", read_only=True)
    event_type = serializers.CharField(source="booking.event_type", read_only=True)
    event_date = serializers.DateField(source="booking.event_date", read_only=True)
    couple_name = serializers.CharField(source="booking.lead.couple_name", read_only=True, default="")
    editor_name = serializers.SerializerMethodField()
    editor_mobile = serializers.SerializerMethodField()
    activities = serializers.SerializerMethodField()
    deliverables = ProductionDeliverableSerializer(many=True, required=False)

    class Meta:
        model = ProductionJob
        fields = "__all__"
        read_only_fields = ("organization",)

    def validate(self, attrs):
        organization = self.context["request"].user.organization
        booking = attrs.get("booking", getattr(self.instance, "booking", None))
        customer = attrs.get("customer", getattr(self.instance, "customer", None))
        editor = attrs.get("editor", getattr(self.instance, "editor", None))
        if booking and booking.organization_id != organization.id:
            raise serializers.ValidationError({"booking": "Invalid booking."})
        if customer and customer.organization_id != organization.id:
            raise serializers.ValidationError({"customer": "Invalid customer."})
        if booking and customer and booking.customer_id != customer.id:
            raise serializers.ValidationError({"customer": "Customer does not match the booking."})
        if editor and editor.organization_id != organization.id:
            raise serializers.ValidationError({"editor": "Select an editor from this organization."})
        delivery_status = attrs.get("delivery_status", getattr(self.instance, "delivery_status", "Pending"))
        approval_status = attrs.get("client_approval_status", getattr(self.instance, "client_approval_status", "Pending"))
        if delivery_status == "Delivered":
            if approval_status != "Approved":
                raise serializers.ValidationError({"client_approval_status": "Client approval is required before final delivery."})
            if self.instance and self.instance.deliverables.filter(enabled=True).exclude(status="Client Approved").exists():
                raise serializers.ValidationError({"delivery_status": "Every enabled deliverable must be client-approved before final delivery."})
            if booking:
                totals = booking.payments.filter(status="Paid").aggregate(
                    received=Sum("amount", filter=~Q(payment_type="Refund")),
                    refunded=Sum("amount", filter=Q(payment_type="Refund")),
                )
                received = (totals["received"] or Decimal("0")) - (totals["refunded"] or Decimal("0"))
                if received < booking.quoted_amount:
                    raise serializers.ValidationError({"delivery_status": f"Full payment is required. Outstanding balance: {booking.quoted_amount - received}."})
            checklist_fields = ("photo_delivery_status", "video_delivery_status", "album_delivery_status")
            incomplete = [
                field
                for field in checklist_fields
                if attrs.get(field, getattr(self.instance, field, "Pending"))
                not in {"Delivered", "Not Applicable"}
            ]
            if incomplete:
                raise serializers.ValidationError({field: "Mark as Delivered or Not Applicable before final delivery." for field in incomplete})
            delivery_method = attrs.get("delivery_method", getattr(self.instance, "delivery_method", ""))
            if not str(delivery_method).strip():
                raise serializers.ValidationError({"delivery_method": "Select a final delivery method."})
        return attrs

    def get_editor_name(self, obj):
        if not obj.editor:
            return ""
        return obj.editor.display_name or obj.editor.username

    def get_editor_mobile(self, obj):
        return getattr(obj.editor, "mobile", "") if obj.editor else ""

    def get_activities(self, obj):
        return ProductionActivitySerializer(obj.activities.all()[:50], many=True).data

    def update(self, instance, validated_data):
        deliverables_data = validated_data.pop("deliverables", None)
        instance = super().update(instance, validated_data)
        if deliverables_data is None:
            return instance
        actor = self.context["request"].user
        actor_name = actor.display_name or actor.username
        for data in deliverables_data:
            name = str(data.get("name", "")).strip()
            if not name:
                continue
            previous = instance.deliverables.filter(name=name).first()
            previous_status = previous.status if previous else "Unassigned"
            editor = data.get("editor")
            enabled = data.get("enabled", True)
            status = data.get("status") or ("Assigned" if editor and enabled else "Unassigned")
            if not enabled or not editor:
                status = "Unassigned"
            data["status"] = status
            if status == "Approved" and previous_status != "Approved":
                data["approved_at"] = timezone.now()
            if status in {"Revision Required", "Client Changes"} and status != previous_status:
                data["revision_count"] = (previous.revision_count if previous else 0) + 1
            deliverable, _ = instance.deliverables.update_or_create(
                organization=instance.organization,
                name=name,
                defaults=data,
            )
            old_editor_id = previous.editor_id if previous else None
            if old_editor_id != deliverable.editor_id:
                old_name = (
                    (previous.editor.display_name or previous.editor.username)
                    if previous and previous.editor
                    else "Unassigned"
                )
                new_name = deliverable.editor_name if hasattr(deliverable, "editor_name") else (
                    (deliverable.editor.display_name or deliverable.editor.username)
                    if deliverable.editor
                    else "Unassigned"
                )
                ProductionActivity.objects.create(
                    organization=instance.organization,
                    job=instance,
                    activity_type="Editor Assignment",
                    description=f"{name} reassigned from {old_name} to {new_name}.",
                    performed_by=actor_name,
                )
            if previous_status != deliverable.status:
                ProductionActivity.objects.create(
                    organization=instance.organization,
                    job=instance,
                    activity_type="Deliverable Status",
                    description=f"{name} changed from {previous_status} to {deliverable.status}.",
                    performed_by=actor_name,
                )
        return instance


class ProductionJobViewSet(OrganizationScopedViewSet):
    queryset = ProductionJob.objects.select_related("booking", "booking__lead", "customer", "editor").prefetch_related("deliverables__editor").all().order_by("due_date", "id")
    serializer_class = ProductionJobSerializer
    permission_classes = (ProductionAccessPermission,)
    filterset_fields = {"stage": ["exact", "in"], "raw_status": ["exact", "in"], "editing_status": ["exact", "in"], "album_status": ["exact", "in"], "video_status": ["exact", "in"], "client_approval_status": ["exact", "in"], "delivery_status": ["exact", "in"], "photo_delivery_status": ["exact", "in"], "video_delivery_status": ["exact", "in"], "album_delivery_status": ["exact", "in"], "editor": ["exact"], "due_date": ["exact", "gte", "lte"], "delivered_at": ["gte", "lte"]}
    search_fields = ("booking__booking_code", "customer__name", "customer__phone", "booking__lead__name", "booking__lead__mobile", "notes")
    ordering_fields = ("due_date", "delivered_at", "stage", "client_approval_status")

    def eligible_for_edit_queue(self, queryset):
        completed_events = CalendarEvent.objects.filter(
            booking_id=OuterRef("booking_id"), status__iexact="Completed"
        )
        completed_qualifying_events = CalendarEvent.objects.filter(
            booking_id=OuterRef("booking_id"),
            status__iexact="Completed",
            event_type__iregex=r"^(wedding|night wedding|pre[- ]?wedding|engagement)$",
        )
        wedding_events = CalendarEvent.objects.filter(
            booking_id=OuterRef("booking_id"),
            event_type__iregex=r"^(wedding|night wedding)$",
        )
        engagement_events = CalendarEvent.objects.filter(
            booking_id=OuterRef("booking_id"), event_type__iexact="Engagement"
        )
        prewedding_events = CalendarEvent.objects.filter(
            booking_id=OuterRef("booking_id"),
            event_type__iregex=r"^pre[- ]?wedding$",
        )
        money_field = DecimalField(max_digits=16, decimal_places=2)
        zero = Value(Decimal("0.00"), output_field=money_field)
        queryset = queryset.annotate(
            has_completed_event=Exists(completed_events),
            has_completed_qualifying_event=Exists(completed_qualifying_events),
            has_wedding_event=Exists(wedding_events),
            has_engagement_event=Exists(engagement_events),
            has_prewedding_event=Exists(prewedding_events),
            gross_paid=Coalesce(
                Sum(
                    "booking__payments__amount",
                    filter=Q(booking__payments__status__iexact="Paid")
                    & ~Q(booking__payments__payment_type__iexact="Refund"),
                ),
                zero,
            ),
            refunds=Coalesce(
                Sum(
                    "booking__payments__amount",
                    filter=Q(booking__payments__status__iexact="Paid")
                    & Q(booking__payments__payment_type__iexact="Refund"),
                ),
                zero,
            ),
        ).annotate(
            net_paid=ExpressionWrapper(
                F("gross_paid") - F("refunds"), output_field=money_field
            ),
            ninety_percent=ExpressionWrapper(
                F("booking__quoted_amount") * Value(Decimal("0.90")),
                output_field=money_field,
            ),
            fifty_percent=ExpressionWrapper(
                F("booking__quoted_amount") * Value(Decimal("0.50")),
                output_field=money_field,
            ),
            combined_wedding_package=Case(
                When(
                    (Q(has_wedding_event=True) & Q(has_engagement_event=True))
                    | (Q(has_wedding_event=True) & Q(has_prewedding_event=True))
                    | (Q(has_engagement_event=True) & Q(has_prewedding_event=True)),
                    then=Value(True),
                ),
                default=Value(False),
            ),
        )
        return queryset.filter(
            booking__lead__status__iexact="Confirmed",
            booking__status__iexact="Confirmed",
            booking__quoted_amount__gt=0,
            has_completed_event=True,
        ).filter(
            Q(
                combined_wedding_package=True,
                has_completed_qualifying_event=True,
                net_paid__gte=F("fifty_percent"),
            )
            | Q(
                combined_wedding_package=False,
                net_paid__gte=F("ninety_percent"),
            )
        )

    def get_queryset(self):
        queryset = super().get_queryset()
        is_editor = str(getattr(self.request.user, "role", "")).strip().lower() == "editor"
        if self.action in {"list", "export"} or is_editor:
            queryset = self.eligible_for_edit_queue(queryset)
        if is_editor:
            assigned_work = ProductionDeliverable.objects.filter(
                job_id=OuterRef("pk"), editor=self.request.user, enabled=True
            )
            queryset = queryset.annotate(
                assigned_to_current_editor=Exists(assigned_work)
            ).filter(assigned_to_current_editor=True)
        return queryset

    def update(self, request, *args, **kwargs):
        if str(getattr(request.user, "role", "")).strip().lower() == "editor":
            return Response(
                {"detail": "Editors can update only work assigned to them."},
                status=403,
            )
        return super().update(request, *args, **kwargs)

    def get_activity_queryset(self, request):
        queryset = ProductionActivity.objects.select_related(
            "job__customer", "job__booking", "job__editor"
        )
        if not request.user.is_superuser:
            queryset = queryset.filter(organization=request.user.organization)
        search = request.query_params.get("search", "").strip()
        editor = request.query_params.get("editor", "").strip()
        activity_type = request.query_params.get("activity_type", "").strip()
        date_from = request.query_params.get("date_from", "").strip()
        date_to = request.query_params.get("date_to", "").strip()
        if search:
            queryset = queryset.filter(
                Q(job__customer__name__icontains=search)
                | Q(job__booking__booking_code__icontains=search)
                | Q(job__booking__event_type__icontains=search)
                | Q(performed_by__icontains=search)
                | Q(description__icontains=search)
            )
        if editor:
            queryset = queryset.filter(job__editor_id=editor)
        if activity_type:
            queryset = queryset.filter(activity_type=activity_type)
        if date_from:
            queryset = queryset.filter(activity_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(activity_date__lte=date_to)
        return queryset

    @action(detail=False, methods=["get"], url_path="activity-history")
    def activity_history(self, request):
        queryset = self.get_activity_queryset(request)
        return Response(ProductionActivitySerializer(queryset, many=True).data)

    @action(detail=False, methods=["get"], url_path="activity-export")
    def activity_export(self, request):
        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Production Activity"
        sheet.append(
            [
                "Date",
                "Client",
                "Booking",
                "Event",
                "Activity Type",
                "Description",
                "Performed By",
                "Current Editor",
            ]
        )
        for activity in self.get_activity_queryset(request):
            editor_name = ""
            if activity.job.editor:
                editor_name = (
                    activity.job.editor.display_name or activity.job.editor.username
                )
            sheet.append(
                [
                    activity.activity_date,
                    activity.job.customer.name,
                    activity.job.booking.booking_code,
                    activity.job.booking.event_type,
                    activity.activity_type,
                    activity.description,
                    activity.performed_by,
                    editor_name,
                ]
            )
        sheet.freeze_panes = "A2"
        sheet.auto_filter.ref = sheet.dimensions
        stream = BytesIO()
        workbook.save(stream)
        response = HttpResponse(
            stream.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = (
            'attachment; filename="production-activity-history.xlsx"'
        )
        return response

    @action(detail=False, methods=["get"])
    def export(self, request):
        queryset = self.get_queryset()
        search = request.query_params.get("search", "").strip()
        editor = request.query_params.get("editor", "").strip()
        stage = request.query_params.get("stage", "").strip()
        job_status = request.query_params.get("status", "").strip()
        due_from = request.query_params.get("due_from", "").strip()
        due_to = request.query_params.get("due_to", "").strip()
        if search:
            queryset = queryset.filter(
                Q(customer__name__icontains=search)
                | Q(booking__booking_code__icontains=search)
                | Q(booking__event_type__icontains=search)
            )
        if editor:
            queryset = queryset.filter(editor_id=editor)
        if stage:
            queryset = queryset.filter(stage=stage)
        if job_status == "active":
            queryset = queryset.exclude(delivery_status="Delivered")
        elif job_status == "overdue":
            queryset = queryset.filter(
                due_date__lt=timezone.localdate()
            ).exclude(delivery_status="Delivered")
        elif job_status == "delivered":
            queryset = queryset.filter(delivery_status="Delivered")
        elif job_status == "unassigned":
            queryset = queryset.filter(editor__isnull=True)
        if due_from:
            queryset = queryset.filter(due_date__gte=due_from)
        if due_to:
            queryset = queryset.filter(due_date__lte=due_to)

        workbook = Workbook()
        sheet = workbook.active
        sheet.title = "Production Jobs"
        sheet.append(
            [
                "Client",
                "Booking",
                "Event",
                "Event Date",
                "Editor",
                "Stage",
                "Raw Data",
                "Editing",
                "Album",
                "Video",
                "Due Date",
                "Client Approval",
                "Delivery Status",
                "Delivery Method",
                "Notes",
            ]
        )
        for job in queryset:
            editor_name = ""
            if job.editor:
                editor_name = job.editor.display_name or job.editor.username
            sheet.append(
                [
                    job.customer.name,
                    job.booking.booking_code,
                    job.booking.event_type,
                    job.booking.event_date,
                    editor_name,
                    job.stage,
                    job.raw_status,
                    job.editing_status,
                    job.album_status,
                    job.video_status,
                    job.due_date,
                    job.client_approval_status,
                    job.delivery_status,
                    job.delivery_method,
                    job.notes,
                ]
            )
        sheet.freeze_panes = "A2"
        sheet.auto_filter.ref = sheet.dimensions
        stream = BytesIO()
        workbook.save(stream)
        response = HttpResponse(
            stream.getvalue(),
            content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        )
        response["Content-Disposition"] = 'attachment; filename="production-jobs.xlsx"'
        return response

    @action(detail=False, methods=["get"])
    def editors(self, request):
        users = User.objects.filter(
            organization=request.user.organization,
            is_active=True,
            role__in=("Editor", "Post Production"),
        ).order_by("display_name", "username")
        return Response(
            [
                {
                    "id": user.id,
                    "name": user.display_name or user.username,
                    "role": user.role,
                    "mobile": getattr(user, "mobile", ""),
                }
                for user in users
            ]
        )

    @action(
        detail=True,
        methods=["patch"],
        url_path=r"deliverables/(?P<deliverable_id>[^/.]+)",
    )
    def update_deliverable(self, request, pk=None, deliverable_id=None):
        job = self.get_object()
        deliverable = job.deliverables.select_related("editor").filter(
            pk=deliverable_id
        ).first()
        if not deliverable:
            return Response({"detail": "Deliverable not found."}, status=404)
        is_editor = str(getattr(request.user, "role", "")).strip().lower() == "editor"
        if is_editor and deliverable.editor_id != request.user.id:
            return Response({"detail": "This work is assigned to another editor."}, status=403)
        requested_status = str(request.data.get("status", deliverable.status)).strip()
        if is_editor and requested_status not in {"In Progress", "Submitted for Review"}:
            return Response({"detail": "Editors can start work or submit it for review."}, status=400)
        drive_link = str(request.data.get("drive_link", deliverable.drive_link or "")).strip()
        if requested_status == "Submitted for Review" and not drive_link:
            return Response({"drive_link": "Add the completed-work link before submitting."}, status=400)
        previous_status = deliverable.status
        deliverable.status = requested_status
        deliverable.drive_link = drive_link
        if requested_status == "Submitted for Review":
            deliverable.submitted_at = timezone.now()
        deliverable.save(update_fields=("status", "drive_link", "submitted_at", "updated_at"))
        if previous_status != requested_status:
            ProductionActivity.objects.create(
                organization=job.organization,
                job=job,
                activity_type="Deliverable Status",
                description=f"{deliverable.name} changed from {previous_status} to {requested_status}.",
                performed_by=request.user.display_name or request.user.username,
            )
        return Response(
            ProductionDeliverableSerializer(
                deliverable, context={"request": request}
            ).data
        )

    def perform_update(self, serializer):
        tracked_fields = {
            "stage": "Stage Change",
            "editor_id": "Editor Assignment",
            "raw_status": "Raw Data Status",
            "editing_status": "Editing Status",
            "album_status": "Album Status",
            "video_status": "Video Status",
            "client_approval_status": "Client Approval",
            "delivery_status": "Delivery Status",
            "photo_delivery_status": "Photo Delivery",
            "video_delivery_status": "Video Delivery",
            "album_delivery_status": "Album Delivery",
        }
        previous = {field: getattr(serializer.instance, field) for field in tracked_fields}
        delivery_status = serializer.validated_data.get("delivery_status", serializer.instance.delivery_status)
        delivered_at = serializer.validated_data.get("delivered_at", serializer.instance.delivered_at)
        approval_status = serializer.validated_data.get("client_approval_status", serializer.instance.client_approval_status)
        approved_at = serializer.validated_data.get("client_approved_at", serializer.instance.client_approved_at)
        updates = {}
        if approval_status == "Approved" and not approved_at:
            updates["client_approved_at"] = timezone.now()
        if delivery_status == "Delivered":
            updates["stage"] = "Delivered"
            if not delivered_at:
                updates["delivered_at"] = timezone.now()
        serializer.save(**updates)
        if delivery_status == "Delivered":
            portal = ClientPortalAccess.objects.filter(booking=serializer.instance.booking, closed_at__isnull=True).first()
            if portal:
                portal.closed_at = timezone.now(); portal.save(update_fields=("closed_at", "updated_at"))
                ClientPortalActivity.objects.create(organization=portal.organization, access=portal, booking=portal.booking, action="Portal Closed", detail="Project delivered and Client Portal closed automatically.")
        actor = self.request.user.display_name or self.request.user.username
        for field, activity_type in tracked_fields.items():
            current = getattr(serializer.instance, field)
            if previous[field] != current:
                old_value = previous[field] or "Unassigned"
                new_value = current or "Unassigned"
                if field == "editor_id":
                    old_editor = User.objects.filter(pk=previous[field]).first()
                    new_editor = serializer.instance.editor
                    old_value = (old_editor.display_name or old_editor.username) if old_editor else "Unassigned"
                    new_value = (new_editor.display_name or new_editor.username) if new_editor else "Unassigned"
                ProductionActivity.objects.create(
                    organization=serializer.instance.organization,
                    job=serializer.instance,
                    activity_type=activity_type,
                    description=f"{activity_type} changed from {old_value} to {new_value}.",
                    performed_by=actor,
                )

    @action(detail=True, methods=["post"])
    def reminder(self, request, pk=None):
        job = self.get_object()
        if (
            not job.due_date
            or job.due_date >= timezone.localdate()
            or job.delivery_status == "Delivered"
        ):
            return Response(
                {"detail": "Reminders can only be recorded for overdue, undelivered jobs."},
                status=400,
            )
        actor = request.user.display_name or request.user.username
        activity, created = ProductionActivity.objects.get_or_create(
            organization=job.organization,
            job=job,
            activity_type="Overdue Reminder",
            activity_date=timezone.localdate(),
            defaults={
                "description": f"Overdue reminder prepared for {job.stage}; due date {job.due_date or 'not set'}.",
                "performed_by": actor,
            },
        )
        return Response(
            ProductionActivitySerializer(activity).data,
            status=201 if created else 200,
        )
