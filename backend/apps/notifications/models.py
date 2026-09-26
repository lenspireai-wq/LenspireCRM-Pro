from django.conf import settings
from django.db import models
from django.db.models import Q

from apps.core.models import Organization
from apps.core.permissions import department_level


# Keep notification categories tied to the same department permissions used by
# the rest of the CRM. A notification is relevant to every member of its
# department, including users with read-only access.
CATEGORY_DEPARTMENTS = {
    "sales": "sales",
    "lead": "sales",
    "booking": "sales",
    "client_portal": "sales",
    "payments": "accounts",
    "payment": "accounts",
    "reminder": "accounts",
    "production": "production",
    "operations": "operations",
    "event": "operations",
}
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


def visible_notifications_for(user):
    """Return notifications the user is authorised to see.

    Users see department broadcasts for departments they can access. A
    notification explicitly addressed to a user is visible only to that user,
    irrespective of its category. Administrators receive all department
    broadcasts but do not receive notifications addressed to somebody else.

    This is used by both the notification list and summary endpoints, keeping
    the desktop and mobile bell counts and contents in sync.
    """
    queryset = Notification.objects.filter(organization=user.organization)

    categories = [
        category
        for category, department in CATEGORY_DEPARTMENTS.items()
        if department_level(user, department) in {"read", "full"}
    ]
    allowed = Q(recipient__isnull=True, category__in=categories)
    allowed |= Q(recipient=user)
    return queryset.filter(allowed)
