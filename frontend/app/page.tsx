"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { queryClient, queryKeys } from "@/lib/query";
import SalesWorkspace from "@/components/SalesWorkspace";
import OperationsWorkspace from "@/components/OperationsWorkspace";
import AccountsWorkspace from "@/components/AccountsWorkspace";
import ProductionWorkspace from "@/components/ProductionWorkspace";
import OwnerPortal from "@/components/OwnerPortal";
import DashboardWorkspace from "@/components/DashboardWorkspace";
import ReportsWorkspace from "@/components/ReportsWorkspace";
import BillingWorkspace from "@/components/BillingWorkspace";
import LeadsKanban from "@/components/LeadsKanban";
import CalendarWorkspace from "@/components/CalendarWorkspace";
import AuditWorkspace from "@/components/AuditWorkspace";
import BackupWorkspace from "@/components/BackupWorkspace";
import ShortcutsWorkspace from "@/components/ShortcutsWorkspace";
import RateLimitWorkspace from "@/components/RateLimitWorkspace";
import AdministrationWorkspace from "@/components/AdministrationWorkspace";
import SettingsWorkspace from "@/components/SettingsWorkspace";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import {
  canAccess,
  canWrite,
  isAdministrator,
  type Department,
} from "@/lib/permissions";
const sections = [
  "Dashboard",
  "Sales",
  "Kanban",
  "Operations",
  "Calendar",
  "Accounts",
  "Production",
  "Billing",
  "Reports",
  "Audit",
  "Backups",
  "Rate limits",
  "Shortcuts",
  "Settings",
  "Admin",
] as const;
type Section = (typeof sections)[number];
const sectionIcons: Record<Section, string> = {
  Dashboard: "⌂", Sales: "◎", Kanban: "▦", Operations: "◇", Calendar: "□",
  Accounts: "₹", Production: "▷", Billing: "▤", Reports: "↗", Audit: "✓",
  Backups: "↻", "Rate limits": "◴", Shortcuts: "⌘", Settings: "⚙", Admin: "♙",
};
const navigationGroups: Array<{ label: string; icon: string; items: Section[] }> = [
  { label: "Sales & Marketing", icon: "⌁", items: ["Sales"] },
  { label: "Operations", icon: "◇", items: ["Operations"] },
  { label: "Accounts", icon: "₹", items: ["Accounts"] },
  { label: "Post Production", icon: "▷", items: ["Production"] },
  { label: "Administration", icon: "♙", items: ["Admin", "Audit"] },
  { label: "Settings", icon: "⚙", items: ["Settings"] },
];
const sectionDepartments: Partial<Record<Section, Department>> = {
  Dashboard: "sales",
  Sales: "sales",
  Kanban: "sales",
  Operations: "operations",
  Calendar: "operations",
  Accounts: "accounts",
  Production: "production",
  Billing: "accounts",
  Reports: "sales",
  Audit: "production",
  Settings: "sales",
};
function Login({
  ownerMode,
  setOwnerMode,
  authenticated,
}: {
  ownerMode: boolean;
  setOwnerMode: (value: boolean) => void;
  authenticated: (owner: boolean) => void;
}) {
  const setSession = useAuthStore((s) => s.setSession),
    [error, setError] = useState(""),
    [showPassword, setShowPassword] = useState(false),
    [submitting, setSubmitting] = useState(false);
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const { data } = await api.post("/auth/login/", Object.fromEntries(form));
      if (
        ownerMode &&
        !data.user?.is_platform_owner &&
        !data.user?.is_superuser
      ) {
        setError("This account does not have LenspireAI Owner access.");
        return;
      }
      setSession(data.access, data.refresh, data.user);
      authenticated(ownerMode);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <main className="login">
      <section className="loginHero" aria-label="LenspireCRM introduction">
        <img
          className="loginWordmark"
          src="/login/lenspire-wordmark.png"
          alt="Lenspire.ai — See, Create, Inspire"
        />
        <div className="loginHeroCopy">
          <h1>
            From first inquiry
            <br />
            to final delivery.
          </h1>
          <p>
            Manage leads, shoots, clients, payments and production through one
            secure studio workspace.
          </p>
          <div className="loginFeatures">
            <div>
              <i>♧</i>
              <span>
                <b>Ready</b>
                <small>Lead management</small>
              </span>
            </div>
            <div>
              <i>☁</i>
              <span>
                <b>Secure</b>
                <small>Cloud sign-in</small>
              </span>
            </div>
            <div>
              <i>▣</i>
              <span>
                <b>Synced</b>
                <small>Studio access</small>
              </span>
            </div>
          </div>
        </div>
        <p className="loginHeroNote">
          “Focus on the moments. Your workspace handles the workflow.”
        </p>
      </section>
      <section className="loginPanel">
        <form className="loginCard" onSubmit={submit}>
          <img
            className="loginMobileWordmark"
            src="/login/lenspire-wordmark.png"
            alt="Lenspire.ai"
          />
          <span className="loginEyebrow">
            {ownerMode ? "LENSPIREAI OWNER PORTAL" : "WELCOME BACK"}
          </span>
          <h2>{ownerMode ? "Studio Management" : "Sandeep Jadhav"}</h2>
          <p>
            {ownerMode
              ? "Sign in with the verified LenspireAI owner account."
              : "Sign in to manage your studio workspace."}
          </p>
          <label>
            Username
            <div className="loginInput loginUsernameField">
              <i>♟</i>
              <input name="username" defaultValue="admin" autoFocus required autoComplete="off" spellCheck="false" />
            </div>
          </label>
          <label>
            Password
            <div className="loginInput loginPasswordField">
              <i>◇</i>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                autoComplete="off"
                spellCheck="false"
                required
              />
              <button
                type="button"
                className="passwordVisibilityToggle"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? "◉" : "⊙"}
              </button>
            </div>
          </label>
          <div className="loginOptions">
            <label>
              <input type="checkbox" defaultChecked /> Remember me
            </label>
            <button type="button">Forgot password?</button>
          </div>
          {error && <div className="error">{error}</div>}
          <button className="loginSubmit" disabled={submitting}>
            {submitting
              ? "Signing in…"
              : ownerMode
                ? "Open Owner Portal"
                : "Sign in"}{" "}
            <span>→</span>
          </button>
          <button
            className="ownerPortalButton"
            type="button"
            onClick={() => {
              setError("");
              setOwnerMode(!ownerMode);
            }}
          >
            {ownerMode
              ? "← Back to Studio Sign In"
              : "◇ LenspireAI Owner Portal"}
          </button>
          <div className="loginCloudStatus">
            <b>LenspireCRM Cloud</b>
            <span>Secure account authentication</span>
            <span>Internet connection required</span>
          </div>
          <small className="loginCopyright">
            © 2026 LenspireCRM. All rights reserved.
          </small>
        </form>
      </section>
    </main>
  );
}
export default function Home() {
  const auth = useAuthStore();
  const [mounted, setMounted] = useState(false),
    [ownerPortalMode, setOwnerPortalMode] = useState(false),
    [startNewLead, setStartNewLead] = useState(false),
    [sidebarHidden, setSidebarHidden] = useState(false),
    [openNavGroup, setOpenNavGroup] = useState<string | null>(null),
    [section, setSection] = useState<Section>("Sales");
  useEffect(() => {
    setOwnerPortalMode(sessionStorage.getItem("lenspire-owner-portal") === "1");
    setSidebarHidden(window.matchMedia("(max-width: 900px)").matches);
    const params = new URLSearchParams(window.location.search);
    const requestedSection = params.get("section");
    if (requestedSection && (sections as readonly string[]).includes(requestedSection)) {
      setSection(requestedSection as Section);
    }
    if (params.get("action") === "new-lead") setStartNewLead(true);
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted || !auth.access) return;
    api
      .get("/auth/me/")
      .then(({ data }) => {
        useAuthStore.setState({ user: data });
      })
      .catch(() => auth.logout());
  }, [mounted, auth.access]);
  useEffect(() => {
    if (mounted && auth.access && auth.user) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.leads(),
        queryFn: async () =>
          (await api.get("/leads/?page_size=500&ordering=-created_at")).data,
      });
    }
  }, [mounted, auth.access, auth.user]);
  const visibleSections = sections.filter((item) => {
    if (item === "Admin" || item === "Audit")
      return isAdministrator(auth.user);
    return canAccess(auth.user, sectionDepartments[item]!);
  });
  useEffect(() => {
    if (
      mounted &&
      auth.user &&
      visibleSections.length &&
      !visibleSections.includes(section)
    ) {
      setSection(visibleSections[0]);
    }
  }, [mounted, auth.user, section, visibleSections.join("|")]);
  if (!mounted)
    return (
      <main className="appBoot" aria-label="Loading LenspireCRM">
        <div className="brand">
          LENSPIRE<span>CRM</span>
        </div>
      </main>
    );
  if (!auth.access)
    return (
      <Login
        ownerMode={ownerPortalMode}
        setOwnerMode={setOwnerPortalMode}
        authenticated={(owner) => {
          setOwnerPortalMode(owner);
          if (owner) sessionStorage.setItem("lenspire-owner-portal", "1");
          else sessionStorage.removeItem("lenspire-owner-portal");
        }}
      />
    );
  if (ownerPortalMode && auth.user?.is_superuser)
    return (
      <OwnerPortal
        logout={() => {
          sessionStorage.removeItem("lenspire-owner-portal");
          setOwnerPortalMode(false);
          auth.logout();
        }}
      />
    );
  const department = sectionDepartments[section];
  const readOnly = department ? !canWrite(auth.user, department) : false;
  return (
    <div className={`shell ${sidebarHidden ? "sidebarHidden" : ""}`}>
      <aside>
        <div className="brand">
          <span className="studioMark" aria-hidden="true"><img src="/ankit-studios-logo.png" alt="" /></span>
          <span className="studioIdentity"><b>Ankit Studios</b><small>Powered by LenspireCRM</small></span>
        </div>
        <nav aria-label="Primary navigation">
          <div className="navGroupCard">
            {visibleSections.includes("Dashboard") && (
              <button className={`navTopItem ${section === "Dashboard" ? "active" : ""}`} aria-current={section === "Dashboard" ? "page" : undefined} onClick={() => { setStartNewLead(false); setSection("Dashboard"); if (window.matchMedia("(max-width: 900px)").matches) setSidebarHidden(true); }}>
                <span className="navIcon" aria-hidden="true">{sectionIcons.Dashboard}</span><span>Main Dashboard</span>
              </button>
            )}
            {navigationGroups.map((group) => {
              const items = group.items.filter((item) => visibleSections.includes(item));
              if (!items.length) return null;
              const active = items.includes(section);
              const direct = items.length === 1;
              const expanded = openNavGroup === group.label;
              return <div className={`navGroup ${active ? "groupActive" : ""} ${expanded ? "open" : ""}`} key={group.label}>
                <button type="button" className={`navGroupLabel ${direct ? "direct" : ""}`} aria-current={direct && active ? "page" : undefined} aria-expanded={direct ? undefined : expanded} aria-label={direct ? group.label : `${expanded ? "Close" : "Open"} ${group.label}`} onClick={() => { if (direct) { setStartNewLead(false); setSection(items[0]); if (window.matchMedia("(max-width: 900px)").matches) setSidebarHidden(true); } else setOpenNavGroup(expanded ? null : group.label); }}><i>{group.icon}</i><span>{group.label}</span>{!direct && <b>⌄</b>}</button>
                {!direct && <div className="navSubmenu">
                  {items.map((item) => <button className={item === section ? "active" : ""} aria-current={item === section ? "page" : undefined} onClick={() => { setStartNewLead(false); setSection(item); if (window.matchMedia("(max-width: 900px)").matches) setSidebarHidden(true); }} key={item}><span className="navIcon" aria-hidden="true">{sectionIcons[item]}</span><span>{item === "Dashboard" ? "Main Dashboard" : item}</span></button>)}
                </div>}
              </div>;
            })}
          </div>
          <div className="navUtility" aria-label="Additional navigation">
            {visibleSections.filter((item) => !["Dashboard", "Sales", "Kanban", "Operations", "Calendar", "Accounts", "Production", "Billing", "Reports", "Audit", "Backups", "Shortcuts", "Rate limits", "Settings", "Admin"].includes(item)).map((item) => (
              <button className={item === section ? "active" : ""} aria-current={item === section ? "page" : undefined} onClick={() => { setStartNewLead(false); setSection(item); if (window.matchMedia("(max-width: 900px)").matches) setSidebarHidden(true); }} key={item}>
                <span className="navIcon" aria-hidden="true">{sectionIcons[item]}</span><span>{item === "Dashboard" ? "Main Dashboard" : item}</span>
              </button>
            ))}
          </div>
        </nav>
        <div className="profile">
          <span className="profileAvatar">
            {isAdministrator(auth.user) ? (
              <img src="/sandeep-jadhav.jpg" alt="Sandeep Jadhav" />
            ) : (
              <span aria-hidden="true">{(auth.user?.display_name || auth.user?.username || "U").split(/\s+/).map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
            )}
          </span>
          <span className="profileIdentity"><b>{auth.user?.display_name || auth.user?.username}</b><small><i />{auth.user?.role}</small><time>{new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "2-digit", month: "long" }).format(new Date())}</time></span>
          <button className="profilePower" aria-label="Sign out" onClick={auth.logout}>◯</button>
        </div>
      </aside>
      <main>
        <button
          type="button"
          className="sidebarToggle"
          aria-label={sidebarHidden ? "Show sidebar" : "Hide sidebar"}
          title={
            sidebarHidden ? "Show sidebar" : "Hide sidebar for full preview"
          }
          onClick={() => setSidebarHidden((hidden) => !hidden)}
        >
          {sidebarHidden ? "☰" : "‹"}
        </button>
        <div className="workspaceChrome">
          <div><h1>{section === "Sales" ? "Sales Dashboard" : section}</h1><span>Your studio at a glance</span></div>
          <div className="chromeActions"><kbd>Find&nbsp;&nbsp;Ctrl F</kbd><label><span>⌕</span><input aria-label="Find in this module" placeholder="Find in this module..." /></label><NotificationBell /><ThemeToggle /><button aria-label="Toggle panels">▥</button><button aria-label="Refresh">↻</button></div>
        </div>
        {readOnly && (
          <div className="readOnlyNotice">
            Read-only access — you can view this module but cannot save changes.
          </div>
        )}
        {section === "Dashboard" ? (
          <ErrorBoundary label="Dashboard">
            <DashboardWorkspace />
          </ErrorBoundary>
        ) : section === "Sales" ? (
          <ErrorBoundary label="Sales">
            <SalesWorkspace startNewLead={startNewLead} />
          </ErrorBoundary>
        ) : section === "Kanban" ? (
          <ErrorBoundary label="Kanban">
            <LeadsKanban />
          </ErrorBoundary>
        ) : section === "Operations" ? (
          <ErrorBoundary label="Operations">
            <OperationsWorkspace readOnly={readOnly} />
          </ErrorBoundary>
        ) : section === "Calendar" ? (
          <ErrorBoundary label="Calendar">
            <CalendarWorkspace />
          </ErrorBoundary>
        ) : section === "Accounts" ? (
          <ErrorBoundary label="Accounts">
            <AccountsWorkspace
              readOnly={readOnly}
              onAddLead={() => {
                if (!canWrite(auth.user, "sales")) return;
                setStartNewLead(true);
                setSection("Sales");
              }}
            />
          </ErrorBoundary>
        ) : section === "Production" ? (
          <ErrorBoundary label="Production">
            <ProductionWorkspace readOnly={readOnly} />
          </ErrorBoundary>
        ) : section === "Billing" ? (
          <ErrorBoundary label="Billing">
            <BillingWorkspace />
          </ErrorBoundary>
        ) : section === "Reports" ? (
          <ErrorBoundary label="Reports">
            <ReportsWorkspace />
          </ErrorBoundary>
        ) : section === "Audit" ? (
          <ErrorBoundary label="Audit">
            <AuditWorkspace currentUser={auth.user} />
          </ErrorBoundary>
        ) : section === "Backups" ? (
          <ErrorBoundary label="Backups">
            <BackupWorkspace />
          </ErrorBoundary>
        ) : section === "Rate limits" ? (
          <ErrorBoundary label="Rate limits">
            <RateLimitWorkspace />
          </ErrorBoundary>
        ) : section === "Shortcuts" ? (
          <ErrorBoundary label="Shortcuts">
            <ShortcutsWorkspace currentUser={auth.user} />
          </ErrorBoundary>
        ) : section === "Settings" ? (
          <ErrorBoundary label="Settings">
            <SettingsWorkspace currentUser={auth.user!} />
          </ErrorBoundary>
        ) : auth.user ? (
          <ErrorBoundary label="Admin">
            <AdministrationWorkspace currentUser={auth.user} />
          </ErrorBoundary>
        ) : null}
      </main>
    </div>
  );
}
