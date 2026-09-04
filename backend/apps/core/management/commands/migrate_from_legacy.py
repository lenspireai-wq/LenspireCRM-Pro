import json
import sqlite3
from datetime import date, datetime
from decimal import Decimal
from pathlib import Path
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils.dateparse import parse_date, parse_datetime
from apps.accounts.models import Payment
from apps.core.models import Organization
from apps.operations.models import CalendarEvent
from apps.production.models import ProductionJob
from apps.sales.models import Booking, Customer, Lead

def value(row, name, default=None):
    return row[name] if name in row.keys() and row[name] not in (None, "") else default

def day(raw):
    if not raw: return None
    return parse_date(str(raw)[:10])

class Command(BaseCommand):
    help = "Import the Electron tracker.db into an organization-scoped Django workspace."
    def add_arguments(self, parser):
        parser.add_argument("database", type=Path)
        parser.add_argument("--organization", default="Lenspire Studio")
        parser.add_argument("--slug", default="lenspire-studio")
        parser.add_argument("--dry-run", action="store_true")

    @transaction.atomic
    def handle(self, *args, **options):
        source = options["database"].resolve()
        if not source.is_file(): raise CommandError(f"Legacy database not found: {source}")
        connection = sqlite3.connect(f"file:{source.as_posix()}?mode=ro", uri=True)
        connection.row_factory = sqlite3.Row
        tables = {row[0] for row in connection.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        if "leads" not in tables: raise CommandError("This is not a LenspireCRM legacy database.")
        org, _ = Organization.objects.get_or_create(slug=options["slug"], defaults={"name": options["organization"]})
        maps = {"lead": {}, "customer": {}, "booking": {}}
        counts = {name: 0 for name in ("leads", "customers", "bookings", "events", "payments", "production")}
        for row in connection.execute("SELECT * FROM leads ORDER BY id"):
            lead, _ = Lead.objects.update_or_create(organization=org, lead_code=value(row,"lead_code",f"LEG-{row['id']:05d}"), defaults={
                "name": value(row,"name","Unknown"), "mobile": value(row,"mobile",""), "event_type": value(row,"event_type","Shoot"),
                "event_date": day(value(row,"event_date")), "city": value(row,"city",""), "source": value(row,"source",""),
                "status": value(row,"status","New"), "priority": value(row,"priority","Medium"),
                "budget": Decimal(str(value(row,"total_closing",0) or 0)), "assigned_to": value(row,"assigned_to",""),
                "notes": value(row,"notes",""), "lost_reason": value(row,"lost_reason","")})
            maps["lead"][row["id"]] = lead; counts["leads"] += 1
        if "customers" in tables:
            for row in connection.execute("SELECT * FROM customers ORDER BY id"):
                customer, _ = Customer.objects.update_or_create(organization=org, customer_code=value(row,"customer_code",f"LEG-CUS-{row['id']:05d}"), defaults={
                    "lead": maps["lead"].get(value(row,"lead_id")), "name": value(row,"name","Unknown"), "phone": value(row,"phone",""),
                    "email": value(row,"email",""), "city": value(row,"city",""), "source": value(row,"source","")})
                maps["customer"][row["id"]] = customer; counts["customers"] += 1
        if "bookings" in tables:
            for row in connection.execute("SELECT * FROM bookings ORDER BY id"):
                customer = maps["customer"].get(value(row,"customer_id"))
                if not customer: continue
                booking, _ = Booking.objects.update_or_create(organization=org, booking_code=value(row,"booking_code",f"LEG-BKG-{row['id']:05d}"), defaults={
                    "customer": customer, "lead": maps["lead"].get(value(row,"lead_id")), "event_type": value(row,"event_type","Shoot"),
                    "event_date": day(value(row,"event_date")), "city": value(row,"city",""), "package_name": value(row,"package_name","Custom Package"),
                    "quoted_amount": Decimal(str(value(row,"quoted_amount",0) or 0)), "status": value(row,"status","Confirmed")})
                maps["booking"][row["id"]] = booking; counts["bookings"] += 1
        if "calendar_events" in tables:
            for row in connection.execute("SELECT * FROM calendar_events ORDER BY id"):
                start = day(value(row,"start_date"));
                if not start: continue
                booking = maps["booking"].get(value(row,"booking_id")); customer = maps["customer"].get(value(row,"customer_id"))
                CalendarEvent.objects.update_or_create(organization=org, title=value(row,"title",f"Legacy event {row['id']}"), start_date=start,
                    defaults={"booking":booking,"customer":customer,"event_type":value(row,"event_type","Shoot"),"city":value(row,"city",""),"status":value(row,"status","Scheduled"),"notes":value(row,"notes","")})
                counts["events"] += 1
        if "payments" in tables:
            for row in connection.execute("SELECT * FROM payments ORDER BY id"):
                booking = maps["booking"].get(value(row,"booking_id")); customer = maps["customer"].get(value(row,"customer_id"))
                if not booking or not customer: continue
                Payment.objects.update_or_create(organization=org, booking=booking, customer=customer, amount=Decimal(str(value(row,"amount",0) or 0)), created_at=value(row,"created_at"), defaults={
                    "payment_type":value(row,"payment_type","Advance"),"status":value(row,"status","Pending"),"payment_mode":value(row,"payment_mode",""),"received_by":value(row,"received_by",""),"notes":value(row,"notes","")})
                counts["payments"] += 1
        if "production_jobs" in tables:
            for row in connection.execute("SELECT * FROM production_jobs ORDER BY id"):
                booking = maps["booking"].get(value(row,"booking_id")); customer = maps["customer"].get(value(row,"customer_id"))
                if not booking or not customer: continue
                ProductionJob.objects.update_or_create(organization=org, booking=booking, defaults={"customer":customer,"stage":value(row,"stage","Shoot Planning"),
                    "raw_status":value(row,"raw_status","Pending"),"editing_status":value(row,"editing_status","Not Started"),"album_status":value(row,"album_status","Not Started"),
                    "video_status":value(row,"video_status","Not Started"),"delivery_status":value(row,"delivery_status","Pending"),"due_date":day(value(row,"due_date")),"notes":value(row,"notes","")})
                counts["production"] += 1
        connection.close()
        if options["dry_run"]: transaction.set_rollback(True)
        self.stdout.write(self.style.SUCCESS(("DRY RUN " if options["dry_run"] else "") + json.dumps(counts)))

