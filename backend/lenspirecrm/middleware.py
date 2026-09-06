"""Security headers middleware and request-size guard."""
from django.conf import settings


class SecurityHeadersMiddleware:
    """Adds CSP + extra security headers. Next.js handles its own headers; this is a belt-and-braces layer."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response.setdefault("X-Content-Type-Options", "nosniff")
        response.setdefault("X-Frame-Options", "DENY")
        response.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        if not settings.DEBUG:
            response.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        csp = "default-src 'self'; img-src 'self' data: blob: https:; connect-src 'self' http: https: ws: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        if settings.DEBUG:
            csp += "; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'"
        response.setdefault("Content-Security-Policy", csp)
        return response


class RequestSizeLimitMiddleware:
    """Reject any request whose Content-Length exceeds the configured cap."""

    def __init__(self, get_response):
        self.get_response = get_response
        self.max_bytes = getattr(settings, "DATA_UPLOAD_MAX_MEMORY_SIZE", 10 * 1024 * 1024)

    def __call__(self, request):
        try:
            length = int(request.META.get("CONTENT_LENGTH") or 0)
        except (TypeError, ValueError):
            length = 0
        if length and length > self.max_bytes:
            from django.http import JsonResponse

            return JsonResponse(
                {"detail": f"Payload too large. Limit is {self.max_bytes} bytes."},
                status=413,
            )
        return self.get_response(request)


class ThrottleMetricsMiddleware:
    """Record throttle-related responses in the Django cache so admins can
    observe login/registration bursts. The middleware records the path,
    status code, IP, and authenticated user (if any) for 429 responses and
    for any 401/403 that mentions throttling, then keeps 24 hours of data
    for the rate-limit dashboard.
    """

    CACHE_KEY = "throttle_metrics"
    RETENTION_SECONDS = 24 * 60 * 60

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        status = getattr(response, "status_code", None)
        if status not in (401, 403, 429):
            return response
        path = request.path
        if "/api/" not in path:
            return response
        if status == 401 and not path.endswith(("/auth/login/", "/auth/refresh/")):
            return response
        try:
            from django.core.cache import cache
            import time

            entry = {
                "ts": int(time.time()),
                "path": path,
                "method": request.method,
                "status": status,
                "ip": self._client_ip(request),
                "user": (
                    request.user.username
                    if getattr(request, "user", None) and request.user.is_authenticated
                    else None
                ),
            }
            data = cache.get(self.CACHE_KEY) or []
            data.append(entry)
            cutoff = int(time.time()) - self.RETENTION_SECONDS
            data = [item for item in data if item.get("ts", 0) >= cutoff]
            cache.set(self.CACHE_KEY, data, self.RETENTION_SECONDS)
        except Exception:
            pass
        return response

    @staticmethod
    def _client_ip(request):
        forwarded = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR", "unknown")
