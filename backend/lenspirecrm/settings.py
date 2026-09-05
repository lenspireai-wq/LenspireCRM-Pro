import os
from datetime import timedelta
from pathlib import Path

from .logging_config import configure_logging

BASE_DIR = Path(__file__).resolve().parent.parent
DEBUG = os.getenv("DEBUG", "true").lower() == "true"
SECRET_KEY = os.getenv("SECRET_KEY", "lenspire-development-key-change-before-production")
if not DEBUG and SECRET_KEY == "lenspire-development-key-change-before-production":
    raise RuntimeError("Set a strong SECRET_KEY when DEBUG is false.")

ALLOWED_HOSTS = [value.strip() for value in os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",") if value.strip()]
INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "corsheaders", "rest_framework", "rest_framework_simplejwt.token_blacklist",
    "django_filters", "drf_spectacular",
    "apps.core", "apps.users", "apps.sales", "apps.operations", "apps.accounts",
    "apps.production", "apps.backup", "apps.storage", "apps.analytics", "apps.billing",
    "apps.notifications",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "lenspirecrm.middleware.SecurityHeadersMiddleware",
    "lenspirecrm.middleware.RequestSizeLimitMiddleware",
    "lenspirecrm.middleware.ThrottleMetricsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "lenspirecrm.urls"
TEMPLATES = [{"BACKEND": "django.template.backends.django.DjangoTemplates", "DIRS": [], "APP_DIRS": True,
              "OPTIONS": {"context_processors": ["django.template.context_processors.request", "django.contrib.auth.context_processors.auth", "django.contrib.messages.context_processors.messages"]}}]
WSGI_APPLICATION = "lenspirecrm.wsgi.application"
ASGI_APPLICATION = "lenspirecrm.asgi.application"

if os.getenv("POSTGRES_DB"):
    DATABASES = {"default": {"ENGINE": "django.db.backends.postgresql", "NAME": os.getenv("POSTGRES_DB"),
        "USER": os.getenv("POSTGRES_USER", "postgres"), "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""),
        "HOST": os.getenv("POSTGRES_HOST", "localhost"), "PORT": os.getenv("POSTGRES_PORT", "5432")}}
else:
    DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}

AUTH_USER_MODEL = "users.User"
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 10}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]
LANGUAGE_CODE = "en-us"
TIME_ZONE = os.getenv("TIME_ZONE", "Asia/Kolkata")
USE_I18N = True
USE_TZ = True
STATIC_URL = "static/"
CLIENT_PORTAL_BASE_URL = os.getenv("CLIENT_PORTAL_BASE_URL", "http://127.0.0.1:3000")
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ("apps.users.authentication.OrganizationAwareJWTAuthentication",),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination", "PAGE_SIZE": 100,
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend", "rest_framework.filters.SearchFilter", "rest_framework.filters.OrderingFilter"),
    "DEFAULT_THROTTLE_CLASSES": ("rest_framework.throttling.ScopedRateThrottle",),
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/hour",
        "user": "2000/hour",
        "login": os.getenv("LOGIN_THROTTLE_RATE", "5/minute"),
        "client_portal_reset": "5/hour",
        "password_reset_request": "3/hour",
        "password_reset_confirm": "5/hour",
        "lead_write": "120/minute",
        "payment_write": "120/minute",
        "export": "20/minute",
        "import": "10/minute",
    },
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}
SIMPLE_JWT = {"ACCESS_TOKEN_LIFETIME": timedelta(minutes=15), "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
              "ROTATE_REFRESH_TOKENS": True, "BLACKLIST_AFTER_ROTATION": True,
              "CHECK_REVOKE_TOKEN": True}
CORS_ALLOWED_ORIGINS = [value.strip() for value in os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",") if value.strip()]
DATA_UPLOAD_MAX_MEMORY_SIZE = int(os.getenv("DATA_UPLOAD_MAX_MEMORY_SIZE", 10 * 1024 * 1024))
FILE_UPLOAD_MAX_MEMORY_SIZE = int(os.getenv("FILE_UPLOAD_MAX_MEMORY_SIZE", 10 * 1024 * 1024))
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG
SECURE_SSL_REDIRECT = os.getenv("SECURE_SSL_REDIRECT", "false").lower() == "true"
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
CELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")
CELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", CELERY_BROKER_URL)
CELERY_BEAT_SCHEDULE = {
    "daily-encrypted-backup": {"task": "apps.backup.tasks.create_scheduled_backup", "schedule": 86400},
    "scan-overdue-production": {"task": "apps.notifications.tasks.scan_overdue_production", "schedule": 3600},
    "scan-pending-payments": {"task": "apps.notifications.tasks.scan_pending_payments", "schedule": 21600},
    "scan-stale-leads": {"task": "apps.notifications.tasks.scan_stale_leads", "schedule": 43200},
    "scan-subscription-expiry": {"task": "apps.notifications.tasks.scan_subscription_expiry", "schedule": 86400},
}
SPECTACULAR_SETTINGS = {
    "TITLE": "LenspireCRM Pro API",
    "DESCRIPTION": "Photography studio CRM REST API.",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
}
SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    try:
        import sentry_sdk
        from sentry_sdk.integrations.celery import CeleryIntegration
        from sentry_sdk.integrations.django import DjangoIntegration
        from sentry_sdk.integrations.logging import LoggingIntegration

        sentry_sdk.init(
            dsn=SENTRY_DSN,
            integrations=[DjangoIntegration(), CeleryIntegration(), LoggingIntegration(level=20, event_level=40)],
            traces_sample_rate=float(os.getenv("SENTRY_TRACES_SAMPLE_RATE", "0.1")),
            environment=os.getenv("SENTRY_ENV", "development"),
        )
    except Exception:  # pragma: no cover
        pass
configure_logging()
