"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CategoryBar, RevenueLineChart } from "@/components/charts";

type RevenueResponse = { labels: string[]; gross: string[]; refunds: string[]; net: string[]; currency: string };
type LeadSources = { sources: { source: string; leads: number; converted: number; conversion_pct: number; revenue_net: string }[] };
type ProductionReport = { by_stage: { stage: string; count: number }[]; by_delivery_status: { delivery_status: string; count: number }[]; in_flight: number; overdue: number };
type BookingsReport = { rows: { event_type: string; count: number }[] };
type CustomersReport = { labels: string[]; new_customers: number[] };

const formatINR = (value: string | number) => {
  const number = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(number)) return "—";
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number);
};

const toNumbers = (values: string[]) => values.map((value) => Number(value));

export default function ReportsWorkspace() {
  const [months, setMonths] = useState(12);
  const [revenue, setRevenue] = useState<RevenueResponse | null>(null);
  const [sources, setSources] = useState<LeadSources | null>(null);
  const [production, setProduction] = useState<ProductionReport | null>(null);
  const [bookings, setBookings] = useState<BookingsReport | null>(null);
  const [customers, setCustomers] = useState<CustomersReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([
      api.get<RevenueResponse>(`/reports/revenue/?months=${months}`),
      api.get<LeadSources>("/reports/lead-sources/"),
      api.get<ProductionReport>("/reports/production/"),
      api.get<BookingsReport>("/reports/bookings/"),
      api.get<CustomersReport>(`/reports/customers/?months=${months}`),
    ])
      .then(([rev, src, prod, bk, cust]) => {
        if (cancelled) return;
        setRevenue(rev.data);
        setSources(src.data);
        setProduction(prod.data);
        setBookings(bk.data);
        setCustomers(cust.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.response?.data?.detail || "Could not load reports");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [months]);

  if (loading && !revenue) {
    return <section className="workspace reports"><p>Loading reports…</p></section>;
  }
  if (error) {
    return <section className="workspace reports"><p className="error">{error}</p></section>;
  }
  if (!revenue || !sources || !production || !bookings || !customers) return null;

  const grossValues = toNumbers(revenue.gross);
  const netValues = toNumbers(revenue.net);
  const refundValues = toNumbers(revenue.refunds);

  return (
    <section className="workspace reports">
      <header className="dashHeader">
        <div>
          <h1>Studio Reports</h1>
          <p>Drill into revenue, lead sources, production and customers.</p>
        </div>
        <label className="dashSelect">
          Window
          <select value={months} onChange={(e) => setMonths(Number(e.target.value))}>
            <option value={3}>3 months</option>
            <option value={6}>6 months</option>
            <option value={12}>12 months</option>
            <option value={24}>24 months</option>
          </select>
        </label>
      </header>

      <div className="dashGrid">
        <div className="dashCard dashCardWide">
          <h2>Revenue trend</h2>
          <div className="dashChart"><RevenueLineChart labels={revenue.labels} gross={grossValues} net={netValues} /></div>
        </div>

        <div className="dashCard">
          <h2>Refunds by month</h2>
          <div className="dashChart"><CategoryBar labels={revenue.labels} values={refundValues} label="Refunds" color="#ef4444" /></div>
        </div>

        <div className="dashCard">
          <h2>New customers</h2>
          <div className="dashChart"><CategoryBar labels={customers.labels} values={customers.new_customers} label="New" color="#22c55e" /></div>
        </div>

        <div className="dashCard dashCardWide">
          <h2>Lead source ROI</h2>
          {sources.sources.length === 0 ? (
            <p className="dashEmpty">No source data yet.</p>
          ) : (
            <table className="dashTable">
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Leads</th>
                  <th>Converted</th>
                  <th>Conv. %</th>
                  <th>Revenue (net)</th>
                </tr>
              </thead>
              <tbody>
                {sources.sources.map((row) => (
                  <tr key={row.source}>
                    <td>{row.source}</td>
                    <td>{row.leads}</td>
                    <td>{row.converted}</td>
                    <td>{row.conversion_pct.toFixed(1)}%</td>
                    <td>{formatINR(row.revenue_net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashCard">
          <h2>Production stage</h2>
          {production.by_stage.length === 0 ? (
            <p className="dashEmpty">No production jobs yet.</p>
          ) : (
            <ul className="dashList">
              {production.by_stage.map((row) => (
                <li key={row.stage}>
                  <strong>{row.stage}</strong>
                  <span>{row.count} job{row.count === 1 ? "" : "s"}</span>
                  <small>{row.stage === "Delivered" ? "Completed" : "In the queue"}</small>
                </li>
              ))}
              <li><strong>In flight</strong><span>{production.in_flight}</span><small>Not yet delivered</small></li>
              <li><strong>Overdue</strong><span>{production.overdue}</span><small>Past due date</small></li>
            </ul>
          )}
        </div>

        <div className="dashCard">
          <h2>Bookings by event type</h2>
          {bookings.rows.length === 0 ? (
            <p className="dashEmpty">No confirmed bookings yet.</p>
          ) : (
            <ul className="dashList">
              {bookings.rows.map((row) => (
                <li key={row.event_type}>
                  <strong>{row.event_type}</strong>
                  <span>{row.count}</span>
                  <small>{((row.count / Math.max(1, bookings.rows.reduce((sum, r) => sum + r.count, 0))) * 100).toFixed(1)}% of mix</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
