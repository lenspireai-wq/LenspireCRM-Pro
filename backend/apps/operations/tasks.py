from celery import shared_task


@shared_task(name="apps.operations.tasks.import_google_sheets_events")
def import_google_sheets_events():
    from .google_sheets import import_calendar_events_from_sheet, sync_all_calendar_events
    from .models import CalendarEvent

    result = import_calendar_events_from_sheet()
    if result["created"] or result["updated"] or result["conflicts"]:
        events = CalendarEvent.objects.filter(is_archived=False).select_related(
            "booking", "assigned_user"
        ).order_by("start_date", "id")
        sync_all_calendar_events(events)
    return result
