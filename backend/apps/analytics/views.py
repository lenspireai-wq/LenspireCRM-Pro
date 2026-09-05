from datetime import timedelta
from decimal import Decimal

from django.db.models import Count, F, Q, Sum, Value
from django.db.models.functions import Coalesce, TruncDate, TruncMonth
from django.utils import timezone
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import Payment
from apps.operations.models import CalendarEvent
from apps.production.models import ProductionJob
from apps.sales.models import Booking, Customer, Lead


def _parse_date(value, default):
    if not value:
        return default
    try:
        return timezone.datetime.fromisoformat(value).date()
    except (TypeError, ValueError):
        return default


def _scoped_qs(model, user):
    qs = model.objects.all()
    if not user.is_superuser:
        qs = qs.filter(organization=user.organization)
    return qs


def _money(value):
    if value is None:
        return "0.00"
    return str(Decimal(value).quantize(Decimal("0.01")))


def _percent(part, total):
    if not total:
        return 0.0
    return round((part / total) * 100, 1)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Studio dashboard snapshot",
        description="Aggregated KPIs for the home screen: lead funnel, revenue MTD, today's events, overdue jobs, outstanding balance.",
        parameters=[
            OpenApiParameter("date", str, OpenApiParameter.QUERY, required=False, description="Reference date (YYYY-MM-DD); defaults to today."),
        ],
    )
    def get(self, request):
        today = _parse_date(request.query_params.get("date"), timezone.localdate())
        month_start = today.replace(day=1)
        next_month = (month_start + timedelta(days=32)).replace(day=1)
        last_month_end = month_start - timedelta(days=1)
        last_month_start = last_month_end.replace(day=1)

        leads = _scoped_qs(Lead, request.user)
        events = _scoped_qs(CalendarEvent, request.user)
        payments = _scoped_qs(Payment, request.user)
        production = _scoped_qs(ProductionJob, request.user)
        bookings = _scoped_qs(Booking, request.user)

        funnel = list(
            leads.values("status").annotate(count=Count("id")).order_by("status")
        )
        funnel_map = {row["status"]: row["count"] for row in funnel}
        total_leads = sum(funnel_map.values())

        revenue_month = payments.filter(
            status__iexact="Paid",
            paid_at__date__gte=month_start,
            paid_at__date__lt=next_month,
        ).aggregate(
            gross=Coalesce(
                Sum("amount", filter=~Q(payment_type__iexact="Refund")), Value(Decimal("0"))
            ),
            refunds=Coalesce(
                Sum("amount", filter=Q(payment_type__iexact="Refund")), Value(Decimal("0"))
            ),
        )
        revenue_last = payments.filter(
            status__iexact="Paid",
            paid_at__date__gte=last_month_start,
            paid_at__date__lt=month_start,
        ).aggregate(
            gross=Coalesce(
                Sum("amount", filter=~Q(payment_type__iexact="Refund")), Value(Decimal("0"))
            ),
            refunds=Coalesce(
                Sum("amount", filter=Q(payment_type__iexact="Refund")), Value(Decimal("0"))
            ),
        )
        mtd_net = Decimal(revenue_month["gross"] or 0) - Decimal(revenue_month["refunds"] or 0)
        last_net = Decimal(revenue_last["gross"] or 0) - Decimal(revenue_last["refunds"] or 0)
        mtd_growth_pct = (
            round(((mtd_net - last_net) / last_net) * 100, 1) if last_net else (100.0 if mtd_net else 0.0)
        )

        today_events = events.filter(start_date=today).exclude(status__iexact="Cancelled")
        today_events_list = [
            {
                "id": event.id,
                "title": event.title,
                "client_name": event.client_name,
                "event_type": event.event_type,
                "start_time": event.start_time.isoformat() if event.start_time else None,
                "city": event.city,
                "status": event.status,
            }
            for event in today_events.order_by("start_time", "id")
        ]

        overdue_jobs = production.filter(
            due_date__lt=today
        ).exclude(delivery_status__iexact="Delivered")
        overdue_jobs_count = overdue_jobs.count()
        overdue_jobs_list = [
            {
                "id": job.id,
                "client_name": getattr(job.customer, "name", "") if job.customer else "",
                "booking_code": getattr(job.booking, "booking_code", "") if job.booking else "",
                "stage": job.stage,
                "due_date": job.due_date.isoformat() if job.due_date else None,
                "days_overdue": (today - job.due_date).days if job.due_date else None,
                "editor": (job.editor.display_name or job.editor.username) if job.editor else "",
            }
            for job in overdue_jobs.order_by("due_date")[:10]
        ]

        outstanding = bookings.filter(status__iexact="Confirmed").aggregate(
            quoted=Coalesce(Sum("quoted_amount"), Value(Decimal("0"))),
            collected=Coalesce(
                Sum(
                    "payments__amount",
                    filter=Q(payments__status__iexact="Paid")
                    & ~Q(payments__payment_type__iexact="Refund"),
                ),
                Value(Decimal("0")),
            ),
        )
        outstanding_amount = Decimal(outstanding["quoted"] or 0) - Decimal(outstanding["collected"] or 0)
        if outstanding_amount < 0:
            outstanding_amount = Decimal("0")

        recent_leads = list(
            leads.order_by("-created_at").values(
                "id", "lead_code", "name", "event_type", "event_date", "status", "city", "assigned_to", "created_at"
            )[:10]
        )
        for lead in recent_leads:
            if lead.get("event_date"):
                lead["event_date"] = lead["event_date"].isoformat()
            if lead.get("created_at"):
                lead["created_at"] = lead["created_at"].isoformat()

        pending_payments = list(
            payments.filter(status__iexact="Pending").order_by("due_date").values(
                "id", "amount", "payment_type", "due_date",
                "customer__name", "booking__booking_code",
            )[:10]
        )
        for payment in pending_payments:
            if payment.get("due_date"):
                payment["due_date"] = payment["due_date"].isoformat()

        return Response({
            "reference_date": today.isoformat(),
            "month": {
                "label": month_start.strftime("%B %Y"),
                "revenue_net": _money(mtd_net),
                "revenue_gross": _money(revenue_month["gross"]),
                "refunds": _money(revenue_month["refunds"]),
                "previous_revenue_net": _money(last_net),
                "growth_pct": mtd_growth_pct,
            },
            "funnel": {
                "total": total_leads,
                "by_status": [
                    {"status": "New", "count": funnel_map.get("New", 0)},
                    {"status": "Follow-up", "count": funnel_map.get("Follow-up", 0)},
                    {"status": "Confirmed", "count": funnel_map.get("Confirmed", 0)},
                    {"status": "Booked", "count": funnel_map.get("Booked", 0)},
                    {"status": "Lost", "count": funnel_map.get("Lost", 0)},
                ],
                "conversion_pct": _percent(funnel_map.get("Confirmed", 0) + funnel_map.get("Booked", 0), total_leads),
            },
            "today": {
                "event_count": today_events.count(),
                "events": today_events_list,
            },
            "production": {
                "overdue_count": overdue_jobs_count,
                "overdue": overdue_jobs_list,
            },
            "outstanding": {
                "amount": _money(outstanding_amount),
                "pending_payments": pending_payments,
            },
            "recent_leads": recent_leads,
        })


