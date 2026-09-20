from django.utils import timezone
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .models import Notification, visible_notifications_for


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ("created_at", "read_at")


class NotificationViewSet(ModelViewSet):
    serializer_class = NotificationSerializer
    http_method_names = ["get", "post", "delete"]

    def get_queryset(self):
        return visible_notifications_for(self.request.user).order_by("-created_at")

    @extend_schema(summary="Mark notification as read")
    @action(detail=True, methods=["post"], url_path="read")
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        if not notification.is_read:
            notification.is_read = True
            notification.read_at = timezone.now()
            notification.save(update_fields=("is_read", "read_at"))
        return Response(self.get_serializer(notification).data)

    @extend_schema(summary="Mark every notification in the org as read")
    @action(detail=False, methods=["post"], url_path="read-all")
    def mark_all_read(self, request):
        updated = self.get_queryset().filter(is_read=False).update(is_read=True, read_at=timezone.now())
        return Response({"updated": updated})


class NotificationSummaryView(APIView):
    def get(self, request):
        queryset = visible_notifications_for(request.user)
        unread = queryset.filter(is_read=False).count()
        latest = list(queryset[:10].values("id", "title", "body", "level", "category", "link", "is_read", "created_at"))
        return Response({"unread": unread, "latest": latest})
