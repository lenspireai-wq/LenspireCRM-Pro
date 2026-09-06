import base64
import json
from decimal import Decimal, InvalidOperation

from django.apps import apps
from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction
from django.utils.text import slugify

from apps.accounts.models import Payment
from apps.core.models import LegacyRecordMap, Organization
from apps.operations.models import CalendarEvent, PhotographerDetail
from apps.production.models import (
    ClientPortalAccess,
    ClientPortalActivity,
    ClientPortalUser,
    ProductionActivity,
    ProductionJob,
)
from apps.sales.models import Booking, Customer, Lead, LeadActivity, SalesTarget
from apps.users.models import User


def text(row, key, default=""):
    value = row.get(key)
    return default if value is None else str(value)


def number(row, key, default=0):
    try:
        return Decimal(str(row.get(key) or default))
    except (InvalidOperation, TypeError, ValueError):
        return Decimal(default)


def json_value(row, key, default):
    value = row.get(key)
    if value in (None, ""):
        return default
    if isinstance(value, (dict, list)):
        return value
    try:
        return json.loads(value)
    except (TypeError, ValueError):
        return default


class Command(BaseCommand):
    help = "Import the legacy Cloudflare Worker PostgreSQL tables into Django tables."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true")

    def rows(self, table):
        allowed = {
            "organizations", "users", "leads", "customers", "bookings",
            "lead_activities", "sales_targets", "calendar_events",
            "photographer_details", "payments", "production_jobs",
            "production_activity_log", "client_portal_access",
            "client_portal_access_log", "client_portal_users",
        }
        if table not in allowed:
            raise CommandError(f"Unsupported legacy table: {table}")
        with connection.cursor() as cursor:
            cursor.execute(f'SELECT * FROM "{table}" ORDER BY id')
            names = [column[0] for column in cursor.description]
            return [dict(zip(names, values)) for values in cursor.fetchall()]

    def mapped(self, table, source_id, model):
        if not source_id:
            return None
        link = self.link_cache.get((table, str(source_id)))
        if not link:
            return None
        return model.objects.filter(pk=link.target_pk).first()

    def save(self, table, row, obj):
        key = (table, str(row["id"]))
        link = self.link_cache.get(key)
        if link:
            if link.target_model != obj._meta.label_lower or link.target_pk != str(obj.pk):
                link.target_model = obj._meta.label_lower
                link.target_pk = str(obj.pk)
                link.save(update_fields=("target_model", "target_pk", "imported_at"))
        else:
            link = LegacyRecordMap(
                source_table=table, source_id=str(row["id"]),
                target_model=obj._meta.label_lower, target_pk=str(obj.pk),
            )
            self.pending_links.append(link)
        self.link_cache[(table, str(row["id"]))] = link
        return obj

    def upsert(self, table, row, model, defaults):
        fields = {field.name: field for field in model._meta.fields}
        for key, value in tuple(defaults.items()):
            max_length = getattr(fields.get(key), "max_length", None)
            if isinstance(value, str) and max_length and len(value) > max_length:
                defaults[key] = value[:max_length]
        obj = self.mapped(table, row["id"], model)
        if obj:
            for key, value in defaults.items():
                setattr(obj, key, value)
            obj.save()
        else:
            obj = model.objects.create(**defaults)
        return self.save(table, row, obj)

    @transaction.atomic
    def handle(self, *args, **options):
        self.link_cache = {
            (link.source_table, link.source_id): link
            for link in LegacyRecordMap.objects.all()
        }
        self.pending_links = []
        existing = {name for name in connection.introspection.table_names()}
        required = {"organizations", "leads", "customers", "bookings"}
        if not required.issubset(existing):
            raise CommandError("Legacy Worker tables were not found in this database.")

        counts = {}
        orgs = {}
        for row in self.rows("organizations"):
            source_id = str(row["id"])
            obj = self.mapped("organizations", source_id, Organization)
            defaults = {
                "name": text(row, "name", "Lenspire Studio"),
                "slug": (slugify(text(row, "name")) or "studio") + "-" + source_id[:8],
                "active": True,
                "license_code": "legacy:" + source_id,
            }
            if obj:
                for key, value in defaults.items(): setattr(obj, key, value)
                obj.save()
            else:
                obj = Organization.objects.create(**defaults)
            orgs[source_id] = self.save("organizations", row, obj)
        counts["organizations"] = len(orgs)

        users = {}
        for row in self.rows("users"):
            org = orgs.get(str(row.get("organization_id")))
            if not org: continue
            username = text(row, "username", "legacy-user")
            defaults = {
                "organization": org, "username": f"{username}@{str(row['organization_id'])[:8]}",
                "display_name": text(row, "display_name", username), "role": text(row, "role", "Administrator"),
                "department_access": json_value(row, "department_access", {}),
                "is_active": bool(row.get("active", True)), "last_login": row.get("last_login"),
            }
            obj = self.upsert("users", row, User, defaults)
            # Worker PBKDF2-SHA256 hashes are compatible after conversion to Django's encoded form.
            if row.get("password_hash") and row.get("password_salt") and row.get("password_iterations"):
                try:
                    encoded = str(row["password_hash"])
                    raw_digest = base64.urlsafe_b64decode(encoded + "=" * (-len(encoded) % 4))
                    digest = base64.b64encode(raw_digest).decode()
                    obj.password = f"pbkdf2_sha256${row['password_iterations']}${row['password_salt']}${digest}"
                    obj.save(update_fields=["password"])
                except ValueError:
                    obj.set_unusable_password(); obj.save(update_fields=["password"])
            users[str(row["id"])] = obj
        counts["users"] = len(users)

        leads = {}
        for row in self.rows("leads"):
            org = orgs.get(str(row.get("organization_id")))
            if not org: continue
            defaults = {"organization": org, "lead_code": text(row,"lead_code",f"LEG-{str(row['id'])[:8]}"),
                "name": text(row,"name","Unknown"), "mobile": text(row,"mobile"), "event_type": text(row,"event_type","Shoot"),
                "event_date": row.get("event_date"), "city": text(row,"city"), "source": text(row,"source"),
                "status": text(row,"status","New"), "priority": text(row,"priority","Medium"), "budget": number(row,"budget"),
                "assigned_to": text(row,"assigned_to"), "notes": text(row,"notes"), "next_followup_at": row.get("next_followup_at"),
                "lost_reason": text(row,"lost_reason"), "client_name": text(row,"client_name"), "client_mobile": text(row,"client_mobile"),
                "couple_name": text(row,"couple_name"), "wedding_dates": json_value(row,"wedding_dates",[]),
                "total_closing": number(row,"total_closing"), "payment_mode": text(row,"payment_mode"),
                "advance_received": number(row,"advance_received"), "received_by": text(row,"received_by"),
                "payment_received_date": row.get("payment_received_date"), "referred_by": text(row,"referred_by"),
                "referral_code": text(row,"referral_code")}
            leads[str(row["id"])] = self.upsert("leads", row, Lead, defaults)
        counts["leads"] = len(leads)

        customers = {}
        for row in self.rows("customers"):
            org = orgs.get(str(row.get("organization_id")))
            if not org: continue
            defaults = {"organization":org, "customer_code":text(row,"customer_code",f"LEG-C-{str(row['id'])[:8]}"),
                "lead":leads.get(str(row.get("lead_id"))), "name":text(row,"name","Unknown"), "phone":text(row,"phone"),
                "email":text(row,"email"), "city":text(row,"city"), "source":text(row,"source")}
            customers[str(row["id"])] = self.upsert("customers", row, Customer, defaults)
        counts["customers"] = len(customers)

        bookings = {}
        for row in self.rows("bookings"):
            org = orgs.get(str(row.get("organization_id"))); customer = customers.get(str(row.get("customer_id")))
            if not org or not customer: continue
            defaults = {"organization":org, "booking_code":text(row,"booking_code",f"LEG-B-{str(row['id'])[:8]}"),
                "customer":customer, "lead":leads.get(str(row.get("lead_id"))), "event_type":text(row,"event_type","Shoot"),
                "event_date":row.get("event_date"), "city":text(row,"city"), "package_name":text(row,"package_name","Custom Package"),
                "quoted_amount":number(row,"quoted_amount"), "status":text(row,"status","Confirmed")}
            bookings[str(row["id"])] = self.upsert("bookings", row, Booking, defaults)
        counts["bookings"] = len(bookings)

        simple = [
            ("lead_activities", LeadActivity, lambda r,o: {"organization":o,"lead":leads.get(str(r.get("lead_id"))),"activity_type":text(r,"activity_type","Note"),"description":text(r,"description"),"performed_by":text(r,"performed_by")}),
            ("sales_targets", SalesTarget, lambda r,o: {"organization":o,"salesperson":text(r,"salesperson"),"target_month":text(r,"target_month"),"target_amount":number(r,"target_amount"),"target_bookings":r.get("target_bookings") or 0}),
            ("photographer_details", PhotographerDetail, lambda r,o: {"organization":o,"name":text(r,"name","Unknown"),"mobile":text(r,"mobile"),"living_in":text(r,"living_in"),"work":text(r,"work"),"status":text(r,"status","Available")}),
        ]
        for table, model, factory in simple:
            imported = 0
            for row in self.rows(table):
                org=orgs.get(str(row.get("organization_id")))
                if not org: continue
                defaults=factory(row,org)
                if any(value is None for key,value in defaults.items() if key in ("lead",)): continue
                self.upsert(table,row,model,defaults); imported += 1
            counts[table]=imported

        imported=0
        for row in self.rows("calendar_events"):
            org=orgs.get(str(row.get("organization_id")))
            if not org: continue
            defaults={"organization":org,"booking":bookings.get(str(row.get("booking_id"))),"customer":customers.get(str(row.get("customer_id"))),
                "title":text(row,"title","Legacy event"),"event_type":text(row,"event_type","Shoot"),"start_date":row.get("start_date"),
                "start_time":row.get("start_time"),"end_time":row.get("end_time"),"city":text(row,"city"),"status":text(row,"status","Scheduled"),
                "assigned_user":users.get(str(row.get("assigned_user_id"))),"notes":text(row,"notes"),"slotted":bool(row.get("slotted",False)),
                "client_name":text(row,"client_name"),"handled_by":text(row,"handled_by"),"couple_name":text(row,"couple_name"),
                "contact_no":text(row,"contact_no"),"photo":text(row,"photo"),"video":text(row,"video"),"candid":text(row,"candid"),
                "cinematic":text(row,"cinematic"),"drone":text(row,"drone"),"assistant":text(row,"assistant"),"bts":text(row,"bts"),
                "date_status":text(row,"date_status","Confirmed"),"tbd_month":text(row,"tbd_month")}
            self.upsert("calendar_events",row,CalendarEvent,defaults); imported+=1
        counts["calendar_events"]=imported

        imported=0
        for row in self.rows("payments"):
            org=orgs.get(str(row.get("organization_id"))); booking=bookings.get(str(row.get("booking_id"))); customer=customers.get(str(row.get("customer_id")))
            if not org or not booking or not customer: continue
            defaults={"organization":org,"booking":booking,"customer":customer,"amount":number(row,"amount"),"payment_type":text(row,"payment_type","Advance"),
                "status":text(row,"status","Pending"),"payment_mode":text(row,"payment_mode"),"received_by":text(row,"received_by"),"notes":text(row,"notes"),
                "due_date":row.get("due_date"),"paid_at":row.get("paid_at")}
            self.upsert("payments",row,Payment,defaults); imported+=1
        counts["payments"]=imported

        jobs={}; imported=0
        for row in self.rows("production_jobs"):
            org=orgs.get(str(row.get("organization_id"))); booking=bookings.get(str(row.get("booking_id"))); customer=customers.get(str(row.get("customer_id")))
            if not org or not booking or not customer: continue
            defaults={"organization":org,"booking":booking,"customer":customer,"stage":text(row,"stage","Shoot Planning"),"raw_status":text(row,"raw_status","Pending"),
                "editing_status":text(row,"editing_status","Not Started"),"album_status":text(row,"album_status","Not Started"),"video_status":text(row,"video_status","Not Started"),
                "delivery_status":text(row,"delivery_status","Pending"),"due_date":row.get("due_date"),"delivered_at":row.get("delivered_at"),
                "client_approved_at":row.get("client_approved_at"),"notes":text(row,"notes")}
            jobs[str(row["id"])]=self.upsert("production_jobs",row,ProductionJob,defaults); imported+=1
        counts["production_jobs"]=imported

        imported=0
        for row in self.rows("production_activity_log"):
            org=orgs.get(str(row.get("organization_id"))); job=jobs.get(str(row.get("production_job_id")))
            if not org or not job: continue
            defaults={"organization":org,"job":job,"activity_type":text(row,"action","Update"),"description":text(row,"message"),"performed_by":text(row,"actor"),"activity_date":row.get("created_at").date() if row.get("created_at") else None}
            if defaults["activity_date"] is None: defaults.pop("activity_date")
            self.upsert("production_activity_log",row,ProductionActivity,defaults); imported+=1
        counts["production_activity_log"]=imported

        accesses={}; imported=0
        for row in self.rows("client_portal_access"):
            org=orgs.get(str(row.get("organization_id"))); booking=bookings.get(str(row.get("booking_id")))
            if not org or not booking: continue
            # Existing opaque token is hashed so no usable credential is exposed or weakened.
            from hashlib import sha256
            token_hash=sha256(text(row,"short_token",str(row["id"])).encode()).hexdigest()
            defaults={"organization":org,"booking":booking,"token_hash":token_hash,"expires_at":row.get("expires_at"),"revoked_at":row.get("revoked_at"),
                "closed_at":row.get("closed_at"),"last_accessed_at":row.get("last_accessed_at"),"access_count":row.get("access_count") or 0}
            accesses[str(row["id"])]=self.upsert("client_portal_access",row,ClientPortalAccess,defaults); imported+=1
        counts["client_portal_access"]=imported

        imported=0
        for row in self.rows("client_portal_access_log"):
            org=orgs.get(str(row.get("organization_id"))); access=accesses.get(str(row.get("portal_access_id"))); booking=bookings.get(str(row.get("booking_id")))
            if not org or not access or not booking: continue
            defaults={"organization":org,"access":access,"booking":booking,"action":text(row,"action"),"detail":text(row,"detail")}
            self.upsert("client_portal_access_log",row,ClientPortalActivity,defaults); imported+=1
        counts["client_portal_access_log"]=imported

        imported=0
        for row in self.rows("client_portal_users"):
            org=orgs.get(str(row.get("organization_id"))); booking=bookings.get(str(row.get("booking_id")))
            if not org or not booking: continue
            email=text(row,"email") or f"legacy-{str(row['id'])[:8]}@invalid.local"
            defaults={"organization":org,"booking":booking,"name":text(row,"name",email),"email":email,"mobile":text(row,"phone"),
                "password_hash":"","last_login_at":row.get("last_login"),"active":text(row,"status","active").lower()=="active"}
            self.upsert("client_portal_users",row,ClientPortalUser,defaults); imported+=1
        counts["client_portal_users"]=imported

        LegacyRecordMap.objects.bulk_create(self.pending_links, batch_size=500)

        if options["dry_run"]:
            transaction.set_rollback(True)
        prefix="DRY RUN " if options["dry_run"] else ""
        self.stdout.write(self.style.SUCCESS(prefix + json.dumps(counts, sort_keys=True)))
