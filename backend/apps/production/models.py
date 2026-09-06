from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone
from apps.core.models import OrganizationScopedModel
from apps.sales.models import Booking, Customer
class ProductionJob(OrganizationScopedModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="production_jobs")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    stage = models.CharField(max_length=40, default="Shoot Planning")
    raw_status = models.CharField(max_length=30, default="Pending")
    editing_status = models.CharField(max_length=30, default="Not Started")
    album_status = models.CharField(max_length=30, default="Not Started")
    video_status = models.CharField(max_length=30, default="Not Started")
    delivery_status = models.CharField(max_length=30, default="Pending")
    editor = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    due_date = models.DateField(null=True, blank=True)
    client_approval_status = models.CharField(max_length=30, default="Pending")
    client_approved_at = models.DateTimeField(null=True, blank=True)
    approval_notes = models.TextField(blank=True)
    delivery_method = models.CharField(max_length=40, blank=True)
    photo_delivery_status = models.CharField(max_length=30, default="Pending")
    video_delivery_status = models.CharField(max_length=30, default="Pending")
    album_delivery_status = models.CharField(max_length=30, default="Pending")
    delivered_at = models.DateTimeField(null=True, blank=True)
    notes = models.TextField(blank=True)


class ProductionActivity(OrganizationScopedModel):
    job = models.ForeignKey(ProductionJob, on_delete=models.CASCADE, related_name="activities")
    activity_type = models.CharField(max_length=40)
    description = models.TextField()
    performed_by = models.CharField(max_length=120)
    activity_date = models.DateField(default=timezone.localdate)

    class Meta:
        ordering = ("-created_at", "-id")
        constraints = [
            models.UniqueConstraint(
                fields=("organization", "job", "activity_type", "activity_date"),
                condition=Q(activity_type="Overdue Reminder"),
                name="unique_daily_production_reminder",
            )
        ]


class ProductionDeliverable(OrganizationScopedModel):
    job = models.ForeignKey(
        ProductionJob, on_delete=models.CASCADE, related_name="deliverables"
    )
    name = models.CharField(max_length=80)
    enabled = models.BooleanField(default=True)
    quantity = models.PositiveIntegerField(default=1)
    events = models.CharField(max_length=250, blank=True)
    editor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="production_deliverables",
    )
    due_date = models.DateField(null=True, blank=True)
    priority = models.CharField(max_length=20, default="Normal")
    status = models.CharField(max_length=40, default="Unassigned")
    drive_link = models.URLField(max_length=500, blank=True)
    revision_notes = models.TextField(blank=True)
    revision_count = models.PositiveIntegerField(default=0)
    submitted_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ("id",)
        constraints = [
            models.UniqueConstraint(
                fields=("organization", "job", "name"),
                name="unique_production_deliverable_per_job",
            )
        ]


class ClientPortalAccess(OrganizationScopedModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="portal_access")
    token_hash = models.CharField(max_length=64, unique=True)
    expires_at = models.DateTimeField()
    revoked_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    last_accessed_at = models.DateTimeField(null=True, blank=True)
    access_count = models.PositiveIntegerField(default=0)


class ClientPortalActivity(OrganizationScopedModel):
    access = models.ForeignKey(ClientPortalAccess, on_delete=models.CASCADE, related_name="activities")
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    detail = models.TextField(blank=True)

    class Meta:
        ordering = ("-created_at", "-id")


class ClientPortalUser(OrganizationScopedModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="portal_users")
    name = models.CharField(max_length=150)
    email = models.EmailField()
    mobile = models.CharField(max_length=30, blank=True)
    password_hash = models.CharField(max_length=256, blank=True)
    invite_token_hash = models.CharField(max_length=64, blank=True)
    invite_expires_at = models.DateTimeField(null=True, blank=True)
    session_token_hash = models.CharField(max_length=64, blank=True)
    session_expires_at = models.DateTimeField(null=True, blank=True)
    last_login_at = models.DateTimeField(null=True, blank=True)
    active = models.BooleanField(default=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=("organization", "email"), name="unique_client_portal_email_per_org")
        ]
