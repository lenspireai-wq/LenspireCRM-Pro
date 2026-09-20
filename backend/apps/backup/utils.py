import base64
import json
import os
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from django.conf import settings
from django.core import serializers
from django.apps import apps
from django.db import transaction
from django.utils.text import slugify
from apps.core.models import Organization

BACKUP_FORMAT = "lenspirecrm-django-backup"
BACKUP_VERSION = 2
BACKUP_VERSIONED_APPS = {
    "core", "users", "sales", "operations", "accounts", "production", "storage",
}


def _key():
    raw = os.getenv("BACKUP_ENCRYPTION_KEY", "")
    if not raw: raise RuntimeError("BACKUP_ENCRYPTION_KEY is required")
    return __import__("hashlib").sha256(raw.encode()).digest()


def _decrypt(payload: dict) -> bytes:
    if payload.get("format") != BACKUP_FORMAT:
        raise ValueError(f"Unsupported backup format: {payload.get('format')!r}")
    if payload.get("version") != BACKUP_VERSION:
        raise ValueError(f"Unsupported backup version: {payload.get('version')!r}")
    nonce = base64.b64decode(payload["nonce"])
    ciphertext = base64.b64decode(payload["ciphertext"])
    return AESGCM(_key()).decrypt(nonce, ciphertext, b"lenspirecrm-backup-v2")


def _organization_objects(organization: Organization):
    objects = []
    for model in apps.get_models():
        if model._meta.app_label not in BACKUP_VERSIONED_APPS:
            continue
        if model is Organization:
            objects.append(organization)
        elif any(field.name == "organization" for field in model._meta.fields):
            objects.extend(model.objects.filter(organization=organization))
    return objects


def encrypted_snapshot(organization: Organization):
    snapshot = {
        "organization_id": organization.id,
        "organization_slug": organization.slug,
        "organization_name": organization.name,
        "objects": json.loads(serializers.serialize("json", _organization_objects(organization))),
    }
    payload = json.dumps(snapshot).encode()
    nonce = os.urandom(12)
    ciphertext = AESGCM(_key()).encrypt(nonce, payload, b"lenspirecrm-backup-v2")
    return {
        "format": BACKUP_FORMAT,
        "version": BACKUP_VERSION,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "nonce": base64.b64encode(nonce).decode(),
        "ciphertext": base64.b64encode(ciphertext).decode(),
    }


def backup_folder(organization: Organization) -> Path:
    folder = Path(settings.BACKUP_ROOT) / (slugify(organization.name) or f"studio-{organization.id}")
    folder.mkdir(parents=True, exist_ok=True)
    return folder


def create_backup_file(organization: Organization):
    folder = backup_folder(organization)
    studio_name = slugify(organization.name) or f"studio-{organization.id}"
    path = folder / f"{studio_name}-backup-{datetime.now():%Y%m%d-%H%M%S}.json"
    path.write_text(json.dumps(encrypted_snapshot(organization)), encoding="utf-8")
    return path


def restore_snapshot(path: Path, organization: Organization, dry_run: bool = True) -> dict:
    """Restore from a backup file.

    When ``dry_run`` is True (the default) we decrypt and summarise the
    contents but do not mutate the database. Pass ``dry_run=False`` to
    actually perform the restore.
    """
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    snapshot = json.loads(_decrypt(payload))
    if snapshot.get("organization_id") != organization.id:
        raise ValueError("This backup belongs to a different studio.")
    objects = list(serializers.deserialize("json", json.dumps(snapshot.get("objects", []))))
    per_app = Counter()
    for obj in objects:
        per_app[obj.object._meta.app_label] += 1
    summary = {
        "total": len(objects),
        "by_app": dict(sorted(per_app.items())),
        "backup_created_at": payload.get("created_at"),
        "backup_format": payload.get("format"),
        "backup_version": payload.get("version"),
        "studio": snapshot.get("organization_name"),
    }
    if dry_run:
        summary["dry_run"] = True
        return summary
    try:
        with transaction.atomic():
            for obj in objects:
                obj.save()
    except Exception as exc:
        raise RuntimeError(
            "Backup restore failed; no database changes were committed."
        ) from exc
    summary["dry_run"] = False
    return summary

