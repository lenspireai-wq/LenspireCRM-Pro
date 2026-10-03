from django.db import migrations


def backfill_leads_from_existing_bookings(apps, schema_editor):
    """Restore the sales records for bookings imported before leads were linked."""
    Customer = apps.get_model("sales", "Customer")
    Lead = apps.get_model("sales", "Lead")
    Booking = apps.get_model("sales", "Booking")

    for customer in Customer.objects.select_related("organization", "lead").order_by("organization_id", "id"):
        bookings = list(
            Booking.objects.filter(customer_id=customer.id)
            .order_by("event_date", "created_at", "id")
        )
        if not bookings:
            continue

        lead = customer.lead
        if lead is None:
            first_booking = bookings[0]
            existing_codes = Lead.objects.filter(
                organization_id=customer.organization_id,
                lead_code__startswith="L",
            ).values_list("lead_code", flat=True)
            next_number = max(
                (int(code[1:]) for code in existing_codes if code[1:].isdigit()),
                default=0,
            ) + 1
            lead = Lead.objects.create(
                organization_id=customer.organization_id,
                lead_code=f"L{next_number:03d}",
                name=customer.name,
                mobile=customer.phone,
                event_type=first_booking.event_type,
                event_date=first_booking.event_date,
                city=first_booking.city or customer.city,
                source=customer.source,
                status="Confirmed",
                client_name=customer.name,
                client_mobile=customer.phone,
                couple_name=customer.name,
                wedding_dates=[
                    booking.event_date.isoformat()
                    for booking in bookings
                    if booking.event_date
                ],
                total_closing=first_booking.quoted_amount,
            )
            customer.lead_id = lead.id
            customer.save(update_fields=("lead", "updated_at"))

        Booking.objects.filter(customer_id=customer.id, lead__isnull=True).update(lead_id=lead.id)


class Migration(migrations.Migration):

    dependencies = [
        ("sales", "0003_salestarget"),
    ]

    operations = [
        migrations.RunPython(backfill_leads_from_existing_bookings, migrations.RunPython.noop),
    ]
