"use client";
import { useEffect, useRef, useState } from "react";
import { useApiMutation, useApiQuery, queryKeys } from "@/lib/query";
import { api } from "@/lib/api";

type Notification = {
  id: number;
  title: string;
  body: string;
  level: string;
  category: string;
  link: string;
  is_read: boolean;
  created_at: string;
};

type Summary = { unread: number; latest: Notification[] };

const LEVEL_COLORS: Record<string, string> = {
  info: "#0ea5e9",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

const formatRelative = (value: string) => {
  const date = new Date(value);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const { data, refetch } = useApiQuery<Summary>(
    ["notifications", "summary"],
    "/notifications/summary/",
    { refetchInterval: 30_000 },
  );

  const { data: list, refetch: refetchList } = useApiQuery<{ results: Notification[]; count: number }>(
    queryKeys.notifications(),
    "/notifications/?page_size=20",
    { enabled: open },
  );

  const markAll = useApiMutation<undefined, { updated: number }>({
    mutationFn: async () => (await api.post("/notifications/read-all/")).data,
    onSuccess: () => {
      refetch();
      refetchList();
    },
  });

  const markOne = useApiMutation<{ id: number }, Notification>({
    mutationFn: async ({ id }) => (await api.post(`/notifications/${id}/read/`)).data,
    onSuccess: () => {
      refetch();
      refetchList();
    },
  });

  const unread = data?.unread || 0;
  const items = list?.results || data?.latest || [];

  return (
    <div className="notifBell" ref={ref}>
      <button
        type="button"
        className="notifBellButton"
        onClick={() => setOpen((value) => !value)}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        aria-expanded={open}
      >
        🔔
        {unread > 0 ? <span className="notifBadge">{unread > 99 ? "99+" : unread}</span> : null}
      </button>
      {open ? (
        <div className="notifPanel" role="dialog" aria-label="Notifications inbox">
          <header>
            <strong>Notifications</strong>
            {unread > 0 ? (
              <button className="billBtn" onClick={() => markAll.mutate(undefined)} disabled={markAll.isPending}>
                {markAll.isPending ? "Marking…" : "Mark all read"}
              </button>
            ) : null}
          </header>
          <ul>
            {items.length === 0 ? <li className="notifEmpty">You&apos;re all caught up.</li> : null}
            {items.map((notification) => (
              <li key={notification.id} className={notification.is_read ? "read" : "unread"}>
                <div className="notifDot" style={{ background: LEVEL_COLORS[notification.level] || "#64748b" }} />
                <div className="notifBody">
                  <strong>{notification.title}</strong>
                  {notification.body ? <p>{notification.body}</p> : null}
                  <small>{formatRelative(notification.created_at)} · {notification.category}</small>
                </div>
                {!notification.is_read ? (
                  <button className="billBtn" onClick={() => markOne.mutate({ id: notification.id })}>Mark read</button>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
