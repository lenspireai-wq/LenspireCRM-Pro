"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation, useApiQuery, queryKeys, queryClient } from "@/lib/query";
import { useAuthStore } from "@/stores/auth";
import { canWrite } from "@/lib/permissions";
import LeadImportWizard from "@/components/LeadImportWizard";

type Lead = {
  id: number;
  lead_code: string;
  name: string;
  mobile: string;
  event_type: string;
  event_date: string | null;
  city: string;
  source: string;
  status: string;
  priority: string;
  budget: string | null;
  assigned_to: string;
  notes: string;
  next_followup_at: string | null;
  lost_reason: string;
  client_name: string;
  client_mobile: string;
  couple_name: string;
  wedding_dates: string[];
  total_closing: string | null;
  payment_mode: string;
  advance_received: string | null;
  received_by: string;
  payment_received_date: string | null;
  referred_by: string;
  referral_code: string;
  created_at: string;
  updated_at: string;
  activities: Activity[];
  attachments: Attachment[];
};
type Attachment = {
  id: number;
  name: string;
  file: string;
  created_at: string;
};
type SalesTarget = {
  id: number;
  salesperson: string;
  target_month: string;
  target_amount: string;
  target_bookings: number;
};
type Activity = {
  id: number;
  activity_type: string;
  description: string;
  performed_by: string;
  created_at: string;
};
const emptyLead = {
  name: "",
  mobile: "",
  event_type: "Wedding",
  event_date: "",
  city: "",
  source: "Instagram",
  status: "New",
  priority: "Medium",
  budget: "",
  assigned_to: "",
  notes: "",
  next_followup_at: "",
  lost_reason: "",
  client_name: "",
  client_mobile: "",
  couple_name: "",
  wedding_dates: [] as string[],
  total_closing: "",
  payment_mode: "",
  advance_received: "",
  received_by: "",
  payment_received_date: "",
  referred_by: "",
  referral_code: "",
};
const money = (value: any) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
const date = (value: any) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const dateTime = (value: any) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not scheduled";

