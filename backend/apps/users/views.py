from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import update_last_login
from django.db import transaction
from django.utils import timezone
import os
from .models import PasswordResetToken, User, UserAuditActivity, UserNotificationPreference
from .authentication import ensure_studio_is_active
from apps.accounts.models import Payment, PaymentReminder
from apps.core.emailer import send_email
from apps.core.models import Organization, OrganizationAuditActivity
from apps.notifications.models import Notification
from apps.core.permissions import ACCESS_LEVELS, DEPARTMENTS, AdminAccessPermission
from apps.operations.models import CalendarEvent
from apps.production.models import ProductionJob
from apps.sales.models import Booking, Customer, Lead
from apps.storage.models import Attachment

class LoginThrottle(AnonRateThrottle):
    scope = "login"

class PasswordResetRequestThrottle(ScopedRateThrottle):
    scope = "password_reset_request"

class PasswordResetConfirmThrottle(ScopedRateThrottle):
    scope = "password_reset_confirm"

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        fields = ("id", "username", "display_name", "mobile", "role", "department_access", "is_active", "is_staff", "is_superuser", "is_platform_owner", "organization", "date_joined", "last_login", "password")
        read_only_fields = ("organization", "is_staff", "is_superuser", "is_platform_owner", "date_joined", "last_login")

    is_platform_owner = serializers.BooleanField(source="is_superuser", read_only=True)
    def validate_department_access(self, value):
        if not isinstance(value, dict):
            raise serializers.ValidationError("Department access must be an object.")
        unknown = set(value) - set(DEPARTMENTS)
        if unknown:
            raise serializers.ValidationError(
                f"Unknown departments: {', '.join(sorted(unknown))}."
            )
        normalized = {}
        for department in DEPARTMENTS:
            level = str(value.get(department, "none")).strip().lower()
            if level not in ACCESS_LEVELS:
                raise serializers.ValidationError(
                    f"Access for {department} must be none, read, or full."
                )
            normalized[department] = level
        return normalized
    def create(self, validated_data):
        password = validated_data.pop("password", None)
        if not password:
            raise serializers.ValidationError({"password": "Password is required."})
        if len(password) < 10:
            raise serializers.ValidationError({"password": "Use at least 10 characters."})
        user = User(**validated_data, organization=self.context["request"].user.organization)
        user.set_password(password); user.save(); return user
    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        if password and len(password) < 10:
            raise serializers.ValidationError({"password": "Use at least 10 characters."})
        for field, value in validated_data.items():
            setattr(instance, field, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance

class LoginView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [LoginThrottle]
    def post(self, request):
        user = authenticate(request, username=request.data.get("username"), password=request.data.get("password"))
        if not user or not user.is_active:
            return Response({"detail": "Incorrect username or password."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            ensure_studio_is_active(user)
        except AuthenticationFailed as error:
            return Response({"detail": str(error.detail)}, status=status.HTTP_401_UNAUTHORIZED)
        update_last_login(None, user)
        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh), "user": UserSerializer(user).data})

class CurrentUserView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)


