import pytest
from django.contrib.auth import get_user_model
from apps.core.models import Organization

User = get_user_model()


@pytest.fixture
def organization(db):
    """Create a test organization"""
    return Organization.objects.create(
        name="Test Studio",
        slug="test-studio",
        plan="professional"
    )


@pytest.fixture
def admin_user(db, organization):
    """Create an admin user"""
    return User.objects.create_user(
        username="admin",
        password="Admin1234",
        organization=organization,
        role="Administrator",
        is_staff=True
    )


@pytest.fixture
def sales_user(db, organization):
    """Create a sales user with full sales access"""
    return User.objects.create_user(
        username="sales",
        password="Sales1234",
        organization=organization,
        role="Sales Executive",
        department_access={
            "sales": "full",
            "operations": "read",
            "accounts": "none",
            "production": "none"
        }
    )


@pytest.fixture
def readonly_user(db, organization):
    """Create a user with read-only access"""
    return User.objects.create_user(
        username="viewer",
        password="View1234",
        organization=organization,
        role="Viewer",
        department_access={
            "sales": "read",
            "operations": "read",
            "accounts": "read",
            "production": "read"
        }
    )


@pytest.fixture
def api_client():
    """Return a DRF API client"""
    from rest_framework.test import APIClient
    return APIClient()


@pytest.fixture
def authenticated_client(api_client, admin_user):
    """Return an authenticated API client"""
    api_client.force_authenticate(user=admin_user)
    return api_client
