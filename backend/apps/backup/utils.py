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

BACKUP_FORMAT = "lenspirecrm-django-backup"
BACKUP_VERSION = 1
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
    return AESGCM(_key()).decrypt(nonce, ciphertext, b"lenspirecrm-backup-v1")


def encrypted_snapshot():
    objects = []
    for model in apps.get_models():
        if model._meta.app_label in BACKUP_VERSIONED_APPS:
            objects.extend(model.objects.all())
    payload = serializers.serialize("json", objects).encode()
    nonce = os.urandom(12)
    ciphertext = AESGCM(_key()).encrypt(nonce, payload, b"lenspirecrm-backup-v1")
    return {
        "format": BACKUP_FORMAT,
        "version": BACKUP_VERSION,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "nonce": base64.b64encode(nonce).decode(),
        "ciphertext": base64.b64encode(ciphertext).decode(),
    }


def create_backup_file():
    folder = Path(settings.BASE_DIR) / "backups"
    folder.mkdir(exist_ok=True)
    path = folder / f"lenspire-{datetime.now():%Y%m%d-%H%M%S}.json"
    path.write_text(json.dumps(encrypted_snapshot()), encoding="utf-8")
    return path


def restore_snapshot(path: Path, dry_run: bool = True) -> dict:
    """Restore from a backup file.

    When ``dry_run`` is True (the default) we decrypt and summarise the
    contents but do not mutate the database. Pass ``dry_run=False`` to
    actually perform the restore.
    """
    payload = json.loads(Path(path).read_text(encoding="utf-8"))
    raw = _decrypt(payload)
    objects = list(serializers.deserialize("json", raw))
    per_app = Counter()
    for obj in objects:
        per_app[obj.object._meta.app_label] += 1
    summary = {
        "total": len(objects),
        "by_app": dict(sorted(per_app.items())),
        "backup_created_at": payload.get("created_at"),
        "backup_format": payload.get("format"),
        "backup_version": payload.get("version"),
    }
    if dry_run:
        summary["dry_run"] = True
        return summary
    for obj in objects:
        try:
            obj.save()
        except Exception as exc:
            summary.setdefault("errors", []).append(
                f"{obj.object._meta.label}: {exc}"
            )
    summary["dry_run"] = False
    return summary

