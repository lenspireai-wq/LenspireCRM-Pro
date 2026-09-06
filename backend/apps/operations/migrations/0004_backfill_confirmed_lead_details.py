from django.db import migrations


def backfill_confirmed_lead_details(apps, schema_editor):
    CalendarEvent = apps.get_model("operations", "CalendarEvent")
    for event in CalendarEvent.objects.exclude(booking_id=None).select_related("booking__lead"):
        lead = event.booking.lead
        if not lead:
            continue
        event.customer_id = event.booking.customer_id
        event.title = f"{lead.name} · {lead.event_type}"
        event.client_name = lead.client_name or lead.name
        event.handled_by = lead.assigned_to
        event.couple_name = lead.couple_name
        event.contact_no = lead.client_mobile or lead.mobile
        event.event_type = lead.event_type
        event.start_date = lead.event_date
        event.city = lead.city
        event.notes = lead.notes
        event.save(update_fields=[
            "customer", "title", "client_name", "handled_by", "couple_name",
            "contact_no", "event_type", "start_date", "city", "notes",
        ])


class Migration(migrations.Migration):
    dependencies = [
        ("operations", "0003_calendarevent_assistant_calendarevent_bts_and_more"),
        ("sales", "0003_salestarget"),
    ]
    operations = [migrations.RunPython(backfill_confirmed_lead_details, migrations.RunPython.noop)]
