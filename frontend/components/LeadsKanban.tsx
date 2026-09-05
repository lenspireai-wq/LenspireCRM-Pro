"use client";
import { useEffect, useMemo, useState } from "react";
import { useApiMutation, useApiQuery, queryKeys } from "@/lib/query";
import { api } from "@/lib/api";

type Lead = {
  id: number;
  lead_code: string;
  name: string;
  mobile?: string;
  event_type?: string;
  event_date?: string | null;
  city?: string;
  status: string;
  priority?: string;
  assigned_to?: string;
  total_closing?: string | number | null;
  next_followup_at?: string | null;
  created_at?: string;
};

const COLUMNS: { key: string; label: string; color: string }[] = [
  { key: "New", label: "New", color: "#0ea5e9" },
  { key: "Follow-up", label: "Follow-up", color: "#f59e0b" },
  { key: "Confirmed", label: "Confirmed", color: "#22c55e" },
  { key: "Booked", label: "Booked", color: "#7367f0" },
  { key: "Lost", label: "Lost", color: "#ef4444" },
];

const formatINR = (value: Lead["total_closing"]) => {
  const number = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  if (!Number.isFinite(number) || number === 0) return null;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(number);
};

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString("en-IN", { month: "short", day: "2-digit" }) : null);

const priorityTone: Record<string, string> = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };

export default function LeadsKanban() {
  const [search, setSearch] = useState("");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [user, setUser] = useState<{ display_name?: string; username?: string; id?: number } | null>(null);

  useEffect(() => {
    api.get("/auth/me/").then(({ data }) => setUser(data)).catch(() => undefined);
  }, []);

  const { data, isLoading, refetch } = useApiQuery<{ results: Lead[]; count: number }>(
    queryKeys.leads({ search }),
    `/leads/?page_size=200&ordering=-created_at&search=${encodeURIComponent(search)}`,
  );

  const leads = useMemo(() => data?.results || [], [data?.results]);
  const grouped = useMemo(() => {
    const map: Record<string, Lead[]> = Object.fromEntries(COLUMNS.map((col) => [col.key, []]));
    for (const lead of leads) {
      if (filter === "mine" && user && lead.assigned_to !== (user.display_name || user.username)) continue;
      const status = map[lead.status] ? lead.status : "New";
      map[status].push(lead);
    }
    return map;
  }, [leads, filter, user]);

  const moveMutation = useApiMutation<{ id: number; status: string }, Lead, Error>({
    mutationFn: async ({ id, status }) => (await api.patch(`/leads/${id}/`, { status })).data,
  });

  const handleDrop = (status: string) => {
    setDragOverColumn(null);
    if (!draggingId) return;
    const lead = leads.find((row) => row.id === draggingId);
    setDraggingId(null);
    if (!lead || lead.status === status) return;
    moveMutation.mutate({ id: lead.id, status });
  };

  return (
    <section className="workspace kanban">
      <header className="dashHeader">
        <div>
          <h1>Leads Kanban</h1>
          <p>Drag cards between columns to update the lead stage.</p>
        </div>
        <div className="kanbanControls">
          <input
            type="search"
            className="dashSearch"
            placeholder="Search leads by name, code, or city"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="kanbanToggle" role="tablist">
            <button role="tab" aria-selected={filter === "all"} className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
            <button role="tab" aria-selected={filter === "mine"} className={filter === "mine" ? "active" : ""} onClick={() => setFilter("mine")} disabled={!user}>My leads</button>
          </div>
          <button className="billBtn" onClick={() => refetch()}>Refresh</button>
        </div>
      </header>

      {isLoading ? <p>Loading leads…</p> : null}
      {moveMutation.isPending ? <p className="dashEmpty">Updating…</p> : null}
      {moveMutation.isError ? <p className="error">{moveMutation.error?.message || "Could not move lead"}</p> : null}

      <div className="kanbanBoard">
        {COLUMNS.map((column) => {
          const items = grouped[column.key] || [];
          const total = items.reduce((sum, lead) => sum + Number(lead.total_closing || 0), 0);
          return (
            <div
              key={column.key}
              className={`kanbanColumn${dragOverColumn === column.key ? " dragOver" : ""}`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverColumn(column.key);
              }}
              onDragLeave={() => setDragOverColumn((current) => (current === column.key ? null : current))}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(column.key);
              }}
            >
              <header style={{ borderTop: `3px solid ${column.color}` }}>
                <h2>{column.label}</h2>
                <span>{items.length}</span>
              </header>
              {total > 0 ? <div className="kanbanTotal">{formatINR(total)} pipeline</div> : null}
              <div className="kanbanList">
                {items.length === 0 ? <p className="dashEmpty">No leads</p> : null}
                {items.map((lead) => {
                  const eventDate = formatDate(lead.event_date);
                  const followup = formatDate(lead.next_followup_at);
                  const value = formatINR(lead.total_closing);
                  return (
                    <article
                      key={lead.id}
                      className={`kanbanCard${draggingId === lead.id ? " dragging" : ""}`}
                      draggable
                      onDragStart={() => setDraggingId(lead.id)}
                      onDragEnd={() => {
                        setDraggingId(null);
                        setDragOverColumn(null);
                      }}
                    >
                      <header>
                        <strong>{lead.name}</strong>
                        <code>{lead.lead_code}</code>
                      </header>
                      <div className="kanbanMeta">
                        <span>{lead.event_type || "Unspecified"}</span>
                        {lead.city ? <span>· {lead.city}</span> : null}
                        {lead.assigned_to ? <span>· {lead.assigned_to}</span> : null}
                      </div>
                      <div className="kanbanFoot">
                        {eventDate ? <span>📅 {eventDate}</span> : null}
                        {followup ? <span>↻ {followup}</span> : null}
                        {value ? <span>{value}</span> : null}
                        {lead.priority ? (
                          <span className="kanbanPriority" style={{ color: priorityTone[lead.priority] || "#94a3b8" }}>
                            {lead.priority}
                          </span>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
