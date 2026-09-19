"""Create event-specific production jobs when a completed shoot is financially ready."""

from decimal import Decimal

from django.db.models import Q, Sum

from apps.operations.models import CalendarEvent
from apps.sales.models import Booking

from .models import ProductionJob


MAJOR_EVENT_TYPES = {
    "engagement": "Engagement",
    "pre wedding": "Pre-Wedding",
    "prewedding": "Pre-Wedding",
    "wedding": "Wedding",
    "night wedding": "Wedding",
}


def canonical_event_type(value: str) -> str:
    return " ".join(str(value or "").strip().lower().replace("-", " ").split())


def production_event_label(event: CalendarEvent) -> str | None:
    return MAJOR_EVENT_TYPES.get(canonical_event_type(event.event_type))


def booking_paid_amount(booking: Booking) -> Decimal:
    totals = booking.payments.filter(status__iexact="Paid").aggregate(
        received=Sum("amount", filter=~Q(payment_type__iexact="Refund")),
        refunded=Sum("amount", filter=Q(payment_type__iexact="Refund")),
    )
    return (totals["received"] or Decimal("0.00")) - (totals["refunded"] or Decimal("0.00"))


def event_payment_threshold(event: CalendarEvent) -> Decimal:
    """Engagement/pre-wedding unlock at Advance + First Shoot (50%).

    Wedding unlocks at Advance + First Shoot + Wedding Day (90%).  This maps
    directly to the CRM's 10/40/40/10 payment schedule.
    """
    label = production_event_label(event)
    return Decimal("0.90") if label == "Wedding" else Decimal("0.50")


def sync_event_production_jobs_for_booking(booking: Booking) -> list[ProductionJob]:
    """Idempotently create one job per completed, unlocked event type."""
    if not booking or str(booking.status or "").lower() != "confirmed":
        return []
    if booking.lead_id and str(booking.lead.status or "").lower() != "confirmed":
        return []
    quoted_amount = Decimal(str(booking.quoted_amount or 0))
    if quoted_amount <= 0:
        return []

    paid = booking_paid_amount(booking)
    jobs = []
    jobs_by_label = {}
    existing_jobs = ProductionJob.objects.filter(
        organization=booking.organization,
        booking=booking,
        calendar_event__isnull=False,
    ).select_related("calendar_event").order_by("id")
    for existing_job in existing_jobs:
        existing_label = production_event_label(existing_job.calendar_event)
        if existing_label:
            jobs_by_label.setdefault(existing_label, existing_job)
    processed_labels = set()
    events = CalendarEvent.objects.filter(
        organization=booking.organization,
        booking=booking,
        status__iexact="Completed",
        is_archived=False,
    ).order_by("start_date", "id")
    for event in events:
        label = production_event_label(event)
        if not label or paid < quoted_amount * event_payment_threshold(event):
            continue
        # A client may have multiple dates for the same event type (for
        # example two Pre-wedding shoots). They are separate operations, but
        # form one editing assignment in Post Production.
        if label in processed_labels:
            continue
        processed_labels.add(label)
        job = jobs_by_label.get(label)
        if not job:
            # Upgrade the old single booking-level job the first time an
            # eligible event enters production. This prevents duplicate work
            # for existing bookings while later events receive their own jobs.
            job = ProductionJob.objects.filter(
                organization=booking.organization,
                booking=booking,
                calendar_event__isnull=True,
            ).order_by("id").first()
            if job:
                job.calendar_event = event
                job.customer = booking.customer
                job.due_date = event.start_date
                job.save(update_fields=("calendar_event", "customer", "due_date", "updated_at"))
            else:
                job = ProductionJob.objects.create(
                    organization=booking.organization,
                    calendar_event=event,
                    booking=booking,
                    customer=booking.customer,
                    due_date=event.start_date,
                    stage="Shoot Planning",
                    notes=f"{label} production job created from calendar event.",
                )
        elif job.calendar_event_id != event.id:
            # Keep the earliest completed date as the representative event for
            # the one consolidated editing job.
            job.calendar_event = event
            job.customer = booking.customer
            job.due_date = event.start_date
            job.save(update_fields=("calendar_event", "customer", "due_date", "updated_at"))
        jobs.append(job)
    return jobs


def sync_event_production_jobs_for_event(event: CalendarEvent) -> list[ProductionJob]:
    if not event.booking_id:
        return []
    return sync_event_production_jobs_for_booking(event.booking)
