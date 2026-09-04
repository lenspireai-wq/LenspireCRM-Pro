"use client";
import { useMemo } from "react";
import { useApiQuery, queryKeys } from "@/lib/query";
import { isAdministrator, canAccess, type Department } from "@/lib/permissions";

type DashboardResponse = {
  today?: { event_count?: number };
  outstanding?: { amount?: string };
  production?: { overdue_count?: number };
};

type Shortcut = {
  id: string;
  name: string;
  description: string;
  url: string;
  badge?: string;
  emoji: string;
  departments: Department[];
};

const buildShortcuts = (
  user: any,
  dashboard: DashboardResponse | null,
): Shortcut[] => {
  const shortcuts: Shortcut[] = [];
  const overdue = dashboard?.production?.overdue_count ?? 0;
  const todayCount = dashboard?.today?.event_count ?? 0;
  const outstanding = dashboard?.outstanding?.amount ?? "0";

  if (canAccess(user, "sales")) {
    shortcuts.push({
      id: "new-lead",
      name: "New lead",
      description: "Capture a new inquiry in the sales pipeline",
      url: "/?action=new-lead&section=Sales",
      emoji: "＋",
      departments: ["sales"],
    });
    shortcuts.push({
      id: "sales-dashboard",
      name: "Sales dashboard",
      description: "Funnel, targets, and recent activity",
      url: "/?section=Sales",
      emoji: "📈",
      departments: ["sales"],
    });
  }
  if (canAccess(user, "operations")) {
    shortcuts.push({
      id: "today-events",
      name: "Today's events",
      description:
        todayCount > 0
          ? `${todayCount} event${todayCount === 1 ? "" : "s"} scheduled today`
          : "No events scheduled today",
      url: "/?section=Calendar",
      emoji: "📅",
      badge: todayCount > 0 ? String(todayCount) : undefined,
      departments: ["operations"],
    });
    shortcuts.push({
      id: "overdue-jobs",
      name: "Overdue production",
      description:
        overdue > 0
          ? `${overdue} job${overdue === 1 ? "" : "s"} need attention`
          : "All jobs on track",
      url: "/?section=Production&filter=overdue",
      emoji: "⏰",
      badge: overdue > 0 ? String(overdue) : undefined,
      departments: ["operations", "production"],
    });
  }
  if (canAccess(user, "accounts")) {
    shortcuts.push({
      id: "pending-payments",
      name: "Pending payments",
      description: `Outstanding: ₹${outstanding}`,
      url: "/?section=Accounts",
      emoji: "💰",
      departments: ["accounts"],
    });
  }
  if (canAccess(user, "production")) {
    shortcuts.push({
      id: "production-board",
      name: "Production board",
      description: "Albums, videos, and delivery status",
      url: "/?section=Production",
      emoji: "🎞",
      departments: ["production"],
    });
  }
  if (isAdministrator(user)) {
    shortcuts.push({
      id: "audit",
      name: "Audit log",
      description: "See who changed what, and when",
      url: "/?section=Audit",
      emoji: "🔍",
      departments: ["sales", "operations", "accounts", "production"],
    });
    shortcuts.push({
      id: "backups",
      name: "Backups",
      description: "Create or restore an encrypted snapshot",
      url: "/?section=Backups",
      emoji: "💾",
      departments: ["sales", "operations", "accounts", "production"],
    });
  }
  return shortcuts;
};

export default function ShortcutsWorkspace({ currentUser }: { currentUser: any }) {
  const dashboardQuery = useApiQuery<DashboardResponse>(queryKeys.dashboard(), "/dashboard/", {
    enabled: Boolean(currentUser),
  });

  const shortcuts = useMemo(
    () => buildShortcuts(currentUser, dashboardQuery.data ?? null),
    [currentUser, dashboardQuery.data],
  );

  return (
    <section className="workspace shortcutsWorkspace" aria-label="Shortcuts">
      <header className="workspaceHead">
        <div>
          <h1>Shortcuts</h1>
          <p className="workspaceSub">
            One-tap actions tailored to your role. Install LenspireCRM on your
            phone and these will appear in the app icon menu.
          </p>
        </div>
      </header>

      <div className="shortcutsHero">
        <div>
          <span>iPhone / iPad</span>
          <p>
            Tap <strong>Share</strong> in Safari → <strong>Add to Home
            Screen</strong>. The icon menu will show your pinned shortcuts.
          </p>
        </div>
        <div>
          <span>Android</span>
          <p>
            Chrome menu → <strong>Install app</strong>. Long-press the icon to
            see quick actions.
          </p>
        </div>
        <div>
          <span>Desktop</span>
          <p>
            Install via the address-bar install button (Chrome / Edge). The
            shortcuts appear in the system app menu.
          </p>
        </div>
      </div>

      {shortcuts.length === 0 ? (
        <div className="auditEmpty">
          <strong>No shortcuts available for your role.</strong>
          <small>Ask an administrator to grant you access to a workspace.</small>
        </div>
      ) : (
        <div className="shortcutsGrid">
          {shortcuts.map((shortcut) => (
            <a key={shortcut.id} className="shortcutTile" href={shortcut.url}>
              <span className="shortcutIcon" aria-hidden="true">
                {shortcut.emoji}
              </span>
              <strong>{shortcut.name}</strong>
              <small>{shortcut.description}</small>
              {shortcut.badge ? (
                <span className="shortcutBadge">{shortcut.badge}</span>
              ) : null}
              <code className="shortcutUrl">{shortcut.url}</code>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
