from celery import shared_task
from django.utils import timezone


@shared_task(name="apps.operations.tasks.refresh_event_lifecycle")
def refresh_event_lifecycle():
    """Apply date-driven event transitions away from user-facing GET requests."""
    from apps.production.event_jobs import sync_event_production_jobs_for_event
    from .google_sheets import sync_calendar_event
    from .models import CalendarEvent
    from .views import automatic_event_status

    today = timezone.localdate()
    active_events = CalendarEvent.objects.filter(is_archived=False)
    newly_completed_ids = list(
        active_events.filter(start_date__lt=today, booking__isnull=False)
        .exclude(status__in=("Cancelled", "Completed"))
        .values_list("id", flat=True)
    )
    completed_count = active_events.filter(start_date__lt=today).exclude(
        status__in=("Cancelled", "Completed")
    ).update(status="Completed")
    in_progress_count = active_events.filter(start_date=today).exclude(
        status__in=("Cancelled", "In Progress")
    ).update(status="In Progress")

    reverted = []
    for event in active_events.filter(status__in=("Completed", "In Progress")).exclude(
        start_date__lte=today
    ):
        event.status = automatic_event_status(event)
        reverted.append(event)
    if reverted:
        CalendarEvent.objects.bulk_update(reverted, ("status",))

    for event in CalendarEvent.objects.filter(id__in=newly_completed_ids).select_related(
        "booking", "booking__lead", "booking__customer"
    ):
        sync_event_production_jobs_for_event(event)
        sync_calendar_event(event)

    return {
        "completed": completed_count,
        "in_progress": in_progress_count,
        "reverted": len(reverted),
    }


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
