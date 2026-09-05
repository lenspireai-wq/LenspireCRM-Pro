from pathlib import Path
from rest_framework import serializers
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
        if upload.size > 10*1024*1024: raise serializers.ValidationError({"file":"Quotation files must be 10 MB or smaller."})
        return attrs
class AttachmentViewSet(OrganizationScopedViewSet):
    queryset = Attachment.objects.all()
    serializer_class = AttachmentSerializer
    permission_classes = (SalesAccessPermission,)
    filterset_fields = {"lead": ["exact"], "created_at": ["gte", "lte"]}
    search_fields = ("name",)
    ordering_fields = ("created_at", "name")
