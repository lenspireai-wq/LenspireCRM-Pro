import json
import logging
import shutil
import hmac
from datetime import datetime, timezone
from pathlib import Path

from django.http import FileResponse, HttpResponseBadRequest, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView

from apps.core.permissions import AdminAccessPermission
from .utils import BACKUP_FORMAT, backup_folder, create_backup_file, encrypted_snapshot, restore_snapshot


logger = logging.getLogger(__name__)


class BackupView(APIView):
    permission_classes = [AdminAccessPermission]

    def get(self, request):
        organization = getattr(request.user, "organization", None)
        if organization is None:
            return JsonResponse({"detail": "Choose a studio account to create a studio backup."}, status=403)
        return JsonResponse(encrypted_snapshot(organization))


def _organization(request):
    return getattr(request.user, "organization", None)


def _safe_resolve(request, filename: str) -> Path:
    organization = _organization(request)
    if organization is None:
        raise PermissionError("Choose a studio account to access studio backups.")
    folder = backup_folder(organization)
    candidate = (folder / filename).resolve()
    if folder.resolve() not in candidate.parents and candidate != folder:
        raise ValueError("Path traversal attempt")
    return candidate


def _restore_password(organization) -> str:
    return "".join(character for character in organization.name.lower() if character.isalnum()) + "lenspireai"


class BackupListView(APIView):
    permission_classes = [AdminAccessPermission]

    def get(self, request):
        organization = _organization(request)
        if organization is None:
            return JsonResponse({"detail": "Choose a studio account to access studio backups."}, status=403)
        folder = backup_folder(organization)
        entries = []
        for path in sorted(folder.glob("*-backup-*.json"), reverse=True):
            try:
                stat = path.stat()
            except FileNotFoundError:
                continue
            size = stat.st_size
            created = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
            entries.append(
                {
                    "filename": path.name,
                    "size_bytes": size,
                    "created_at": created.isoformat(),
                    "size_human": _humanize(size),
                }
            )
        return JsonResponse({"results": entries})


class BackupCreateView(APIView):
    permission_classes = [AdminAccessPermission]

    def post(self, request):
        organization = _organization(request)
        if organization is None:
            return JsonResponse({"detail": "Choose a studio account to create a studio backup."}, status=403)
        try:
            path = create_backup_file(organization)
        except Exception:
            logger.exception("Could not create encrypted backup")
            return JsonResponse(
                {
                    "detail": (
                        "The server could not create the encrypted backup. "
                        "Check the backup storage and encryption configuration."
                    )
                },
                status=500,
            )
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except Exception:
            payload = {}
        return JsonResponse(
            {
                "filename": path.name,
                "created_at": datetime.now(tz=timezone.utc).isoformat(),
                "format": payload.get("format", BACKUP_FORMAT),
                "size_bytes": path.stat().st_size,
                "size_human": _humanize(path.stat().st_size),
            }
        )


class BackupDownloadView(APIView):
    permission_classes = [AdminAccessPermission]

    def get(self, request, filename: str):
        try:
            path = _safe_resolve(request, filename)
        except ValueError:
            return HttpResponseBadRequest("Invalid filename")
        except PermissionError as exc:
            return JsonResponse({"detail": str(exc)}, status=403)
        if not path.exists() or not path.is_file():
            return JsonResponse({"detail": "Backup not found"}, status=404)
        return FileResponse(
            path.open("rb"),
            as_attachment=True,
            filename=path.name,
            content_type="application/json",
        )


class BackupDeleteView(APIView):
    permission_classes = [AdminAccessPermission]

    def delete(self, request, filename: str):
        try:
            path = _safe_resolve(request, filename)
        except ValueError:
            return HttpResponseBadRequest("Invalid filename")
        except PermissionError as exc:
            return JsonResponse({"detail": str(exc)}, status=403)
        if not path.exists() or not path.is_file():
            return JsonResponse({"detail": "Backup not found"}, status=404)
        path.unlink()
        return JsonResponse({"deleted": path.name})


class BackupUploadView(APIView):
    permission_classes = [AdminAccessPermission]
    parser_classes = [MultiPartParser]

    def post(self, request):
        upload = request.FILES.get("file")
        if not upload:
            return JsonResponse({"detail": "file field is required"}, status=400)
        organization = _organization(request)
        if organization is None:
            return JsonResponse({"detail": "Choose a studio account to upload a studio backup."}, status=403)
        folder = backup_folder(organization)
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        studio_name = "".join(character for character in organization.name.lower() if character.isalnum()) or f"studio{organization.id}"
        target = folder / f"{studio_name}-backup-uploaded-{stamp}.json"
        with target.open("wb") as out:
            shutil.copyfileobj(upload.file, out)
        try:
            payload = json.loads(target.read_text(encoding="utf-8"))
        except Exception as exc:
            target.unlink(missing_ok=True)
            return JsonResponse({"detail": f"Backup file is not valid JSON: {exc}"}, status=400)
        format_ = payload.get("format")
        if format_ != BACKUP_FORMAT:
            target.unlink(missing_ok=True)
            return JsonResponse(
                {"detail": f"Unsupported backup format: {format_!r}"}, status=400
            )
        try:
            restore_snapshot(target, organization, dry_run=True)
        except Exception as exc:
            target.unlink(missing_ok=True)
            return JsonResponse({"detail": f"This backup cannot be used by your studio: {exc}"}, status=400)
        return JsonResponse(
            {
                "filename": target.name,
                "size_bytes": target.stat().st_size,
                "size_human": _humanize(target.stat().st_size),
                "format": format_,
                "version": payload.get("version"),
                "created_at": payload.get("created_at"),
            }
        )


class BackupRestoreView(APIView):
    permission_classes = [AdminAccessPermission]

    def post(self, request):
        filename = request.data.get("filename")
        confirmation = request.data.get("confirmation")
        password = request.data.get("password", "")
        dry_run = bool(request.data.get("dry_run", True))
        if not filename:
            return JsonResponse({"detail": "filename is required"}, status=400)
        if confirmation != "RESTORE BACKUP":
            return JsonResponse(
                {"detail": 'Type "RESTORE BACKUP" to confirm.'}, status=400
            )
        organization = _organization(request)
        if organization is None:
            return JsonResponse({"detail": "Choose a studio account to restore a studio backup."}, status=403)
        if not hmac.compare_digest(str(password), _restore_password(organization)):
            return JsonResponse({"detail": "The studio restore password is incorrect."}, status=403)
        try:
            path = _safe_resolve(request, filename)
        except ValueError:
            return HttpResponseBadRequest("Invalid filename")
        except PermissionError as exc:
            return JsonResponse({"detail": str(exc)}, status=403)
        if not path.exists():
            return JsonResponse({"detail": "Backup not found"}, status=404)
        if dry_run:
            try:
                summary = restore_snapshot(path, organization, dry_run=True)
            except Exception as exc:
                return JsonResponse({"detail": f"Could not read backup: {exc}"}, status=400)
            return JsonResponse(
                {
                    "dry_run": True,
                    "summary": summary,
                    "filename": filename,
                    "warning": "Set dry_run=false and re-confirm to actually restore.",
                }
            )
        try:
            summary = restore_snapshot(path, organization, dry_run=False)
        except Exception as exc:
            return JsonResponse({"detail": f"Restore failed: {exc}"}, status=500)
        return JsonResponse({"dry_run": False, "summary": summary, "filename": filename})


def _humanize(num: int) -> str:
    size = float(num)
    for unit in ["B", "KB", "MB", "GB"]:
        if size < 1024:
            return f"{size:.1f} {unit}"
        size /= 1024
    return f"{size:.1f} TB"
