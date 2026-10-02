from datetime import datetime, time

from django.db import migrations
from django.db.models import Sum
from django.utils import timezone


LEAD_ADVANCE_NOTE = "Advance Booking amount recorded during lead confirmation."


def sync_sales_booking_advances(apps, schema_editor):
    Lead = apps.get_model("sales", "Lead")
    Booking = apps.get_model("sales", "Booking")
    Payment = apps.get_model("accounts", "Payment")
    for lead in Lead.objects.filter(advance_received__gt=0):
        booking = Booking.objects.filter(
            organization_id=lead.organization_id, lead_id=lead.id
        ).first()
        if not booking:
            continue
        paid_advance = Payment.objects.filter(
            organization_id=lead.organization_id,
            booking_id=booking.id,
            payment_type__iexact="Advance",
            status__iexact="Paid",
        ).aggregate(total=Sum("amount"))["total"] or 0
        if paid_advance >= lead.advance_received:
            continue
        paid_at = (
            timezone.make_aware(datetime.combine(lead.payment_received_date, time.min))
            if lead.payment_received_date
            else lead.created_at
        )
        Payment.objects.create(
            organization_id=lead.organization_id,
            booking_id=booking.id,
            customer_id=booking.customer_id,
            payment_type="Advance",
            amount=lead.advance_received - paid_advance,
            status="Paid",
            payment_mode=lead.payment_mode,
            received_by=lead.received_by,
            paid_at=paid_at,
            notes=LEAD_ADVANCE_NOTE,
        )


class Migration(migrations.Migration):
    dependencies = [("accounts", "0003_paymentreminder"), ("sales", "0003_salestarget")]
    operations = [migrations.RunPython(sync_sales_booking_advances, migrations.RunPython.noop)]
