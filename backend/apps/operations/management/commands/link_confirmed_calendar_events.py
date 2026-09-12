from django.core.management.base import BaseCommand, CommandError

from apps.core.models import Organization
from apps.operations.models import CalendarEvent
from apps.operations.views import (
    confirmed_bookings_for_organization,
    event_identity,
    matching_confirmed_bookings,
)


class Command(BaseCommand):
    help = "Preview or safely link unlinked calendar events to one confirmed booking."

    def add_arguments(self, parser):
        parser.add_argument("--organization-id", type=int, required=True)
        parser.add_argument(
            "--apply",
            action="store_true",
            help="Link only events with exactly one confirmed booking match.",
        )

    def handle(self, *args, **options):
        organization = Organization.objects.filter(pk=options["organization_id"]).first()
        if not organization:
            raise CommandError("Organization not found.")

        bookings = confirmed_bookings_for_organization(organization)
        events = CalendarEvent.objects.filter(
            organization=organization,
            is_archived=False,
            booking__isnull=True,
            customer__isnull=True,
        ).order_by("id")
        eligible = []
        ambiguous = 0
        unmatched = 0

        for event in events:
            matches = matching_confirmed_bookings(event_identity(event), organization, bookings)
            if len(matches) == 1:
                booking = matches[0]
                eligible.append((event, booking))
                self.stdout.write(
                    f"ELIGIBLE event={event.id} -> booking={booking.booking_code} "
                    f"lead={booking.lead_id}: {event.title}"
                )
            elif matches:
                ambiguous += 1
                self.stdout.write(
                    f"AMBIGUOUS event={event.id}: {event.title} "
                    f"matches={','.join(booking.booking_code for booking in matches)}"
                )
            else:
                unmatched += 1
                self.stdout.write(f"UNMATCHED event={event.id}: {event.title}")

        linked = 0
        if options["apply"]:
            for event, booking in eligible:
                linked += CalendarEvent.objects.filter(
                    pk=event.id,
                    organization=organization,
                    booking__isnull=True,
                    customer__isnull=True,
                ).update(booking=booking, customer=booking.customer)

        mode = "APPLIED" if options["apply"] else "PREVIEW"
        self.stdout.write(
            self.style.SUCCESS(
                f"{mode}: total_unlinked={events.count()} eligible={len(eligible)} "
                f"ambiguous={ambiguous} unmatched={unmatched} linked={linked}"
            )
        )
