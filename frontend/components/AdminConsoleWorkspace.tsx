"use client";

import { useState } from "react";
import type { SessionUser } from "@/lib/permissions";
import AdminWorkspace from "@/components/AdminWorkspace";
import AuditWorkspace from "@/components/AuditWorkspace";

type View = "Admin" | "Audit";

export default function AdminConsoleWorkspace({
  currentUser,
  view,
  onViewChange,
}: {
  currentUser: SessionUser;
  view: View;
  onViewChange: (next: View) => void;
}) {
  const [addUserTrigger, setAddUserTrigger] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [exportTrigger, setExportTrigger] = useState(0);
  const [canExport, setCanExport] = useState(false);

  return (
    <div className="adminConsoleLayout">
      <div className="adminConsoleHeaderRow">
        <nav className="operationsTabs" aria-label="Admin Console views">
          <button className={view === "Admin" ? "active" : ""} onClick={() => onViewChange("Admin")}>Admin</button>
          <button className={view === "Audit" ? "active" : ""} onClick={() => onViewChange("Audit")}>Audit</button>
        </nav>
        {view === "Admin" && (
          <div className="adminHeaderActions">
            <button
              className="dangerButton resetDataAction"
              onClick={() => setResetTrigger((t) => t + 1)}
            >
              ↺ Reset Testing Data
            </button>
            <button className="primary createAction" onClick={() => setAddUserTrigger((t) => t + 1)}>
              ＋ Add User
            </button>
          </div>
        )}
        {view === "Audit" && (
          <div className="adminHeaderActions">
            <button
              type="button"
              className="btnSecondary"
              onClick={() => setExportTrigger((t) => t + 1)}
              disabled={!canExport}
              title="Download the filtered list as a CSV"
            >
              Export CSV
            </button>
          </div>
        )}
      </div>
      {view === "Admin" ? (
        <AdminWorkspace currentUser={currentUser} hideActions addUserTrigger={addUserTrigger} resetTrigger={resetTrigger} />
      ) : (
        <AuditWorkspace currentUser={currentUser} exportTrigger={exportTrigger} onExportReady={setCanExport} />
      )}
    </div>
  );
}