class UserAuditActivitySerializer(serializers.ModelSerializer):
    target_username = serializers.CharField(
        source="target_user.username", read_only=True, default=""
    )

    class Meta:
        model = UserAuditActivity
        fields = "__all__"
        read_only_fields = ("organization",)

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [AdminAccessPermission]
    filterset_fields = {"is_active": ["exact"], "role": ["exact", "in"], "is_staff": ["exact"], "organization": ["exact"]}
    search_fields = ("username", "display_name", "mobile", "email")
    ordering_fields = ("username", "display_name", "role", "date_joined", "last_login")
    def get_queryset(self):
        if self.request.user.is_superuser: return User.objects.all()
        return User.objects.filter(organization=self.request.user.organization)
    def revoke_refresh_tokens(self, user):
        for token in OutstandingToken.objects.filter(user=user):
            BlacklistedToken.objects.get_or_create(token=token)
    def record_activity(self, user, action, description):
        organization = user.organization or self.request.user.organization
        if organization:
            UserAuditActivity.objects.create(
                organization=organization,
                target_user=user,
                target_name=user.display_name or user.username,
                action=action,
                description=description,
                performed_by=self.request.user.display_name or self.request.user.username,
            )
    def perform_create(self, serializer):
        user = serializer.save()
        self.record_activity(
            user,
            "User Created",
            f"Created {user.role} account with department access {user.department_access}.",
        )
    def perform_update(self, serializer):
        user = serializer.instance
        previous = {
            "role": user.role,
            "department_access": dict(user.department_access or {}),
            "is_active": user.is_active,
            "display_name": user.display_name,
            "mobile": user.mobile,
        }
        password_changed = bool(serializer.validated_data.get("password"))
        updated = serializer.save()
        changes = []
        labels = {
            "role": "Role",
            "department_access": "Department permissions",
            "is_active": "Account status",
            "display_name": "Display name",
            "mobile": "Mobile number",
        }
        for field, old_value in previous.items():
            new_value = getattr(updated, field)
            if old_value != new_value:
                if field == "is_active":
                    old_value = "Active" if old_value else "Inactive"
                    new_value = "Active" if new_value else "Inactive"
                changes.append(f"{labels[field]} changed from {old_value} to {new_value}")
        if password_changed:
            changes.append("Password was reset")
        if changes and updated.organization:
            self.record_activity(updated, "User Updated", ". ".join(changes) + ".")
        if password_changed:
            self.revoke_refresh_tokens(updated)
    @action(detail=True, methods=["post"], url_path="reset-password")
    def reset_password(self, request, pk=None):
        user = self.get_object()
        password = str(request.data.get("password", ""))
        if len(password) < 10:
            return Response(
                {"password": "Use at least 10 characters."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(password)
        user.save(update_fields=("password",))
        self.revoke_refresh_tokens(user)
        self.record_activity(
            user,
            "Password Reset",
            "Password was reset and all existing sessions were revoked.",
        )
        return Response({"detail": "Password reset and sessions revoked."})
    @action(detail=True, methods=["post"], url_path="set-active")
    def set_active(self, request, pk=None):
        user = self.get_object()
        active = request.data.get("active")
        if not isinstance(active, bool):
            return Response(
                {"active": "Enter true or false."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user.pk == request.user.pk and not active:
            return Response(
                {"detail": "You cannot deactivate your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.is_active = active
        user.save(update_fields=("is_active",))
        if not active:
            self.revoke_refresh_tokens(user)
        action_label = "Account Activated" if active else "Account Deactivated"
        self.record_activity(
            user,
            action_label,
            f"Account changed to {'Active' if active else 'Inactive'}."
            + (" Existing sessions were revoked." if not active else ""),
        )
        return Response(UserSerializer(user).data)
    @action(detail=False, methods=["get"], url_path="audit-history")
    def audit_history(self, request):
        queryset = UserAuditActivity.objects.select_related("target_user")
        if not request.user.is_superuser:
            queryset = queryset.filter(organization=request.user.organization)
        return Response(UserAuditActivitySerializer(queryset[:500], many=True).data)
    @action(detail=False, methods=["post"], url_path="reset-testing-data")
    def reset_testing_data(self, request):
        if request.data.get("confirmation") != "RESET TEST DATA":
            return Response(
                {"confirmation": "Type RESET TEST DATA exactly to continue."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        organization = request.user.organization
        if not organization:
            return Response(
                {"detail": "Your administrator account is not connected to an organization."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        attachment_files = [
            (attachment.file.storage, attachment.file.name)
            for attachment in Attachment.objects.filter(organization=organization)
            if attachment.file and attachment.file.name
        ]
        with transaction.atomic():
            counts = {
                "production_jobs": ProductionJob.objects.filter(organization=organization).count(),
                "events": CalendarEvent.objects.filter(organization=organization).count(),
                "payments": Payment.objects.filter(organization=organization).count(),
                "payment_reminders": PaymentReminder.objects.filter(organization=organization).count(),
                "bookings": Booking.objects.filter(organization=organization).count(),
                "customers": Customer.objects.filter(organization=organization).count(),
                "leads": Lead.objects.filter(organization=organization).count(),
                "attachments": len(attachment_files),
            }
            ProductionJob.objects.filter(organization=organization).delete()
            CalendarEvent.objects.filter(organization=organization).delete()
            PaymentReminder.objects.filter(organization=organization).delete()
            Payment.objects.filter(organization=organization).delete()
            Booking.objects.filter(organization=organization).delete()
            Customer.objects.filter(organization=organization).delete()
            Lead.objects.filter(organization=organization).delete()
            self.record_activity(
                request.user,
                "Testing Data Reset",
                "Cleared connected Sales, Operations, Accounts, and Production testing records. Users, permissions, sales targets, and photographer records were preserved.",
            )
        for storage, filename in attachment_files:
            if storage.exists(filename):
                storage.delete(filename)
        return Response(
            {
                "detail": "Testing data reset completed.",
                "deleted": counts,
                "preserved": [
                    "organizations",
                    "users",
                    "permissions",
                    "sales targets",
                    "photographer records",
                    "user audit history",
                ],
            }
        )
    def perform_destroy(self, instance):
        if instance.pk == self.request.user.pk:
            raise serializers.ValidationError("You cannot delete your own account.")
        instance.delete()


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PasswordResetRequestThrottle]

    def post(self, request):
        identifier = (request.data.get("username") or request.data.get("email") or "").strip()
        if not identifier:
            return Response({"detail": "Enter your username or email."}, status=400)
        user = User.objects.filter(username__iexact=identifier).first() or User.objects.filter(email__iexact=identifier).first()
        if not user:
            # Do not reveal whether the account exists; respond 200 anyway.
            return Response({"detail": "If the account exists, a reset link has been sent."})
        token_obj, raw_token = PasswordResetToken.issue(user, ip=request.META.get("REMOTE_ADDR"))
        reset_url = f"{os.getenv('CLIENT_PORTAL_BASE_URL', 'http://127.0.0.1:3000')}/reset?token={raw_token}"
        send_email(
            subject="Reset your LenspireCRM password",
            body=f"Hello {user.display_name or user.username},\n\nUse the link below to reset your password. It expires in 60 minutes.\n{reset_url}\n\nIf you did not request this, please ignore this email.",
            to=[user.email] if user.email else [user.username],
            category="password_reset",
        )
        return Response({"detail": "If the account exists, a reset link has been sent."})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    throttle_classes = [PasswordResetConfirmThrottle]

    def post(self, request):
        raw_token = (request.data.get("token") or "").strip()
        new_password = request.data.get("password") or ""
        if not raw_token or not new_password:
            return Response({"detail": "Token and password are required."}, status=400)
        if len(new_password) < 10:
            return Response({"password": "Use at least 10 characters."}, status=400)

        candidate = None
        for token in PasswordResetToken.objects.filter(used_at__isnull=True).order_by("-created_at")[:200]:
            if token.is_valid() and check_password(raw_token, token.token_hash):
                candidate = token
                break
        if not candidate:
            return Response({"detail": "Invalid or expired token."}, status=400)

        with transaction.atomic():
            user = candidate.user
            user.set_password(new_password)
            user.save(update_fields=("password",))
            candidate.used_at = timezone.now()
            candidate.save(update_fields=("used_at",))
            for outstanding in OutstandingToken.objects.filter(user=user):
                BlacklistedToken.objects.get_or_create(token=outstanding)
        from django.utils import timezone
        candidate.used_at = candidate.used_at or timezone.now()
        candidate.save(update_fields=("used_at",))
        return Response({"detail": "Password updated. Please sign in."})


class NotificationPreferencesView(APIView):
    """Per-user notification settings.

    Returns every notification category that has ever fired in this studio
    plus any preferences the current user has already saved. Users can
    enable / disable a category or opt into an email digest.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = []

    CATEGORY_LABELS = {
        "general": "General updates",
        "lead": "New leads",
        "booking": "Bookings",
        "payment": "Payments",
        "reminder": "Payment reminders",
        "production": "Production updates",
        "client_portal": "Client portal activity",
        "password_reset": "Password reset",
    }

    def get(self, request):
        organization_id = request.user.organization_id
        seen = set(
            Notification.objects.filter(organization_id=organization_id)
            .values_list("category", flat=True)
            .distinct()
        )
        saved = {
            pref.category: pref
            for pref in UserNotificationPreference.objects.filter(user=request.user)
        }
        categories = sorted(seen or set(self.CATEGORY_LABELS.keys()))
        return Response({
            "results": [
                {
                    "category": category,
                    "label": self.CATEGORY_LABELS.get(category, category.replace("_", " ").title()),
                    "enabled": saved[category].enabled if category in saved else True,
                    "email_digest": saved[category].email_digest if category in saved else False,
                }
                for category in categories
            ]
        })

    def put(self, request):
        items = request.data.get("items") or []
        if not isinstance(items, list):
            return Response({"detail": "items must be a list"}, status=400)
        for item in items:
            category = (item or {}).get("category")
            if not category:
                continue
            UserNotificationPreference.objects.update_or_create(
                user=request.user,
                category=category,
                defaults={
                    "enabled": bool(item.get("enabled", True)),
                    "email_digest": bool(item.get("email_digest", False)),
                },
            )
        return self.get(request)


class MetricsView(APIView):
    """Lightweight Prometheus-shaped metrics. No external dep so it works in SQLite dev mode too."""

    permission_classes = [AllowAny]

    def get(self, request):
        from apps.accounts.models import Payment
        from apps.notifications.models import Notification
        from apps.sales.models import Lead

        try:
            from django.db import connection

            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
                cursor.fetchone()
            db_ok = 1
        except Exception:
            db_ok = 0

        if request.user.is_authenticated and getattr(request.user, "organization_id", None):
            org_id = request.user.organization_id
            metrics = {
                "leads_total": Lead.objects.filter(organization_id=org_id).count(),
                "payments_total": Payment.objects.filter(organization_id=org_id).count(),
                "notifications_total": Notification.objects.filter(organization_id=org_id).count(),
            }
        else:
            metrics = {
                "leads_total": Lead.objects.count(),
                "payments_total": Payment.objects.count(),
                "notifications_total": Notification.objects.count(),
            }
        metrics["db_ok"] = db_ok

        lines = []
        for key, value in metrics.items():
            lines.append(f"# HELP lenspire_{key} {key}")
            lines.append(f"# TYPE lenspire_{key} gauge")
            lines.append(f"lenspire_{key} {value}")
        return Response("\n".join(lines), content_type="text/plain")

