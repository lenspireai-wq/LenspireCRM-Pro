from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter
from apps.accounts.views import PaymentReminderViewSet, PaymentViewSet
from apps.analytics.views import DashboardView, ReportsBookingsView, ReportsCustomersView, ReportsLeadSourceView, ReportsProductionView, ReportsRevenueView
from apps.backup.views import (
    BackupCreateView,
    BackupDeleteView,
    BackupDownloadView,
    BackupListView,
    BackupRestoreView,
    BackupUploadView,
    BackupView,
)
from apps.billing.views import ContractViewSet, InvoiceViewSet, QuotationViewSet
from apps.notifications.views import NotificationSummaryView, NotificationViewSet
from apps.core.views import HealthView, OrganizationViewSet
from apps.operations.views import CalendarEventViewSet, PhotographerDetailViewSet
from apps.production.views import ProductionJobViewSet
from apps.production.client_portal import ClientPortalAuthView, ClientPortalInviteView, ClientPortalManageView, ClientPortalPublicView, ClientPortalResetRequestView, ClientPortalWhatsAppView
from apps.sales.views import BookingViewSet, CustomerViewSet, LeadViewSet, SalesTargetViewSet
from apps.storage.views import AttachmentViewSet
from apps.users.views import (
    LoginView,
    UserViewSet,
    CurrentUserView,
    NotificationPreferencesView,
)
from apps.users.views import MetricsView, PasswordResetConfirmView, PasswordResetRequestView
from apps.users.token_views import OrganizationAwareTokenRefreshView
from apps.core.throttle_views import ThrottleMetricsView

router = DefaultRouter()
router.register("organizations", OrganizationViewSet, basename="organization")
router.register("users", UserViewSet, basename="user")
router.register("leads", LeadViewSet, basename="lead")
router.register("customers", CustomerViewSet, basename="customer")
router.register("bookings", BookingViewSet, basename="booking")
router.register("sales-targets", SalesTargetViewSet, basename="sales-target")
router.register("events", CalendarEventViewSet, basename="event")
router.register("photographers", PhotographerDetailViewSet, basename="photographer")
router.register("payments", PaymentViewSet, basename="payment")
router.register("payment-reminders", PaymentReminderViewSet, basename="payment-reminder")
router.register("production", ProductionJobViewSet, basename="production")
router.register("attachments", AttachmentViewSet, basename="attachment")
router.register("quotations", QuotationViewSet, basename="quotation")
router.register("contracts", ContractViewSet, basename="contract")
router.register("invoices", InvoiceViewSet, basename="invoice")
router.register("notifications", NotificationViewSet, basename="notification")

urlpatterns = [
    path("api/auth/me/", CurrentUserView.as_view()),
    path("api/client-portal/access/", ClientPortalManageView.as_view()),
    path("api/client-portal/invitations/", ClientPortalInviteView.as_view()),
    path("api/client-portal/whatsapp/", ClientPortalWhatsAppView.as_view()),
    path("api/client-portal/auth/<str:action>/", ClientPortalAuthView.as_view()),
    path("api/client-portal/request-password-reset/", ClientPortalResetRequestView.as_view()),
    path("api/client-portal/<str:token>/", ClientPortalPublicView.as_view()),
    path("admin/", admin.site.urls), path("api/health/", HealthView.as_view()),
    path("api/auth/login/", LoginView.as_view()), path("api/auth/refresh/", OrganizationAwareTokenRefreshView.as_view()),
    path("api/auth/password-reset/request/", PasswordResetRequestView.as_view(), name="password-reset-request"),
    path("api/auth/password-reset/confirm/", PasswordResetConfirmView.as_view(), name="password-reset-confirm"),
    path("api/metrics", MetricsView.as_view(), name="metrics"),
    path("api/backup/", BackupView.as_view()),
    path("api/notification-preferences/", NotificationPreferencesView.as_view(), name="notification-preferences"),
    path("api/admin/throttle-metrics/", ThrottleMetricsView.as_view(), name="throttle-metrics"),
    path("api/backups/", BackupListView.as_view(), name="backup-list"),
    path("api/backups/create/", BackupCreateView.as_view(), name="backup-create"),
    path("api/backups/upload/", BackupUploadView.as_view(), name="backup-upload"),
    path("api/backups/restore/", BackupRestoreView.as_view(), name="backup-restore"),
    path("api/backups/download/<str:filename>/", BackupDownloadView.as_view(), name="backup-download"),
    path("api/backups/<str:filename>/", BackupDeleteView.as_view(), name="backup-delete"),
    path("api/notifications/summary/", NotificationSummaryView.as_view(), name="notifications-summary"),
    path("api/dashboard/", DashboardView.as_view(), name="dashboard"),
    path("api/reports/revenue/", ReportsRevenueView.as_view(), name="reports-revenue"),
    path("api/reports/lead-sources/", ReportsLeadSourceView.as_view(), name="reports-lead-sources"),
    path("api/reports/production/", ReportsProductionView.as_view(), name="reports-production"),
    path("api/reports/bookings/", ReportsBookingsView.as_view(), name="reports-bookings"),
    path("api/reports/customers/", ReportsCustomersView.as_view(), name="reports-customers"),
    path("api/", include(router.urls)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
