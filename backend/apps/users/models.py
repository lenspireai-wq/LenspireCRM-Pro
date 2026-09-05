from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.crypto import get_random_string
from apps.core.models import Organization, OrganizationScopedModel

class User(AbstractUser):
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.CASCADE, related_name="users")
    display_name = models.CharField(max_length=120, blank=True)
    mobile = models.CharField(max_length=30, blank=True)
    role = models.CharField(max_length=40, default="Administrator")
    department_access = models.JSONField(default=dict, blank=True)


class UserAuditActivity(OrganizationScopedModel):
    target_user = models.ForeignKey(
        User,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="audit_activities",
    )
    target_name = models.CharField(max_length=150)
    action = models.CharField(max_length=40)
    description = models.TextField()
    performed_by = models.CharField(max_length=150)

    class Meta:
        ordering = ("-created_at", "-id")


class UserNotificationPreference(models.Model):
    """Per-user, per-category notification settings.

    `enabled=False` mutes that category in the bell + dashboard. A row is
    created lazily the first time a user opens their notification settings.
    """
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notification_preferences"
    )
    category = models.CharField(max_length=40)
    enabled = models.BooleanField(default=True)
    email_digest = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("category",)
        constraints = [
            models.UniqueConstraint(
                fields=("user", "category"), name="uniq_user_category_pref"
            ),
        ]


class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="password_reset_tokens")
    token_hash = models.CharField(max_length=128, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    requested_ip = models.GenericIPAddressField(null=True, blank=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=("user", "used_at"))]

    @classmethod
    def issue(cls, user, ip=None, ttl_minutes=60):
        raw = get_random_string(48)
        from django.contrib.auth.hashers import make_password
        return cls.objects.create(
            user=user,
            token_hash=make_password(raw),
            expires_at=timezone.now() + timezone.timedelta(minutes=ttl_minutes),
            requested_ip=ip,
        ), raw

    def is_valid(self):
        return self.used_at is None and self.expires_at > timezone.now()

