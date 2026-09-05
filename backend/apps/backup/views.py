import json
import os
import shutil
from datetime import datetime, timezone
from pathlib import Path

from django.conf import settings
from django.http import FileResponse, HttpResponseBadRequest, JsonResponse
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.permissions import AdminAccessPermission
from .tasks import create_scheduled_backup
from .utils import BACKUP_FORMAT, create_backup_file, encrypted_snapshot, restore_snapshot


class BackupView(APIView):
    permission_classes = [AdminAccessPermission]

    def get(self, request):
        return JsonResponse(encrypted_snapshot())


def _backup_folder() -> Path:
    folder = Path(settings.BASE_DIR) / "backups"
    folder.mkdir(exist_ok=True)
    return folder


def _safe_resolve(filename: str) -> Path:
    folder = _backup_folder()
    candidate = (folder / filename).resolve()
    if folder.resolve() not in candidate.parents and candidate != folder:
        raise ValueError("Path traversal attempt")
    return candidate


class BackupListView(APIView):
    permission_classes = [AdminAccessPermission]

    def get(self, request):
        folder = _backup_folder()
        entries = []
        for path in sorted(folder.glob("lenspire-*.json"), reverse=True):
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
        path = create_backup_file()
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
            path = _safe_resolve(filename)
        except ValueError:
            return HttpResponseBadRequest("Invalid filename")
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
            path = _safe_resolve(filename)
        except ValueError:
            return HttpResponseBadRequest("Invalid filename")
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
        folder = _backup_folder()
        stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        target = folder / f"lenspire-uploaded-{stamp}-{upload.name}"
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
        dry_run = bool(request.data.get("dry_run", True))
        if not filename:
            return JsonResponse({"detail": "filename is required"}, status=400)
        if confirmation != "RESTORE BACKUP":
            return JsonResponse(
                {"detail": 'Type "RESTORE BACKUP" to confirm.'}, status=400
            )
        try:
            path = _safe_resolve(filename)
        except ValueError:
            return HttpResponseBadRequest("Invalid filename")
        if not path.exists():
            return JsonResponse({"detail": "Backup not found"}, status=404)
        if dry_run:
            try:
                summary = restore_snapshot(path, dry_run=True)
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
            summary = restore_snapshot(path, dry_run=False)
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
