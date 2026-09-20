import os
import tempfile

from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from apps.core.models import Organization
from apps.users.models import User


class StudioBackupIsolationTests(TestCase):
    def setUp(self):
        self.backup_root = tempfile.TemporaryDirectory()
        self.settings_override = override_settings(BACKUP_ROOT=self.backup_root.name)
        self.settings_override.enable()
        self.previous_key = os.environ.get("BACKUP_ENCRYPTION_KEY")
        os.environ["BACKUP_ENCRYPTION_KEY"] = "test-only-backup-key"
        self.ankit = Organization.objects.create(name="Ankit Studios", slug="ankit-studios")
        self.lenspire = Organization.objects.create(name="The Lenspire", slug="the-lenspire")
        self.ankit_admin = User.objects.create_user(
            username="ankit-admin", password="password", organization=self.ankit, is_staff=True
        )
        self.lenspire_admin = User.objects.create_user(
            username="lenspire-admin", password="password", organization=self.lenspire, is_staff=True
        )
        self.client = APIClient()

    def tearDown(self):
        if self.previous_key is None:
            os.environ.pop("BACKUP_ENCRYPTION_KEY", None)
        else:
            os.environ["BACKUP_ENCRYPTION_KEY"] = self.previous_key
        self.settings_override.disable()
        self.backup_root.cleanup()

    def test_backup_is_named_and_visible_only_for_its_studio(self):
        self.client.force_authenticate(self.ankit_admin)
        created = self.client.post("/api/backups/create/")
        self.assertEqual(created.status_code, 200, created.data)
        filename = created.data["filename"]
        self.assertTrue(filename.startswith("ankit-studios-backup-"))

        self.client.force_authenticate(self.lenspire_admin)
        listed = self.client.get("/api/backups/")
        self.assertEqual(listed.status_code, 200, listed.data)
        self.assertEqual(listed.data["results"], [])
        self.assertEqual(self.client.get(f"/api/backups/download/{filename}/").status_code, 404)

    def test_restore_requires_the_studio_password(self):
        self.client.force_authenticate(self.ankit_admin)
        filename = self.client.post("/api/backups/create/").data["filename"]
        invalid = self.client.post(
            "/api/backups/restore/",
            {"filename": filename, "confirmation": "RESTORE BACKUP", "password": "wrong", "dry_run": True},
            format="json",
        )
        self.assertEqual(invalid.status_code, 403)
        allowed = self.client.post(
            "/api/backups/restore/",
            {"filename": filename, "confirmation": "RESTORE BACKUP", "password": "ankitstudioslenspireai", "dry_run": True},
            format="json",
        )
        self.assertEqual(allowed.status_code, 200, allowed.data)
