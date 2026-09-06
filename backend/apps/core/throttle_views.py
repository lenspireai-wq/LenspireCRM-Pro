"""Admin-only rate-limit dashboard endpoint.

Surfaces throttle-related 401/403/429 responses that the
``ThrottleMetricsMiddleware`` recorded in the Django cache. Returns a
summary by path, IP, and user, plus the recent raw events. Used by the
``RateLimitWorkspace`` on the admin "Rate limits" page.
"""
import time
from collections import Counter

from django.core.cache import cache
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from lenspirecrm.middleware import ThrottleMetricsMiddleware


def _window(items, now, seconds):
    cutoff = now - seconds
    return [item for item in items if item.get("ts", 0) >= cutoff]


def _top(counter, limit=10):
    return [
        {"key": key, "count": value}
        for key, value in counter.most_common(limit)
    ]


class ThrottleMetricsView(APIView):
    """Return throttle events aggregated by path / IP / user."""

    permission_classes = [IsAdminUser]

    def get(self, request):
        data = cache.get(ThrottleMetricsMiddleware.CACHE_KEY) or []
        now = int(time.time())
        last_hour = _window(data, now, 60 * 60)
        last_day = _window(data, now, 24 * 60 * 60)

        def summary(items):
            by_path = Counter(item.get("path", "?") for item in items)
            by_ip = Counter(item.get("ip", "?") for item in items)
            by_user = Counter(
                item.get("user") or "anonymous" for item in items
            )
            by_status = Counter(str(item.get("status")) for item in items)
            return {
                "total": len(items),
                "by_path": _top(by_path, 8),
                "by_ip": _top(by_ip, 8),
                "by_user": _top(by_user, 8),
                "by_status": _top(by_status, 4),
            }

        recent = sorted(last_day, key=lambda item: item.get("ts", 0), reverse=True)[
            :50
        ]

        return Response(
            {
                "last_hour": summary(last_hour),
                "last_day": summary(last_day),
                "recent": recent,
                "retention_seconds": ThrottleMetricsMiddleware.RETENTION_SECONDS,
                "now": now,
            }
        )

    def delete(self, request):
        cache.delete(ThrottleMetricsMiddleware.CACHE_KEY)
        return Response({"detail": "Throttle metrics cleared."})
