from django.conf import settings
from django.db import models
from apps.core.models import OrganizationScopedModel

class Lead(OrganizationScopedModel):
    lead_code = models.CharField(max_length=30, blank=True)
    name = models.CharField(max_length=160)
    mobile = models.CharField(max_length=30, blank=True)
    event_type = models.CharField(max_length=80)
    event_date = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=120, blank=True)
    source = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=30, default="New")
    priority = models.CharField(max_length=20, default="Medium")
    budget = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    assigned_to = models.CharField(max_length=120, blank=True)
    notes = models.TextField(blank=True)
    next_followup_at = models.DateTimeField(null=True, blank=True)
    lost_reason = models.TextField(blank=True)
    client_name = models.CharField(max_length=160, blank=True)
    client_mobile = models.CharField(max_length=30, blank=True)
    couple_name = models.CharField(max_length=160, blank=True)
    wedding_dates = models.JSONField(default=list, blank=True)
    total_closing = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    payment_mode = models.CharField(max_length=40, blank=True)
    advance_received = models.DecimalField(max_digits=14, decimal_places=2, null=True, blank=True)
    received_by = models.CharField(max_length=120, blank=True)
    payment_received_date = models.DateField(null=True, blank=True)
    referred_by = models.CharField(max_length=160, blank=True)
    referral_code = models.CharField(max_length=80, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("organization", "lead_code"), name="unique_org_lead_code")]

class Customer(OrganizationScopedModel):
    customer_code = models.CharField(max_length=30)
    lead = models.OneToOneField(Lead, null=True, blank=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=160)
    phone = models.CharField(max_length=30, blank=True)
    email = models.EmailField(blank=True)
    city = models.CharField(max_length=120, blank=True)
    source = models.CharField(max_length=80, blank=True)
    class Meta:
        constraints = [models.UniqueConstraint(fields=("organization", "customer_code"), name="unique_org_customer_code")]

class Booking(OrganizationScopedModel):
    booking_code = models.CharField(max_length=30)
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT, related_name="bookings")
    lead = models.ForeignKey(Lead, null=True, blank=True, on_delete=models.SET_NULL)
    event_type = models.CharField(max_length=80)
    event_date = models.DateField(null=True, blank=True)
    city = models.CharField(max_length=120, blank=True)
    package_name = models.CharField(max_length=120, default="Custom Package")
    quoted_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    status = models.CharField(max_length=30, default="Confirmed")
    class Meta:
        constraints = [models.UniqueConstraint(fields=("organization", "booking_code"), name="unique_org_booking_code")]

class LeadActivity(OrganizationScopedModel):
    lead = models.ForeignKey(Lead, on_delete=models.CASCADE, related_name="activities")
    activity_type = models.CharField(max_length=40)
    description = models.TextField()
    performed_by = models.CharField(max_length=120)

class SalesTarget(OrganizationScopedModel):
    salesperson = models.CharField(max_length=120)
    target_month = models.CharField(max_length=7)
    target_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    target_bookings = models.PositiveIntegerField(default=0)
    class Meta:
        constraints = [models.UniqueConstraint(fields=("organization","salesperson","target_month"), name="unique_org_sales_target")]
