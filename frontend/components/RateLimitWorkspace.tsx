"use client";
import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation, useApiQuery, queryKeys } from "@/lib/query";

type BucketEntry = { key: string; count: number };
type Window = {
  total: number;
  by_path: BucketEntry[];
  by_ip: BucketEntry[];
  by_user: BucketEntry[];
  by_status: BucketEntry[];
};
type Event = {
  ts: number;
  path: string;
  method: string;
  status: number;
  ip: string;
  user: string | null;
};
type Metrics = {
  last_hour: Window;
  last_day: Window;
  recent: Event[];
  retention_seconds: number;
  now: number;
};

const formatTime = (ts: number, now: number) => {
  const diff = Math.max(0, now - ts);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86_400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86_400)}d ago`;
};

export default function RateLimitWorkspace() {
  const metricsQuery = useApiQuery<Metrics>(
    queryKeys.throttleMetrics(),
    "/admin/throttle-metrics/",
    { refetchInterval: 15_000 },
  );
  const [showRecent, setShowRecent] = useState(false);

  const clearMutation = useApiMutation<void, { detail: string }, Error>({
    mutationFn: async () =>
      (await api.delete<{ detail: string }>("/admin/throttle-metrics/")).data,
  });

  const data = metricsQuery.data;
  const lastHour = data?.last_hour;
  const lastDay = data?.last_day;

  const statusPills = useMemo(() => {
    return data?.last_day.by_status ?? [];
  }, [data]);

  return (
    <section className="workspace rateLimitWorkspace" aria-label="Rate-limit dashboard">
      <header className="workspaceHead">
        <div>
          <h1>Rate-limit dashboard</h1>
          <p className="workspaceSub">
            Throttle, auth-failure, and 401/403 events recorded by the API
            gateway. Data is kept for {Math.round((data?.retention_seconds ?? 0) / 3600)}h and
            refreshes every 15s.
          </p>
        </div>
        <div className="workspaceHeadActions">
          <button
            type="button"
            className="btnSecondary"
            onClick={() => metricsQuery.refetch()}
            disabled={metricsQuery.isFetching}
          >
            {metricsQuery.isFetching ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            className="btnSecondary"
            onClick={() => {
              if (confirm("Clear all throttle metrics?")) {
                clearMutation.mutate(undefined, {
                  onSuccess: () => metricsQuery.refetch(),
                });
              }
            }}
            disabled={clearMutation.isPending}
          >
            {clearMutation.isPending ? "Clearing…" : "Clear metrics"}
          </button>
        </div>
      </header>

      {clearMutation.isSuccess ? (
        <div className="backupBanner backupBannerInfo" role="status">
          Throttle metrics cleared.
        </div>
      ) : null}

      {metricsQuery.isLoading ? (
        <div className="auditEmpty">Loading throttle metrics…</div>
      ) : !data ? (
        <div className="auditEmpty">No data yet.</div>
      ) : (
        <>
          <div className="rateLimitStats">
            <div className="rateLimitStat">
              <span className="rateLimitStatLabel">Last hour</span>
              <strong>{lastHour?.total ?? 0}</strong>
              <small>events recorded</small>
            </div>
            <div className="rateLimitStat">
              <span className="rateLimitStatLabel">Last 24h</span>
              <strong>{lastDay?.total ?? 0}</strong>
              <small>events recorded</small>
            </div>
            <div className="rateLimitStat">
              <span className="rateLimitStatLabel">Status mix</span>
              <div className="rateLimitPills">
                {statusPills.length === 0 ? (
                  <span className="auditSource">no events</span>
                ) : (
                  statusPills.map((entry) => (
                    <span
                      key={entry.key}
                      className={`auditPill ${pillForStatus(entry.key)}`}
                    >
                      {entry.key} · {entry.count}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rateLimitGrid">
            <BucketCard
              title="Top paths (24h)"
              entries={lastDay?.by_path ?? []}
              empty="No paths hit recently."
            />
            <BucketCard
              title="Top IPs (24h)"
              entries={lastDay?.by_ip ?? []}
              empty="No client IPs recorded."
            />
            <BucketCard
              title="Top users (24h)"
              entries={lastDay?.by_user ?? []}
              empty="No authenticated users hit rate limits."
            />
            <BucketCard
              title="Top paths (last hour)"
              entries={lastHour?.by_path ?? []}
              empty="Quiet hour — no throttled requests."
            />
          </div>

          <div className="rateLimitRecent">
            <button
              type="button"
              className="btnSecondary"
              onClick={() => setShowRecent((value) => !value)}
            >
              {showRecent
                ? "Hide recent events"
                : `Show recent events (${data.recent.length})`}
            </button>
            {showRecent ? (
              <div className="auditTableWrap">
                <table className="auditTable">
                  <thead>
                    <tr>
                      <th scope="col">When</th>
                      <th scope="col">Status</th>
                      <th scope="col">Method</th>
                      <th scope="col">Path</th>
                      <th scope="col">IP</th>
                      <th scope="col">User</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recent.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="auditEmpty">
                          No events recorded.
                        </td>
                      </tr>
                    ) : (
                      data.recent.map((event, index) => (
                        <tr key={`${event.ts}-${index}`}>
                          <td>
                            <time dateTime={new Date(event.ts * 1000).toISOString()}>
                              {formatTime(event.ts, data.now)}
                            </time>
                          </td>
                          <td>
                            <span className={`auditPill ${pillForStatus(String(event.status))}`}>
                              {event.status}
                            </span>
                          </td>
                          <td>{event.method}</td>
                          <td className="rateLimitPath">{event.path}</td>
                          <td className="rateLimitMono">{event.ip}</td>
                          <td>{event.user || "anonymous"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}

function BucketCard({
  title,
  entries,
  empty,
}: {
  title: string;
  entries: BucketEntry[];
  empty: string;
}) {
  return (
    <div className="rateLimitBucket">
      <h2>{title}</h2>
      {entries.length === 0 ? (
        <div className="auditSource">{empty}</div>
      ) : (
        <ol>
          {entries.map((entry) => (
            <li key={entry.key}>
              <span className="rateLimitBucketKey">{entry.key}</span>
              <span className="rateLimitBucketCount">{entry.count}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function pillForStatus(status: string): string {
  if (status === "429") return "auditPillDanger";
  if (status === "403") return "auditPillInfo";
  if (status === "401") return "auditPillMuted";
  return "auditPillMuted";
}
