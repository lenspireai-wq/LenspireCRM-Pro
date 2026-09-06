"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type Organization = Record<string, any>;
type StudioActivity = Record<string, any>;
type StudioStatus = "active" | "paused" | "expired" | "expiring";

const rows = (value: any): Organization[] =>
  Array.isArray(value) ? value : value?.results || [];
const dateLabel = (value?: string) =>
  value
    ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString(
        "en-IN",
        { day: "2-digit", month: "short", year: "numeric" },
      )
    : "No expiry";
const dateTimeLabel = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
const localDateValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const expiryFromToday = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return localDateValue(date);
};
const studioStatus = (organization: Organization): StudioStatus => {
  if (!organization.active) return "paused";
  const expiry = String(organization.subscription_expires_at || "").slice(0, 10);
  if (!expiry) return "active";
  const today = localDateValue(new Date());
  if (expiry < today) return "expired";
  const remainingDays = Math.ceil(
    (Date.parse(`${expiry}T00:00:00`) - Date.parse(`${today}T00:00:00`)) /
      86400000,
  );
  return remainingDays <= 30 ? "expiring" : "active";
};
const statusLabel: Record<StudioStatus, string> = {
  active: "Active",
  paused: "Paused",
  expired: "Expired",
  expiring: "Expiring Soon",
};

