"use client";

import { useState } from "react";
import type { SessionUser } from "@/lib/permissions";
import BackupWorkspace from "@/components/BackupWorkspace";
import NotificationPreferencesWorkspace from "@/components/NotificationPreferencesWorkspace";
import RateLimitWorkspace from "@/components/RateLimitWorkspace";
import ShortcutsWorkspace from "@/components/ShortcutsWorkspace";

type View = "Settings" | "Backups" | "Rate limits" | "Shortcuts";
const views: View[] = ["Settings", "Backups", "Rate limits", "Shortcuts"];

export default function SettingsWorkspace({ currentUser }: { currentUser: SessionUser }) {
  const [view, setView] = useState<View>("Settings");

  return (
    <>
      <nav className="operationsTabs" aria-label="Settings views">
        {views.map((item) => (
          <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>
        ))}
      </nav>
      {view === "Settings" ? (
        <NotificationPreferencesWorkspace />
      ) : view === "Backups" ? (
        <BackupWorkspace />
      ) : view === "Rate limits" ? (
        <RateLimitWorkspace />
      ) : (
        <ShortcutsWorkspace currentUser={currentUser} />
      )}
    </>
  );
}
