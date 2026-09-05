"use client";
import { useMemo, useState } from "react";
import { useApiQuery, queryKeys } from "@/lib/query";
import { isAdministrator } from "@/lib/permissions";

type OrgAudit = {
  id: number;
  organization: number | null;
  studio_name: string;
  action: string;
  description: string;
  performed_by: string;
  created_at: string;
};

type UserAudit = {
  id: number;
  target_user: number | null;
  target_username: string;
  target_name: string;
  action: string;
  description: string;
  performed_by: string;
  created_at: string;
};

type Source = "organization" | "user";

type CombinedEntry = {
  key: string;
  source: Source;
  id: number;
  actor: string;
  subject: string;
  action: string;
  description: string;
  timestamp: string;
};

const dateTime = (value: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const actionTone = (action: string) => {
  const value = action.toLowerCase();
  if (value.includes("delete") || value.includes("deactivate") || value.includes("reset"))
    return "auditPill auditPillDanger";
  if (value.includes("create") || value.includes("activate") || value.includes("enable"))
    return "auditPill auditPillSuccess";
  if (value.includes("update") || value.includes("edit") || value.includes("change") || value.includes("password"))
    return "auditPill auditPillInfo";
  return "auditPill auditPillMuted";
};

export default function AuditWorkspace({ currentUser }: { currentUser: any }) {
  const [source, setSource] = useState<"all" | Source>("all");
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const isAdmin = isAdministrator(currentUser);

  const orgQuery = useApiQuery<OrgAudit[]>(
    queryKeys.auditOrganization(),
    "/organizations/audit-history/",
  );
  const userQuery = useApiQuery<UserAudit[]>(
    queryKeys.auditUser(),
    "/users/audit-history/",
  );

  const combined: CombinedEntry[] = useMemo(() => {
    const org = (orgQuery.data ?? []).map<CombinedEntry>((row) => ({
      key: `org-${row.id}`,
      source: "organization",
      id: row.id,
      actor: row.performed_by,
      subject: row.studio_name,
      action: row.action,
      description: row.description,
      timestamp: row.created_at,
    }));
    const user = (userQuery.data ?? []).map<CombinedEntry>((row) => ({
      key: `user-${row.id}`,
      source: "user",
      id: row.id,
      actor: row.performed_by,
      subject: `${row.target_name || row.target_username || "—"}${row.target_username ? ` (@${row.target_username})` : ""}`,
      action: row.action,
      description: row.description,
      timestamp: row.created_at,
    }));
    return [...org, ...user].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  }, [orgQuery.data, userQuery.data]);

  const actors = useMemo(() => {
    return Array.from(new Set(combined.map((row) => row.actor).filter(Boolean))).sort();
  }, [combined]);
  const actions = useMemo(() => {
    return Array.from(new Set(combined.map((row) => row.action).filter(Boolean))).sort();
  }, [combined]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return combined.filter((row) => {
      if (source !== "all" && row.source !== source) return false;
      if (actor && row.actor !== actor) return false;
      if (action && row.action !== action) return false;
      if (from) {
        const start = new Date(`${from}T00:00:00`).getTime();
        if (new Date(row.timestamp).getTime() < start) return false;
      }
      if (to) {
        const end = new Date(`${to}T23:59:59`).getTime();
        if (new Date(row.timestamp).getTime() > end) return false;
      }
      if (needle) {
        const haystack = `${row.actor} ${row.subject} ${row.action} ${row.description}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    });
  }, [combined, source, actor, action, search, from, to]);

  const summary = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    const weekMs = todayMs - 6 * 86400000;
    let todayCount = 0;
    let weekCount = 0;
    const actorCounts = new Map<string, number>();
    for (const row of combined) {
      const ts = new Date(row.timestamp).getTime();
      if (ts >= todayMs) todayCount += 1;
      if (ts >= weekMs) weekCount += 1;
      actorCounts.set(row.actor, (actorCounts.get(row.actor) ?? 0) + 1);
    }
    const topActor = Array.from(actorCounts.entries()).sort((a, b) => b[1] - a[1])[0];
    return { todayCount, weekCount, topActor };
  }, [combined]);

  const isLoading = orgQuery.isLoading || userQuery.isLoading;
  const isError = orgQuery.isError || userQuery.isError;
  const exportCsv = () => {
    const header = ["timestamp", "source", "actor", "subject", "action", "description"];
    const escape = (value: string) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const lines = [header.join(",")];
    for (const row of filtered) {
      lines.push(
        [row.timestamp, row.source, row.actor, row.subject, row.action, row.description]
          .map(escape)
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lenspire-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <section className="workspace auditWorkspace" aria-label="Audit log">
      <header className="workspaceHead">
        <div>
          <h1>Audit Log</h1>
          <p className="workspaceSub">
            {isAdmin
              ? "Every change made by your team — who, what, and when."
              : "Changes your team has made — read-only history."}
          </p>
        </div>
        <div className="workspaceHeadActions">
          <button
            type="button"
            className="btnSecondary"
            onClick={exportCsv}
            disabled={!filtered.length}
            title="Download the filtered list as a CSV"
          >
            Export CSV
          </button>
        </div>
      </header>

      <div className="auditSummary">
        <div className="auditSummaryCard">
          <span>Today</span>
          <strong>{summary.todayCount}</strong>
          <small>events</small>
        </div>
        <div className="auditSummaryCard">
          <span>Last 7 days</span>
          <strong>{summary.weekCount}</strong>
          <small>events</small>
        </div>
        <div className="auditSummaryCard">
          <span>Most active actor</span>
          <strong>{summary.topActor ? summary.topActor[0] : "—"}</strong>
          <small>{summary.topActor ? `${summary.topActor[1]} actions` : "no data yet"}</small>
        </div>
        <div className="auditSummaryCard">
          <span>Filters applied</span>
          <strong>{filtered.length}</strong>
          <small>of {combined.length} entries</small>
        </div>
      </div>

      <div className="auditFilters" role="group" aria-label="Audit log filters">
        <label>
          <span>Source</span>
          <select value={source} onChange={(event) => setSource(event.target.value as "all" | Source)}>
            <option value="all">All sources</option>
            <option value="organization">Organization</option>
            <option value="user">User accounts</option>
          </select>
        </label>
        <label>
          <span>Actor</span>
          <select value={actor} onChange={(event) => setActor(event.target.value)}>
            <option value="">Anyone</option>
            {actors.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>Action</span>
          <select value={action} onChange={(event) => setAction(event.target.value)}>
            <option value="">All actions</option>
            {actions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span>From</span>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label>
          <span>To</span>
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
        <label className="auditFilterSearch">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search actor, subject, description…"
          />
        </label>
        <button
          type="button"
          className="btnSecondary"
          onClick={() => {
            setSource("all");
            setActor("");
            setAction("");
            setSearch("");
            setFrom("");
            setTo("");
          }}
        >
          Clear
        </button>
      </div>

      {isError ? (
        <div className="auditEmpty">
          <strong>Could not load audit history.</strong>
          <small>Check your connection or sign in again.</small>
        </div>
      ) : isLoading ? (
        <div className="auditEmpty">Loading audit history…</div>
      ) : filtered.length === 0 ? (
        <div className="auditEmpty">
          <strong>No matching activity.</strong>
          <small>
            {combined.length === 0
              ? "Once your team makes changes (creating users, updating the studio, etc.) they will show up here."
              : "Adjust the filters to see more entries."}
          </small>
        </div>
      ) : (
        <div className="auditTableWrap">
          <table className="auditTable">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">Source</th>
                <th scope="col">Actor</th>
                <th scope="col">Subject</th>
                <th scope="col">Action</th>
                <th scope="col">Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.key}>
                  <td>
                    <time dateTime={row.timestamp}>{dateTime(row.timestamp)}</time>
                  </td>
                  <td className="auditSource">
                    {row.source === "organization" ? "Studio" : "User"}
                  </td>
                  <td>{row.actor || "—"}</td>
                  <td>{row.subject}</td>
                  <td>
                    <span className={actionTone(row.action)}>{row.action}</span>
                  </td>
                  <td className="auditDescription">{row.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
