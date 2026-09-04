from django.urls import reverse
from django.utils import timezone
from django.core.cache import cache
from datetime import timedelta
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from apps.core.models import Organization, OrganizationAuditActivity
from apps.users.models import User, UserAuditActivity
from apps.sales.models import Lead, Booking
from apps.accounts.models import Payment

class ApiTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.org = Organization.objects.create(name="Studio One", slug="studio-one")
        self.other = Organization.objects.create(name="Studio Two", slug="studio-two")
        self.user = User.objects.create_user(username="owner", password="Strong-pass-123", organization=self.org, is_staff=True)
        self.client.force_authenticate(self.user)
    def test_health(self):
        self.client.credentials(); self.assertEqual(self.client.get("/api/health/").status_code, 200)
    def test_only_platform_owner_can_manage_studio_workspaces(self):
        self.assertEqual(self.client.get("/api/organizations/").status_code, 403)
        platform_owner = User.objects.create_superuser(
            username="platform-owner", password="Owner-pass-123"
        )
        self.client.force_authenticate(platform_owner)
        response = self.client.post(
            "/api/organizations/",
            {
                "name": "Client Studio",
                "plan": "professional",
                "subscription_expires_at": "2027-09-03",
                "admin_name": "Client Administrator",
                "username": "client.admin",
                "password": "Secure-pass-123",
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        organization = Organization.objects.get(slug="client-studio")
        administrator = User.objects.get(username="client.admin")
        self.assertEqual(administrator.organization, organization)
        self.assertTrue(administrator.is_staff)
        self.assertTrue(administrator.check_password("Secure-pass-123"))
        self.assertEqual(response.data["user_count"], 1)
        self.assertRegex(organization.license_code, r"^LENSPIRE-\d{4}-[A-Z0-9]{8}$")
        self.assertTrue(
            OrganizationAuditActivity.objects.filter(
                organization=organization, action="Studio Created"
            ).exists()
        )
        paused = self.client.patch(
            f"/api/organizations/{organization.id}/", {"active": False}, format="json"
        )
        self.assertEqual(paused.status_code, 200)
        renewed = self.client.patch(
            f"/api/organizations/{organization.id}/",
            {"subscription_expires_at": "2028-09-03"},
            format="json",
        )
        self.assertEqual(renewed.status_code, 200)
        actions = set(
            OrganizationAuditActivity.objects.filter(organization=organization)
            .values_list("action", flat=True)
        )
        self.assertTrue({"Studio Created", "Studio Paused", "Subscription Renewed"}.issubset(actions))
        history = self.client.get("/api/organizations/audit-history/")
        self.assertEqual(history.status_code, 200)
        self.assertGreaterEqual(len(history.data), 3)
        protected = self.client.delete(f"/api/organizations/{organization.id}/")
        self.assertEqual(protected.status_code, 405)
        self.assertTrue(Organization.objects.filter(pk=organization.id).exists())
    def test_paused_studio_blocks_login_existing_tokens_and_refresh(self):
        member = User.objects.create_user(
            username="paused-admin",
            password="Secure-pass-123",
            organization=self.org,
            role="Administrator",
        )
        anonymous = APIClient()
        login = anonymous.post(
            "/api/auth/login/",
            {"username": member.username, "password": "Secure-pass-123"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)
        self.org.active = False
        self.org.save(update_fields=("active",))
        blocked_login = anonymous.post(
            "/api/auth/login/",
            {"username": member.username, "password": "Secure-pass-123"},
            format="json",
        )
        self.assertEqual(blocked_login.status_code, 401)
        anonymous.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        self.assertEqual(anonymous.get("/api/auth/me/").status_code, 401)
        anonymous.credentials()
        refreshed = anonymous.post(
            "/api/auth/refresh/", {"refresh": login.data["refresh"]}, format="json"
        )
        self.assertEqual(refreshed.status_code, 401)
    def test_expired_studio_blocks_login_existing_tokens_and_refresh_until_renewed(self):
        member = User.objects.create_user(
            username="expired-admin",
            password="Secure-pass-123",
            organization=self.org,
            role="Administrator",
        )
        anonymous = APIClient()
        login = anonymous.post(
            "/api/auth/login/",
            {"username": member.username, "password": "Secure-pass-123"},
            format="json",
        )
        self.assertEqual(login.status_code, 200)

        self.org.subscription_expires_at = timezone.localdate() - timedelta(days=1)
        self.org.save(update_fields=("subscription_expires_at",))
        blocked_login = anonymous.post(
            "/api/auth/login/",
            {"username": member.username, "password": "Secure-pass-123"},
            format="json",
        )
        self.assertEqual(blocked_login.status_code, 401)
        self.assertIn("subscription has expired", blocked_login.data["detail"])
        anonymous.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        self.assertEqual(anonymous.get("/api/auth/me/").status_code, 401)
        anonymous.credentials()
        self.assertEqual(
            anonymous.post(
                "/api/auth/refresh/", {"refresh": login.data["refresh"]}, format="json"
            ).status_code,
            401,
        )

        # The subscription remains valid throughout its stated expiry date.
        self.org.subscription_expires_at = timezone.localdate()
        self.org.save(update_fields=("subscription_expires_at",))
        renewed_login = anonymous.post(
            "/api/auth/login/",
            {"username": member.username, "password": "Secure-pass-123"},
            format="json",
        )
        self.assertEqual(renewed_login.status_code, 200)

        self.org.subscription_expires_at = timezone.localdate() + timedelta(days=365)
        self.org.save(update_fields=("subscription_expires_at",))
        self.assertEqual(
            anonymous.post(
                "/api/auth/login/",
                {"username": member.username, "password": "Secure-pass-123"},
                format="json",
            ).status_code,
            200,
        )
    def test_leads_are_organization_scoped(self):
        Lead.objects.create(organization=self.other, lead_code="OTHER-1", name="Hidden", event_type="Wedding")
        response = self.client.get("/api/leads/")
        self.assertEqual(response.status_code, 200); self.assertEqual(response.data["count"], 0)
    def test_admin_can_reset_connected_testing_data_without_deleting_users(self):
        created = self.client.post(
            "/api/leads/",
            {
                "name": "Reset Client",
                "mobile": "9000000099",
                "event_type": "Wedding",
                "event_date": "2026-10-10",
                "status": "Confirmed",
                "couple_name": "Reset & Client",
                "total_closing": "100000",
                "advance_received": "10000",
                "payment_mode": "Cash",
                "received_by": "Owner",
                "payment_received_date": "2026-09-03",
            },
            format="json",
        )
        self.assertEqual(created.status_code, 201, created.data)
        Lead.objects.create(
            organization=self.other,
            lead_code="OTHER-RESET",
            name="Preserved Other Studio",
            event_type="Wedding",
        )
        rejected = self.client.post(
            "/api/users/reset-testing-data/",
            {"confirmation": "RESET"},
            format="json",
        )
        self.assertEqual(rejected.status_code, 400)
        reset = self.client.post(
            "/api/users/reset-testing-data/",
            {"confirmation": "RESET TEST DATA"},
            format="json",
        )
        self.assertEqual(reset.status_code, 200, reset.data)
        self.assertEqual(Lead.objects.filter(organization=self.org).count(), 0)
        self.assertEqual(Booking.objects.filter(organization=self.org).count(), 0)
        self.assertEqual(Payment.objects.filter(organization=self.org).count(), 0)
        self.assertEqual(Lead.objects.filter(organization=self.other).count(), 1)
        self.assertTrue(User.objects.filter(pk=self.user.pk).exists())
        self.assertTrue(
            UserAuditActivity.objects.filter(
                organization=self.org, action="Testing Data Reset"
            ).exists()
        )
    def test_create_and_convert_lead(self):
        created = self.client.post("/api/leads/", {"lead_code":"LEAD-1","name":"Asha","event_type":"Wedding","event_date":"2026-10-10","status":"New"})
        self.assertEqual(created.status_code, 201)
        converted = self.client.post(f"/api/leads/{created.data['id']}/convert/")
        self.assertEqual(converted.status_code, 200)
    def test_sales_validation_and_activity_timeline(self):
        invalid = self.client.post("/api/leads/", {"name":"Lost Lead","event_type":"Wedding","status":"Lost"})
        self.assertEqual(invalid.status_code, 400)
        created = self.client.post("/api/leads/", {"name":"Follow-up Lead","mobile":"9876543210","event_type":"Wedding","event_date":"2026-10-10","status":"Follow-up","next_followup_at":"2026-09-10T10:00:00+05:30"})
        activity = self.client.post(f"/api/leads/{created.data['id']}/activities/", {"activity_type":"Call","description":"Discussed package"})
        self.assertEqual(activity.status_code, 201)
        detail = self.client.get(f"/api/leads/{created.data['id']}/")
        self.assertEqual(detail.data["activities"][0]["description"], "Discussed package")
        duplicate = self.client.post("/api/leads/", {"name":"Duplicate","mobile":"+91 98765 43210","event_type":"Wedding","event_date":"2026-10-10","status":"New"})
        self.assertEqual(duplicate.status_code, 400)
    def test_followup_and_confirmation_amount_validation(self):
        followup = self.client.post("/api/leads/", {"name":"No Date","mobile":"9000000001","event_type":"Wedding","event_date":"2026-10-10","status":"Follow-up"})
        self.assertEqual(followup.status_code, 400)
        confirmed = self.client.post("/api/leads/", {"name":"Invalid Advance","mobile":"9000000002","event_type":"Wedding","event_date":"2026-10-10","status":"Confirmed","couple_name":"A & B","total_closing":"10000","advance_received":"11000","payment_mode":"Cash","received_by":"Admin","payment_received_date":"2026-09-03"})
        self.assertEqual(confirmed.status_code, 400)
        self.assertIn("advance_received", confirmed.data)
    def test_confirmation_advance_updates_without_touching_manual_payment(self):
        payload = {"name":"Advance Client","mobile":"9000000003","event_type":"Wedding","event_date":"2026-10-10","status":"Confirmed","couple_name":"A & B","total_closing":"100000","advance_received":"30000","payment_mode":"Gpay","received_by":"Admin","payment_received_date":"2026-09-03"}
        created = self.client.post("/api/leads/", payload)
        self.assertEqual(created.status_code, 201, created.data)
        booking = Booking.objects.get(lead_id=created.data["id"])
        manual = Payment.objects.create(organization=self.org, booking=booking, customer=booking.customer, amount=2500, payment_type="Advance", status="Paid")
        response = self.client.patch(f"/api/leads/{created.data['id']}/", {"advance_received":"35000","payment_mode":"Cash"})
        self.assertEqual(response.status_code, 200, response.data)
        confirmation = Payment.objects.get(booking=booking, notes="Advance Booking amount recorded during lead confirmation.")
        self.assertEqual(confirmation.amount, 35000)
        self.assertEqual(confirmation.payment_mode, "Cash")
        manual.refresh_from_db(); self.assertEqual(manual.amount, 2500)
    def test_read_only_sales_user_cannot_mutate(self):
        viewer = User.objects.create_user(username="viewer", organization=self.org, role="Viewer", department_access={"sales":"read"})
        self.client.force_authenticate(viewer)
        self.assertEqual(self.client.get("/api/leads/").status_code, 200)
        response = self.client.post("/api/leads/", {"name":"Blocked","event_type":"Wedding","event_date":"2026-10-10"})
        self.assertEqual(response.status_code, 403)
    def test_department_permissions_control_reads_and_writes(self):
        viewer = User.objects.create_user(
            username="operations-viewer",
            organization=self.org,
            role="Viewer",
            department_access={"operations": "read"},
        )
        self.client.force_authenticate(viewer)
        self.assertEqual(self.client.get("/api/events/").status_code, 200)
        self.assertEqual(self.client.get("/api/customers/").status_code, 200)
        self.assertEqual(self.client.get("/api/bookings/").status_code, 200)
        self.assertEqual(self.client.get("/api/leads/").status_code, 403)
        self.assertEqual(self.client.get("/api/payments/").status_code, 403)
        self.assertEqual(self.client.get("/api/production/").status_code, 403)
        response = self.client.post(
            "/api/events/",
            {"title": "Blocked", "event_type": "Shoot", "start_date": "2026-10-10"},
        )
        self.assertEqual(response.status_code, 403)

        viewer.department_access = {"operations": "full"}
        viewer.save(update_fields=["department_access"])
        response = self.client.post(
            "/api/events/",
            {"title": "Allowed", "event_type": "Shoot", "start_date": "2026-10-10"},
        )
        self.assertEqual(response.status_code, 201, response.data)

    def test_user_management_hashes_password_and_normalizes_permissions(self):
        response = self.client.post(
            "/api/users/",
            {
                "username": "sales-reader",
                "display_name": "Sales Reader",
                "password": "Secure-pass-123",
                "role": "Viewer",
                "department_access": {"sales": "read"},
                "is_active": True,
            },
            format="json",
        )
        self.assertEqual(response.status_code, 201, response.data)
        created = User.objects.get(username="sales-reader")
        self.assertTrue(created.check_password("Secure-pass-123"))
        self.assertEqual(
            created.department_access,
            {
                "sales": "read",
                "operations": "none",
                "accounts": "none",
                "production": "none",
            },
        )
        self.assertTrue(
            UserAuditActivity.objects.filter(
                target_user=created, action="User Created", performed_by="owner"
            ).exists()
        )
        updated = self.client.patch(
            f"/api/users/{created.id}/", {"password": "Changed-pass-123"}
        )
        self.assertEqual(updated.status_code, 200, updated.data)
        created.refresh_from_db()
        self.assertTrue(created.check_password("Changed-pass-123"))
        password_activity = UserAuditActivity.objects.filter(
            target_user=created, action="User Updated"
        ).latest("created_at")
        self.assertIn("Password was reset", password_activity.description)
        self.assertNotIn("Changed-pass-123", password_activity.description)
        audit_response = self.client.get("/api/users/audit-history/")
        self.assertEqual(audit_response.status_code, 200)
        self.assertEqual(len(audit_response.data), 2)

        session_client = APIClient()
        login = session_client.post(
            "/api/auth/login/",
            {"username": "sales-reader", "password": "Changed-pass-123"},
            format="json",
        )
        self.assertEqual(login.status_code, 200, login.data)
        session_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
        )
        reset = self.client.post(
            f"/api/users/{created.id}/reset-password/",
            {"password": "Final-pass-123"},
            format="json",
        )
        self.assertEqual(reset.status_code, 200, reset.data)
        self.assertEqual(session_client.get("/api/auth/me/").status_code, 401)

        new_session = APIClient()
        login = new_session.post(
            "/api/auth/login/",
            {"username": "sales-reader", "password": "Final-pass-123"},
            format="json",
        )
        new_session.credentials(HTTP_AUTHORIZATION=f"Bearer {login.data['access']}")
        deactivated = self.client.post(
            f"/api/users/{created.id}/set-active/",
            {"active": False},
            format="json",
        )
        self.assertEqual(deactivated.status_code, 200, deactivated.data)
        self.assertEqual(new_session.get("/api/auth/me/").status_code, 401)
        blocked_login = APIClient().post(
            "/api/auth/login/",
            {"username": "sales-reader", "password": "Final-pass-123"},
            format="json",
        )
        self.assertEqual(blocked_login.status_code, 401)
    def test_sales_targets_upsert_and_excel_export(self):
        first = self.client.post("/api/sales-targets/", {"salesperson":"Administrator","target_month":"2026-09","target_amount":"500000","target_bookings":5})
        self.assertEqual(first.status_code, 201)
        second = self.client.post("/api/sales-targets/", {"salesperson":"Administrator","target_month":"2026-09","target_amount":"600000","target_bookings":6})
        self.assertEqual(second.status_code, 201)
        self.assertEqual(self.client.get("/api/sales-targets/").data["count"], 1)
        export = self.client.get("/api/leads/export/")
        self.assertEqual(export.status_code, 200)
        self.assertIn("spreadsheetml", export["Content-Type"])