export default function SalesWorkspace({
  startNewLead = false,
}: {
  startNewLead?: boolean;
}) {
  const leadsQuery = useApiQuery<{ results: Lead[] } | Lead[]>(
      queryKeys.leads(),
      "/leads/?page_size=500&ordering=-created_at",
    ),
    bookingsQuery = useApiQuery<{ results: any[] } | any[]>(
      queryKeys.bookings(),
      "/bookings/?page_size=500",
    ),
    user = useAuthStore((s) => s.user);
  const leads = (Array.isArray(leadsQuery.data)
    ? leadsQuery.data
    : leadsQuery.data?.results || []) as Lead[];
  const bookingsCount = (Array.isArray(bookingsQuery.data)
    ? bookingsQuery.data
    : bookingsQuery.data?.results || []
  ).length;
  const canEdit = canWrite(user, "sales");

  const importLeadsMutation = useApiMutation<FormData, any, Error>({
    mutationFn: async (body) => (await api.post("/leads/import/", body)).data,
  });
  const deleteLeadMutation = useApiMutation<{ id: number }, unknown, Error>({
    mutationFn: async ({ id }) => (await api.delete(`/leads/${id}/`)).data,
  });
  const saveSalesTargetMutation = useApiMutation<any, unknown, Error>({
    mutationFn: async (payload) => (await api.post("/sales-targets/", payload)).data,
  });
  const saveLeadMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) =>
      (await (url ? api.put(url, payload) : api.post("/leads/", payload))).data,
  });
  const [targets, setTargets] = useState<SalesTarget[]>([]),
    [targetOpen, setTargetOpen] = useState(false),
    [importOpen, setImportOpen] = useState(false);
  const targetsQuery = useApiQuery<{ results: SalesTarget[] } | SalesTarget[]>(
    queryKeys.salesTargets(),
    "/sales-targets/",
  );
  useEffect(() => {
    if (targetsQuery.data) {
      setTargets(
        Array.isArray(targetsQuery.data)
          ? targetsQuery.data
          : targetsQuery.data.results || [],
      );
    }
  }, [targetsQuery.data]);
  const fileInput = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<"Dashboard" | "Lead Management">(
      "Dashboard",
    ),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("All"),
    [priority, setPriority] = useState("All"),
    [source, setSource] = useState("All"),
    [reminder, setReminder] = useState("All"),
    [editing, setEditing] = useState<Lead | null | undefined>(undefined),
    [detail, setDetail] = useState<Lead | null>(null),
    [notice, setNotice] = useState("");
  useEffect(() => {
    if (startNewLead && canEdit) setEditing(null);
  }, [startNewLead, canEdit]);
  const now = new Date(),
    today = now.toISOString().slice(0, 10);
  const buckets = useMemo(() => {
    const active = leads.filter(
      (l) => l.next_followup_at && !["Confirmed", "Lost"].includes(l.status),
    );
    return {
      overdue: active.filter((l) => new Date(l.next_followup_at!) < now),
      today: active.filter(
        (l) =>
          l.next_followup_at!.slice(0, 10) === today &&
          new Date(l.next_followup_at!) >= now,
      ),
      upcoming: active.filter((l) => l.next_followup_at!.slice(0, 10) > today),
    };
  }, [leads]);
  const filtered = useMemo(
    () =>
      leads
        .filter((l) => {
          const search =
            !query ||
            Object.values(l).some((v) =>
              String(v ?? "")
                .toLowerCase()
                .includes(query.toLowerCase()),
            );
          const rem =
            reminder === "All" ||
            (reminder === "Overdue"
              ? buckets.overdue
              : reminder === "Today"
                ? buckets.today
                : buckets.upcoming
            ).some((x) => x.id === l.id);
          return (
            search &&
            (status === "All" || l.status === status) &&
            (priority === "All" || l.priority === priority) &&
            (source === "All" || l.source === source) &&
            rem
          );
        })
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        ),
    [leads, query, status, priority, source, reminder, buckets],
  );
  const activeValue = leads
    .filter((lead) => ["New", "Follow-up"].includes(lead.status))
    .reduce((sum, lead) => sum + Number(lead.budget || 0), 0);
  const sourceRows = Object.entries(
    leads.reduce<Record<string, number>>((rows, lead) => {
      const key = lead.source || "Other";
      rows[key] = (rows[key] || 0) + 1;
      return rows;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const lostRows = Object.entries(
    leads
      .filter((lead) => lead.status === "Lost")
      .reduce<Record<string, number>>((rows, lead) => {
        const key = lead.lost_reason || "Not specified";
        rows[key] = (rows[key] || 0) + 1;
        return rows;
      }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const teamRows = Object.entries(
    leads.reduce<Record<string, number>>((rows, lead) => {
      const key = lead.assigned_to || "Unassigned";
      rows[key] = (rows[key] || 0) + 1;
      return rows;
    }, {}),
  ).sort((a, b) => b[1] - a[1]);
  const month = new Date().toISOString().slice(0, 7),
    monthTargets = targets.filter((target) => target.target_month === month),
    targetTotal = monthTargets.reduce(
      (sum, target) => sum + Number(target.target_amount || 0),
      0,
    ),
    confirmedValue = leads
      .filter(
        (lead) =>
          lead.status === "Confirmed" &&
          String(lead.updated_at || lead.created_at).slice(0, 7) === month,
      )
      .reduce(
        (sum, lead) => sum + Number(lead.total_closing || lead.budget || 0),
        0,
      );
  const notify = (text: string) => {
    setNotice(text);
    setTimeout(() => setNotice(""), 3500);
  };
  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.leads() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.bookings() }),
    ]);
  };
  const exportLeads = async () => {
    try {
      const response = await api.get("/leads/export/", {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Lenspire-Leads.xlsx";
      link.click();
      URL.revokeObjectURL(url);
      notify("Lead workbook exported");
    } catch {
      notify("Could not export leads");
    }
  };
  const importLeads = async (file?: File) => {
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    try {
      const data = await importLeadsMutation.mutateAsync(body);
      notify(
        `${data.imported} leads imported${data.skipped ? ` · ${data.skipped} skipped` : ""}`,
      );
    } catch (e: any) {
      notify(e.response?.data?.detail || "Could not import leads");
    } finally {
      if (fileInput.current) fileInput.current.value = "";
    }
  };
  const remove = async (lead: Lead) => {
    if (!confirm(`Delete lead ${lead.name}? This action cannot be undone.`))
      return;
    try {
      await deleteLeadMutation.mutateAsync({ id: lead.id });
      setDetail(null);
      notify("Lead deleted successfully");
    } catch (e: any) {
      notify(
        e.response?.data?.[0] ||
          e.response?.data?.detail ||
          "Could not delete lead",
      );
    }
  };
  const card = (
    label: string,
    count: number,
    kind: string,
    sub: string,
    click: () => void,
  ) => (
    <button className={`reminderCard ${kind}`} onClick={click}>
      <i>
        {kind === "overdue"
          ? "⏰"
          : kind === "today"
            ? "📅"
            : kind === "upcoming"
              ? "🚀"
              : kind === "confirmed"
                ? "✓"
                : kind === "lost"
                  ? "×"
                  : "♙"}
      </i>
      <span>{label}</span>
      <b>{count}</b>
      <small>{sub}</small>
    </button>
  );
  if (view === "Dashboard")
    return (
      <div className="salesPage">
        <div className="salesTop">
          <div>
            <small>SALES &amp; MARKETING</small>
            <h1>Sales Dashboard</h1>
            <p>Your studio at a glance</p>
            {!canEdit && (
              <p>
                {user
                  ? "Your account has no Sales edit access. Ask an administrator to enable it."
                  : "Loading your Sales permissions…"}
              </p>
            )}
          </div>
          {canEdit && (
            <div className="salesActions">
              <button
                className="secondary"
                onClick={() => setImportOpen(true)}
                aria-label="Open the lead import wizard"
              >
                ⇪ Import leads
              </button>
              <button className="secondary" onClick={() => setTargetOpen(true)}>
                ◎ Set Target
              </button>
            </div>
          )}
        </div>
        <nav className="operationsTabs" aria-label="Sales views">
          <button className="active" onClick={() => setView("Dashboard")}>
            Sales Dashboard
          </button>
          <button onClick={() => setView("Lead Management")}>
            Lead Management
          </button>
        </nav>
        <div className="salesKpis">
          {[
            ["Total Leads", leads.length, "Live pipeline", "blue", "All"],
            [
              "Confirmed",
              leads.filter((l) => l.status === "Confirmed").length,
              `${bookingsCount} connected bookings`,
              "green",
              "Confirmed",
            ],
            [
              "Follow-ups Due",
              leads.filter((l) => l.status === "Follow-up").length,
              "Needs attention",
              "amber",
              "Follow-up",
            ],
            [
              "Lost",
              leads.filter((l) => l.status === "Lost").length,
              "Lost opportunities",
              "red",
              "Lost",
            ],
            [
              "Total Sales",
              money(
                leads
                  .filter((l) => l.status === "Confirmed")
                  .reduce(
                    (s, l) => s + Number(l.total_closing || l.budget || 0),
                    0,
                  ),
              ),
              "Total closing",
              "purple",
              "Confirmed",
            ],
          ].map(([label, value, sub, kind, filter]) => (
            <button
              key={String(label)}
              className={`salesKpi ${kind}`}
              onClick={() => {
                setStatus(String(filter));
                setView("Lead Management");
              }}
            >
              <span>{label}</span>
              <b>{value}</b>
              <small>{sub}</small>
            </button>
          ))}
        </div>
        <div className="salesDashboardGrid">
          <section className="salesPanel leadListPanel">
            <div className="panelTitle">
              <div>
                <h3>Recent Leads</h3>
                <p>Latest sales opportunities</p>
              </div>
              <button
                className="iconOnlyAction viewAction"
                title="View all leads"
                aria-label="View all leads"
                onClick={() => setView("Lead Management")}
              >
                ◉
              </button>
            </div>
            <LeadTable leads={leads.slice(0, 12)} onOpen={setDetail} />
          </section>
          <section className="salesPanel pipelinePanel">
            <div className="panelTitle">
              <div>
                <h3>Lead Pipeline</h3>
                <p>{leads.length} active opportunities</p>
              </div>
            </div>
            <div className="pipelineTotal">
              <b>{leads.length}</b>
              <span>Total</span>
            </div>
            {["New", "Follow-up", "Confirmed", "Lost"].map((x) => (
              <div className="pipelineRow" key={x}>
                <span>{x}</span>
                <i>
                  <em
                    style={{
                      width: `${leads.length ? (leads.filter((l) => l.status === x).length / leads.length) * 100 : 0}%`,
                    }}
                  />
                </i>
                <b>{leads.filter((l) => l.status === x).length}</b>
              </div>
            ))}
          </section>
          <section className="salesPanel followPanel">
            <div className="panelTitle">
              <div>
                <h3>Follow-up Center</h3>
                <p>Upcoming sales actions</p>
              </div>
            </div>
            {[...buckets.overdue, ...buckets.today, ...buckets.upcoming]
              .slice(0, 8)
              .map((l) => (
                <button
                  className="followRow"
                  key={l.id}
                  onClick={() => setDetail(l)}
                >
                  <span className="miniAvatar">
                    {l.name
                      .split(/\s+/)
                      .map((x) => x[0])
                      .slice(0, 2)
                      .join("")}
                  </span>
                  <div>
                    <b>{l.name}</b>
                    <small>{l.mobile || l.event_type}</small>
                  </div>
                  <time>{dateTime(l.next_followup_at)}</time>
                </button>
              ))}
            {!buckets.overdue.length &&
              !buckets.today.length &&
              !buckets.upcoming.length && (
                <div className="salesEmpty">No follow-ups scheduled.</div>
              )}
          </section>
          <ReportPanel
            title="Sales Forecast"
            subtitle="Open opportunity value"
            rows={[
              ["Active pipeline", activeValue],
              [
                "High priority",
                leads
                  .filter(
                    (lead) =>
                      lead.priority === "High" &&
                      ["New", "Follow-up"].includes(lead.status),
                  )
                  .reduce((sum, lead) => sum + Number(lead.budget || 0), 0),
              ],
            ]}
            moneyValues
          />
          <ReportPanel
            title="Lead Sources"
            subtitle="Where inquiries come from"
            rows={sourceRows}
          />
          <ReportPanel
            title="Lost Reasons"
            subtitle="Why opportunities were lost"
            rows={lostRows}
          />
          <ReportPanel
            title="Team Efforts"
            subtitle="Leads assigned by executive"
            rows={teamRows}
          />
          <ReportPanel
            title="Monthly Target"
            subtitle={
              targetTotal
                ? `${Math.min(100, Math.round((confirmedValue / targetTotal) * 100))}% achieved`
                : "No target set"
            }
            rows={[
              ["Target", targetTotal],
              ["Confirmed", confirmedValue],
            ]}
            moneyValues
          />
        </div>
        {targetOpen && (
          <TargetModal
            month={month}
            onClose={() => setTargetOpen(false)}
            onSaved={async () => {
              setTargetOpen(false);
              const { data } = await api.get("/sales-targets/");
              setTargets(data.results || data);
              notify("Sales target saved");
            }}
          />
        )}
        {editing !== undefined && (
          <LeadModal
            lead={editing}
            onClose={() => setEditing(undefined)}
            onSaved={async () => {
              setEditing(undefined);
              await refresh();
              notify(
                editing
                  ? "Lead updated successfully"
                  : "Lead added successfully",
              );
            }}
          />
        )}
        {detail && (
          <LeadDetail
            lead={detail}
            canEdit={canEdit}
            onClose={() => setDetail(null)}
            onEdit={() => {
              setEditing(detail);
              setDetail(null);
            }}
            onDelete={() => remove(detail)}
            onRefresh={async () => {
              await refresh();
              setDetail(null);
            }}
          />
        )}
        {notice && <div className="toast">{notice}</div>}
      </div>
    );
  return (
    <div className="salesPage">
      <div className="salesTop">
        <div>
          <small>SALES PIPELINE</small>
          <h1>Lead Management</h1>
          <p>Track every inquiry from first call to booking</p>
        </div>
      </div>
      <nav className="operationsTabs" aria-label="Sales views">
        <button onClick={() => setView("Dashboard")}>Sales Dashboard</button>
        <button className="active" onClick={() => setView("Lead Management")}>
          Lead Management
        </button>
      </nav>
      <div className="reminderGrid">
        {card(
          "Overdue",
          buckets.overdue.length,
          "overdue",
          "Needs immediate action",
          () => {
            setReminder("Overdue");
            setStatus("All");
          },
        )}
        {card("Today", buckets.today.length, "today", "Scheduled today", () => {
          setReminder("Today");
          setStatus("All");
        })}
        {card(
          "Upcoming",
          buckets.upcoming.length,
          "upcoming",
          "Future follow-ups",
          () => {
            setReminder("Upcoming");
            setStatus("All");
          },
        )}
        {card(
          "Follow-up",
          leads.filter((l) => l.status === "Follow-up").length,
          "followup",
          "Active follow-ups",
          () => {
            setStatus("Follow-up");
            setReminder("All");
          },
        )}
        {card(
          "Confirmed",
          leads.filter((l) => l.status === "Confirmed").length,
          "confirmed",
          "Won deals",
          () => {
            setStatus("Confirmed");
            setReminder("All");
          },
        )}
        {card(
          "Lost",
          leads.filter((l) => l.status === "Lost").length,
          "lost",
          "Lost opportunities",
          () => {
            setStatus("Lost");
            setReminder("All");
          },
        )}
        {card(
          "Total Leads",
          leads.length,
          "total",
          "Full sales pipeline",
          () => {
            setStatus("All");
            setReminder("All");
          },
        )}
        <button
          type="button"
          className="reminderCard newLead"
          aria-label="New Lead (+)"
          title="Open the new lead form"
          onClick={() => {
            setNotice("");
            setEditing(null);
          }}
        >
          <i aria-hidden="true">＋</i>
          <span>New Lead</span>
          <b className="newLeadPlus" aria-hidden="true">
            +
          </b>
          <small>Open lead form</small>
        </button>
      </div>
      <section className="salesPanel">
        <div className="leadToolbar">
          <div className="salesSearch">
            ⌕
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Find in this module…"
            />
            <button onClick={() => setQuery("")}>×</button>
          </div>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>All</option>
            {["New", "Follow-up", "Confirmed", "Lost"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option>All</option>
            {[
              "Instagram",
              "Google",
              "Referral",
              "WhatsApp",
              "Website",
              "Others",
              "Excel Import",
            ].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <span>{filtered.length} records</span>
        </div>
        <LeadTable
          leads={filtered}
          onOpen={setDetail}
          onEdit={(lead) => setEditing(lead)}
          onDelete={remove}
          showActions
        />
      </section>
      {editing !== undefined && (
        <LeadModal
          lead={editing}
          onClose={() => setEditing(undefined)}
          onSaved={async () => {
            setEditing(undefined);
            await refresh();
            notify(
              editing ? "Lead updated successfully" : "Lead added successfully",
            );
          }}
        />
      )}
      {detail && (
        <LeadDetail
          lead={detail}
          canEdit={canEdit}
          onClose={() => setDetail(null)}
          onEdit={() => {
            setEditing(detail);
            setDetail(null);
          }}
          onDelete={() => remove(detail)}
          onRefresh={async () => {
            await refresh();
            setDetail(null);
          }}
        />
      )}
      {importOpen && (
        <LeadImportWizard
          open={importOpen}
          onClose={() => setImportOpen(false)}
          onCompleted={async () => {
            await refresh();
            notify("Leads imported successfully");
          }}
        />
      )}
      {notice && <div className="toast">{notice}</div>}
    </div>
  );
}

function ReportPanel({
  title,
  subtitle,
  rows,
  moneyValues = false,
}: {
  title: string;
  subtitle: string;
  rows: [string, number][];
  moneyValues?: boolean;
}) {
  const maximum = Math.max(1, ...rows.map(([, value]) => Number(value) || 0));
  return (
    <section className="salesPanel reportPanel">
      <div className="panelTitle">
        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="reportRows">
        {rows.length ? (
          rows.slice(0, 7).map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <i>
                <em
                  style={{
                    width: `${Math.round(((Number(value) || 0) / maximum) * 100)}%`,
                  }}
                />
              </i>
              <b>{moneyValues ? money(value) : value}</b>
            </div>
          ))
        ) : (
          <div className="salesEmpty">No data yet.</div>
        )}
      </div>
    </section>
  );
}

function TargetModal({
  month,
  onClose,
  onSaved,
}: {
  month: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const saveTargetMutation = useApiMutation<any, unknown, Error>({
    mutationFn: async (payload) =>
      (await api.post("/sales-targets/", payload)).data,
  });
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await saveTargetMutation.mutateAsync({
        salesperson: data.salesperson,
        target_month: data.target_month,
        target_amount: data.target_amount,
        target_bookings: data.target_bookings,
      });
      onSaved();
    } catch (problem: any) {
      setError(problem.response?.data?.detail || "Could not save target");
      setSaving(false);
    }
  };
  return (
    <div className="modalBackdrop">
      <form className="targetModal" onSubmit={submit}>
        <div className="modalHeader">
          <div>
            <small>SALES PERFORMANCE</small>
            <h2>Set Monthly Target</h2>
            <p>Track closing value and booking goals by executive.</p>
          </div>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="leadFormGrid">
          <label className="wide">
            Sales Executive
            <input name="salesperson" required placeholder="Team member name" />
          </label>
          <label>
            Target Month
            <input
              name="target_month"
              type="month"
              required
              defaultValue={month}
            />
          </label>
          <label>
            Target Amount
            <input name="target_amount" type="number" min="0" required />
          </label>
          <label>
            Target Bookings
            <input name="target_bookings" type="number" min="0" required />
          </label>
        </div>
        {error && <div className="formError">{error}</div>}
        <div className="modalFooter">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" disabled={saving}>
            {saving ? "Saving…" : "Save Target"}
          </button>
        </div>
      </form>
    </div>
  );
}

function LeadTable({
  leads,
  onOpen,
  onEdit,
  onDelete,
  showActions = false,
}: {
  leads: Lead[];
  onOpen: (lead: Lead) => void;
  onEdit?: (lead: Lead) => void;
  onDelete?: (lead: Lead) => void;
  showActions?: boolean;
}) {
  return (
    <div className="leadTableWrap">
      <table className="leadTable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client Name</th>
            <th>Sales Person</th>
            <th>Couple Name</th>
            <th>Mobile Number</th>
            <th>Event</th>
            <th>Event Date</th>
            <th>Source</th>
            <th>Status</th>
            <th>Total Closing</th>
            {showActions && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {leads.map((l) => (
            <tr key={l.id} onClick={() => onOpen(l)}>
              <td>{date(l.created_at)}</td>
              <td>
                <b>{l.client_name || l.name}</b>
              </td>
              <td>{l.assigned_to || "Unassigned"}</td>
              <td>{l.couple_name || l.name || "—"}</td>
              <td>{l.client_mobile || l.mobile || "—"}</td>
              <td>{l.event_type}</td>
              <td>{date(l.event_date)}</td>
              <td>{l.source || "Other"}</td>
              <td>
                <span
                  className={`leadStatus ${l.status.toLowerCase().replaceAll(" ", "-")}`}
                >
                  {l.status}
                </span>
              </td>
              <td>{money(l.total_closing || l.budget)}</td>
              {showActions && (
                <td>
                  <div className="leadRowActions">
                    {l.mobile && (
                      <a
                        href={`https://wa.me/${l.mobile.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        title="Open WhatsApp"
                        onClick={(event) => event.stopPropagation()}
                      >
                        ✉
                      </a>
                    )}
                    <button
                      title="View lead"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpen(l);
                      }}
                    >
                      ◉
                    </button>
                    <button
                      title="Edit lead"
                      onClick={(event) => {
                        event.stopPropagation();
                        onEdit?.(l);
                      }}
                    >
                      ✎
                    </button>
                    <button
                      className="delete"
                      title="Delete lead"
                      onClick={(event) => {
                        event.stopPropagation();
                        onDelete?.(l);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {!leads.length && (
        <div className="salesEmpty">No leads match these filters.</div>
      )}
    </div>
  );
}

function LeadModal({
  lead,
  onClose,
  onSaved,
}: {
  lead: Lead | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<any>(
      lead
        ? {
            ...lead,
            event_date: lead.event_date || "",
            next_followup_at: lead.next_followup_at?.slice(0, 16) || "",
            payment_received_date: lead.payment_received_date || "",
            wedding_dates: lead.wedding_dates || [],
          }
        : emptyLead,
    ),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false);
  const saveLeadMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) =>
      (await (url ? api.put(url, payload) : api.post("/leads/", payload))).data,
  });
  const booked = ["Booked", "Confirmed"].includes(form.status);
  const set = (key: string, value: any) =>
    setForm((x: any) => ({ ...x, [key]: value }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...form,
      budget: form.budget || null,
      total_closing: form.total_closing || null,
      advance_received: form.advance_received || null,
      event_date: form.event_date || null,
      next_followup_at: form.next_followup_at || null,
      payment_received_date: form.payment_received_date || null,
    };
    try {
      await saveLeadMutation.mutateAsync({
        url: lead ? `/leads/${lead.id}/` : "",
        payload,
      });
      onSaved();
    } catch (e: any) {
      const data = e.response?.data;
      setError(
        typeof data === "string"
          ? data
          : Object.entries(data || {})
              .map(
                ([k, v]) =>
                  `${k.replaceAll("_", " ")}: ${Array.isArray(v) ? v.join(" ") : v}`,
              )
              .join(" · ") || "Could not save lead",
      );
      setSaving(false);
    }
  };
  return (
    <div className="modalBackdrop">
      <form className="leadModal" onSubmit={submit}>
        <div className="modalHeader">
          <div>
            <small>{lead ? "UPDATE OPPORTUNITY" : "NEW OPPORTUNITY"}</small>
            <h2>{lead ? "Edit Lead" : "Add Lead"}</h2>
            <p>
              {lead
                ? "Update the lead details and save your changes."
                : "Capture the inquiry and schedule the next action."}
            </p>
          </div>
          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="leadFormGrid">
          <label className="wide">
            Customer / Couple Name
            <input
              required
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="e.g. Rahul & Priya"
            />
          </label>
          <label>
            Event Type
            <select
              value={form.event_type}
              onChange={(e) => set("event_type", e.target.value)}
            >
              {[
                "Wedding",
                "Night Wedding",
                "Pre-Wedding",
                "Birthday",
                "Maternity",
                "Corporate",
                "Product Shoot",
                "Others",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Event Date
            <input
              type="date"
              required
              value={form.event_date}
              onChange={(e) => set("event_date", e.target.value)}
            />
          </label>
          <label>
            Mobile Number
            <input
              required
              value={form.mobile}
              onChange={(e) => set("mobile", e.target.value)}
              placeholder="+91 98765 43210"
            />
          </label>
          <label>
            City
            <input
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder="Pune"
            />
          </label>
          <label>
            Lead Source
            <select
              value={form.source}
              onChange={(e) => set("source", e.target.value)}
            >
              {[
                "Instagram",
                "Google",
                "Referral",
                "WhatsApp",
                "Website",
                "Others",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Status
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {["New", "Follow-up", "Confirmed", "Lost"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Budget
            <input
              type="number"
              min="0"
              value={form.budget || ""}
              onChange={(e) => set("budget", e.target.value)}
              placeholder="300000"
            />
          </label>
          <label>
            Priority
            <select
              value={form.priority}
              onChange={(e) => set("priority", e.target.value)}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </label>
          <label>
            Sales Person
            <input
              value={form.assigned_to}
              onChange={(e) => set("assigned_to", e.target.value)}
              placeholder="Sales person name"
            />
          </label>
          <label>
            Next Follow-up
            <input
              type="datetime-local"
              value={form.next_followup_at || ""}
              onChange={(e) => set("next_followup_at", e.target.value)}
            />
          </label>
          <label>
            Referred By
            <input
              value={form.referred_by}
              onChange={(e) => set("referred_by", e.target.value)}
            />
          </label>
          <label>
            Referral Code
            <input
              value={form.referral_code}
              onChange={(e) => set("referral_code", e.target.value)}
            />
          </label>
          {form.status === "Lost" && (
            <label>
              Lost Reason
              <select
                required
                value={form.lost_reason}
                onChange={(e) => set("lost_reason", e.target.value)}
              >
                <option value="">Select reason</option>
                {[
                  "Price",
                  "Unavailable Date",
                  "No Response",
                  "Competitor",
                  "Postponed",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          )}
          <label className="wide">
            Notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Requirements, follow-up details or other notes"
            />
          </label>
          <fieldset
            className={`bookingBox wide ${booked ? "" : "locked"}`}
            disabled={!booked}
          >
            <legend>
              Booking &amp; Payment Details{" "}
              <span>
                {booked
                  ? "Required for confirmed lead"
                  : "Unlocks when status is Confirmed"}
              </span>
            </legend>
            <div className="leadFormGrid">
              <label className="wide">
                Couple Name
                <input
                  required={booked}
                  value={form.couple_name}
                  onChange={(e) => set("couple_name", e.target.value)}
                />
              </label>
              <label>
                Total Closing
                <input
                  required={booked}
                  type="number"
                  min="0"
                  value={form.total_closing || ""}
                  onChange={(e) => set("total_closing", e.target.value)}
                />
              </label>
              <label>
                Mode of Payment
                <select
                  required={booked}
                  value={form.payment_mode}
                  onChange={(e) => set("payment_mode", e.target.value)}
                >
                  <option value="">Select payment mode</option>
                  <option>Gpay</option>
                  <option>UPI/Gpay</option>
                  <option>Cash</option>
                  <option>Bank Transfer</option>
                  <option>Cheque</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Advance Received
                <input
                  required={booked}
                  type="number"
                  min="0"
                  value={form.advance_received || ""}
                  onChange={(e) => set("advance_received", e.target.value)}
                />
              </label>
              <label>
                Received By
                <input
                  required={booked}
                  value={form.received_by}
                  onChange={(e) => set("received_by", e.target.value)}
                />
              </label>
              <label>
                Payment Received Date
                <input
                  required={booked}
                  type="date"
                  value={form.payment_received_date || ""}
                  onChange={(e) => set("payment_received_date", e.target.value)}
                />
              </label>
            </div>
          </fieldset>
        </div>
        {error && <div className="formError">{error}</div>}
        <div className="modalFooter">
          <button type="button" className="secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="primary" disabled={saving}>
            {saving ? "Saving…" : lead ? "Update Lead" : "Save Lead"}
          </button>
        </div>
      </form>
    </div>
  );
}

function LeadDetail({
  lead,
  canEdit,
  onClose,
  onEdit,
  onDelete,
  onRefresh,
}: {
  lead: Lead;
  canEdit: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onRefresh: () => void;
}) {
  const [type, setType] = useState("Call"),
    [description, setDescription] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const attachMutation = useApiMutation<FormData, any, Error>({
    mutationFn: async (payload) =>
      (await api.post("/attachments/", payload)).data,
  });
  const logActivityMutation = useApiMutation<
    { type: string; description: string },
    any,
    Error
  >({
    mutationFn: async ({ type, description }) =>
      (
        await api.post(`/leads/${lead.id}/activities/`, {
          activity_type: type,
          description,
        })
      ).data,
  });
  const uploadAttachment = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    setError("");
    const data = new FormData();
    data.append("lead", String(lead.id));
    data.append("name", file.name);
    data.append("file", file);
    try {
      await attachMutation.mutateAsync(data);
      onRefresh();
    } catch (problem: any) {
      setError(problem.response?.data?.detail || "Could not upload quotation");
      setUploading(false);
    }
  };
  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    setBusy(true);
    try {
      await api.post(`/leads/${lead.id}/activities/`, {
        activity_type: type,
        description,
      });
      onRefresh();
    } catch (e: any) {
      setError(e.response?.data?.detail || "Could not add activity");
      setBusy(false);
    }
  };
  return (
    <div className="modalBackdrop">
      <div className="leadDetailModal">
        <div className="modalHeader">
          <div>
            <small>
              {lead.lead_code} · {lead.priority} PRIORITY
            </small>
            <h2>{lead.name}</h2>
            <p>
              {lead.event_type} · {date(lead.event_date)} · {lead.city}
            </p>
          </div>
          <button onClick={onClose}>×</button>
        </div>
        <div className="detailSummary">
          <div>
            <span>Status</span>
            <b>{lead.status}</b>
          </div>
          <div>
            <span>Mobile</span>
            <b>{lead.mobile || "—"}</b>
          </div>
          <div>
            <span>Source</span>
            <b>{lead.source}</b>
          </div>
          <div>
            <span>Budget</span>
            <b>{money(lead.total_closing || lead.budget)}</b>
          </div>
          <div>
            <span>Assigned</span>
            <b>{lead.assigned_to || "Unassigned"}</b>
          </div>
          <div>
            <span>Next follow-up</span>
            <b>{dateTime(lead.next_followup_at)}</b>
          </div>
        </div>
        {lead.notes && <div className="detailNotes">{lead.notes}</div>}
        <section className="attachmentSection">
          <div>
            <small>CLIENT QUOTATIONS</small>
            <h3>Attachments</h3>
          </div>
          {canEdit && (
            <label className="attachmentUpload">
              {uploading ? "Uploading…" : "⇧ Upload Quotation"}
              <input
                hidden
                disabled={uploading}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={(event) => uploadAttachment(event.target.files?.[0])}
              />
            </label>
          )}
          <div className="attachmentList">
            {(lead.attachments || []).map((attachment) => (
              <a
                key={attachment.id}
                href={attachment.file}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>▤</span>
                <div>
                  <b>{attachment.name}</b>
                  <small>{dateTime(attachment.created_at)}</small>
                </div>
                <i>Open ↗</i>
              </a>
            ))}
            {!lead.attachments?.length && (
              <div className="salesEmpty">No quotation uploaded.</div>
            )}
          </div>
        </section>
        <section className="activitySection">
          <div className="activityTitle">
            <div>
              <small>LEAD HISTORY</small>
              <h3>Activity Timeline</h3>
            </div>
            {canEdit && (
              <form onSubmit={add}>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option>Call</option>
                  <option>WhatsApp</option>
                  <option>Meeting</option>
                  <option>Note</option>
                </select>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add activity details..."
                />
                <button className="primary" disabled={busy}>
                  Add Activity
                </button>
              </form>
            )}
          </div>
          {error && <div className="formError">{error}</div>}
          <div className="activityList">
            {(lead.activities || []).map((a) => (
              <article key={a.id}>
                <i>
                  {a.activity_type === "Call"
                    ? "☎"
                    : a.activity_type === "WhatsApp"
                      ? "◉"
                      : a.activity_type === "Meeting"
                        ? "□"
                        : "✎"}
                </i>
                <div>
                  <b>{a.activity_type}</b>
                  <p>{a.description}</p>
                  <small>
                    {a.performed_by} · {dateTime(a.created_at)}
                  </small>
                </div>
              </article>
            ))}
            {!lead.activities?.length && (
              <div className="salesEmpty">No activity recorded yet.</div>
            )}
          </div>
        </section>
        <div className="modalFooter">
          {canEdit && (
            <button className="dangerButton" onClick={onDelete}>
              Delete Lead
            </button>
          )}
          <span />
          <button className="secondary" onClick={onClose}>
            Close
          </button>
          {lead.mobile && (
            <a
              className="secondary whatsappButton"
              href={`https://wa.me/${lead.mobile.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${lead.name}, following up regarding your ${lead.event_type} inquiry with LenspireCRM.`)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </a>
          )}
          {canEdit && (
            <button className="primary" onClick={onEdit}>
              Edit Lead
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

