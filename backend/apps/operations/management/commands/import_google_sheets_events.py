from django.core.management.base import BaseCommand

from apps.operations.google_sheets import import_calendar_events_from_sheet, is_configured, sync_all_calendar_events
from apps.operations.models import CalendarEvent


class Command(BaseCommand):
    help = "Import staff changes from the configured Google Sheets calendar mirror."

    def handle(self, *args, **options):
        if not is_configured():
            self.stdout.write("Google Sheets sync is not configured; skipped.")
            return
        result = import_calendar_events_from_sheet()
        if result["created"] or result["updated"] or result["conflicts"]:
            events = CalendarEvent.objects.filter(is_archived=False).select_related(
                "booking", "assigned_user"
            ).order_by("start_date", "id")
            sync_all_calendar_events(events)
        self.stdout.write(self.style.SUCCESS(
            "Imported Google Sheets events: "
            f"{result['created']} created, {result['updated']} updated, "
            f"{result['conflicts']} CRM-won conflicts, {result['skipped']} skipped."
        ))
