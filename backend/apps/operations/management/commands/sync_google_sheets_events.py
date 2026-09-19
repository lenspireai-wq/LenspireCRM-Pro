from django.core.management.base import BaseCommand

from apps.operations.google_sheets import is_configured, sync_all_calendar_events
from apps.operations.models import CalendarEvent


class Command(BaseCommand):
    help = "Mirror all active CRM calendar events to the configured Google Sheet."

    def handle(self, *args, **options):
        if not is_configured():
            self.stdout.write("Google Sheets sync is not configured; skipped.")
            return
        events = CalendarEvent.objects.filter(is_archived=False).select_related(
            "booking", "assigned_user"
        ).order_by("start_date", "id")
        synced = sync_all_calendar_events(events)
        self.stdout.write(self.style.SUCCESS(f"Mirrored {synced} calendar events to Google Sheets."))
