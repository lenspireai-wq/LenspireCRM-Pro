from pathlib import Path
from django.conf import settings
from django.http import FileResponse, Http404
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.parsers import FormParser, MultiPartParser
from apps.core.api import OrganizationScopedViewSet
from .models import Attachment
from apps.core.permissions import SalesAccessPermission
class AttachmentSerializer(serializers.ModelSerializer):
    class Meta: model = Attachment; fields = "__all__"; read_only_fields = ("organization",)
    def validate(self, attrs):
        request=self.context["request"]; lead=attrs.get("lead"); upload=attrs.get("file")
        if not request.user.is_superuser and lead.organization_id != request.user.organization_id:
            raise serializers.ValidationError("Lead does not belong to this organization.")
        allowed={".pdf",".doc",".docx",".xls",".xlsx",".jpg",".jpeg",".png"}
        if Path(upload.name).suffix.lower() not in allowed: raise serializers.ValidationError({"file":"Unsupported quotation file type."})
        if upload.size > settings.QUOTATION_UPLOAD_MAX_SIZE: raise serializers.ValidationError({"file":"Quotation files must be 25 MB or smaller."})
        return attrs
class AttachmentViewSet(OrganizationScopedViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = (SalesAccessPermission,)
    parser_classes = (MultiPartParser, FormParser)
    filterset_fields = {"lead": ["exact"], "created_at": ["gte", "lte"]}
    search_fields = ("name",)
    ordering_fields = ("created_at", "name")

    def perform_destroy(self, instance):
        # Keep storage tidy when staff explicitly remove an uploaded quotation.
        if instance.file:
            instance.file.delete(save=False)
        instance.delete()

    @action(detail=True, methods=["get"])
    def download(self, request, pk=None):
        attachment = self.get_object()
        if not attachment.file or not attachment.file.name:
            raise Http404("Attachment file not found.")
        return FileResponse(
            attachment.file.open("rb"),
            as_attachment=False,
            filename=attachment.name or Path(attachment.file.name).name,
        )
