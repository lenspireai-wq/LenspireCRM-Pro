"""Celery tasks for periodic scans and async exports."""
from datetime import timedelta

from celery import shared_task
from django.utils import timezone

from apps.accounts.models import Payment
from apps.core.models import Organization
from apps.notifications.models import Notification
from apps.production.models import ProductionJob
from apps.sales.models import Lead


def _scoped(model, organization):
    return model.objects.filter(organization=organization)


@shared_task(name="apps.notifications.tasks.scan_overdue_production")
def scan_overdue_production():
    today = timezone.localdate()
    created = 0
    for org in Organization.objects.filter(active=True):
        for job in _scoped(ProductionJob, org).filter(due_date__lt=today).exclude(delivery_status__iexact="Delivered"):
            for editor in (job.editor, None):
                key = f"overdue:{job.id}:{today.isoformat()}"
                if Notification.objects.filter(organization=org, category="production", payload__key=key).exists():
                    continue
                Notification.objects.create(
                    organization=org,
                    recipient=editor,
                    title=f"Overdue: {job.customer.name if job.customer else 'Job'}",
                    body=f"Production job {job.booking.booking_code if job.booking else ''} is overdue since {job.due_date}.",
                    level=Notification.LEVEL_WARNING,
                    category="production",
                    link="/production",
                    payload={"key": key, "job_id": job.id},
                )
                created += 1
    return {"overdue_notifications_created": created}


@shared_task(name="apps.notifications.tasks.scan_pending_payments")
def scan_pending_payments():
    today = timezone.localdate()
    created = 0
    for org in Organization.objects.filter(active=True):
        for payment in _scoped(Payment, org).filter(status__iexact="Pending", due_date__lte=today):
            key = f"payment:{payment.id}:{today.isoformat()}"
            if Notification.objects.filter(organization=org, category="payments", payload__key=key).exists():
                continue
            Notification.objects.create(
                organization=org,
                title=f"Payment due: {payment.customer.name if payment.customer else 'Customer'}",
                body=f"{payment.payment_type} of ₹{payment.amount} was due on {payment.due_date}.",
                level=Notification.LEVEL_WARNING,
                category="payments",
                link="/accounts",
                payload={"key": key, "payment_id": payment.id},
            )
            created += 1
    return {"payment_notifications_created": created}


@shared_task(name="apps.notifications.tasks.scan_stale_leads")
def scan_stale_leads():
    cutoff = timezone.now() - timedelta(days=7)
    created = 0
    for org in Organization.objects.filter(active=True):
        for lead in _scoped(Lead, org).filter(status__in=["New", "Follow-up"], updated_at__lte=cutoff):
            key = f"stale-lead:{lead.id}:{cutoff.date().isoformat()}"
            if Notification.objects.filter(organization=org, category="sales", payload__key=key).exists():
                continue
            Notification.objects.create(
                organization=org,
                title=f"Stale lead: {lead.name}",
                body=f"{lead.lead_code} has had no activity since {lead.updated_at.date() if lead.updated_at else '—'}.",
                level=Notification.LEVEL_INFO,
                category="sales",
                link="/sales",
                payload={"key": key, "lead_id": lead.id},
            )
            created += 1
    return {"stale_lead_notifications_created": created}


@shared_task(name="apps.notifications.tasks.scan_subscription_expiry")
def scan_subscription_expiry():
    today = timezone.localdate()
    cutoff = today + timedelta(days=14)
    created = 0
    for org in Organization.objects.filter(active=True, subscription_expires_at__lte=cutoff, subscription_expires_at__gte=today):
        key = f"sub:{org.id}:{today.isoformat()}"
        if Notification.objects.filter(category="subscription", payload__key=key).exists():
            continue
        Notification.objects.create(
            organization=org,
            title=f"Subscription expiring soon: {org.name}",
            body=f"Plan {org.plan} expires on {org.subscription_expires_at}.",
            level=Notification.LEVEL_WARNING,
            category="subscription",
            link="/admin",
            payload={"key": key, "organization_id": org.id},
        )
        created += 1
    return {"subscription_notifications_created": created}


@shared_task(name="apps.analytics.tasks.compute_dashboard_snapshot")
def compute_dashboard_snapshot(organization_id: int):
    """Heavy aggregation that updates an org's dashboard cache; placeholder for future use."""
    org = Organization.objects.filter(pk=organization_id).first()
    if not org:
        return {"organization_id": organization_id, "status": "missing"}
    leads = _scoped(Lead, org).count()
    payments = _scoped(Payment, org).filter(status__iexact="Paid").aggregate(total=__import__("django").db.models.Sum("amount")).get("total") or 0
    return {"organization_id": organization_id, "leads": leads, "payments_total": str(payments)}