export default function OwnerPortal({ logout }: { logout: () => void }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activities, setActivities] = useState<StudioActivity[]>([]);
  const [editing, setEditing] = useState<Organization | null>(null);
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [expiryChoice, setExpiryChoice] = useState("12-months");
  const [expiryDate, setExpiryDate] = useState(() => expiryFromToday(12));
  const [statusFilter, setStatusFilter] = useState<StudioStatus | "all">("all");
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [studioResponse, activityResponse] = await Promise.all([
        api.get("/organizations/"),
        api.get("/organizations/audit-history/"),
      ]);
      setOrganizations(rows(studioResponse.data));
      setActivities(rows(activityResponse.data));
    } catch (problem: any) {
      setError(
        problem.response?.data?.detail || "Could not load studio workspaces.",
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const statusCounts = useMemo(
    () =>
      organizations.reduce(
        (counts, organization) => {
          counts[studioStatus(organization)] += 1;
          return counts;
        },
        { active: 0, paused: 0, expired: 0, expiring: 0 } as Record<StudioStatus, number>),
    [organizations],
  );
  const visibleOrganizations = useMemo(
    () =>
      statusFilter === "all"
        ? organizations
        : organizations.filter(
            (organization) => studioStatus(organization) === statusFilter,
          ),
    [organizations, statusFilter],
  );
  const users = useMemo(
    () =>
      organizations.reduce(
        (total, organization) => total + Number(organization.user_count || 0),
        0,
      ),
    [organizations],
  );
  const submitStudio = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget));
    if (
      editing &&
      String(payload.subscription_expires_at) !==
        String(editing.subscription_expires_at || "") &&
      !window.confirm(
        `Change ${editing.name}'s subscription expiry to ${dateLabel(String(payload.subscription_expires_at))}?`,
      )
    )
      return;
    setSaving(true);
    setError("");
    try {
      if (editing) await api.patch(`/organizations/${editing.id}/`, payload);
      else await api.post("/organizations/", payload);
      setEditing(null);
      setCreating(false);
      await load();
    } catch (problem: any) {
      const details = problem.response?.data || {};
      setError(
        Object.entries(details)
          .map(
            ([key, value]) =>
              `${key}: ${Array.isArray(value) ? value.join(" ") : value}`,
          )
          .join(" · ") || "Could not save studio.",
      );
    } finally {
      setSaving(false);
    }
  };
  const toggleStudio = async (organization: Organization) => {
    const nextAction = organization.active ? "pause" : "resume";
    if (
      !window.confirm(
        `${nextAction === "pause" ? "Pause" : "Resume"} ${organization.name}?${nextAction === "pause" ? " All studio users will lose access immediately." : " Studio users will regain access if the subscription is valid."}`,
      )
    )
      return;
    setError("");
    try {
      await api.patch(`/organizations/${organization.id}/`, {
        active: !organization.active,
      });
      await load();
    } catch (problem: any) {
      setError(
        problem.response?.data?.detail || "Could not update studio status.",
      );
    }
  };
  const openStudioEditor = (organization: Organization, renew = false) => {
    setCreating(false);
    setEditing(organization);
    setExpiryChoice(renew ? "12-months" : "custom");
    setExpiryDate(
      renew
        ? expiryFromToday(12)
        : organization.subscription_expires_at || expiryFromToday(12),
    );
  };
  return (
    <main className="ownerPortal">
      <aside className="ownerSidebar">
        <div className="ownerBrand">
          <i>◇</i>
          <div>
            <b>LenspireAI</b>
            <span>Owner Portal</span>
          </div>
        </div>
        <nav>
          <button className="active">
            ◇ <span>Studio Management</span>
          </button>
        </nav>
        <div className="ownerProfile">
          <b>Platform Owner</b>
          <small>Verified owner access</small>
          <button onClick={logout}>Sign out</button>
        </div>
      </aside>
      <section className="ownerContent">
        <header className="ownerHeader">
          <div>
            <small>LENSPIRECRM OWNER PANEL</small>
            <h1>Studio Management</h1>
            <p>Create and control isolated client studio workspaces.</p>
          </div>
          <button
            className="primary ownerCreateButton"
            onClick={() => {
              setEditing(null);
              setExpiryChoice("12-months");
              setExpiryDate(expiryFromToday(12));
              setCreating(true);
            }}
          >
            ＋ New Studio
          </button>
        </header>
        {error && <div className="ownerError">{error}</div>}
        <section className="ownerMetrics">
          <article className={statusFilter === "all" ? "selected" : ""} onClick={() => setStatusFilter("all")}>
            <span>Registered Studios</span>
            <b>{organizations.length}</b>
          </article>
          <article className={statusFilter === "active" ? "selected active" : "active"} onClick={() => setStatusFilter("active")}>
            <span>Active Studios</span>
            <b>{statusCounts.active}</b>
          </article>
          <article className={statusFilter === "paused" ? "selected paused" : "paused"} onClick={() => setStatusFilter("paused")}>
            <span>Paused Studios</span>
            <b>{statusCounts.paused}</b>
          </article>
          <article className={statusFilter === "expired" ? "selected expired" : "expired"} onClick={() => setStatusFilter("expired")}>
            <span>Expired Studios</span>
            <b>{statusCounts.expired}</b>
          </article>
          <article className={statusFilter === "expiring" ? "selected expiring" : "expiring"} onClick={() => setStatusFilter("expiring")}>
            <span>Expiring in 30 Days</span>
            <b>{statusCounts.expiring}</b>
          </article>
          <article>
            <span>Total Users</span><b>{users}</b>
          </article>
        </section>
        <section className="panel ownerStudiosPanel">
          <div className="panelHead">
            <div>
              <h2>Client Studios</h2>
              <p>
                Plans, licences, access status and branding for every workspace.
              </p>
            </div>
            <div className="ownerStudioFilter">
              <label htmlFor="studio-status-filter">Status</label>
              <select id="studio-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StudioStatus | "all")}>
                <option value="all">All studios</option>
                <option value="active">Active</option>
                <option value="expiring">Expiring Soon</option>
                <option value="expired">Expired</option>
                <option value="paused">Paused</option>
              </select>
              <span>{visibleOrganizations.length} studios</span>
            </div>
          </div>
          <div className="table">
            <table className="ownerStudiosTable">
              <thead>
                <tr>
                  <th>Studio</th>
                  <th>Plan</th>
                  <th>Expiry</th>
                  <th>Licence</th>
                  <th>Status</th>
                  <th>Users</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleOrganizations.map((organization) => (
                  <tr key={organization.id}>
                    <td>
                      <b>{organization.name}</b>
                      <small>/{organization.slug}</small>
                    </td>
                    <td>
                      <span className={`ownerPlan ${organization.plan}`}>
                        {organization.plan}
                      </span>
                    </td>
                    <td>{dateLabel(organization.subscription_expires_at)}</td>
                    <td>{organization.license_code || "—"}</td>
                    <td>
                      <span
                        className={`ownerStatus ${studioStatus(organization)}`}
                      >
                        {statusLabel[studioStatus(organization)]}
                      </span>
                    </td>
                    <td>{organization.user_count}</td>
                    <td>{dateLabel(organization.created_at)}</td>
                    <td>
                      <div className="ownerRowActions">
                        <button
                          className="editAction"
                          title="Edit studio"
                          onClick={() => openStudioEditor(organization)}
                        >
                          ✎
                        </button>
                        {(studioStatus(organization) === "expired" || studioStatus(organization) === "expiring") && (
                          <button className="renewAction" title="Renew for one year" onClick={() => openStudioEditor(organization, true)}>↻</button>
                        )}
                        <button
                          className={
                            organization.active
                              ? "pauseAction"
                              : "activateAction"
                          }
                          title={
                            organization.active
                              ? "Pause studio"
                              : "Activate studio"
                          }
                          onClick={() => void toggleStudio(organization)}
                        >
                          {organization.active ? "Ⅱ" : "▶"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !visibleOrganizations.length && (
              <div className="empty">No studios match this status.</div>
            )}
            {loading && <div className="empty">Loading studio workspaces…</div>}
          </div>
        </section>
        <section className="panel ownerActivityPanel">
          <div className="panelHead">
            <div>
              <h2>Studio Activity History</h2>
              <p>Permanent record of owner-level workspace changes.</p>
            </div>
            <span>{activities.length} activities</span>
          </div>
          <div className="table">
            <table className="ownerActivityTable">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Studio</th>
                  <th>Action</th>
                  <th>Details</th>
                  <th>Performed By</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{dateTimeLabel(activity.created_at)}</td>
                    <td><b>{activity.studio_name}</b></td>
                    <td><span className="ownerActivityAction">{activity.action}</span></td>
                    <td>{activity.description}</td>
                    <td>{activity.performed_by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!loading && !activities.length && <div className="empty">No studio activity recorded yet.</div>}
          </div>
        </section>
      </section>
      {(creating || editing) && (
        <div className="modalBackdrop">
          <form
            className="accountModal ownerStudioModal"
            onSubmit={submitStudio}
          >
            <div className="modalHeader">
              <div>
                <small>
                  {editing ? "STUDIO SETTINGS" : "NEW CLIENT STUDIO"}
                </small>
                <h2>{editing ? editing.name : "Start a New Studio"}</h2>
                <p>
                  {editing
                    ? "Update subscription, licence and customer-facing branding."
                    : "Create a separate workspace and its first administrator."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="ownerStudioForm">
              <label>
                <span>
                  Studio Name <i className="requiredMark">*</i>
                </span>
                <input
                  name="name"
                  required
                  minLength={2}
                  defaultValue={editing?.name || ""}
                />
              </label>
              {editing ? (
                <label>
                  URL Slug
                  <input value={editing.slug || ""} readOnly />
                  <small>Automatically generated and protected.</small>
                </label>
              ) : (
                <label className="ownerAutoSlug">
                  Studio URL
                  <span>Generated automatically from the studio name</span>
                </label>
              )}
              <label>
                <span>
                  Plan <i className="requiredMark">*</i>
                </span>
                <select
                  name="plan"
                  required
                  defaultValue={editing?.plan || "starter"}
                >
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </label>
              <label>
                <span>
                  Expiry Period <i className="requiredMark">*</i>
                </span>
                <select
                  value={expiryChoice}
                  onChange={(event) => {
                    const choice = event.target.value;
                    setExpiryChoice(choice);
                    if (choice === "6-months")
                      setExpiryDate(expiryFromToday(6));
                    if (choice === "12-months")
                      setExpiryDate(expiryFromToday(12));
                  }}
                >
                  <option value="12-months">
                    1 year from today — {dateLabel(expiryFromToday(12))}
                  </option>
                  <option value="6-months">
                    6 months from today — {dateLabel(expiryFromToday(6))}
                  </option>
                  <option value="custom">Custom date</option>
                </select>
              </label>
              <input
                type="hidden"
                name="subscription_expires_at"
                value={expiryDate}
              />
              {expiryChoice === "custom" && (
                <label>
                  <span>
                    Custom Expiry Date <i className="requiredMark">*</i>
                  </span>
                  <input
                    type="date"
                    min={localDateValue(new Date())}
                    required
                    value={expiryDate}
                    onChange={(event) => setExpiryDate(event.target.value)}
                  />
                </label>
              )}
              <label className="wide">
                Licence Code
                <input
                  name="license_code"
                  defaultValue={editing?.license_code || ""}
                  placeholder="Auto-generated or supplied licence"
                />
              </label>
              {!editing && (
                <>
                  <label>
                    <span>
                      First Administrator Name <i className="requiredMark">*</i>
                    </span>
                    <input name="admin_name" required />
                  </label>
                  <label>
                    <span>
                      Administrator Username <i className="requiredMark">*</i>
                    </span>
                    <input name="username" required minLength={3} />
                  </label>
                  <label className="wide">
                    <span>
                      Temporary Password <i className="requiredMark">*</i>
                    </span>
                    <input
                      name="password"
                      type="password"
                      required
                      minLength={10}
                      autoComplete="new-password"
                    />
                  </label>
                </>
              )}
              <label className="wide">
                Logo URL
                <input
                  name="logo_url"
                  type="url"
                  defaultValue={editing?.logo_url || ""}
                />
              </label>
              <label>
                Contact Phone
                <input
                  name="contact_phone"
                  defaultValue={editing?.contact_phone || ""}
                />
              </label>
              <label>
                WhatsApp Number
                <input
                  name="whatsapp_number"
                  defaultValue={editing?.whatsapp_number || ""}
                />
              </label>
              <label className="wide">
                Contact Email
                <input
                  name="contact_email"
                  type="email"
                  defaultValue={editing?.contact_email || ""}
                />
              </label>
              <label className="wide">
                Studio Address
                <textarea
                  name="studio_address"
                  rows={2}
                  defaultValue={editing?.studio_address || ""}
                />
              </label>
              <label className="wide">
                Document Header
                <textarea
                  name="document_header"
                  rows={2}
                  defaultValue={editing?.document_header || ""}
                />
              </label>
              <label className="wide">
                Document Footer
                <textarea
                  name="document_footer"
                  rows={3}
                  defaultValue={editing?.document_footer || ""}
                />
              </label>
            </div>
            <div className="modalFooter">
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setEditing(null);
                }}
              >
                Cancel
              </button>
              <button className="primary" disabled={saving}>
                {saving
                  ? "Saving…"
                  : editing
                    ? "Save Studio"
                    : "Create Separate Studio"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
