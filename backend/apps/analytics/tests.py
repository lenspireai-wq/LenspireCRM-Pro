from datetime import datetime
from decimal import Decimal

from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import Payment
from apps.core.models import Organization
from apps.sales.models import Booking, Customer, Lead
from apps.users.models import User


class DashboardTenantIsolationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.ankit = Organization.objects.create(name="Ankit Studios", slug="ankit-studios")
        self.lenspire = Organization.objects.create(name="The Lenspire", slug="the-lenspire")
        # This specifically covers the former superuser bypass.
        self.ankit_admin = User.objects.create_user(
            username="ankit-admin", password="test-password", organization=self.ankit,
            is_superuser=True, is_staff=True,
        )

        ankit_booking, ankit_customer = self._create_studio_data(
            self.ankit, "ANKIT", "Ankit lead", Decimal("60000")
        )
        ankit_booking.quoted_amount = Decimal("232000")
        ankit_booking.save(update_fields=["quoted_amount"])
        Payment.objects.create(
            organization=self.ankit, booking=ankit_booking, customer=ankit_customer,
            amount=Decimal("40000"), status="Paid", payment_type="Balance",
            paid_at=timezone.make_aware(datetime(2026, 10, 3, 10, 0)),
        )
        self._create_studio_data(self.lenspire, "LENSPIRE", "Lenspire lead", Decimal("476816"))

    def _create_studio_data(self, organization, code, lead_name, paid_amount):
        lead = Lead.objects.create(
            organization=organization, lead_code=f"{code}-L1", name=lead_name,
            event_type="Wedding", status="Confirmed",
        )
        customer = Customer.objects.create(
            organization=organization, customer_code=f"{code}-C1", name=lead_name,
        )
        booking = Booking.objects.create(
            organization=organization, booking_code=f"{code}-B1", customer=customer,
            lead=lead, event_type="Wedding", quoted_amount=paid_amount, status="Confirmed",
        )
        Payment.objects.create(
            organization=organization, booking=booking, customer=customer, amount=paid_amount,
            status="Paid", paid_at=timezone.make_aware(datetime(2026, 10, 2, 10, 0)),
        )
        return booking, customer

    def test_dashboard_is_scoped_to_superusers_studio(self):
        self.client.force_authenticate(user=self.ankit_admin)

        response = self.client.get("/api/dashboard/?date=2026-10-07")

        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload["funnel"]["total"], 1)
        self.assertEqual(payload["month"]["revenue_net"], "100000.00")
        self.assertEqual(payload["month"]["revenue_gross"], "100000.00")
        self.assertEqual(payload["outstanding"]["amount"], "132000.00")
