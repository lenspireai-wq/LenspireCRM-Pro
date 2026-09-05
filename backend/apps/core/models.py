from django.db import models

class Organization(models.Model):
    PLAN_CHOICES = (("starter", "Starter"), ("professional", "Professional"), ("enterprise", "Enterprise"))
    name = models.CharField(max_length=120)
    slug = models.SlugField(unique=True)
    active = models.BooleanField(default=True)
    plan = models.CharField(max_length=24, choices=PLAN_CHOICES, default="starter")
    subscription_expires_at = models.DateField(null=True, blank=True)
    license_code = models.CharField(max_length=80, blank=True)
    logo_url = models.URLField(max_length=500, blank=True)
    contact_phone = models.CharField(max_length=40, blank=True)
    whatsapp_number = models.CharField(max_length=40, blank=True)
    contact_email = models.EmailField(blank=True)
    studio_address = models.TextField(blank=True)
    document_header = models.TextField(blank=True)
    document_footer = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class OrganizationAuditActivity(models.Model):
    organization = models.ForeignKey(
        Organization,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="audit_activities",
    )
    studio_name = models.CharField(max_length=120)
    action = models.CharField(max_length=40)
    description = models.TextField()
    performed_by = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at", "-id")

class OrganizationScopedModel(models.Model):
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class EmailLog(models.Model):
    organization = models.ForeignKey(Organization, null=True, blank=True, on_delete=models.SET_NULL, related_name="email_logs")
    category = models.CharField(max_length=40, default="transactional")
    subject = models.CharField(max_length=200)
    body = models.TextField(blank=True)
    recipient = models.CharField(max_length=255)
    delivered = models.BooleanField(default=False)
    error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=("organization", "category", "created_at"))]


class LegacyRecordMap(models.Model):
    """Stable link between a legacy UUID row and its Django replacement."""

    source_table = models.CharField(max_length=80)
    source_id = models.CharField(max_length=80)
    target_model = models.CharField(max_length=120)
    target_pk = models.CharField(max_length=80)
    imported_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=("source_table", "source_id"), name="unique_legacy_source_row"
            )
        ]
