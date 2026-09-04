"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation } from "@/lib/query";

type ImportResponse = {
  imported: number;
  skipped: number;
  skipped_duplicates: number;
  skipped_invalid: number;
  dry_run: boolean;
  headers_detected: { header: string; field: string }[];
  headers_unmapped: string[];
  errors: { row: number; name: string; error: string }[];
};

type Stage = "idle" | "preview" | "done";

const downloadTemplate = async (format: "csv" | "xlsx") => {
  const response = await api.get(`/leads/import-template/?as=${format}`, {
    responseType: "blob",
  });
  const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Lenspire-Leads-Template.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function LeadImportWizard({
  open,
  onClose,
  onCompleted,
}: {
  open: boolean;
  onClose: () => void;
  onCompleted?: (result: ImportResponse) => void;
}) {
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const importMutation = useApiMutation<{ file: File; dry_run: boolean }, ImportResponse, Error>({
    mutationFn: async ({ file, dry_run }) => {
      const form = new FormData();
      form.append("file", file);
      if (dry_run) form.append("dry_run", "true");
      return (await api.post("/leads/import/", form)).data;
    },
  });

  useEffect(() => {
    if (open) {
      setStage("idle");
      setFile(null);
      setReport(null);
      setError(null);
      importMutation.reset();
    }
  }, [open, importMutation.reset]);

  const headerSummary = useMemo(() => {
    if (!report) return null;
    return {
      mapped: report.headers_detected.length,
      unmapped: report.headers_unmapped.length,
    };
  }, [report]);

  if (!open) return null;

  const run = async (dryRun: boolean) => {
    if (!file) {
      setError("Choose a CSV or Excel file to import.");
      return;
    }
    setError(null);
    try {
      const result = await importMutation.mutateAsync({ file, dry_run: dryRun });
      setReport(result);
      setStage("done");
      if (!dryRun) onCompleted?.(result);
    } catch (e: any) {
      setError(e.response?.data?.detail || e.message || "Import failed.");
    }
  };

  return (
    <div className="leadImportModal" role="dialog" aria-modal="true" aria-label="Import leads">
      <div className="modalContent leadImportCard">
        <div className="modalHeader">
          <div>
            <h2>Import leads</h2>
            <small>Upload a CSV or Excel file. We&apos;ll preview what will land before committing.</small>
          </div>
          <button
            type="button"
            className="modalClose"
            onClick={onClose}
            aria-label="Close import dialog"
          >
            ×
          </button>
        </div>
        <div className="modalBody leadImportBody">
          {stage === "idle" ? (
            <>
              <div className="leadImportSteps">
                <span className="leadImportStep active">1. Pick file</span>
                <span className="leadImportStep">2. Dry-run review</span>
                <span className="leadImportStep">3. Commit</span>
              </div>
              <label className="leadImportDrop">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls,text/csv"
                  onChange={(event) => {
                    const next = event.target.files?.[0];
                    setFile(next ?? null);
                    setError(null);
                    event.target.value = "";
                  }}
                />
                <div>
                  <strong>{file ? file.name : "Drop or pick a CSV / Excel file"}</strong>
                  <small>
                    {file
                      ? `${formatSize(file.size)} · ${file.type || "unknown type"}`
                      : "Up to ~10 MB recommended. The first row should be column headers."}
                  </small>
                </div>
              </label>
              {error ? <div className="formError">{error}</div> : null}
              <div className="leadImportActions">
                <div className="leadImportTemplates">
                  <span>Need a template?</span>
                  <button
                    type="button"
                    className="btnSecondary"
                    onClick={() => downloadTemplate("csv")}
                  >
                    CSV
                  </button>
                  <button
                    type="button"
                    className="btnSecondary"
                    onClick={() => downloadTemplate("xlsx")}
                  >
                    Excel
                  </button>
                </div>
                <div className="leadImportPrimaryActions">
                  <button
                    type="button"
                    className="loginSubmit"
                    disabled={!file || importMutation.isPending}
                    onClick={() => run(true)}
                  >
                    {importMutation.isPending ? "Analyzing…" : "Preview import"}
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {stage === "done" && report ? (
            <>
              <div className="leadImportReport">
                {report.dry_run ? (
                  <div className="leadImportBanner leadImportBannerInfo">
                    Dry-run only — nothing was saved. Review the report below and
                    commit when you&apos;re happy.
                  </div>
                ) : (
                  <div className="leadImportBanner leadImportBannerSuccess">
                    Import complete — {report.imported} leads added.
                  </div>
                )}
                <div className="leadImportStats">
                  <div>
                    <span>To import</span>
                    <strong>{report.imported}</strong>
                  </div>
                  <div>
                    <span>Skipped</span>
                    <strong>{report.skipped}</strong>
                  </div>
                  <div>
                    <span>Duplicates</span>
                    <strong>{report.skipped_duplicates}</strong>
                  </div>
                  <div>
                    <span>Invalid</span>
                    <strong>{report.skipped_invalid}</strong>
                  </div>
                </div>
                {headerSummary ? (
                  <div className="leadImportHeaderSummary">
                    <span>
                      {headerSummary.mapped} column
                      {headerSummary.mapped === 1 ? "" : "s"} mapped
                    </span>
                    {headerSummary.unmapped > 0 ? (
                      <span className="leadImportHeaderUnmapped">
                        {headerSummary.unmapped} unmapped:{" "}
                        {report.headers_unmapped.join(", ")}
                      </span>
                    ) : null}
                  </div>
                ) : null}
                {report.errors.length > 0 ? (
                  <div className="leadImportErrors">
                    <h3>Rows that need attention</h3>
                    <ol>
                      {report.errors.map((err) => (
                        <li key={`${err.row}-${err.error}`}>
                          <span className="leadImportRowNum">Row {err.row}</span>
                          <span className="leadImportRowName">{err.name}</span>
                          <span className="leadImportRowError">{err.error}</span>
                        </li>
                      ))}
                    </ol>
                    {report.skipped > report.errors.length ? (
                      <p className="leadImportMoreErrors">
                        + {report.skipped - report.errors.length} more rows skipped
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </>
          ) : null}
        </div>
        <div className="modalFooter">
          {stage === "done" && report?.dry_run ? (
            <>
              <button
                type="button"
                className="btnSecondary"
                onClick={() => {
                  setStage("idle");
                  setReport(null);
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="loginSubmit"
                disabled={!report || report.imported === 0 || importMutation.isPending}
                onClick={() => run(false)}
              >
                {importMutation.isPending ? "Importing…" : `Commit ${report?.imported ?? 0} leads`}
              </button>
            </>
          ) : (
            <button type="button" className="btnSecondary" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
