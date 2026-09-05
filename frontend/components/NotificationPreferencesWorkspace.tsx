"use client";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation, useApiQuery, queryKeys } from "@/lib/query";

type Preference = {
  category: string;
  label: string;
  enabled: boolean;
  email_digest: boolean;
};

const FALLBACK_CATEGORIES = [
  "general",
  "lead",
  "booking",
  "payment",
  "reminder",
  "production",
  "client_portal",
];

const labelFor = (category: string) =>
  category
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

export default function NotificationPreferencesWorkspace() {
  const preferencesQuery = useApiQuery<{ results: Preference[] }>(
    queryKeys.notificationPreferences(),
    "/notification-preferences/",
  );

  const saveMutation = useApiMutation<Preference[], { results: Preference[] }, Error>({
    mutationFn: async (items: Preference[]) =>
      (await api.put<{ results: Preference[] }>("/notification-preferences/", { items })).data,
  });

  const [draft, setDraft] = useState<Preference[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const baselineRef = useRef<Preference[]>([]);

  useEffect(() => {
    if (preferencesQuery.data) {
      const seen = new Set(preferencesQuery.data.results.map((p) => p.category));
      const merged: Preference[] = [...preferencesQuery.data.results];
      for (const category of FALLBACK_CATEGORIES) {
        if (!seen.has(category)) {
          merged.push({
            category,
            label: labelFor(category),
            enabled: true,
            email_digest: false,
          });
        }
      }
      setDraft(merged);
      baselineRef.current = merged.map((entry) => ({ ...entry }));
    }
  }, [preferencesQuery.data]);

  const update = (category: string, patch: Partial<Preference>) => {
    setSavedAt(null);
    setDraft((current) =>
      current.map((entry) =>
        entry.category === category ? { ...entry, ...patch } : entry,
      ),
    );
  };

  const save = async () => {
    setError(null);
    try {
      const result = await saveMutation.mutateAsync(draft);
      setSavedAt(new Date().toLocaleTimeString());
      if (result?.results) {
        setDraft(result.results);
        baselineRef.current = result.results.map((entry) => ({ ...entry }));
      }
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || "Could not save preferences");
    }
  };

  const muteAll = () => {
    setSavedAt(null);
    setDraft((current) => current.map((entry) => ({ ...entry, enabled: false })));
  };
  const enableAll = () => {
    setSavedAt(null);
    setDraft((current) => current.map((entry) => ({ ...entry, enabled: true })));
  };

  const isDirty = isDirtyDiff(baselineRef.current, draft);

  return (
    <section className="workspace notificationsWorkspace" aria-label="Notification preferences">
      <header className="workspaceHead">
        <div>
          <h1>Notification preferences</h1>
          <p className="workspaceSub">
            Choose which categories appear in your notification bell, and
            whether you want a daily email digest.
          </p>
        </div>
        <div className="workspaceHeadActions">
          <button type="button" className="btnSecondary" onClick={muteAll}>
            Mute all
          </button>
          <button type="button" className="btnSecondary" onClick={enableAll}>
            Enable all
          </button>
          <button
            type="button"
            className="loginSubmit"
            onClick={save}
            disabled={saveMutation.isPending || !isDirty}
          >
            {saveMutation.isPending ? "Saving…" : "Save preferences"}
          </button>
        </div>
      </header>

      {savedAt ? (
        <div className="backupBanner backupBannerInfo" role="status">
          Saved at {savedAt}.
        </div>
      ) : null}
      {error ? (
        <div className="formError" role="alert">
          {error}
        </div>
      ) : null}

      {preferencesQuery.isLoading ? (
        <div className="auditEmpty">Loading preferences…</div>
      ) : draft.length === 0 ? (
        <div className="auditEmpty">
          <strong>No notification categories yet.</strong>
          <small>
            Once your team starts sending notifications (new leads, payments,
            reminders, etc.) you can opt out of each category here.
          </small>
        </div>
      ) : (
        <div className="auditTableWrap">
          <table className="auditTable">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">In-app bell</th>
                <th scope="col">Daily email digest</th>
              </tr>
            </thead>
            <tbody>
              {draft.map((entry) => (
                <tr key={entry.category}>
                  <td>
                    <strong>{entry.label}</strong>
                    <div className="auditSource">{entry.category}</div>
                  </td>
                  <td>
                    <label className="preferencesSwitch">
                      <input
                        type="checkbox"
                        checked={entry.enabled}
                        onChange={(event) =>
                          update(entry.category, { enabled: event.target.checked })
                        }
                      />
                      <span>{entry.enabled ? "On" : "Off"}</span>
                    </label>
                  </td>
                  <td>
                    <label className="preferencesSwitch">
                      <input
                        type="checkbox"
                        checked={entry.email_digest}
                        onChange={(event) =>
                          update(entry.category, { email_digest: event.target.checked })
                        }
                      />
                      <span>{entry.email_digest ? "On" : "Off"}</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function isDirtyDiff(baseline: Preference[], draft: Preference[]): boolean {
  if (baseline.length !== draft.length) return true;
  for (let i = 0; i < baseline.length; i += 1) {
    const b = baseline[i];
    const d = draft[i];
    if (!b || !d) return true;
    if (b.enabled !== d.enabled || b.email_digest !== d.email_digest) return true;
  }
  return false;
}
