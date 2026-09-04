"use client";

import { useState } from "react";
import type { SessionUser } from "@/lib/permissions";
import AdminWorkspace from "@/components/AdminWorkspace";
import AuditWorkspace from "@/components/AuditWorkspace";

type View = "Admin" | "Audit";

export default function AdministrationWorkspace({ currentUser }: { currentUser: SessionUser }) {
  const [view, setView] = useState<View>("Admin");

  return (
    <>
      <nav className="operationsTabs" aria-label="Administration views">
        <button className={view === "Admin" ? "active" : ""} onClick={() => setView("Admin")}>Admin</button>
        <button className={view === "Audit" ? "active" : ""} onClick={() => setView("Audit")}>Audit</button>
      </nav>
      {view === "Admin" ? <AdminWorkspace currentUser={currentUser} /> : <AuditWorkspace currentUser={currentUser} />}
    </>
  );
}
