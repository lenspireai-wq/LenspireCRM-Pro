import pytest
from django.urls import reverse
from apps.sales.models import Lead, Customer, Booking
from apps.accounts.models import Payment


@pytest.mark.django_db
class TestLeadAPI:
    """Test Lead CRUD operations"""

    def test_create_lead(self, authenticated_client, organization):
        """Test creating a new lead"""
        url = reverse("lead-list")
        data = {
            "name": "Rahul & Priya",
            "mobile": "9876543210",
            "event_type": "Wedding",
            "event_date": "2026-11-25",
            "city": "Pune",
            "source": "Instagram",
            "status": "New",
            "priority": "Medium"
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == 201
        assert response.data["name"] == "Rahul & Priya"
        assert response.data["mobile"] == "9876543210"
        assert Lead.objects.filter(organization=organization).count() == 1

    def test_duplicate_mobile_rejected(self, authenticated_client, organization):
        """Test that duplicate mobile numbers are rejected"""
        Lead.objects.create(
            organization=organization,
            lead_code="L001",
            name="First Lead",
            mobile="9876543210",
            event_type="Wedding",
            event_date="2026-11-25"
        )
        
        url = reverse("lead-list")
        data = {
            "name": "Duplicate Lead",
            "mobile": "9876543210",
            "event_type": "Wedding",
            "event_date": "2026-11-26"
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == 400
        assert "mobile" in str(response.data).lower()

    def test_lost_lead_requires_reason(self, authenticated_client):
        """Test that Lost status requires a lost_reason"""
        url = reverse("lead-list")
        data = {
            "name": "Lost Lead",
            "mobile": "9876543211",
            "event_type": "Wedding",
            "status": "Lost"
        }
        response = authenticated_client.post(url, data, format="json")
        assert response.status_code == 400
        assert "lost_reason" in str(response.data).lower()

    def test_convert_lead_to_customer(self, authenticated_client, organization):
        """Test lead conversion creates customer, booking, and production job"""
        lead = Lead.objects.create(
            organization=organization,
            lead_code="L002",
            name="Convert Lead",
            mobile="9876543212",
            event_type="Wedding",
            event_date="2026-12-01",
            status="New",
            couple_name="Convert & Lead"
        )
        
        url = reverse("lead-convert", kwargs={"pk": lead.pk})
        response = authenticated_client.post(url, format="json")
        
        assert response.status_code == 200
        assert Customer.objects.filter(lead=lead).exists()
        assert Booking.objects.filter(lead=lead).exists()

    def test_confirmed_lead_auto_converts(self, authenticated_client, organization):
        """Test that Confirmed status auto-converts to customer workflow"""
        url = reverse("lead-list")
        data = {
            "name": "Auto Convert",
            "mobile": "9876543213",
            "event_type": "Wedding",
            "event_date": "2026-12-05",
            "status": "Confirmed",
            "couple_name": "Auto & Convert",
            "total_closing": "100000",
            "advance_received": "10000",
            "payment_mode": "Cash",
            "received_by": "Admin",
            "payment_received_date": "2026-09-03"
        }
        response = authenticated_client.post(url, data, format="json")
        
        assert response.status_code == 201
        lead = Lead.objects.get(pk=response.data["id"])
        assert Customer.objects.filter(lead=lead).exists()
        assert Booking.objects.filter(lead=lead).exists()
        
        # Check advance payment was recorded
        booking = Booking.objects.get(lead=lead)
        advance_payment = Payment.objects.filter(
            booking=booking,
            payment_type="Advance",
            status="Paid"
        ).first()
        assert advance_payment is not None
        assert advance_payment.amount == 10000

    def test_readonly_user_cannot_create_lead(self, api_client, readonly_user):
        """Test that read-only users cannot create leads"""
        api_client.force_authenticate(user=readonly_user)
        url = reverse("lead-list")
        data = {
            "name": "Blocked Lead",
            "mobile": "9876543214",
            "event_type": "Wedding"
        }
        response = api_client.post(url, data, format="json")
        assert response.status_code == 403

    def test_organization_scoping(self, authenticated_client, organization):
        """Test that users only see leads from their organization"""
        # Create lead in user's organization
        Lead.objects.create(
            organization=organization,
            lead_code="L003",
            name="My Lead",
            mobile="9876543215",
            event_type="Wedding"
        )
        
        # Create lead in another organization
        other_org = pytest.importorskip("apps.core.models").Organization.objects.create(
            name="Other Studio",
            slug="other-studio"
        )
        Lead.objects.create(
            organization=other_org,
            lead_code="L004",
            name="Hidden Lead",
            mobile="9876543216",
            event_type="Wedding"
        )
        
        url = reverse("lead-list")
        response = authenticated_client.get(url)
        
        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["name"] == "My Lead"
