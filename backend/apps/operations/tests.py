from datetime import date, timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.utils import timezone
from openpyxl import Workbook
from rest_framework.test import APIClient

from apps.core.models import Organization
from apps.users.models import User
from .models import CalendarEvent, PhotographerDetail


class OperationsApiTests(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(name="Studio", slug="studio")
        self.user = User.objects.create_user(username="admin", password="secret", organization=self.organization)
        self.client = APIClient()
        self.client.force_authenticate(self.user)

    def test_event_and_photographer_are_organization_scoped(self):
        response = self.client.post("/api/events/", {"title": "Wedding", "client_name": "Asha", "event_type": "Wedding", "start_date": "2026-09-20", "date_status": "Confirmed"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(CalendarEvent.objects.get().organization, self.organization)
        response = self.client.post("/api/photographers/", {"name": "Avi", "status": "Available"})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(PhotographerDetail.objects.get().organization, self.organization)

    def test_tbd_event_requires_month(self):
        response = self.client.post("/api/events/", {"title": "Wedding", "event_type": "Wedding", "date_status": "TBD Month"})
        self.assertEqual(response.status_code, 400)
        self.assertIn("tbd_month", response.data)

    def test_past_event_is_automatically_completed(self):
        yesterday = date.today() - timedelta(days=1)
        response = self.client.post(
            "/api/events/",
            {
                "title": "Past Wedding",
                "event_type": "Wedding",
                "start_date": yesterday.isoformat(),
                "date_status": "Confirmed",
                "status": "Scheduled",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["status"], "Completed")

    def test_future_event_cannot_remain_completed(self):
        tomorrow = date.today() + timedelta(days=1)
        event = CalendarEvent.objects.create(
            organization=self.organization,
            title="Future Wedding",
            event_type="Wedding",
            start_date=tomorrow,
            status="Completed",
        )
        response = self.client.get("/api/events/")
        self.assertEqual(response.status_code, 200)
        event.refresh_from_db()
        self.assertEqual(event.status, "Scheduled")

    def test_cancelled_past_event_stays_cancelled(self):
        yesterday = date.today() - timedelta(days=1)
        event = CalendarEvent.objects.create(
            organization=self.organization,
            title="Cancelled Wedding",
            event_type="Wedding",
            start_date=yesterday,
            status="Cancelled",
        )
        self.client.get("/api/events/")
        event.refresh_from_db()
        self.assertEqual(event.status, "Cancelled")

    def test_event_today_is_automatically_in_progress(self):
        response = self.client.post(
            "/api/events/",
            {
                "title": "Wedding Today",
                "event_type": "Wedding",
                "start_date": timezone.localdate().isoformat(),
                "date_status": "Confirmed",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["status"], "In Progress")

    def test_ready_future_event_is_automatically_confirmed(self):
        tomorrow = timezone.localdate() + timedelta(days=1)
        response = self.client.post(
            "/api/events/",
            {
                "title": "Ready Wedding",
                "event_type": "Wedding",
                "start_date": tomorrow.isoformat(),
                "start_time": "10:00:00",
                "date_status": "Confirmed",
                "city": "Mumbai Venue",
                "notes": "Arrive thirty minutes early.",
                "photo": "Aakash Gorde · 918421258470",
                "video": "NA",
                "candid": "NA",
                "cinematic": "NA",
                "drone": "NA",
                "assistant": "NA",
                "bts": "NA",
            },
        )
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["status"], "Confirmed")

    def test_rejects_duplicate_events_and_photographers(self):
        event = {"title": "Wedding", "client_name": "Asha", "event_type": "Wedding", "start_date": "2026-09-20", "date_status": "Confirmed"}
        self.assertEqual(self.client.post("/api/events/", event).status_code, 201)
        self.assertEqual(self.client.post("/api/events/", event).status_code, 400)
        self.assertEqual(self.client.post("/api/photographers/", {"name": "Avi", "mobile": "+91 98765 43210"}).status_code, 201)
        self.assertEqual(self.client.post("/api/photographers/", {"name": "Avi Duplicate", "mobile": "9876543210"}).status_code, 400)

    def test_upcoming_events_excel_export(self):
        CalendarEvent.objects.create(organization=self.organization, title="Wedding", start_date=date(2026, 9, 20))
        response = self.client.get("/api/events/export/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("upcoming-events.xlsx", response["Content-Disposition"])

    def test_upcoming_events_excel_import(self):
        workbook = Workbook()
        sheet = workbook.active
        sheet.append(["title", "event_type", "start_date", "date_status"])
        sheet.append(["Reception", "Reception", date(2026, 10, 2), "Confirmed"])
        from io import BytesIO
        stream = BytesIO()
        workbook.save(stream)
        upload = SimpleUploadedFile("events.xlsx", stream.getvalue(), content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
        response = self.client.post("/api/events/import/", {"file": upload}, format="multipart")
        self.assertEqual(response.status_code, 201, response.data)
        self.assertEqual(response.data["created"], 1)
