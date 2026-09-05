"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CategoryBar, FunnelDoughnut, RevenueLineChart } from "@/components/charts";

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
  <div className="dashMetric" style={accent ? { borderColor: accent } : undefined}>
    <span className="dashMetricLabel">{label}</span>
    <strong>{value}</strong>
    {hint ? <small>{hint}</small> : null}
  </div>
);

export default function DashboardWorkspace() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [revenue, setRevenue] = useState<RevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [months, setMonths] = useState(6);

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
      <header className="dashHeader">
        <div>
          <h1>Studio Dashboard</h1>
          <p>Snapshot for {data.reference_date} · {data.month.label}</p>
        </div>
        <label className="dashSelect">
          Window
          <select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
          </select>
        </label>
      </header>

      <div className="dashMetrics">
        <MetricCard label="Revenue (MTD)" value={formatINR(data.month.revenue_net)} hint={`Gross ${formatINR(data.month.revenue_gross)} · Refunds ${formatINR(data.month.refunds)}`} accent="#22c55e" />
        <MetricCard label="MoM Growth" value={`${data.month.growth_pct.toFixed(1)}%`} hint={`Previous: ${formatINR(data.month.previous_revenue_net)}`} accent={data.month.growth_pct >= 0 ? "#22c55e" : "#ef4444"} />
        <MetricCard label="Leads (Total)" value={String(data.funnel.total)} hint={`Conversion ${data.funnel.conversion_pct.toFixed(1)}%`} />
        <MetricCard label="Outstanding" value={formatINR(data.outstanding.amount)} hint="Unpaid across confirmed bookings" accent="#f59e0b" />
        <MetricCard label="Today’s Events" value={String(data.today.event_count)} hint={data.today.event_count ? "Tap Operations to manage" : "No events scheduled"} />
        <MetricCard label="Overdue Jobs" value={String(data.production.overdue_count)} hint={data.production.overdue_count ? "Production attention needed" : "All caught up"} accent={data.production.overdue_count ? "#ef4444" : "#22c55e"} />
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
