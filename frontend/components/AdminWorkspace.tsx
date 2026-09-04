"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { queryClient, useApiMutation } from "@/lib/query";
import {
  departments,
  type AccessLevel,
  type Department,
  type SessionUser,
} from "@/lib/permissions";

type UserRow = SessionUser & { organization?: number };
type AuditRow = {
  id: number;
  target_name: string;
  target_username?: string;
  action: string;
  description: string;
  performed_by: string;
  created_at: string;
};
const roles = [
  "Administrator",
  "Manager",
  "Sales Executive",
  "Operations Executive",
  "Accountant",
  "Editor",
  "Viewer",
];
const blankAccess = (): Record<Department, AccessLevel> => ({
  sales: "none",
  operations: "none",
  accounts: "none",
  production: "none",
});
const accessForRole = (role: string): Record<Department, AccessLevel> => {
  const access = blankAccess();
  if (role === "Administrator" || role === "Manager") {
    departments.forEach((department) => (access[department] = "full"));
  } else if (role === "Sales Executive") access.sales = "full";
  else if (role === "Operations Executive") access.operations = "full";
  else if (role === "Accountant") access.accounts = "full";
  else if (role === "Editor") access.production = "full";
  return access;
};
const dateTime = (value?: string | null) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

export default function AdminWorkspace({
  currentUser,
}: {
  currentUser: SessionUser;
}) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [draft, setDraft] = useState<Partial<UserRow> | null>(null);
  const [password, setPassword] = useState("");
  const [resetUser, setResetUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [resetOpen, setResetOpen] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState("");
  const [resetResult, setResetResult] = useState("");
  const setActiveMutation = useApiMutation<{ id: number; active: boolean }, unknown, Error>({
    mutationFn: async ({ id, active }) =>
      (await api.post(`/users/${id}/set-active/`, { active })).data,
  });
  const resetPasswordMutation = useApiMutation<
    { id: number; password: string },
    unknown,
    Error
  >({
    mutationFn: async ({ id, password }) =>
      (await api.post(`/users/${id}/reset-password/`, { password })).data,
  });
  const saveUserMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) =>
      (await (url ? api.patch(url, payload) : api.post("/users/", payload))).data,
  });
  const resetTestingMutation = useApiMutation<
    { confirmation: string },
    any,
    Error
  >({
    mutationFn: async ({ confirmation }) =>
      (await api.post("/users/reset-testing-data/", { confirmation })).data,
  });
  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersResponse, auditResponse] = await Promise.all([
        api.get("/users/"),
        api.get("/users/audit-history/"),
      ]);
      setUsers(usersResponse.data.results || usersResponse.data);
      setAudit(auditResponse.data);
    } catch {
      setError("Could not load user accounts.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);

  const openNew = () => {
    setPassword("");
    setError("");
    setDraft({
      username: "",
      display_name: "",
      mobile: "",
      role: "Viewer",
      is_active: true,
      department_access: blankAccess(),
    });
  };
  const openEdit = (user: UserRow) => {
    setPassword("");
    setError("");
    setDraft({
      ...user,
      department_access: {
        ...blankAccess(),
        ...(user.department_access || {}),
      },
    });
  };
  const updateAccess = (department: Department, level: AccessLevel) =>
    setDraft((current) =>
      current
        ? {
            ...current,
            department_access: {
              ...blankAccess(),
              ...(current.department_access || {}),
              [department]: level,
            },
          }
        : current,
    );
  const updateRole = (role: string) =>
    setDraft((current) =>
      current
        ? { ...current, role, department_access: accessForRole(role) }
        : current,
    );
  const setActive = async (user: UserRow) => {
    const nextActive = !user.is_active;
    if (
      !window.confirm(
        `${nextActive ? "Activate" : "Deactivate"} ${user.display_name || user.username}?${nextActive ? "" : " Their existing sessions will be revoked immediately."}`,
      )
    )
      return;
    setError("");
    try {
      await setActiveMutation.mutateAsync({ id: user.id, active: nextActive });
      await load();
    } catch (problem: any) {
      setError(
        problem.response?.data?.detail || "Could not change account status.",
      );
    }
  };
  const resetPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!resetUser) return;
    setSaving(true);
    setError("");
    try {
      await resetPasswordMutation.mutateAsync({ id: resetUser.id, password });
      if (resetUser.id === currentUser.id) {
        useAuthStore.getState().logout();
        return;
      }
      await load();
      setResetUser(null);
      setPassword("");
    } catch (problem: any) {
      setError(
        problem.response?.data?.password ||
          problem.response?.data?.detail ||
          "Could not reset the password.",
      );
    } finally {
      setSaving(false);
    }
  };
  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft) return;
    setSaving(true);
    setError("");
    const payload = {
      username: draft.username,
      display_name: draft.display_name,
      mobile: draft.mobile,
      role: draft.role,
      is_active: draft.is_active,
      department_access:
        draft.role === "Administrator"
          ? {
              sales: "full",
              operations: "full",
              accounts: "full",
              production: "full",
            }
          : { ...blankAccess(), ...(draft.department_access || {}) },
      ...(password ? { password } : {}),
    };
    try {
      await saveUserMutation.mutateAsync({
        url: draft.id ? `/users/${draft.id}/` : "",
        payload,
      });
      await load();
      setDraft(null);
    } catch (problem: any) {
      const details = problem.response?.data || {};
      setError(
        Object.entries(details)
          .map(([field, messages]) => `${field}: ${String(messages)}`)
          .join(" · ") || "Could not save this user.",
      );
    } finally {
      setSaving(false);
    }
  };
  const resetTestingData = async () => {
    setSaving(true);
    setError("");
    setResetResult("");
    try {
      const data = await resetTestingMutation.mutateAsync({ confirmation: resetConfirmation });
      await Promise.all([load(), queryClient.invalidateQueries()]);
      const total = Object.values(data.deleted || {}).reduce(
        (sum: number, value) => sum + Number(value || 0),
        0,
      );
      setResetResult(`${total} connected testing records were cleared.`);
      setResetConfirmation("");
    } catch (problem: any) {
      setError(
        problem.response?.data?.confirmation ||
          problem.response?.data?.detail ||
          "Could not reset testing data.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="adminWorkspace">
      <header className="adminHeader">
        <div>
          <small>ADMINISTRATION</small>
          <h1>Users & Permissions</h1>
          <p>
            Control module visibility and read or full access for each user.
          </p>
        </div>
        <div className="adminHeaderActions">
          <button
            className="dangerButton resetDataAction"
            onClick={() => {
              setError("");
              setResetResult("");
              setResetOpen(true);
            }}
          >
            ↺ Reset Testing Data
          </button>
          <button className="primary createAction" onClick={openNew}>
            ＋ Add User
          </button>
        </div>
      </header>
      <section className="accountMetrics adminMetrics">
        <article>
          <span>Total Users</span>
          <strong>{users.length}</strong>
        </article>
        <article>
          <span>Active</span>
          <strong>{users.filter((user) => user.is_active).length}</strong>
        </article>
        <article>
          <span>Administrators</span>
          <strong>
            {users.filter((user) => user.role === "Administrator").length}
          </strong>
        </article>
        <article>
          <span>Audit Entries</span>
          <strong>{audit.length}</strong>
        </article>
      </section>
      {error && !draft && !resetOpen && <p className="formError">{error}</p>}
      <section className="panel">
        <div className="panelHead">
          <h2>User Accounts</h2>
          <span>{loading ? "Loading…" : `${users.length} users`}</span>
        </div>
        <div className="table">
          <table className="adminUsersTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Mobile</th>
                <th>Department Access</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <b>{user.display_name || user.username}</b>
                    {user.id === currentUser.id && <small>You</small>}
                  </td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.mobile || "—"}</td>
                  <td>
                    <div className="permissionBadges">
                      {user.role === "Administrator" ? (
                        <span className="full">All · Full</span>
                      ) : (
                        departments
                          .filter(
                            (department) =>
                              user.department_access?.[department] !== "none" &&
                              user.department_access?.[department],
                          )
                          .map((department) => (
                            <span
                              key={department}
                              className={user.department_access?.[department]}
                            >
                              {department} ·{" "}
                              {user.department_access?.[department]}
                            </span>
                          ))
                      )}
                      {user.role !== "Administrator" &&
                        !departments.some(
                          (department) =>
                            user.department_access?.[department] !== "none" &&
                            user.department_access?.[department],
                        ) && <span>None</span>}
                    </div>
                  </td>
                  <td>
                    <span
                      className={user.is_active ? "userActive" : "userInactive"}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{dateTime(user.last_login)}</td>
                  <td>
                    <div className="adminUserActions">
                      <button
                        className="editAction"
                        title="Edit user"
                        aria-label="Edit user"
                        onClick={() => openEdit(user)}
                      >
                        ✎
                      </button>
                      <button
                        className="resetAction"
                        title="Reset password"
                        aria-label="Reset password"
                        onClick={() => {
                          setPassword("");
                          setError("");
                          setResetUser(user);
                        }}
                      >
                        ↻
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          className={
                            user.is_active
                              ? "deactivateAction"
                              : "activateAction"
                          }
                          title={
                            user.is_active ? "Deactivate user" : "Activate user"
                          }
                          aria-label={
                            user.is_active ? "Deactivate user" : "Activate user"
                          }
                          onClick={() => setActive(user)}
                        >
                          {user.is_active ? "×" : "✓"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && !loading && (
            <div className="empty">No users found.</div>
          )}
        </div>
      </section>
      <section className="panel adminAuditPanel">
        <div className="panelHead">
          <div>
            <h2>Permission & User Activity</h2>
            <p>Permanent record of account and access changes.</p>
          </div>
          <span>{audit.length} activities</span>
        </div>
        <div className="table">
          <table className="adminAuditTable">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User Account</th>
                <th>Action</th>
                <th>Changes</th>
                <th>Changed By</th>
              </tr>
            </thead>
            <tbody>
              {audit.map((activity) => (
                <tr key={activity.id}>
                  <td>{dateTime(activity.created_at)}</td>
                  <td>
                    <b>{activity.target_name}</b>
                    {activity.target_username && (
                      <small>@{activity.target_username}</small>
                    )}
                  </td>
                  <td>
                    <span className="adminAuditAction">{activity.action}</span>
                  </td>
                  <td>{activity.description}</td>
                  <td>{activity.performed_by}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!audit.length && !loading && (
            <div className="empty">
              No changes recorded yet. New user and permission changes will
              appear here.
            </div>
          )}
        </div>
      </section>

      {resetOpen && (
        <div className="modalBackdrop">
          <section className="accountModal resetTestingModal" role="dialog" aria-modal="true" aria-labelledby="reset-testing-title">
            <div className="modalHeader">
              <div>
                <small>TESTING TOOLS</small>
                <h2 id="reset-testing-title">Reset Connected Testing Data</h2>
                <p>
                  This clears transactional test records across every connected
                  department.
                </p>
              </div>
              <button type="button" aria-label="Close reset testing data dialog" onClick={() => setResetOpen(false)}>
                ×
              </button>
            </div>
            <div className="resetTestingBody">
              <div className="resetWarning">
                <b>This action cannot be undone.</b>
                <p>
                  Leads, customers, bookings, events, payments, reminders and
                  production jobs will be deleted.
                </p>
                <p>
                  Users, passwords, permissions, sales targets, photographer
                  records and audit history will remain.
                </p>
              </div>
              <label>
                Type <b>RESET TEST DATA</b> to confirm
                <input
                  autoFocus
                  value={resetConfirmation}
                  onChange={(event) => setResetConfirmation(event.target.value)}
                  placeholder="RESET TEST DATA"
                />
              </label>
              {error && <p className="formError">{error}</p>}
              {resetResult && <p className="resetSuccess">{resetResult}</p>}
            </div>
            <div className="modalFooter">
              <button type="button" onClick={() => setResetOpen(false)}>
                Close
              </button>
              <button
                type="button"
                className="dangerButton"
                disabled={saving || resetConfirmation !== "RESET TEST DATA"}
                onClick={() => void resetTestingData()}
              >
                {saving ? "Resetting…" : "Reset Testing Data"}
              </button>
            </div>
          </section>
        </div>
      )}

      {draft && (
        <div className="modalBackdrop">
          <form className="accountModal adminUserModal" role="dialog" aria-modal="true" aria-labelledby="admin-user-dialog-title" onSubmit={save}>
            <div className="modalHeader">
              <div>
                <small>USER ACCOUNT</small>
                <h2 id="admin-user-dialog-title">{draft.id ? "Edit User" : "Add User"}</h2>
                <p>Set identity, login status, and department permissions.</p>
              </div>
              <button type="button" aria-label="Close user dialog" onClick={() => setDraft(null)}>
                ×
              </button>
            </div>
            <div className="adminUserForm">
              <label>
                Display Name
                <input
                  required
                  autoComplete="off"
                  value={draft.display_name || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, display_name: event.target.value })
                  }
                />
              </label>
              <label>
                Username
                <input
                  required
                  autoComplete="off"
                  value={draft.username || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, username: event.target.value })
                  }
                />
              </label>
              <label>
                Mobile Number
                <input
                  autoComplete="off"
                  value={draft.mobile || ""}
                  onChange={(event) =>
                    setDraft({ ...draft, mobile: event.target.value })
                  }
                />
              </label>
              <label>
                Role
                <select
                  disabled={Boolean(draft.is_superuser)}
                  value={draft.role || "Viewer"}
                  onChange={(event) => updateRole(event.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>
              {!draft.id && (
                <label className="wide">
                  Password
                  <input
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={10}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 10 characters"
                  />
                </label>
              )}
              <label className="userActiveToggle wide">
                <input
                  type="checkbox"
                  checked={draft.is_active !== false}
                  disabled={draft.id === currentUser.id}
                  onChange={(event) =>
                    setDraft({ ...draft, is_active: event.target.checked })
                  }
                />
                Active user — allowed to sign in
              </label>
              <div className="permissionMatrix wide">
                <header>
                  <div>
                    <b>Department Permissions</b>
                    <small>
                      No Access hides the module. Read allows viewing. Full
                      allows creating and editing.
                    </small>
                  </div>
                  {draft.role === "Administrator" && (
                    <strong>
                      Administrator · Full access to all departments
                    </strong>
                  )}
                </header>
                {departments.map((department) => (
                  <div className="permissionRow" key={department}>
                    <span>{department}</span>
                    <div className="permissionChoices">
                      {(
                        [
                          ["none", "No Access"],
                          ["read", "Read Only"],
                          ["full", "Full Access"],
                        ] as [AccessLevel, string][]
                      ).map(([level, label]) => {
                        const selected =
                          (draft.role === "Administrator"
                            ? "full"
                            : draft.department_access?.[department] ||
                              "none") === level;
                        return (
                          <button
                            type="button"
                            key={level}
                            disabled={draft.role === "Administrator"}
                            className={selected ? `selected ${level}` : ""}
                            onClick={() => updateAccess(department, level)}
                          >
                            {selected ? "✓ " : ""}
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {error && <p className="formError adminFormError">{error}</p>}
            <div className="modalFooter">
              <button type="button" onClick={() => setDraft(null)}>
                Cancel
              </button>
              <button className="primary" disabled={saving}>
                {saving ? "Saving…" : "Save User"}
              </button>
            </div>
          </form>
        </div>
      )}
      {resetUser && (
        <div className="modalBackdrop">
          <form
            className="accountModal passwordResetModal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-reset-dialog-title"
            onSubmit={resetPassword}
          >
            <div className="modalHeader">
              <div>
                <small>ACCOUNT SECURITY</small>
                <h2 id="password-reset-dialog-title">Reset Password</h2>
                <p>
                  {resetUser.display_name || resetUser.username} · Existing
                  sessions will be revoked.
                </p>
              </div>
              <button type="button" aria-label="Close password reset dialog" onClick={() => setResetUser(null)}>
                ×
              </button>
            </div>
            <div className="adminUserForm">
              <label className="wide">
                New Password
                <input
                  autoFocus
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={10}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Minimum 10 characters"
                />
              </label>
            </div>
            {error && <p className="formError adminFormError">{error}</p>}
            <div className="modalFooter">
              <button type="button" onClick={() => setResetUser(null)}>
                Cancel
              </button>
              <button className="primary" disabled={saving}>
                {saving ? "Resetting…" : "Reset Password & Revoke Sessions"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
