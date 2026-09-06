from django.db import connection
from django.db import transaction
from django.utils import timezone
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Organization, OrganizationAuditActivity
from .permissions import PlatformOwnerPermission
from apps.users.models import User

class OrganizationSerializer(serializers.ModelSerializer):
    user_count = serializers.IntegerField(source="users.count", read_only=True)
    slug = serializers.SlugField(required=False, allow_blank=True)
    admin_name = serializers.CharField(write_only=True, required=False)
    username = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Organization
        fields = "__all__"

    def validate(self, attrs):
        if not self.instance:
            missing = [field for field in ("admin_name", "username", "password", "subscription_expires_at") if not attrs.get(field)]
            if missing:
                raise serializers.ValidationError({field: "This field is required." for field in missing})
        expiry = attrs.get("subscription_expires_at")
        if expiry and expiry < timezone.localdate():
            raise serializers.ValidationError({"subscription_expires_at": "Expiry date cannot be before today."})
        password = attrs.get("password")
        if password and len(password) < 10:
            raise serializers.ValidationError({"password": "Use at least 10 characters."})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        admin_name = validated_data.pop("admin_name")
        username = validated_data.pop("username")
        password = validated_data.pop("password")
        if not validated_data.get("slug"):
            validated_data.pop("slug", None)
            base = slugify(validated_data["name"]) or "studio"
            slug = base
            suffix = 2
            while Organization.objects.filter(slug=slug).exists():
                slug = f"{base}-{suffix}"
                suffix += 1
            validated_data["slug"] = slug
        if not validated_data.get("license_code"):
            while True:
                license_code = f"LENSPIRE-{timezone.localdate().year}-{get_random_string(8).upper()}"
                if not Organization.objects.filter(license_code=license_code).exists():
                    validated_data["license_code"] = license_code
                    break
        organization = Organization.objects.create(**validated_data)
        User.objects.create_user(
            username=username,
            password=password,
            display_name=admin_name,
            role="Administrator",
            is_staff=True,
            organization=organization,
            department_access={department: "full" for department in ("sales", "operations", "accounts", "production")},
        )
        return organization


class OrganizationAuditActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = OrganizationAuditActivity
        fields = "__all__"

class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.prefetch_related("users").all().order_by("name")
    serializer_class = OrganizationSerializer
    permission_classes = [PlatformOwnerPermission]
    filterset_fields = {"active": ["exact"], "plan": ["exact", "in"], "subscription_expires_at": ["exact", "gte", "lte"]}
    search_fields = ("name", "slug", "contact_email", "contact_phone", "whatsapp_number", "license_code")
    ordering_fields = ("name", "plan", "subscription_expires_at", "created_at")

    def record_activity(self, organization, action, description):
        actor = self.request.user.display_name or self.request.user.username
        OrganizationAuditActivity.objects.create(
            organization=organization,
            studio_name=organization.name,
            action=action,
            description=description,
            performed_by=actor,
        )

    def perform_create(self, serializer):
        organization = serializer.save()
        self.record_activity(
            organization,
            "Studio Created",
            f"Created {organization.plan.title()} workspace with expiry {organization.subscription_expires_at}.",
        )

    def perform_update(self, serializer):
        organization = serializer.instance
        previous_active = organization.active
        previous_expiry = organization.subscription_expires_at
        previous_plan = organization.plan
        updated = serializer.save()
        if previous_active != updated.active:
            action_name = "Studio Resumed" if updated.active else "Studio Paused"
            self.record_activity(updated, action_name, f"Studio access changed to {'active' if updated.active else 'paused'}.")
        if previous_expiry != updated.subscription_expires_at:
            self.record_activity(
                updated,
                "Subscription Renewed",
                f"Expiry changed from {previous_expiry or 'no expiry'} to {updated.subscription_expires_at or 'no expiry'}.",
            )
        if previous_plan != updated.plan:
            self.record_activity(updated, "Studio Edited", f"Plan changed from {previous_plan} to {updated.plan}.")

    def destroy(self, request, *args, **kwargs):
        return Response(
            {"detail": "Studio deletion is disabled to protect client records. Pause the studio instead."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED,
        )

    @action(detail=False, methods=["get"], url_path="audit-history")
    def audit_history(self, request):
        activities = OrganizationAuditActivity.objects.select_related("organization")[:500]
        return Response(OrganizationAuditActivitySerializer(activities, many=True).data)

class HealthView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        return Response({"ok": True, "service": "lenspirecrm-api", "database": connection.vendor})
