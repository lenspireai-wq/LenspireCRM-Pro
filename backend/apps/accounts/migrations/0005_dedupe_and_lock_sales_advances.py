from django.db import migrations, models
from django.db.models import Q


LEAD_ADVANCE_NOTE = "Advance Booking amount recorded during lead confirmation."


def dedupe_sales_advance_payments(apps, schema_editor):
    Payment = apps.get_model("accounts", "Payment")
    duplicates = (
        Payment.objects.filter(notes=LEAD_ADVANCE_NOTE)
        .values("organization_id", "booking_id", "notes")
        .annotate(count=models.Count("id"))
        .filter(count__gt=1)
    )
    for duplicate in duplicates:
        payments = Payment.objects.filter(
            organization_id=duplicate["organization_id"],
            booking_id=duplicate["booking_id"],
            notes=duplicate["notes"],
        ).order_by("id")
        payments.exclude(id=payments.first().id).delete()


class Migration(migrations.Migration):
    dependencies = [("accounts", "0004_sync_sales_booking_advances")]

    operations = [
        migrations.RunPython(dedupe_sales_advance_payments, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name="payment",
            constraint=models.UniqueConstraint(
                fields=("organization", "booking", "notes"),
                condition=Q(notes=LEAD_ADVANCE_NOTE),
                name="unique_sales_advance_payment_per_booking",
            ),
        ),
    ]
