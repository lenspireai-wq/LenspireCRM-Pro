from datetime import datetime, time

from django.db import migrations
from django.utils import timezone


def backfill_booking_advances(apps, schema_editor):
    Lead = apps.get_model("sales", "Lead")
    Booking = apps.get_model("sales", "Booking")
    Payment = apps.get_model("accounts", "Payment")
    for lead in Lead.objects.filter(advance_received__gt=0):
        booking = Booking.objects.filter(organization_id=lead.organization_id, lead_id=lead.id).first()
        if not booking:
            continue
        paid_at = (
            timezone.make_aware(datetime.combine(lead.payment_received_date, time.min))
            if lead.payment_received_date
            else lead.created_at
        )
        Payment.objects.get_or_create(
            organization_id=lead.organization_id,
            booking_id=booking.id,
            customer_id=booking.customer_id,
            payment_type="Advance",
            amount=lead.advance_received,
            defaults={
                "status": "Paid",
                "payment_mode": lead.payment_mode,
                "received_by": lead.received_by,
                "paid_at": paid_at,
                "notes": "Advance Booking amount recorded during lead confirmation.",
            },
        )


class Migration(migrations.Migration):
    dependencies = [("accounts", "0001_initial"), ("sales", "0003_salestarget")]
    operations = [migrations.RunPython(backfill_booking_advances, migrations.RunPython.noop)]
