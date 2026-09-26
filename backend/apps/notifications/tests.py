from rest_framework.test import APITestCase

from apps.core.models import Organization
from apps.notifications.models import Notification
from apps.users.models import User


class NotificationVisibilityTests(APITestCase):
    def setUp(self):
        self.organization = Organization.objects.create(name="Notification Studio", slug="notification-studio")
        self.sales_full = User.objects.create_user(
            username="sales-full",
            organization=self.organization,
            role="Sales Executive",
            department_access={"sales": "full", "accounts": "read", "production": "none"},
        )
        self.sales_read = User.objects.create_user(
            username="sales-read",
            organization=self.organization,
            role="Sales Executive",
            department_access={"sales": "read", "accounts": "none", "production": "none"},
        )
        self.admin = User.objects.create_user(
            username="notification-admin",
            organization=self.organization,
            role="Administrator",
        )
        self.sales = Notification.objects.create(
            organization=self.organization, category="sales", title="Sales notification"
        )
        self.payment = Notification.objects.create(
            organization=self.organization, category="payments", title="Payment notification"
        )
        self.production = Notification.objects.create(
            organization=self.organization, category="production", title="Production notification"
        )
        self.direct = Notification.objects.create(
            organization=self.organization,
            recipient=self.sales_full,
            category="sales",
            title="Direct notification",
        )

    def test_department_and_direct_notifications_are_returned(self):
        self.client.force_authenticate(self.sales_full)

        response = self.client.get("/api/notifications/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            {item["id"] for item in response.data["results"]},
            {self.sales.id, self.direct.id},
        )

        summary = self.client.get("/api/notifications/summary/")
        self.assertEqual(summary.status_code, 200)
        self.assertEqual(summary.data["unread"], 2)
        self.assertEqual(
            {item["id"] for item in summary.data["latest"]},
            {self.sales.id, self.direct.id},
        )

    def test_read_department_access_receives_department_notifications(self):
        self.client.force_authenticate(self.sales_read)

        response = self.client.get("/api/notifications/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual([item["id"] for item in response.data["results"]], [self.sales.id])

    def test_administrator_sees_all_organization_notifications(self):
        self.client.force_authenticate(self.admin)

        response = self.client.get("/api/notifications/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            {item["id"] for item in response.data["results"]},
            {self.sales.id, self.payment.id, self.production.id},
        )
