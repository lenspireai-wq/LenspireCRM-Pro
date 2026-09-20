"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "@/lib/api";
import { canAccess } from "@/lib/permissions";
import { useAuthStore } from "@/stores/auth";
import styles from "./HeaderSearch.module.css";

const sources = [
  { path: "/leads/", label: "Leads", department: "sales", section: "Sales" },
  { path: "/customers/", label: "Clients", department: "sales", section: "Sales" },
  { path: "/bookings/", label: "Bookings", department: "sales", section: "Sales" },
  { path: "/events/", label: "Events", department: "operations", section: "Operations" },
  { path: "/payments/", label: "Payments", department: "accounts", section: "Accounts" },
  { path: "/production/", label: "Production jobs", department: "production", section: "Production" },
] as const;
type Group = { source: typeof sources[number]; count: number; rows: Record<string, any>[]; failed: boolean };
export default function HeaderSearch({ onNavigate, scope = "global", onEventSearch, onPhotographerSearch, onAccountsSearch, onProductionSearch, onAdminSearch, onAuditSearch, productionView }: { onNavigate: (section: "Sales" | "Operations" | "Accounts" | "Production") => void; scope?: "global" | "lead-management" | "events" | "photographers" | "accounts-table" | "production-table" | "admin" | "audit"; onEventSearch?: (value: string) => void; onPhotographerSearch?: (value: string) => void; onAccountsSearch?: (value: string) => void; onProductionSearch?: (value: string) => void; onAdminSearch?: (value: string) => void; onAuditSearch?: (value: string) => void; productionView?: string }) {
  const user = useAuthStore(state => state.user);
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [resultsPosition, setResultsPosition] = useState<{ top: number; right: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isLeadManagementSearch = scope === "lead-management";
  const isEventSearch = scope === "events";
  const isPhotographerSearch = scope === "photographers";
  const isAccountsSearch = scope === "accounts-table";
  const isProductionSearch = scope === "production-table";
  const isAdminSearch = scope === "admin";
  const isAuditSearch = scope === "audit";
  const isTableSearch = isLeadManagementSearch || isEventSearch || isPhotographerSearch || isAccountsSearch || isProductionSearch || isAdminSearch || isAuditSearch;
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node) && !resultsRef.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  useEffect(() => {
    setTerm("");
    setOpen(false);
    if (isLeadManagementSearch) window.dispatchEvent(new CustomEvent("lenspire:lead-search", { detail: "" }));
    onEventSearch?.("");
    onPhotographerSearch?.("");
    onAccountsSearch?.("");
    onProductionSearch?.("");
    onAdminSearch?.("");
    onAuditSearch?.("");
  }, [scope, isLeadManagementSearch, onEventSearch, onPhotographerSearch, onAccountsSearch, onProductionSearch, onAdminSearch, onAuditSearch]);
  useEffect(() => {
    if (!open || isTableSearch) return;
    const updatePosition = () => {
      const rect = root.current?.getBoundingClientRect();
      if (!rect) return;
      setResultsPosition({ top: rect.bottom + 8, right: Math.max(16, window.innerWidth - rect.right) });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, isTableSearch]);
  useEffect(() => {
    if (isTableSearch) return;
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
  }, [term, user, isTableSearch]);
  const updateTerm = (value: string) => {
    setTerm(value);
    if (isEventSearch) { onEventSearch?.(value); return; }
    if (isPhotographerSearch) { onPhotographerSearch?.(value); return; }
    if (isAccountsSearch) { onAccountsSearch?.(value); return; }
    if (isProductionSearch) { onProductionSearch?.(value); return; }
    if (isAdminSearch) { onAdminSearch?.(value); return; }
    if (isAuditSearch) { onAuditSearch?.(value); return; }
    if (isLeadManagementSearch) {
      window.dispatchEvent(new CustomEvent("lenspire:lead-search", { detail: value }));
      return;
    }
    setOpen(value.trim().length >= 2);
  };
  const results = !isTableSearch && open && term.trim().length >= 2 && resultsPosition ? <div id="header-search-results" className={styles.results} ref={resultsRef} aria-label="CRM search results" style={{ position: "fixed", top: resultsPosition.top, right: resultsPosition.right, zIndex: 1000 }}>
    <div role="status">{loading ? "Searching…" : groups.every(group => !group.count) && !groups.some(group => group.failed) ? "No matching records." : "Search results"}</div>
    {groups.map(({ source, rows, count, failed }) => <section key={source.path}>
      {failed ? <p role="alert">Could not search {source.label.toLowerCase()}. Please try again.</p> : count > 0 && <>
        <h3>{source.label} · {count} matches</h3>
        {rows.map(row => <article key={row.id}>
          <strong>{row.title || row.name || row.client_name || row.booking_code || `Record ${row.id}`}</strong>
          <small>{[row.lead_code || row.customer_code, row.client_name || row.couple_name, row.start_date, row.city, row.mobile || row.phone || row.contact_no, row.status].filter(Boolean).join(" · ")}</small>
        </article>)}
        {count > 5 && <small>Showing the first 5 matches. Refine your search for more specific results.</small>}
        <button type="button" onClick={() => { onNavigate(source.section); setOpen(false); }}>Open {source.section}</button>
      </>}
    </section>)}
  </div> : null;
  return <div className={styles.root} ref={root} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
    <input className={styles.input} type="search" aria-label={isEventSearch ? "Search events in this table" : isPhotographerSearch ? "Search photographers in this table" : isLeadManagementSearch ? "Search leads in this table" : isAccountsSearch ? "Search client accounts in this table" : isProductionSearch ? `Search ${productionView || "production"}` : isAdminSearch ? "Search users in Admin Console" : isAuditSearch ? "Search Audit records" : "Search CRM records"} placeholder={isEventSearch ? "Search events in this table…" : isPhotographerSearch ? "Search photographers in this table…" : isLeadManagementSearch ? "Search leads in this table…" : isAccountsSearch ? "Search client, couple, or booking…" : isProductionSearch ? `Search ${productionView || "this view"}…` : isAdminSearch ? "Search users in Admin…" : isAuditSearch ? "Search Audit records…" : "Search leads, clients, events…"} value={term} onChange={event => updateTerm(event.target.value)} aria-expanded={!isTableSearch && open} aria-controls={isTableSearch ? undefined : "header-search-results"} />
    {typeof document !== "undefined" && results ? createPortal(results, document.body) : null}
  </div>;
}
