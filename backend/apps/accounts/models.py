from django.db import models
from django.utils import timezone
from apps.core.models import OrganizationScopedModel
from apps.sales.models import Booking, Customer
class Payment(OrganizationScopedModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="payments")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    payment_type = models.CharField(max_length=40, default="Advance")
    status = models.CharField(max_length=30, default="Pending")
    payment_mode = models.CharField(max_length=40, blank=True)
    received_by = models.CharField(max_length=120, blank=True)
    notes = models.TextField(blank=True)
    due_date = models.DateField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)


class PaymentReminder(OrganizationScopedModel):
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="payment_reminders")
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="payment_reminders")
    payment_type = models.CharField(max_length=40)
    milestone_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    outstanding_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    action = models.CharField(max_length=30, default="Copied")
    reminder_date = models.DateField(default=timezone.localdate)
    next_followup_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ("-reminder_date", "-created_at")
        constraints = [
            models.UniqueConstraint(
                fields=("organization", "booking", "payment_type", "reminder_date"),
                name="unique_daily_payment_reminder",
            )
        ]
