from django.conf import settings
from django.db import models

from apps.core.models import Organization


class Notification(models.Model):
    LEVEL_INFO = "info"
    LEVEL_SUCCESS = "success"
    LEVEL_WARNING = "warning"
    LEVEL_ERROR = "error"
    LEVEL_CHOICES = (
        (LEVEL_INFO, "Info"),
        (LEVEL_SUCCESS, "Success"),
        (LEVEL_WARNING, "Warning"),
        (LEVEL_ERROR, "Error"),
    )

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="notifications")
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="notifications"
    )
    title = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    level = models.CharField(max_length=10, choices=LEVEL_CHOICES, default=LEVEL_INFO)
    category = models.CharField(max_length=40, default="general")
    link = models.CharField(max_length=255, blank=True)
    payload = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("organization", "recipient", "is_read")),
            models.Index(fields=("organization", "category")),
        ]


def broadcast(organization, *, title, body="", level=Notification.LEVEL_INFO, category="general", link="", payload=None, recipient=None):
    """Helper used across apps to push notifications."""
    return Notification.objects.create(
        organization=organization,
        recipient=recipient,
        title=title,
        body=body,
        level=level,
        category=category,
        link=link,
        payload=payload or {},
    )
