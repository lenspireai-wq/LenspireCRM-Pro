"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { canAccess } from "@/lib/permissions";
import { useAuthStore } from "@/stores/auth";
import styles from "./HeaderSearch.module.css";

const sources = [
  { path: "/leads/", label: "Leads", department: "sales", section: "Sales" },
  { path: "/customers/", label: "Clients", department: "sales", section: "Sales" },
  { path: "/bookings/", label: "Bookings", department: "sales", section: "Sales" },
  { path: "/events/", label: "Events", department: "operations", section: "Operations" },
] as const;
type Group = { source: typeof sources[number]; count: number; rows: Record<string, any>[]; failed: boolean };
export default function HeaderSearch({ onNavigate, scope = "global" }: { onNavigate: (section: "Sales" | "Operations") => void; scope?: "global" | "lead-management" }) {
  const user = useAuthStore(state => state.user);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const isLeadManagementSearch = scope === "lead-management";
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => {
    setTerm("");
    setOpen(false);
    if (isLeadManagementSearch) window.dispatchEvent(new CustomEvent("lenspire:lead-search", { detail: "" }));
  }, [isLeadManagementSearch]);
  useEffect(() => {
    if (isLeadManagementSearch) return;
    const search = term.trim();
    setGroups([]);
    if (search.length < 2) { setLoading(false); return; }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const results = await Promise.all(sources.filter(source => canAccess(user, source.department)).map(async source => {
        try {
          const { data } = await api.get(source.path, { params: { search, page_size: 5 }, signal: controller.signal });
          const rows = Array.isArray(data) ? data : data.results ?? [];
          return { source, rows: rows.slice(0, 5), count: data.count ?? rows.length, failed: false };
        } catch { return { source, rows: [], count: 0, failed: true }; }
      }));
      if (!controller.signal.aborted) { setGroups(results); setLoading(false); }
    }, 300);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [term, user, isLeadManagementSearch]);
  const updateTerm = (value: string) => {
    setTerm(value);
    if (isLeadManagementSearch) {
      window.dispatchEvent(new CustomEvent("lenspire:lead-search", { detail: value }));
      return;
    }
    setOpen(value.trim().length >= 2);
  };
  return <div className={styles.root} ref={root} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
    <input className={styles.input} type="search" aria-label={isLeadManagementSearch ? "Search leads in this table" : "Search CRM records"} placeholder={isLeadManagementSearch ? "Search leads in this table…" : "Search leads, clients, events…"} value={term} onChange={event => updateTerm(event.target.value)} aria-expanded={!isLeadManagementSearch && open} aria-controls={isLeadManagementSearch ? undefined : "header-search-results"} />
    {!isLeadManagementSearch && open && term.trim().length >= 2 && <div id="header-search-results" className={styles.results} aria-label="CRM search results">
      <div role="status">{loading ? "Searching…" : groups.every(group => !group.count) && !groups.some(group => group.failed) ? "No matching records." : "Search results"}</div>
      {groups.map(({ source, rows, count, failed }) => <section key={source.path}>
        {failed ? <p role="alert">Could not search {source.label.toLowerCase()}. Please try again.</p> : count > 0 && <>
          <h3>{source.label} · {count} matches</h3>
          {rows.map(row => <article key={row.id}>
            <strong>{row.title || row.name || row.booking_code || `Record ${row.id}`}</strong>
            <small>{[row.lead_code || row.customer_code, row.client_name || row.couple_name, row.start_date, row.city, row.mobile || row.phone || row.contact_no, row.status].filter(Boolean).join(" · ")}</small>
          </article>)}
          {count > 5 && <small>Showing the first 5 matches. Refine your search for more specific results.</small>}
          <button type="button" onClick={() => { onNavigate(source.section); setOpen(false); }}>Open {source.section}</button>
        </>}
      </section>)}
    </div>}
  </div>;
}