class ReportsRevenueView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Revenue report",
        description="Monthly revenue (gross, refunds, net) for the last N months. Defaults to 12.",
        parameters=[
            OpenApiParameter("months", int, OpenApiParameter.QUERY, required=False),
        ],
    )
    def get(self, request):
        months = max(1, min(int(request.query_params.get("months", 12) or 12), 36))
        today = timezone.localdate()
        first_of_this_month = today.replace(day=1)
        months_axis = []
        year, month = first_of_this_month.year, first_of_this_month.month
        for _ in range(months):
            months_axis.append(today.replace(year=year, month=month, day=1))
            month -= 1
            if month == 0:
                month = 12
                year -= 1
        months_axis.reverse()

        labels = [m.strftime("%b %Y") for m in months_axis]

        payments = _scoped_qs(Payment, request.user).filter(
            status__iexact="Paid",
            paid_at__date__gte=months_axis[0],
        )
        buckets = payments.annotate(month=TruncMonth("paid_at")).values("month").annotate(
            gross=Coalesce(
                Sum("amount", filter=~Q(payment_type__iexact="Refund")), Value(Decimal("0"))
            ),
            refunds=Coalesce(
                Sum("amount", filter=Q(payment_type__iexact="Refund")), Value(Decimal("0"))
            ),
        )
        bucket_map = {row["month"].date().replace(day=1) if row["month"] else None: row for row in buckets if row["month"]}

        gross_series = []
        refund_series = []
        net_series = []
        for m in months_axis:
            row = bucket_map.get(m, None)
            gross = Decimal(row["gross"] or 0) if row else Decimal("0")
            refunds = Decimal(row["refunds"] or 0) if row else Decimal("0")
            gross_series.append(_money(gross))
            refund_series.append(_money(refunds))
            net_series.append(_money(gross - refunds))

        return Response({
            "labels": labels,
            "gross": gross_series,
            "refunds": refund_series,
            "net": net_series,
            "currency": "INR",
        })


