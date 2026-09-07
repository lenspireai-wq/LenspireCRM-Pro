"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CategoryBar, FunnelDoughnut, RevenueLineChart } from "@/components/charts";
import { useAuthStore } from "@/stores/auth";

type DashboardResponse = {
  reference_date: string;
  month: { label: string; revenue_net: string; revenue_gross: string; refunds: string; previous_revenue_net: string; growth_pct: number };
  funnel: { total: number; by_status: { status: string; count: number }[]; conversion_pct: number };
  today: { event_count: number; events: { id: number; title: string; client_name: string; event_type: string; start_time: string | null; city: string; status: string }[] };
  production: { overdue_count: number; overdue: { id: number; client_name: string; booking_code: string; stage: string; due_date: string | null; days_overdue: number | null; editor: string }[] };
  outstanding: { amount: string; pending_payments: { id: number; amount: number; payment_type: string; due_date: string | null; customer__name: string; booking__booking_code: string }[] };
  recent_leads: { id: number; lead_code: string; name: string; event_type: string; event_date: string | null; status: string; city: string; assigned_to: string; created_at: string }[];
};

type RevenueResponse = { labels: string[]; gross: string[]; refunds: string[]; net: string[]; currency: string };

const formatINR = (value: string | number) => {
  const number = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number);
};

const MetricCard = ({ label, value, hint, accent }: { label: string; value: string; hint?: string; accent?: string }) => (
  <div className="dashMetric">
    <span className="dashMetricIcon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        {label.startsWith("Revenue") || label === "Outstanding" ? <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="M3 10h18M7 15h4" /></> : label === "MoM Growth" ? <><path d="m4 17 6-6 4 3 6-9M15 5h5v5" /></> : label.startsWith("Leads") ? <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M21 20v-2a6 6 0 0 0-3-5" /></> : <><rect x="4" y="5" width="16" height="16" rx="3" /><path d="M8 3v4M16 3v4M4 11h16m-12 5 2 2 5-4" /></>}
      </svg>
    </span>
    <div className="dashMetricCopy">
    <span className="dashMetricLabel">{label}</span>
    <strong>{value}</strong>
    {hint ? <small className={accent === "#ef4444" ? "dashMetricAlert" : undefined}>{hint}</small> : null}
    </div>
  </div>
);

export default function DashboardWorkspace({ months, onMonthsChange }: { months: number; onMonthsChange: (value: number) => void }) {
  const user = useAuthStore((state) => state.user);
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [revenue, setRevenue] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      api.get<DashboardResponse>("/dashboard/"),
      api.get<RevenueResponse>(`/reports/revenue/?months=${months}`),
    ])
      .then(([dash, rev]) => {
        if (cancelled) return;
        setData(dash.data);
        setRevenue(rev.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.detail || "Could not load dashboard");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [months]);

  if (loading && !data) {
    return <section className="workspace dashboard"><p>Loading dashboard…</p></section>;
  }
  if (error) {
    return <section className="workspace dashboard"><p className="error">{error}</p></section>;
  }
  if (!data || !revenue) return null;

  const grossValues = revenue.gross.map((value) => Number(value));
  const netValues = revenue.net.map((value) => Number(value));
  const refundsValues = revenue.refunds.map((value) => Number(value));

  return (
    <section className="workspace dashboard">
      <div className="dashMetrics">
        <MetricCard label="Revenue (MTD)" value={formatINR(data.month.revenue_net)} hint={`Gross ${formatINR(data.month.revenue_gross)}`} accent="#22c55e" />
        <MetricCard label="MoM Growth" value={`${data.month.growth_pct.toFixed(1)}%`} hint={`Prev ${formatINR(data.month.previous_revenue_net)}`} accent={data.month.growth_pct >= 0 ? "#22c55e" : "#ef4444"} />
        <MetricCard label="Leads (Total)" value={String(data.funnel.total)} hint={`${data.funnel.conversion_pct.toFixed(1)}%`} />
        <MetricCard label="Outstanding" value={formatINR(data.outstanding.amount)} hint="Unpaid" accent="#f59e0b" />
        <MetricCard label="Today’s Events" value={String(data.today.event_count)} hint={data.today.event_count ? "Open Operations" : "No events"} />
        <MetricCard label="Overdue Jobs" value={String(data.production.overdue_count)} hint={data.production.overdue_count ? "Needs attention" : "All good"} accent={data.production.overdue_count ? "#ef4444" : "#22c55e"} />
      </div>

      <div className="dashGrid">
        <div className="dashCard">
          <h2>Revenue trend</h2>
          <div className="dashChart"><RevenueLineChart labels={revenue.labels} gross={grossValues} net={netValues} /></div>
        </div>
        <div className="dashCard">
          <h2>Lead funnel</h2>
          <div className="dashChart"><FunnelDoughnut rows={data.funnel.by_status} /></div>
        </div>
        <div className="dashCard">
          <h2>Refunds vs gross</h2>
          <div className="dashChart">
            <CategoryBar labels={revenue.labels} values={grossValues} label="Gross" color="#7367f0" />
          </div>
          <div className="dashChart" style={{ marginTop: 12 }}>
            <CategoryBar labels={revenue.labels} values={refundsValues} label="Refunds" color="#ef4444" />
          </div>
        </div>
        <div className="dashCard">
          <h2>Today’s events</h2>
          {data.today.events.length === 0 ? (
            <p className="dashEmpty">No events scheduled for today.</p>
          ) : (
            <ul className="dashList">
              {data.today.events.map((event) => (
                <li key={event.id}>
                  <strong>{event.client_name || event.title}</strong>
                  <span>{event.event_type} · {event.city}</span>
                  <small>{event.start_time || "Time not set"} · {event.status}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dashCard">
          <h2>Overdue production</h2>
          {data.production.overdue.length === 0 ? (
            <p className="dashEmpty">No overdue jobs.</p>
          ) : (
            <ul className="dashList">
              {data.production.overdue.map((job) => (
                <li key={job.id}>
                  <strong>{job.client_name || job.booking_code}</strong>
                  <span>{job.booking_code} · {job.stage}</span>
                  <small>
                    Due {job.due_date} · {job.days_overdue ?? 0}d late · {job.editor || "Unassigned"}
                  </small>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="dashCard">
          <h2>Recent leads</h2>
          {data.recent_leads.length === 0 ? (
            <p className="dashEmpty">No recent leads yet.</p>
          ) : (
            <ul className="dashList">
              {data.recent_leads.map((lead) => (
                <li key={lead.id}>
                  <strong>{lead.name} <em>{lead.lead_code}</em></strong>
                  <span>{lead.event_type} · {lead.city}</span>
                  <small>Event {lead.event_date || "TBD"} · {lead.status} · {lead.assigned_to || "Unassigned"}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
