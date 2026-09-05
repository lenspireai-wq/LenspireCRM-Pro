"use client";
import { useMemo, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation, useApiQuery, queryKeys } from "@/lib/query";

type Backup = {
  filename: string;
  size_bytes: number;
  created_at: string;
  size_human: string;
};

type RestoreSummary = {
  total: number;
  by_app: Record<string, number>;
  backup_created_at: string;
  backup_format: string;
  backup_version: number;
  errors?: string[];
  dry_run?: boolean;
};

const formatDate = (value: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const downloadFile = async (filename: string) => {
  const response = await api.get(`/backups/download/${filename}/`, { responseType: "blob" });
  const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function BackupWorkspace() {
  const [restoreFilename, setRestoreFilename] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [dryRun, setDryRun] = useState(true);
  const [restoreSummary, setRestoreSummary] = useState<RestoreSummary | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  const backupsQuery = useApiQuery<{ results: Backup[] }>(
    queryKeys.backups(),
    "/backups/",
    { refetchInterval: 15_000 },
  );

  const createMutation = useApiMutation<unknown, Backup, Error>({
    mutationFn: async () => (await api.post("/backups/create/")).data,
    onSuccess: () => {
      setActionMessage("Backup created.");
      backupsQuery.refetch?.();
    },
  });

  const deleteMutation = useApiMutation<{ filename: string }, unknown, Error>({
    mutationFn: async ({ filename }) => (await api.delete(`/backups/${filename}/`)).data,
    onSuccess: (_data, variables) => {
      setActionMessage(`Deleted ${variables.filename}.`);
      backupsQuery.refetch?.();
    },
  });

  const uploadMutation = useApiMutation<File, Backup, Error>({
    mutationFn: async (file) => {
      const form = new FormData();
      form.append("file", file);
      return (await api.post("/backups/upload/", form, { headers: { "Content-Type": "multipart/form-data" } })).data;
    },
    onSuccess: (data) => {
      setActionMessage(`Uploaded ${data.filename}.`);
      backupsQuery.refetch?.();
    },
  });

  const restoreMutation = useApiMutation<
    { filename: string; confirmation: string; dry_run: boolean },
    { dry_run: boolean; summary: RestoreSummary; filename: string; warning?: string },
    Error
  >({
    mutationFn: async (variables) => (await api.post("/backups/restore/", variables)).data,
    onSuccess: (data) => {
      setRestoreSummary(data.summary);
      setRestoreError(null);
      if (data.warning) setActionMessage(data.warning);
    },
  });

  const backups = useMemo<Backup[]>(() => {
    const raw = backupsQuery.data;
    if (Array.isArray(raw)) return raw as Backup[];
    return (raw?.results ?? []) as Backup[];
  }, [backupsQuery.data]);

  const totalBytes = useMemo(
    () => backups.reduce((sum, entry) => sum + Number(entry.size_bytes || 0), 0),
    [backups],
  );
  const lastBackup = backups[0];

  const startRestore = (filename: string) => {
    setRestoreFilename(filename);
    setConfirmation("");
    setRestoreSummary(null);
    setRestoreError(null);
    setDryRun(true);
  };

  return (
    <section className="workspace backupWorkspace" aria-label="Backups">
      <header className="workspaceHead">
        <div>
          <h1>Backups</h1>
          <p className="workspaceSub">
            Encrypted snapshots of every record in your workspace. Create one
            before destructive changes, and store copies off-site.
          </p>
        </div>
        <div className="workspaceHeadActions">
          <button
            type="button"
            className="loginSubmit"
            disabled={createMutation.isPending}
            onClick={() => createMutation.mutate(undefined)}
          >
            {createMutation.isPending ? "Creating…" : "Create backup now"}
          </button>
          <button
            type="button"
            className="btnSecondary"
            onClick={() => fileInput.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading…" : "Upload backup"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            style={{ display: "none" }}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) uploadMutation.mutate(file);
              event.target.value = "";
            }}
          />
        </div>
      </header>

      {actionMessage ? (
        <div className="backupBanner backupBannerInfo" role="status">
          {actionMessage}
        </div>
      ) : null}

      <div className="backupSummary">
        <div className="auditSummaryCard">
          <span>Stored backups</span>
          <strong>{backups.length}</strong>
          <small>files on disk</small>
        </div>
        <div className="auditSummaryCard">
          <span>Total size</span>
          <strong>{(totalBytes / (1024 * 1024)).toFixed(1)} MB</strong>
          <small>encrypted</small>
        </div>
        <div className="auditSummaryCard">
          <span>Last backup</span>
          <strong>{lastBackup ? formatDate(lastBackup.created_at) : "Never"}</strong>
          <small>{lastBackup?.size_human ?? "—"}</small>
        </div>
        <div className="auditSummaryCard">
          <span>Encryption</span>
          <strong>AES-256-GCM</strong>
          <small>BACKUP_ENCRYPTION_KEY</small>
        </div>
      </div>

      {backupsQuery.isLoading ? (
        <div className="auditEmpty">Loading backups…</div>
      ) : backupsQuery.isError ? (
        <div className="auditEmpty">
          <strong>Could not load backups.</strong>
          <small>Check the API connection and try again.</small>
        </div>
      ) : backups.length === 0 ? (
        <div className="auditEmpty">
          <strong>No backups yet.</strong>
          <small>Click &quot;Create backup now&quot; to make your first snapshot.</small>
        </div>
      ) : (
        <div className="auditTableWrap">
          <table className="auditTable">
            <thead>
              <tr>
                <th scope="col">When</th>
                <th scope="col">File</th>
                <th scope="col">Size</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.filename}>
                  <td>
                    <time dateTime={backup.created_at}>{formatDate(backup.created_at)}</time>
                  </td>
                  <td className="auditDescription">
                    <code>{backup.filename}</code>
                  </td>
                  <td>{backup.size_human}</td>
                  <td>
                    <div className="backupActions">
                      <button
                        type="button"
                        className="btnSecondary"
                        onClick={() => downloadFile(backup.filename)}
                      >
                        Download
                      </button>
                      <button
                        type="button"
                        className="btnSecondary"
                        onClick={() => startRestore(backup.filename)}
                      >
                        Restore…
                      </button>
                      <button
                        type="button"
                        className="btnDanger"
                        onClick={() => {
                          if (confirm(`Delete ${backup.filename}? This cannot be undone.`)) {
                            deleteMutation.mutate({ filename: backup.filename });
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {restoreFilename ? (
        <div className="backupRestoreModal" role="dialog" aria-modal="true" aria-label="Restore backup">
          <div className="modalContent backupRestoreCard">
            <div className="modalHeader">
              <div>
                <h2>Restore {restoreFilename}</h2>
                <small>Run a dry-run first to see what will change.</small>
              </div>
              <button
                type="button"
                className="modalClose"
                onClick={() => setRestoreFilename(null)}
                aria-label="Close restore dialog"
              >
                ×
              </button>
            </div>
            <div className="modalBody">
              <label className="formField backupRestoreToggle">
                <input
                  type="checkbox"
                  checked={dryRun}
                  onChange={(event) => setDryRun(event.target.checked)}
                />
                <span>Dry run only (recommended)</span>
              </label>
              {!dryRun ? (
                <label className="formField">
                  <span>Type <code>RESTORE BACKUP</code> to confirm</span>
                  <input
                    type="text"
                    value={confirmation}
                    onChange={(event) => setConfirmation(event.target.value)}
                    placeholder="RESTORE BACKUP"
                  />
                </label>
              ) : null}
              {restoreError ? <div className="formError">{restoreError}</div> : null}
              {restoreSummary ? (
                <div className="backupRestoreSummary">
                  <h3>
                    {restoreSummary.dry_run ? "Dry-run summary" : "Restore complete"}
                  </h3>
                  <p>
                    {restoreSummary.total} records across{" "}
                    {Object.keys(restoreSummary.by_app).length} apps.
                  </p>
                  <ul>
                    {Object.entries(restoreSummary.by_app).map(([app, count]) => (
                      <li key={app}>
                        <code>{app}</code> <span>{count} records</span>
                      </li>
                    ))}
                  </ul>
                  {restoreSummary.errors?.length ? (
                    <div className="formError">
                      {restoreSummary.errors.length} record(s) failed:
                      <ul>
                        {restoreSummary.errors.slice(0, 5).map((err, index) => (
                          <li key={index}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
            <div className="modalFooter">
              <button
                type="button"
                className="btnSecondary"
                onClick={() => setRestoreFilename(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="loginSubmit"
                disabled={
                  restoreMutation.isPending ||
                  (!dryRun && confirmation !== "RESTORE BACKUP")
                }
                onClick={() =>
                  restoreMutation.mutate(
                    { filename: restoreFilename, confirmation: confirmation || "RESTORE BACKUP", dry_run: dryRun },
                    {
                      onError: (error: any) => {
                        setRestoreError(error.response?.data?.detail || error.message);
                      },
                    },
                  )
                }
              >
                {restoreMutation.isPending
                  ? dryRun
                    ? "Analyzing…"
                    : "Restoring…"
                  : dryRun
                    ? "Run dry run"
                    : "Restore now"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