class ReportsLeadSourceView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Lead source ROI report",
        description="Leads, bookings and revenue grouped by lead source.",
    )
    def get(self, request):
        leads = _scoped_qs(Lead, request.user)
        sources = list(leads.values_list("source", flat=True).distinct())
        out = []
        for source in sorted(s for s in sources if s):
            source_leads = leads.filter(source=source)
            lead_count = source_leads.count()
            converted = source_leads.filter(status__in=["Booked", "Confirmed"]).count()
            booking_ids = Booking.objects.filter(lead__in=source_leads).values_list("id", flat=True)
            revenue = Payment.objects.filter(
                booking_id__in=booking_ids, status__iexact="Paid"
            ).aggregate(
                gross=Coalesce(
                    Sum("amount", filter=~Q(payment_type__iexact="Refund")), Value(Decimal("0"))
                ),
                refunds=Coalesce(
                    Sum("amount", filter=Q(payment_type__iexact="Refund")), Value(Decimal("0"))
                ),
            )
            net = Decimal(revenue["gross"] or 0) - Decimal(revenue["refunds"] or 0)
            out.append({
                "source": source,
                "leads": lead_count,
                "converted": converted,
                "conversion_pct": _percent(converted, lead_count),
                "revenue_net": _money(net),
            })
        out.sort(key=lambda row: Decimal(row["revenue_net"]), reverse=True)
        return Response({"sources": out})


class ReportsProductionView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Production throughput report", description="Counts of production jobs by stage and delivery status.")
    def get(self, request):
        jobs = _scoped_qs(ProductionJob, request.user)
        by_stage = list(jobs.values("stage").annotate(count=Count("id")).order_by("stage"))
        by_delivery = list(jobs.values("delivery_status").annotate(count=Count("id")).order_by("delivery_status"))
        today = timezone.localdate()
        in_flight = jobs.exclude(delivery_status__iexact="Delivered").count()
        overdue = jobs.filter(due_date__lt=today).exclude(delivery_status__iexact="Delivered").count()
        return Response({
            "by_stage": [{"stage": row["stage"] or "Unspecified", "count": row["count"]} for row in by_stage],
            "by_delivery_status": [{"delivery_status": row["delivery_status"] or "Unspecified", "count": row["count"]} for row in by_delivery],
            "in_flight": in_flight,
            "overdue": overdue,
        })


class ReportsBookingsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Bookings by event type", description="Counts of confirmed bookings grouped by event type.")
    def get(self, request):
        rows = (
            _scoped_qs(Booking, request.user)
            .filter(status__iexact="Confirmed")
            .values("event_type")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        return Response({
            "rows": [
                {"event_type": row["event_type"] or "Unspecified", "count": row["count"]}
                for row in rows
            ]
        })


class ReportsCustomersView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(summary="Customer acquisition report", description="New customers per month for the last N months.")
    def get(self, request):
        months = max(1, min(int(request.query_params.get("months", 12) or 12), 36))
        today = timezone.localdate()
        first_of_this_month = today.replace(day=1)
        months_axis = []
        year, month = first_of_this_month.year, first_of_this_month.month
        for _ in range(months):
            months_axis.append(today.replace(year=year, month=month, day=1))
            month -= 1
            if month == 0:
                month = 12
                year -= 1
        months_axis.reverse()

        customers = _scoped_qs(Customer, request.user).filter(created_at__date__gte=months_axis[0])
        buckets = customers.annotate(month=TruncMonth("created_at")).values("month").annotate(count=Count("id"))
        bucket_map = {row["month"].date().replace(day=1) if row["month"] else None: row["count"] for row in buckets if row["month"]}
        labels = [m.strftime("%b %Y") for m in months_axis]
        series = [bucket_map.get(m, 0) for m in months_axis]
        return Response({"labels": labels, "new_customers": series})
