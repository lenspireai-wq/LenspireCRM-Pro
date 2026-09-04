from django.db import models
from apps.core.models import OrganizationScopedModel
from apps.sales.models import Lead
class Attachment(OrganizationScopedModel):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="attachments")
    name = models.CharField(max_length=255)
    file = models.FileField(upload_to="lead-attachments/%Y/%m/")

