"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/auth";
import { useApiMutation, useApiQuery, queryKeys, queryClient } from "@/lib/query";

type Row = Record<string, any>;
type View =
  "Dashboard" | "Edit Queue" | "My Work" | "Overdue" | "Activity History";
type Filters = {
  search: string;
  editor: string;
  stage: string;
  status: string;
  dueFrom: string;
  dueTo: string;
  activityType: string;
};

const emptyFilters: Filters = {
  search: "",
  editor: "",
  stage: "",
  status: "",
  dueFrom: "",
  dueTo: "",
  activityType: "",
};

const views: View[] = [
  "Dashboard",
  "Edit Queue",
  "Overdue",
  "Activity History",
];
const deliverableNames = [
  "Raw Photos",
  "Photo Retouching",
  "Reels",
  "Teaser",
  "Cinematic Highlight",
  "Full Length Video",
  "Wedding Album",
];
const defaultEnabledDeliverables = new Set([
  "Raw Photos",
  "Reels",
  "Teaser",
  "Cinematic Highlight",
  "Full Length Video",
  "Wedding Album",
]);
const deliverableStatuses = [
  "Unassigned",
  "Assigned",
  "In Progress",
  "Submitted for Review",
  "Revision Required",
  "Approved",
  "Sent to Client",
  "Client Changes",
  "Client Approved",
];
const priorities = ["Normal", "High", "Urgent"];
const workflowDeliverables = (job: Row) => {
  const existing = new Map<string, Row>(
    (job.deliverables || []).map((item: Row) => [item.name, item]),
  );
  return deliverableNames.map((name) => ({
    id: existing.get(name)?.id,
    name,
    enabled:
      existing.get(name)?.enabled ?? defaultEnabledDeliverables.has(name),
    quantity: existing.get(name)?.quantity ?? 1,
    events: existing.get(name)?.events || "",
    editor: existing.get(name)?.editor || "",
    editor_name: existing.get(name)?.editor_name || "",
    due_date: existing.get(name)?.due_date || "",
    priority: existing.get(name)?.priority || "Normal",
    status: existing.get(name)?.status || "Unassigned",
    drive_link: existing.get(name)?.drive_link || "",
    revision_notes: existing.get(name)?.revision_notes || "",
    revision_count: existing.get(name)?.revision_count || 0,
  }));
};
const stages = [
  "Shoot Planning",
  "Raw Data",
  "Editing",
  "Album",
  "Quality Check",
  "Ready for Delivery",
  "Delivered",
];
const activityTypes = [
  "Stage Change",
  "Editor Assignment",
  "Raw Data Status",
  "Editing Status",
  "Album Status",
  "Video Status",
  "Client Approval",
  "Delivery Status",
  "Photo Delivery",
  "Video Delivery",
  "Album Delivery",
  "Overdue Reminder",
];
const dateLabel = (value?: string) =>
  value
    ? new Date(`${value.slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const editorStatusMessage = (status: string) =>
  ({
    "Submitted for Review": "Waiting for Production Head review",
    Approved: "Approved by Production Head",
    "Sent to Client": "Waiting for client decision",
    "Client Approved": "Work completed and accepted",
  })[status] || "";

const enabledDeliverables = (job: Row) =>
  (job.deliverables || []).filter((item: Row) => item.enabled);

const workflowStatus = (job: Row) => {
  const tasks = enabledDeliverables(job);
  if (!tasks.length || tasks.every((task: Row) => !task.editor))
    return "Awaiting Assignment";
  if (
    tasks.some((task: Row) =>
      ["Revision Required", "Client Changes"].includes(task.status),
    )
  )
    return "Revision Required";
  if (tasks.every((task: Row) => task.status === "Client Approved"))
    return "Client Approved";
  if (tasks.some((task: Row) => task.status === "Sent to Client"))
    return "Client Review";
  if (tasks.some((task: Row) => task.status === "Submitted for Review"))
    return "Under Review";
  if (tasks.some((task: Row) => task.status === "In Progress"))
    return "In Progress";
  return "Assigned";
};

const workflowEditors = (job: Row) => {
  const names = enabledDeliverables(job)
    .map((item: Row) => item.editor_name)
    .filter(Boolean);
  return [...new Set<string>(names)].join(", ") || "Unassigned";
};

const workflowDueDate = (job: Row) => {
  const dates = enabledDeliverables(job)
    .map((item: Row) => item.due_date)
    .filter(Boolean)
    .sort();
  return dates[0] || "";
};

export default function ProductionWorkspace({
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const user = useAuthStore((state) => state.user);
  const isEditor = user?.role?.trim().toLowerCase() === "editor";
  const [view, setView] = useState<View>("Dashboard");
  const [draft, setDraft] = useState<Row | null>(null);
  const [editors, setEditors] = useState<Row[]>([]);
  const [reminderJob, setReminderJob] = useState<Row | null>(null);
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const availableViews: View[] = isEditor ? ["My Work"] : views;
  useEffect(() => {
    if (isEditor) setView("My Work");
  }, [isEditor]);

  const productionQuery = useApiQuery<{ results: Row[]; count: number }>(
    queryKeys.production({ isEditor }),
    `/production/?page_size=200&ordering=due_date,id`,
  );
  const bookingsQuery = useApiQuery<{ results: Row[] }>(
    queryKeys.bookings(),
    "/bookings/?page_size=500&ordering=-event_date",
  );
  const customersQuery = useApiQuery<{ results: Row[] }>(
    queryKeys.customers(),
    "/customers/?page_size=500",
  );
  const activitiesQuery = useApiQuery<Row[]>(
    queryKeys.events({ scope: "production-activities" }),
    "/production/activity-history/",
  );

  const saveJobMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) => (await api.patch(url, payload)).data,
  });
  const updateDeliverableMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) => (await api.patch(url, payload)).data,
  });

  useEffect(() => {
    api
      .get("/production/editors/")
      .then(({ data }) => setEditors(data))
      .catch(() => setEditors([]));
  }, []);

  const invalidateProductionQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.production() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.events({ scope: "production-activities" }) }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
  };

  const jobs = useMemo<Row[]>(() => {
    const production = productionQuery.data?.results || [];
    const bookings = bookingsQuery.data?.results || [];
    const customers = customersQuery.data?.results || [];
    return production.map((job) => {
      const booking = bookings.find((item) => item.id === job.booking);
      const customer = customers.find((item) => item.id === job.customer);
      return {
        ...job,
        booking_code: job.booking_code || booking?.booking_code,
        client_name: job.client_name || customer?.name,
        event_type: job.event_type || booking?.event_type,
        event_date: job.event_date || booking?.event_date,
        overdue:
          job.delivery_status !== "Delivered" &&
          Boolean(job.due_date) &&
          job.due_date < today,
      } as Row;
    });
  }, [productionQuery.data, bookingsQuery.data, customersQuery.data, today]);
  const filteredJobs = useMemo(
    () =>
      jobs.filter((job) => {
        const haystack = [
          job.client_name,
          job.booking_code,
          job.event_type,
          job.editor_name,
        ]
          .join(" ")
          .toLowerCase();
        const matchesStatus =
          !filters.status ||
          (filters.status === "active" &&
            job.delivery_status !== "Delivered") ||
          (filters.status === "overdue" && job.overdue) ||
          (filters.status === "delivered" &&
            job.delivery_status === "Delivered") ||
          (filters.status === "unassigned" && !job.editor);
        return (
          haystack.includes(filters.search.trim().toLowerCase()) &&
          (!filters.editor || String(job.editor) === filters.editor) &&
          (!filters.stage || job.stage === filters.stage) &&
          matchesStatus &&
          (!filters.dueFrom || job.due_date >= filters.dueFrom) &&
          (!filters.dueTo || job.due_date <= filters.dueTo)
        );
      }),
    [jobs, filters],
  );
  const active = filteredJobs.filter(
    (job) => job.delivery_status !== "Delivered",
  );
  const overdue = filteredJobs.filter((job) => job.overdue);
  const delivered = filteredJobs.filter(
    (job) => job.delivery_status === "Delivered",
  );
  const pendingApproval = active.filter(
    (job) => job.client_approval_status !== "Approved",
  );
  const readyForDelivery = active.filter(
    (job) =>
      job.delivery_status === "Ready" || job.stage === "Ready for Delivery",
  );
  const activities = activitiesQuery.data || [];
  const filteredActivities = useMemo(
    () =>
      activities.filter((activity) => {
        const haystack = [
          activity.client_name,
          activity.booking_code,
          activity.event_type,
          activity.editor_name,
          activity.performed_by,
          activity.description,
        ]
          .join(" ")
          .toLowerCase();
        return (
          haystack.includes(filters.search.trim().toLowerCase()) &&
          (!filters.editor || String(activity.editor_id) === filters.editor) &&
          (!filters.activityType ||
            activity.activity_type === filters.activityType) &&
          (!filters.dueFrom || activity.activity_date >= filters.dueFrom) &&
          (!filters.dueTo || activity.activity_date <= filters.dueTo)
        );
      }),
    [activities, filters],
  );

  const changeFilter = (name: keyof Filters, value: string) =>
    setFilters((current) => ({ ...current, [name]: value }));
  const exportExcel = async () => {
    setExporting(true);
    setError("");
    try {
      const activityView = view === "Activity History";
      const params = {
        search: filters.search || undefined,
        editor: filters.editor || undefined,
        stage: !activityView ? filters.stage || undefined : undefined,
        status: !activityView ? filters.status || undefined : undefined,
        due_from: !activityView ? filters.dueFrom || undefined : undefined,
        due_to: !activityView ? filters.dueTo || undefined : undefined,
        activity_type: activityView
          ? filters.activityType || undefined
          : undefined,
        date_from: activityView ? filters.dueFrom || undefined : undefined,
        date_to: activityView ? filters.dueTo || undefined : undefined,
      };
      const response = await api.get(
        activityView ? "/production/activity-export/" : "/production/export/",
        {
          params,
          responseType: "blob",
        },
      );
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${activityView ? "production-activity-history" : "production-jobs"}-${today}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError(
        view === "Activity History"
          ? "Could not export the activity history."
          : "Could not export the production jobs.",
      );
    } finally {
      setExporting(false);
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const tasks = draft?.deliverables || [];
    const assignedEditor = tasks.find(
      (item: Row) => item.enabled && item.editor,
    )?.editor;
    const dueDates = tasks
      .filter((item: Row) => item.enabled && item.due_date)
      .map((item: Row) => item.due_date)
      .sort();
    const statuses = tasks
      .filter((item: Row) => item.enabled)
      .map((item: Row) => item.status);
    const stage =
      statuses.length &&
      statuses.every((status: string) => status === "Client Approved")
        ? "Ready for Delivery"
        : statuses.some((status: string) => status === "Submitted for Review")
          ? "Quality Check"
          : assignedEditor
            ? "Editing"
            : "Shoot Planning";
    try {
      await saveJobMutation.mutateAsync({
        url: `/production/${draft?.id}/`,
        payload: {
          stage,
          due_date: dueDates[0] || null,
          editor: assignedEditor || null,
          deliverables: tasks.map((item: Row) => ({
            id: item.id,
            name: item.name,
            enabled: Boolean(item.enabled),
            quantity: Number(item.quantity || 0),
            events: item.events || "",
            editor: item.enabled && item.editor ? item.editor : null,
            due_date: item.enabled && item.due_date ? item.due_date : null,
            priority: item.priority || "Normal",
            status:
              item.enabled && item.editor
                ? item.status === "Unassigned"
                  ? "Assigned"
                  : item.status
                : "Unassigned",
            drive_link: item.drive_link || "",
            revision_notes: item.revision_notes || "",
            revision_count: Number(item.revision_count || 0),
          })),
        },
      });
      setDraft(null);
    } catch (problem: any) {
      setError(
        Object.values(problem.response?.data || {})
          .flat()
          .join(" · ") || "Could not update production job.",
      );
    } finally {
      setSaving(false);
    }
  };
  const openWorkflow = (job: Row) =>
    setDraft({ ...job, deliverables: workflowDeliverables(job) });
  const updateDeliverable = (index: number, updates: Row) =>
    setDraft((current) => {
      if (!current) return current;
      const deliverables = [...current.deliverables];
      deliverables[index] = { ...deliverables[index], ...updates };
      return { ...current, deliverables };
    });
  const updateMyTask = async (
    job: Row,
    task: Row,
    status: "In Progress" | "Submitted for Review",
  ) => {
    setError("");
    if (status === "Submitted for Review" && !task.drive_link?.trim()) {
      setError("Paste the completed-work link before submitting for review.");
      return;
    }
    try {
      await updateDeliverableMutation.mutateAsync({
        url: `/production/${job.id}/deliverables/${task.id}/`,
        payload: { status, drive_link: task.drive_link || "" },
      });
    } catch (problem: any) {
      setError(
        Object.values(problem.response?.data || {})
          .flat()
          .join(" · ") || "Could not update assigned work.",
      );
    }
  };

  return (
    <div className="productionWorkspace">
      <header className="productionHeader">
        <div>
          <small>PRODUCTION</small>
          <h1>{isEditor ? "Work Assigned" : view}</h1>
          <p>
            {isEditor
              ? `${user?.display_name || user?.username} workspace`
              : "Track every confirmed booking from shoot planning to delivery."}
          </p>
        </div>
      </header>
      {!isEditor && (
        <nav className="operationsTabs" aria-label="Production views">
          {availableViews.map((item) => (
            <button
              key={item}
              className={view === item ? "active" : ""}
              onClick={() => setView(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      )}
      {!isEditor && (
        <section
          className={`productionTools ${view === "Activity History" ? "activityHistoryTools" : ""}`}
        >
          <div className="productionFilters">
            <label className="productionSearch">
              <span>Search</span>
              <input
                value={filters.search}
                onChange={(event) => changeFilter("search", event.target.value)}
                placeholder="Client, booking, event or editor"
              />
            </label>
            <label>
              <span>Editor</span>
              <select
                value={filters.editor}
                onChange={(event) => changeFilter("editor", event.target.value)}
              >
                <option value="">All Editors</option>
                {editors.map((editor) => (
                  <option key={editor.id} value={editor.id}>
                    {editor.name}
                  </option>
                ))}
              </select>
            </label>
            {view === "Activity History" ? (
              <label>
                <span>Activity Type</span>
                <select
                  value={filters.activityType}
                  onChange={(event) =>
                    changeFilter("activityType", event.target.value)
                  }
                >
                  <option value="">All Activity</option>
                  {activityTypes.map((activityType) => (
                    <option key={activityType}>{activityType}</option>
                  ))}
                </select>
              </label>
            ) : (
              <>
                <label>
                  <span>Stage</span>
                  <select
                    value={filters.stage}
                    onChange={(event) =>
                      changeFilter("stage", event.target.value)
                    }
                  >
                    <option value="">All Stages</option>
                    {stages.map((stage) => (
                      <option key={stage}>{stage}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span>Status</span>
                  <select
                    value={filters.status}
                    onChange={(event) =>
                      changeFilter("status", event.target.value)
                    }
                  >
                    <option value="">All Jobs</option>
                    <option value="active">Active</option>
                    <option value="overdue">Overdue</option>
                    <option value="delivered">Delivered</option>
                    <option value="unassigned">Unassigned</option>
                  </select>
                </label>
              </>
            )}
            <label>
              <span>
                {view === "Activity History" ? "Activity From" : "Due From"}
              </span>
              <input
                type="date"
                value={filters.dueFrom}
                onChange={(event) =>
                  changeFilter("dueFrom", event.target.value)
                }
              />
            </label>
            <label>
              <span>
                {view === "Activity History" ? "Activity To" : "Due To"}
              </span>
              <input
                type="date"
                value={filters.dueTo}
                onChange={(event) => changeFilter("dueTo", event.target.value)}
              />
            </label>
          </div>
          <div className="productionToolActions">
            <span>
              {view === "Activity History"
                ? `${filteredActivities.length} activities`
                : `${filteredJobs.length} jobs`}
            </span>
            <button
              className="iconOnlyAction clearAction"
              title="Clear filters"
              aria-label="Clear filters"
              onClick={() => setFilters(emptyFilters)}
            >
              ↺
            </button>
            <button
              className="primary iconOnlyAction exportAction"
              title="Export Excel"
              aria-label="Export Excel"
              disabled={exporting}
              onClick={exportExcel}
            >
              {exporting ? "…" : "⇩"}
            </button>
          </div>
        </section>
      )}
      {error && !draft && (
        <p className="formError productionPageError">{error}</p>
      )}

      {view === "Dashboard" && (
        <>
          <section className="productionAlerts">
            <button onClick={() => setView("Overdue")}>
              <span>Overdue jobs requiring attention</span>
              <b>{jobs.filter((job) => job.overdue).length}</b>
            </button>
            <button
              onClick={() => {
                changeFilter("status", "unassigned");
                setView("Dashboard");
              }}
            >
              <span>Jobs waiting for editor assignment</span>
              <b>{jobs.filter((job) => !job.editor).length}</b>
            </button>
          </section>
          <section className="accountMetrics productionMetrics">
            <article>
              <span>Total Jobs</span>
              <strong>{jobs.length}</strong>
            </article>
            <article>
              <span>Active</span>
              <strong>{active.length}</strong>
            </article>
            <article>
              <span>Overdue</span>
              <strong>{overdue.length}</strong>
            </article>
            <article>
              <span>Delivered</span>
              <strong>{delivered.length}</strong>
            </article>
            <article>
              <span>Pending Approval</span>
              <strong>{pendingApproval.length}</strong>
            </article>
            <article>
              <span>Ready for Delivery</span>
              <strong>{readyForDelivery.length}</strong>
            </article>
          </section>
          <section className="panel">
            <div className="panelHead">
              <h2>Active Production Jobs</h2>
            </div>
            <ProductionTable
              jobs={active.slice(0, 10)}
              edit={readOnly ? undefined : openWorkflow}
              remind={readOnly ? undefined : setReminderJob}
            />
          </section>
        </>
      )}

      {view === "Edit Queue" && (
        <section className="panel">
          <div className="panelHead">
            <div>
              <h2>Edit Queue</h2>
              <p>Open a workflow and assign every committed deliverable.</p>
            </div>
          </div>
          <EditQueueTable
            jobs={filteredJobs}
            edit={readOnly ? undefined : openWorkflow}
          />
        </section>
      )}

      {view === "My Work" && (
        <section className="myProductionWork">
          {error && <p className="formError productionPageError">{error}</p>}
          <div className="myProductionTaskGrid">
            {jobs.flatMap((job) =>
              (job.deliverables || [])
                .filter((task: Row) => task.editor === user?.id && task.enabled)
                .map((task: Row) => (
                  <article
                    key={`${job.id}-${task.id}`}
                    className="myProductionTask"
                  >
                    <header>
                      <div>
                        <h3>{job.client_name}</h3>
                        <p>{job.event_type}</p>
                      </div>
                      <div className="taskBadges">
                        <span
                          className={`taskPriority ${task.priority?.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>
                        <span className="taskStatus">{task.status}</span>
                      </div>
                    </header>
                    <div className="myProductionTaskBody">
                      <div className="assignedTaskDetails">
                        <span>
                          <small>Deliverable</small>
                          <b>{task.name}</b>
                        </span>
                        <span>
                          <small>Quantity</small>
                          <b>{task.quantity}</b>
                        </span>
                        <span>
                          <small>Events / Parts</small>
                          <b>{task.events || "Not specified"}</b>
                        </span>
                        <span>
                          <small>Due Date</small>
                          <b>{dateLabel(task.due_date)}</b>
                        </span>
                      </div>
                      {task.revision_notes && (
                        <p className="taskRevisionNote">
                          <b>Revision:</b> {task.revision_notes}
                        </p>
                      )}
                      <label>
                        Drive Link
                        <input
                          type="url"
                          value={task.drive_link || ""}
                          placeholder="https://drive.google.com/..."
                          onChange={(event) => {
                            task.drive_link = event.target.value;
                            setError("");
                          }}
                        />
                      </label>
                    </div>
                    <footer>
                      <button
                        disabled={
                          ![
                            "Assigned",
                            "Revision Required",
                            "Client Changes",
                          ].includes(task.status)
                        }
                        onClick={() =>
                          void updateMyTask(job, task, "In Progress")
                        }
                      >
                        Start Work
                      </button>
                      <button
                        className="primary"
                        disabled={task.status !== "In Progress"}
                        onClick={() =>
                          void updateMyTask(job, task, "Submitted for Review")
                        }
                      >
                        Submit for Review
                      </button>
                      {editorStatusMessage(task.status) && (
                        <small>{editorStatusMessage(task.status)}</small>
                      )}
                    </footer>
                  </article>
                )),
            )}
          </div>
          {!jobs.some((job) =>
            (job.deliverables || []).some(
              (task: Row) => task.editor === user?.id && task.enabled,
            ),
          ) && (
            <div className="empty">No work is currently assigned to you.</div>
          )}
        </section>
      )}

      {view === "Overdue" && (
        <section className="panel">
          <ProductionTable
            jobs={overdue}
            edit={readOnly ? undefined : openWorkflow}
            remind={readOnly ? undefined : setReminderJob}
          />
        </section>
      )}

      {view === "Activity History" && (
        <section className="panel activityHistoryPanel">
          <div className="panelHead">
            <div>
              <h2>Production Activity History</h2>
              <p>Complete record of job updates and overdue reminders.</p>
            </div>
          </div>
          <ActivityTable activities={filteredActivities} />
        </section>
      )}

      {draft && (
        <div className="modalBackdrop">
          <form className="accountModal productionModal" onSubmit={save}>
            <div className="modalHeader">
              <div>
                <small>PRODUCTION JOB</small>
                <h2>{draft.client_name || draft.booking_code}</h2>
                <p>
                  {draft.event_type} · Event {dateLabel(draft.event_date)}
                </p>
              </div>
              <button type="button" onClick={() => setDraft(null)}>
                ×
              </button>
            </div>
            <section className="productionWorkflowEditor">
              <div className="productionWorkflowIntro">
                <div>
                  <h3>Deliverable Workflow</h3>
                  <p>
                    Enable committed work, select its editor, priority and
                    deadline.
                  </p>
                </div>
                <b>
                  {
                    (draft.deliverables || []).filter(
                      (item: Row) => item.enabled,
                    ).length
                  }{" "}
                  deliverables
                </b>
              </div>
              <div className="productionDeliverableGrid">
                {(draft.deliverables || []).map((item: Row, index: number) => (
                  <article
                    key={item.name}
                    className={item.enabled ? "" : "disabled"}
                  >
                    <header>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(item.enabled)}
                          onChange={(event) =>
                            updateDeliverable(index, {
                              enabled: event.target.checked,
                              status: event.target.checked
                                ? item.status
                                : "Unassigned",
                              editor: event.target.checked ? item.editor : "",
                            })
                          }
                        />
                        <b>{item.name}</b>
                      </label>
                      <span
                        className={`productionActivityType deliverableStatus ${String(item.status).toLowerCase().replaceAll(" ", "-")}`}
                      >
                        {item.status}
                      </span>
                    </header>
                    <div>
                      <label>
                        Quantity
                        <input
                          type="number"
                          min="0"
                          value={item.quantity}
                          disabled={!item.enabled}
                          onChange={(event) =>
                            updateDeliverable(index, {
                              quantity: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Events / Parts
                        <input
                          value={item.events}
                          disabled={!item.enabled}
                          placeholder="Haldi, Sangeet, Wedding"
                          onChange={(event) =>
                            updateDeliverable(index, {
                              events: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Assign Editor / Post Production
                        <select
                          value={item.editor || ""}
                          disabled={!item.enabled}
                          onChange={(event) =>
                            updateDeliverable(index, {
                              editor: event.target.value,
                              status: event.target.value
                                ? item.status === "Unassigned"
                                  ? "Assigned"
                                  : item.status
                                : "Unassigned",
                            })
                          }
                        >
                          <option value="">Unassigned</option>
                          {editors.map((editor) => (
                            <option key={editor.id} value={editor.id}>
                              {editor.name} · {editor.role}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Priority
                        <select
                          value={item.priority}
                          disabled={!item.enabled}
                          onChange={(event) =>
                            updateDeliverable(index, {
                              priority: event.target.value,
                            })
                          }
                        >
                          {priorities.map((priority) => (
                            <option key={priority}>{priority}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        Due Date
                        <input
                          type="date"
                          value={item.due_date}
                          disabled={!item.enabled}
                          onChange={(event) =>
                            updateDeliverable(index, {
                              due_date: event.target.value,
                            })
                          }
                        />
                      </label>
                      <label>
                        Workflow Status
                        <select
                          value={item.status}
                          disabled={!item.enabled}
                          onChange={(event) =>
                            updateDeliverable(index, {
                              status: event.target.value,
                            })
                          }
                        >
                          {deliverableStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                      <label className="wide">
                        Revision Instructions
                        <textarea
                          rows={2}
                          value={item.revision_notes}
                          disabled={!item.enabled}
                          onChange={(event) =>
                            updateDeliverable(index, {
                              revision_notes: event.target.value,
                            })
                          }
                        />
                      </label>
                      {item.drive_link && (
                        <a
                          className="wide"
                          href={item.drive_link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Open submitted work ↗
                        </a>
                      )}
                      {item.enabled &&
                        item.status === "Submitted for Review" && (
                          <div className="deliverableReviewActions wide">
                            <button
                              type="button"
                              className="approve"
                              onClick={() =>
                                updateDeliverable(index, { status: "Approved" })
                              }
                            >
                              ✓ Approved
                            </button>
                            <button
                              type="button"
                              className="revision"
                              disabled={!item.revision_notes?.trim()}
                              title={
                                item.revision_notes?.trim()
                                  ? "Return work to editor"
                                  : "Add revision instructions first"
                              }
                              onClick={() =>
                                updateDeliverable(index, {
                                  status: "Revision Required",
                                })
                              }
                            >
                              ↺ Revision Required
                            </button>
                          </div>
                        )}
                      {item.enabled && item.status === "Approved" && (
                        <div className="deliverableReviewActions wide">
                          <button
                            type="button"
                            className="client"
                            onClick={() =>
                              updateDeliverable(index, {
                                status: "Sent to Client",
                              })
                            }
                          >
                            ➤ Sent to Client
                          </button>
                        </div>
                      )}
                      {item.enabled && item.status === "Sent to Client" && (
                        <div className="deliverableReviewActions wide">
                          <button
                            type="button"
                            className="approve"
                            onClick={() =>
                              updateDeliverable(index, {
                                status: "Client Approved",
                              })
                            }
                          >
                            ✓ Client Approved
                          </button>
                          <button
                            type="button"
                            className="revision"
                            disabled={!item.revision_notes?.trim()}
                            title={
                              item.revision_notes?.trim()
                                ? "Return client changes to editor"
                                : "Add client change instructions first"
                            }
                            onClick={() =>
                              updateDeliverable(index, {
                                status: "Client Changes",
                              })
                            }
                          >
                            ↺ Client Changes
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section className="productionTimeline">
              <h3>Activity History</h3>
              {(draft.activities || []).map((activity: Row) => (
                <article key={activity.id}>
                  <i />
                  <div>
                    <b>{activity.activity_type}</b>
                    <p>{activity.description}</p>
                    <small>
                      {activity.performed_by} ·{" "}
                      {dateLabel(activity.activity_date)}
                    </small>
                  </div>
                </article>
              ))}
              {!draft.activities?.length && (
                <p>No production activity recorded yet.</p>
              )}
            </section>
            {error && <p className="formError">{error}</p>}
            <div className="modalFooter">
              <button
                type="button"
                className="workflowCancelButton"
                onClick={() => setDraft(null)}
              >
                Cancel
              </button>
              <button className="primary workflowSaveButton" disabled={saving}>
                {saving ? "Saving…" : "Save Job"}
              </button>
            </div>
          </form>
        </div>
      )}
      {reminderJob && (
        <ProductionReminder
          job={reminderJob}
          close={() => setReminderJob(null)}
          onLogged={async () => {
            await invalidateProductionQueries();
          }}
        />
      )}
    </div>
  );
}

function EditQueueTable({
  jobs,
  edit,
}: {
  jobs: Row[];
  edit?: (job: Row) => void;
}) {
  return (
    <div className="table">
      <table className="editQueueTable">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Couple Name</th>
            <th>Event &amp; Date</th>
            <th>Workflow</th>
            <th>Editors</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => {
            const status = workflowStatus(job);
            return (
              <tr key={job.id}>
                <td>{index + 1}</td>
                <td>
                  <b>{job.couple_name || job.client_name || "—"}</b>
                </td>
                <td>
                  <div className="editQueueEvent">
                    <b>{job.event_type || "—"}</b>
                    <small>{dateLabel(job.event_date)}</small>
                  </div>
                </td>
                <td>
                  <span
                    className={`workflowBadge ${status.toLowerCase().replaceAll(" ", "-")}`}
                  >
                    {status}
                  </span>
                </td>
                <td>{workflowEditors(job)}</td>
                <td>{dateLabel(workflowDueDate(job))}</td>
                <td>
                  {edit ? (
                    <button
                      className="openWorkflowAction"
                      onClick={() => edit(job)}
                    >
                      Open Workflow
                    </button>
                  ) : (
                    <small>View only</small>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!jobs.length && <div className="empty">No production jobs found.</div>}
    </div>
  );
}

function ProductionTable({
  jobs,
  edit,
  remind,
}: {
  jobs: Row[];
  edit?: (job: Row) => void;
  remind?: (job: Row) => void;
}) {
  return (
    <div className="table">
      <table className="productionTable">
        <thead>
          <tr>
            <th>Client</th>
            <th>Booking</th>
            <th>Event</th>
            <th>Editor</th>
            <th>Stage</th>
            <th>Editing</th>
            <th>Album</th>
            <th>Video</th>
            <th>Due Date</th>
            <th>Approval</th>
            <th>Delivery</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              className={job.overdue ? "productionOverdueRow" : ""}
            >
              <td>
                <b>{job.client_name || "—"}</b>
              </td>
              <td>{job.booking_code || "—"}</td>
              <td>{job.event_type || "—"}</td>
              <td>{job.editor_name || "Unassigned"}</td>
              <td>
                <span className="productionStatus">{job.stage}</span>
              </td>
              <td>{job.editing_status}</td>
              <td>{job.album_status}</td>
              <td>{job.video_status}</td>
              <td>{dateLabel(job.due_date)}</td>
              <td>{job.client_approval_status || "Pending"}</td>
              <td>{job.delivery_status}</td>
              <td>
                <div className="productionRowActions">
                  {job.overdue && remind && (
                    <button
                      className="reminderAction"
                      title="Send reminder"
                      aria-label="Send reminder"
                      onClick={() => remind(job)}
                    >
                      ◷
                    </button>
                  )}
                  {edit && (
                    <button
                      className="editAction"
                      title="Open workflow"
                      aria-label="Open workflow"
                      onClick={() => edit(job)}
                    >
                      ✎
                    </button>
                  )}
                  {!edit && !remind && <small>View only</small>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!jobs.length && <div className="empty">No production jobs found.</div>}
    </div>
  );
}

function ActivityTable({ activities }: { activities: Row[] }) {
  return (
    <div className="table">
      <table className="productionActivityTable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client</th>
            <th>Booking</th>
            <th>Event</th>
            <th>Activity Type</th>
            <th>Description</th>
            <th>Performed By</th>
            <th>Current Editor</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => (
            <tr
              key={activity.id}
              className={
                activity.activity_type === "Overdue Reminder"
                  ? "productionReminderRow"
                  : ""
              }
            >
              <td>{dateLabel(activity.activity_date)}</td>
              <td>
                <b>{activity.client_name || "—"}</b>
              </td>
              <td>{activity.booking_code || "—"}</td>
              <td>{activity.event_type || "—"}</td>
              <td>
                <span className="productionActivityType">
                  {activity.activity_type}
                </span>
              </td>
              <td>{activity.description}</td>
              <td>{activity.performed_by || "—"}</td>
              <td>{activity.editor_name || "Unassigned"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!activities.length && (
        <div className="empty">
          No production activity matches these filters.
        </div>
      )}
    </div>
  );
}

function ProductionReminder({
  job,
  close,
  onLogged,
}: {
  job: Row;
  close: () => void;
  onLogged: () => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const [recording, setRecording] = useState(false);
  const [error, setError] = useState("");
  const digits = String(job.editor_mobile || "").replace(/\D/g, "");
  const phone = digits.length === 10 ? `91${digits}` : digits;
  const message = `Production Follow-up

Client: ${job.client_name || "—"}
Booking: ${job.booking_code || "—"}
Event: ${job.event_type || "—"}
Assigned Editor: ${job.editor_name || "Unassigned"}
Current Stage: ${job.stage}
Due Date: ${dateLabel(job.due_date)}
Editing Status: ${job.editing_status}
Album Status: ${job.album_status}
Video Status: ${job.video_status}

This production job is overdue. Please share the current progress and expected completion time.

Regards,
Lenspire CRM`;
  const log = async () => {
    setRecording(true);
    setError("");
    try {
      await api.post(`/production/${job.id}/reminder/`);
      await onLogged();
    } catch {
      setError("Message prepared, but reminder history could not be recorded.");
    } finally {
      setRecording(false);
    }
  };
  const copy = async () => {
    await navigator.clipboard.writeText(message);
    await log();
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="modalBackdrop">
      <section className="accountModal productionReminderModal">
        <div className="modalHeader">
          <div>
            <small>OVERDUE PRODUCTION</small>
            <h2>Production Reminder</h2>
            <p>Review the message before sending it to the assigned editor.</p>
          </div>
          <button type="button" onClick={close}>
            ×
          </button>
        </div>
        <div className="productionReminderBody">
          <textarea readOnly value={message} />
          {!phone && (
            <p className="formError">
              No editor mobile number is available. You can still copy the
              message.
            </p>
          )}
          {error && <p className="formError">{error}</p>}
        </div>
        <div className="modalFooter">
          <button type="button" onClick={close}>
            Close
          </button>
          <button type="button" disabled={recording} onClick={copy}>
            {recording ? "Recording…" : copied ? "Copied ✓" : "Copy Message"}
          </button>
          {phone && (
            <a
              className="primary"
              href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => void log()}
            >
              Open WhatsApp
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
