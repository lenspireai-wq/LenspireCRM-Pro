from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework.test import APIClient

from apps.core.models import Organization
from .models import User


class FourCharacterPasswordTests(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(name="Policy Test", slug="policy-test")
        self.admin = User.objects.create_user(
            username="policy-admin", password="existing-long-password",
            organization=self.organization, role="Administrator", is_staff=True,
        )
        self.client = APIClient()
        self.client.force_authenticate(self.admin)

    def test_numeric_and_longer_passwords_pass_global_validation(self):
        for password in ("1234", "0000", "existing-long-password"):
            validate_password(password)
        with self.assertRaises(ValidationError):
            validate_password("123")

    def test_create_update_and_reset_accept_four_digits(self):
        response = self.client.post('/api/users/', {
            'username': 'four-digit-user', 'password': '1234', 'role': 'Sales Executive',
        }, format='json')
        self.assertEqual(response.status_code, 201, response.data)
        user = User.objects.get(pk=response.data['id'])
        self.assertTrue(user.check_password('1234'))
        response = self.client.patch(f'/api/users/{user.pk}/', {'password': '0000'}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        user.refresh_from_db()
        self.assertTrue(user.check_password('0000'))
        response = self.client.post(f'/api/users/{user.pk}/reset-password/', {'password': '9876'}, format='json')
        self.assertEqual(response.status_code, 200, response.data)
        user.refresh_from_db()
        self.assertTrue(user.check_password('9876'))
        response = self.client.post(f'/api/users/{user.pk}/reset-password/', {'password': '123'}, format='json')
        self.assertEqual(response.status_code, 400, response.data)
        user.refresh_from_db()
        self.assertTrue(user.check_password('9876'))
