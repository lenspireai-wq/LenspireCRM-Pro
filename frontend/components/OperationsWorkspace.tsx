"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { api } from "@/lib/api";
import { useApiMutation, useApiQuery, queryKeys, queryClient } from "@/lib/query";
import CalendarWorkspace from "@/components/CalendarWorkspace";
import { useAuthStore } from "@/stores/auth";
import { formatDate, formatTime } from "@/lib/date-format";
import { exportFilename } from "@/lib/download-filename";

export type View =
  | "Dashboard"
  | "Calendar"
  | "Upcoming Events"
  | "Completed Events"
  | "Photographers Details";
type Row = Record<string, any>;
const views: View[] = [
  "Dashboard",
  "Calendar",
  "Upcoming Events",
  "Completed Events",
  "Photographers Details",
];
const mobileViewLabels: Record<View, string> = {
  Dashboard: "Dashboard",
  Calendar: "Calendar",
  "Upcoming Events": "Upcoming",
  "Completed Events": "Completed",
  "Photographers Details": "Photographers",
};
const upcomingStatuses = new Set(["Scheduled", "Confirmed", "In Progress"]);
const blankEvent = {
  title: "",
  client_name: "",
  event_type: "Wedding",
  start_date: "",
  start_time: "",
  end_time: "",
  city: "",
  status: "Scheduled",
  handled_by: "",
  couple_name: "",
  contact_no: "",
  photo: "",
  video: "",
  candid: "",
  cinematic: "",
  drone: "",
  assistant: "",
  bts: "",
  notes: "",
  slotted: true,
  date_status: "Confirmed",
  tbd_month: "",
};
const blankPhotographer = {
  name: "",
  mobile: "",
  living_in: "",
  work: "",
  status: "Available",
};
const rows = (value: any): Row[] =>
  Array.isArray(value) ? value : value?.results || [];
const dateLabel = (value?: string) => formatDate(value, "TBD");
const eventDateLabel = (event: Row) => {
  if (event.date_status === "TBD Month" && event.tbd_month) {
    const [year, month] = String(event.tbd_month).split("-").map(Number);
    const monthLabel = new Date(year, month - 1, 1).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
    return `TBD · ${monthLabel}`;
  }
  return dateLabel(event.start_date);
};
const isMonthTbd = (event: Row) =>
  event.date_status === "TBD Month" && Boolean(event.tbd_month);
const upcomingEventSort = (left: Row, right: Row) => {
  const sortDate = (event: Row) => {
    if (event.start_date) return String(event.start_date);
    // A month-only event belongs after every confirmed date in that month.
    if (isMonthTbd(event)) return `${event.tbd_month}-99`;
    // No date or month selected: retain these at the end of the full list.
    return "9999-12-31";
  };
  const dateOrder = sortDate(left).localeCompare(sortDate(right));
  if (dateOrder) return dateOrder;

  // Within a TBD month, keep like events—such as all Pre-wedding shoots—
  // together, then use the client name as a predictable tie-breaker.
  if (isMonthTbd(left) && isMonthTbd(right)) {
    const typeOrder = String(left.event_type || "").localeCompare(String(right.event_type || ""));
    if (typeOrder) return typeOrder;
  }
  const nameOrder = String(left.client_name || left.title || "").localeCompare(String(right.client_name || right.title || ""));
  if (nameOrder) return nameOrder;
  return String(left.start_time || "").localeCompare(String(right.start_time || "")) || Number(left.id) - Number(right.id);
};
const crewMessageValue = (value: any) =>
  String(value || "")
    .split("; ")
    .map((item) => item.replace(/ · /g, " "))
    .join(" + ");
const crewDisplayValue = (value: any) =>
  String(value || "")
    .replace(/\+?(?:91[\s()-]*)?[6-9](?:[\s()-]*\d){9}\b/g, "")
    .replace(/\s*[·|,-]\s*$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
function eventMessage(event: Row) {
  const eventDate = event.start_date
    ? new Date(`${event.start_date}T00:00:00`)
    : null;
  const shortDate = eventDate ? formatDate(event.start_date) : "Date TBD";
  const fullDate = eventDate ? formatDate(event.start_date) : "Date to be confirmed";
  const day = eventDate
    ? eventDate.toLocaleDateString("en-IN", { weekday: "long" })
    : "Day to be confirmed";
  const eventTime = formatTime(event.start_time, "Time to be confirmed");
  const roles = [
    ["📸", "Traditional Photographer", event.photo],
    ["🎥", "Traditional Videographer", event.video],
    ["📷", "Candid Photographer", event.candid],
    ["🎬", "Cinematographer", event.cinematic],
    ["🚁", "Drone", event.drone],
    ["🧑‍🤝‍🧑", "Assistant", event.assistant],
    ["🎞", "BTS", event.bts],
  ].filter(([, , value]) => value && value !== "NA");
  const team =
    roles
      .map(
        ([icon, label, value]) =>
          `${icon} ${label}: ${crewMessageValue(value)}`,
      )
      .join("\n") || "Team assignment pending";
  return `${shortDate} - ${event.event_type || "Event"} – ${event.couple_name || event.client_name || event.title}

📞 Client / Contact: ${event.contact_no || "Contact to be confirmed"}
📍 Location & Venue:
${event.city || "Location to be confirmed"}
📅 Date: ${fullDate}
🗓 Day: ${day}
⏰ Time: ${eventTime}

👥 Team Members:
${team}

💡 Notes:
${event.notes || "No additional notes."}

🎯 Team Coordinators:
Govind Tiwari - 7757870959 - https://wa.me/7757870959
Sandeep Jadhav - 8976480490 - https://wa.me/8976480490
Pratiksha Pathak - 7709177580 - https://wa.me/7709177580
Aarzoo Singh - 9307846897 - https://wa.me/9307846897

📸 Guidelines for Photographers:
• Always wear black colored plain outfits (T-shirt/Shirt and Jeans/Trousers).
• Avoid flashy colors, printed designs, or casual wear like shorts or slippers.
• Keep your attire clean and well-ironed.
• Arrive at least 30 minutes before event start time.
• Maintain respectful communication with clients and team.
• Do not argue with clients — report issues to coordinator.
• Avoid using mobile phones for personal use.
• Do not eat, smoke, or chew gum during the shoot.
• Follow Team Leader / Coordinator instructions.
• Support other team members.
• Do not share client photos/videos without permission.`;
}

export default function OperationsWorkspace({
  searchTerm = "",
  photographerSearchTerm = "",
  readOnly = false,
  view = "Dashboard",
  setView,
}: {
  searchTerm?: string;
  photographerSearchTerm?: string;
  readOnly?: boolean;
  view?: View;
  setView?: (value: View) => void;
}) {
  const setViewSafe = setView ?? (() => {});
  const [photographers, setPhotographers] = useState<Row[]>([]);
  const [eventDraft, setEventDraft] = useState<Row | null>(null);
  const [crewDraft, setCrewDraft] = useState<Row | null>(null);
  const [messageEvent, setMessageEvent] = useState<Row | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setError("");
  }, [view]);
  const [importSummary, setImportSummary] = useState("");
  const [month, setMonth] = useState(() => new Date());
  const [importing, setImporting] = useState(false);
  const [dashboardControlsHeight, setDashboardControlsHeight] = useState(96);
  const dashboardControlsRef = useRef<HTMLDivElement>(null);
  const eventFileInputRef = useState<HTMLInputElement | null>(null)[0];
  const photographerFileInputRef = useState<HTMLInputElement | null>(null)[0];
  const eventsQuery = useApiQuery<{ results: Row[] } | Row[]>(
    queryKeys.events(),
    "/events/?page_size=5000&ordering=start_date,start_time,id",
  );
  const crewQuery = useApiQuery<{ results: Row[] } | Row[]>(
    ["photographers"],
    "/photographers/?page_size=500",
  );
  useEffect(() => {
    if (crewQuery.data) {
      setPhotographers(
        Array.isArray(crewQuery.data)
          ? crewQuery.data
          : crewQuery.data.results || [],
      );
    }
  }, [crewQuery.data]);
  useEffect(() => {
    if ((view !== "Dashboard" && view !== "Photographers Details") || !dashboardControlsRef.current) return;
    const controls = dashboardControlsRef.current;
    const updateHeight = () => setDashboardControlsHeight(controls.getBoundingClientRect().height);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(controls);
    return () => observer.disconnect();
  }, [view, eventsQuery.isPending]);
  const events: Row[] = Array.isArray(eventsQuery.data)
    ? eventsQuery.data
    : eventsQuery.data?.results || [];
  const saveEventMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) =>
      (await (url ? api.patch(url, payload) : api.post("/events/", payload)))
        .data,
  });
  const saveCrewMutation = useApiMutation<
    { url: string; payload: any },
    unknown,
    Error
  >({
    mutationFn: async ({ url, payload }) =>
      (await (url ? api.patch(url, payload) : api.post("/photographers/", payload)))
        .data,
  });
  const invalidateEvents = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.events() });
  const matchingEvents = useMemo(() => {
    const terms = searchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return events.filter(event => {
      const text = [event.title, event.client_name, event.handled_by, event.couple_name,
        event.contact_no, event.event_type, event.city, event.start_date,
        dateLabel(event.start_date), event.start_time, event.notes, event.photo,
        event.video, event.candid, event.cinematic, event.drone, event.assistant,
        event.bts].filter(value => value != null).join(" ").toLowerCase();
      return terms.every(term => text.includes(term));
    });
  }, [events, searchTerm]);
  const upcoming = useMemo(
    () => matchingEvents.filter((e) => upcomingStatuses.has(e.status)).sort(upcomingEventSort),
    [matchingEvents],
  );
  const completed = useMemo(
    () => matchingEvents
      .filter((e) => e.status === "Completed")
      .sort((a, b) => {
        const dateOrder = String(b.start_date || "").localeCompare(String(a.start_date || ""));
        if (dateOrder) return dateOrder;
        const timeOrder = String(b.start_time || "").localeCompare(String(a.start_time || ""));
        return timeOrder || Number(b.id) - Number(a.id);
      }),
    [matchingEvents],
  );
  const matchingPhotographers = useMemo(() => {
    const terms = photographerSearchTerm.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return photographers;
    return photographers.filter((photographer) => {
      const text = [photographer.name, photographer.mobile, photographer.living_in, photographer.work, photographer.status]
        .filter(Boolean).join(" ").toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [photographers, photographerSearchTerm]);

  const saveEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const payload = {
      ...eventDraft,
      ...data,
      title: `${data.client_name} · ${data.event_type}`,
      slotted: true,
      start_date:
        data.date_status === "TBD Month" ? null : data.start_date || null,
      start_time: data.start_time || null,
      end_time: null,
    };
    try {
      await saveEventMutation.mutateAsync({
        url: eventDraft?.id ? `/events/${eventDraft.id}/` : "",
        payload,
      });
      setEventDraft(null);
    } catch (err: any) {
      setError(JSON.stringify(err.response?.data || "Could not save event"));
    }
  };
  const saveCrew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const payload = Object.fromEntries(new FormData(e.currentTarget));
    if (!payload.work) {
      setError("Select at least one work type.");
      return;
    }
    try {
      await saveCrewMutation.mutateAsync({
        url: crewDraft?.id ? `/photographers/${crewDraft.id}/` : "",
        payload,
      });
      setCrewDraft(null);
    } catch (err: any) {
      setError(
        JSON.stringify(err.response?.data || "Could not save photographer"),
      );
    }
  };
  const remove = async (path: string, refresh: () => Promise<any>) => {
    if (!confirm("Delete this record?")) return;
    await api.delete(path);
    await refresh();
  };
  const duplicateEvent = (event: Row) => {
    const { id: _id, ...copy } = event;
    setError("");
    setEventDraft({ ...copy });
  };
  const exportEvents = async () => {
    try {
      const response = await api.get("/events/export/", { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = exportFilename(
        view === "Completed Events" ? "Completed_Events" : "Upcoming_Events",
        "xlsx",
      );
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not export events.");
    }
  };
  const importEvents = async (file?: File) => {
    if (!file) return;
    setImporting(true);
    setError("");
    setImportSummary("");
    try {
      // Send the workbook directly instead of multipart. This avoids reverse
      // proxies that discard multipart boundaries and empty Django's FILES map.
      const upload = (token?: string | null) => fetch(`${api.defaults.baseURL}/events/import/`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": file.type || "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
        body: file,
      });
      let auth = useAuthStore.getState();
      let response = await upload(auth.access);
      // This direct file upload does not pass through Axios's normal token
      // refresh interceptor. Refresh once and retry so a stale access token
      // does not turn a valid Excel import into a login error.
      if (response.status === 401 && auth.refresh) {
        const refreshResponse = await fetch(`${api.defaults.baseURL}/auth/refresh/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: auth.refresh }),
        });
        if (refreshResponse.ok) {
          const refreshed = await refreshResponse.json();
          useAuthStore.getState().setTokens(refreshed.access, refreshed.refresh || auth.refresh);
          response = await upload(refreshed.access);
        }
      }
      const responseText = await response.text();
      let data: any = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        // Reverse proxies can return an HTML error document. Keep a short
        // plain-text excerpt so the user is not shown an unhelpful `{}`.
        data = { detail: responseText.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 300) };
      }
      if (!response.ok) {
        const detail = data.detail || `Import failed (HTTP ${response.status}).`;
        throw { response: { data: { ...data, detail } } };
      }
      await invalidateEvents();
      setImportSummary(`${data.updated || 0} event(s) updated, ${data.created || 0} event(s) created, ${data.skipped || 0} duplicate event(s) skipped.`);
    } catch (err: any) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data || "Could not import events."));
    } finally {
      setImporting(false);
    }
  };
  const exportPhotographers = async () => {
    try {
      const response = await api.get("/photographers/export/", { responseType: "blob" });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = exportFilename("Photographers", "xlsx");
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Could not export photographers.");
    }
  };
  const importPhotographers = async (file?: File) => {
    if (!file) return;
    setImporting(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    try {
      await api.post("/photographers/import/", form);
      await crewQuery.refetch();
    } catch (err: any) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data || "Could not import photographers."));
    } finally {
      setImporting(false);
    }
  };

  if (view !== "Photographers Details" && eventsQuery.isPending) {
    return <div className="operationsWorkspace" role="status">Loading events…</div>;
  }
  if (view !== "Photographers Details" && eventsQuery.isError) {
    return <div className="operationsWorkspace" role="alert">Could not load events. <button onClick={() => eventsQuery.refetch()}>Retry</button></div>;
  }

  return (
    <div
      className={`operationsWorkspace${view === "Dashboard" ? " operationsDashboardView" : view === "Photographers Details" ? " photographersDetailsView" : ""}`}
      style={view === "Dashboard" || view === "Photographers Details" ? { "--operations-controls-height": `${dashboardControlsHeight}px` } as CSSProperties : undefined}
    >
      <div ref={dashboardControlsRef} className="operationsDashboardControls">
        <nav className="operationsTabs">
          {views.map((item) => (
            <button
              key={item}
              className={view === item ? "active" : ""}
              onClick={() => setViewSafe(item)}
            >
              <span className="desktopOperationsTabLabel">{item === "Photographers Details" ? "Photographers" : item}</span>
              <span className="mobileOperationsTabLabel">{mobileViewLabels[item]}</span>
            </button>
          ))}
        </nav>
        <div className={`operationsActions${view === "Upcoming Events" || view === "Completed Events" ? " upcomingEventActions" : view === "Photographers Details" ? " photographerActions" : ""}`}>
        {(view === "Upcoming Events" || view === "Completed Events") && (
          <>
            <button type="button" className="operationsActionButton" onClick={exportEvents} title="Export events to Excel">
              <span>Export</span><span className="operationsActionIcon" aria-hidden="true">↗</span>
            </button>
            <label className="fileLabel operationsActionButton" title="Import events from Excel">
              <span>Import</span><span className="operationsActionIcon" aria-hidden="true">↥</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hiddenInput"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) importEvents(file);
                  event.target.value = "";
                }}
              />
            </label>
          </>
        )}
        {view === "Photographers Details" && (
          <>
            <button type="button" className="operationsActionButton" onClick={exportPhotographers} title="Export photographers to Excel">
              <span>Export</span><span className="operationsActionIcon" aria-hidden="true">↗</span>
            </button>
            <label className="fileLabel operationsActionButton" title="Import photographers from Excel">
              <span>Import</span><span className="operationsActionIcon" aria-hidden="true">↥</span>
              <input
                type="file"
                accept=".xlsx,.xls"
                className="hiddenInput"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) importPhotographers(file);
                  event.target.value = "";
                }}
              />
            </label>
            {!readOnly && (
              <button
                className="primary operationsActionButton"
                onClick={() => setCrewDraft({ ...blankPhotographer })}
              >
                <span>Add Photographer</span><span className="operationsActionIcon" aria-hidden="true">＋</span>
              </button>
            )}
          </>
        )}
        {view === "Upcoming Events" && (
          <>
            {!readOnly && (
              <button
                className="primary operationsActionButton"
                onClick={() => setEventDraft({ ...blankEvent })}
              >
                <span>Add Event</span><span className="operationsActionIcon" aria-hidden="true">＋</span>
              </button>
            )}
          </>
        )}
        </div>
      </div>
      {error && !eventDraft && !crewDraft && !messageEvent && (
        <p className="formError" role="alert">
          {error}
        </p>
      )}
      {importSummary && <div className="operationsImportSummary" role="status">{importSummary}</div>}
      {view === "Dashboard" && (
        <Dashboard
          events={events}
          photographers={photographers}
          open={setViewSafe}
        />
      )}
      {view === "Calendar" && <CalendarWorkspace />}
      {view === "Upcoming Events" && (
        <EventTable
          events={upcoming}
          fitColumns
          uniformColumns
          fitPage
          fitPageClass="operationsUpcomingTable"
          edit={readOnly ? undefined : setEventDraft}
          onMessage={setMessageEvent}
          onDuplicate={readOnly ? undefined : duplicateEvent}
          remove={
            readOnly ? undefined : (id) => remove(`/events/${id}/`, invalidateEvents)
          }
        />
      )}
      {view === "Completed Events" && (
        <EventTable
          events={completed}
          fitColumns
          uniformColumns
          fitPage
          edit={readOnly ? undefined : setEventDraft}
          onMessage={setMessageEvent}
          onDuplicate={readOnly ? undefined : duplicateEvent}
          remove={
            readOnly ? undefined : (id) => remove(`/events/${id}/`, invalidateEvents)
          }
        />
      )}
      {view === "Photographers Details" && (
        <CrewTable
          rows={matchingPhotographers}
          edit={readOnly ? undefined : setCrewDraft}
          remove={
            readOnly
              ? undefined
              : (id) => remove(`/photographers/${id}/`, () => crewQuery.refetch())
          }
        />
      )}
      {eventDraft && (
        <EventModal
          draft={eventDraft}
          photographers={photographers}
          close={() => setEventDraft(null)}
          save={saveEvent}
          error={error}
        />
      )}
      {crewDraft && (
        <CrewModal
          draft={crewDraft}
          close={() => setCrewDraft(null)}
          save={saveCrew}
          error={error}
        />
      )}
      {messageEvent && (
        <EventMessageModal
          event={messageEvent}
          close={() => setMessageEvent(null)}
        />
      )}
    </div>
  );
}

function Dashboard({
  events,
  photographers,
  open,
}: {
  events: Row[];
  photographers: Row[];
  open: (view: View) => void;
}) {
  const today = new Date().toISOString().slice(0, 10),
    upcoming = events.filter((e) => upcomingStatuses.has(e.status));
  const nextShoots = upcoming.slice(0, 10);
  return (
    <>
      <section className="salesKpis">
        <article
          className="operationsKpiLink"
          role="button"
          tabIndex={0}
          onClick={() => open("Upcoming Events")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              open("Upcoming Events");
            }
          }}
        >
          <span>Upcoming Events</span>
          <b>{upcoming.length}</b>
          <small>awaiting completion</small>
        </article>
        <article>
          <span>Shooting Today</span>
          <b>
            {
              events.filter(
                (e) => e.start_date === today && e.status === "In Progress",
              ).length
            }
          </b>
          <small>events today</small>
        </article>
        <article
          className="operationsKpiLink"
          role="button"
          tabIndex={0}
          onClick={() => open("Completed Events")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              open("Completed Events");
            }
          }}
        >
          <span>Completed</span>
          <b>{events.filter((e) => e.status === "Completed").length}</b>
          <small>finished shoots</small>
        </article>
        <article
          className="operationsKpiLink"
          role="button"
          tabIndex={0}
          onClick={() => open("Photographers Details")}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              open("Photographers Details");
            }
          }}
        >
          <span>Crew</span>
          <b>{photographers.length}</b>
          <small>photographers</small>
        </article>
      </section>
      <section className="panel nextShootsPanel">
        <div className="panelHead nextShootsHead">
          <div>
            <span className="sectionEyebrow">OPERATIONS TIMELINE</span>
            <h2>Next Shoots</h2>
            <p>Stay ahead of every upcoming assignment.</p>
          </div>
          <span className="nextShootsCount">{nextShoots.length} scheduled</span>
          <button
            className="iconOnlyAction viewAction"
            title="View all upcoming events"
            aria-label="View all upcoming events"
            onClick={() => open("Upcoming Events")}
          >
            ◉
          </button>
        </div>
        <NextShootsTable events={nextShoots} />
      </section>
    </>
  );
}

function NextShootsTable({ events }: { events: Row[] }) {
  const crewCount = (event: Row) =>
    [event.photo, event.video, event.candid, event.cinematic, event.drone, event.assistant, event.bts]
      .flatMap((value) => String(value || "").split(/\s*;\s*|\s*\+(?!\s*\d)\s*/))
      .filter((value) => value && !["X", "XX", "NA"].includes(value.trim().toUpperCase()))
      .length;

  return (
    <div className="nextShootsTableWrap">
      <table className="nextShootsTable">
        <thead>
          <tr>
            <th>Sr. No.</th>
            <th>When</th>
            <th>Client &amp; shoot</th>
            <th>Coverage</th>
            <th>Venue</th>
            <th>Readiness</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => {
            const count = crewCount(event);
            return (
              <tr key={event.id}>
                <td className="shootSerial">{index + 1}</td>
                <td>
                  <div className="shootDateCard">
                    <span>{event.start_date ? new Date(`${event.start_date}T00:00:00`).toLocaleDateString("en-IN", { month: "short" }).toUpperCase() : "TBD"}</span>
                    <b>{event.start_date ? new Date(`${event.start_date}T00:00:00`).getDate() : "—"}</b>
                    <small>{event.start_date ? new Date(`${event.start_date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" }) : "date"}</small>
                  </div>
                </td>
                <td>
                  <div className="shootClient">
                    <span className="shootNumber">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <b>{event.client_name || event.title || "Client to be confirmed"}</b>
                      <small>{event.couple_name || event.event_type || "Shoot details pending"}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={`coverageMeter ${count ? "ready" : "pending"}`}>
                    <span>{count ? `${count} crew assigned` : "Crew pending"}</span>
                    <i><em style={{ width: `${Math.min(100, count * 20)}%` }} /></i>
                  </div>
                </td>
                <td>
                  <div className="shootVenue">
                    <b>{event.city || "Venue to be confirmed"}</b>
                    <small>{formatTime(event.start_time, "Time TBD")}</small>
                  </div>
                </td>
                <td>
                  <span className={`statusPill status-${String(event.status || "scheduled").toLowerCase().replaceAll(" ", "-")}`}>
                    <i aria-hidden="true">●</i>{event.status || "Scheduled"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {!events.length && <div className="empty">No upcoming shoots found.</div>}
    </div>
  );
}

function EventTable({
  events,
  edit,
  remove,
  onMessage,
  onDuplicate,
  compact = false,
  fitColumns = false,
  uniformColumns = false,
  fitPage = false,
  fitPageClass = "operationsCompletedTable",
}: {
  events: Row[];
  edit?: (row: Row) => void;
  remove?: (id: any) => void;
  onMessage?: (row: Row) => void;
  onDuplicate?: (row: Row) => void;
  compact?: boolean;
  fitColumns?: boolean;
  uniformColumns?: boolean;
  fitPage?: boolean;
  fitPageClass?: "operationsCompletedTable" | "operationsUpcomingTable";
}) {
  const labels = ["Sr. No.", "Date", "Client Name", "Handled By", "Couple Name", "Contact No.", "Event", "Photo", "Video", "Candid", "Cinematic", "Drone", "Assistant", "BTS", "Venue", "Time", "Notes", "Action"];
  const completedColumnWidth = `${100 / labels.length}%`;
  const plainUpcomingFields = fitPageClass === "operationsUpcomingTable";
  const eventTypeTone = (eventType: unknown) => {
    const value = String(eventType || "").trim().toLowerCase();
    if (value.includes("pre-wedding") || value.includes("pre wedding")) return "eventTypePreWedding";
    if (value.includes("night wedding")) return "eventTypeNightWedding";
    return "";
  };
  const crew = (value: any) => {
    const assignments = String(value || "")
      .split(/\s*;\s*|\s*\+(?!\s*\d)\s*/)
      .map((assignment) => assignment.trim())
      .filter(Boolean);
    const namedAssignments = assignments.filter(
      (assignment) => !["X", "XX", "NA"].includes(assignment.toUpperCase()),
    );
    const multipleNames = namedAssignments.length > 1;
    return assignments.length ? (
      <div
        className={`crewAssignments ${multipleNames ? "multipleCrew" : ""}`}
        data-crew-count={multipleNames ? namedAssignments.length : undefined}
      >
        {assignments.map((assignment, index) => {
          const marker = assignment.toUpperCase();
          const displayAssignment = crewDisplayValue(assignment) || assignment;
          const colorClass =
            marker === "NA"
              ? "crewNA"
              : marker === "XX"
                ? "crewXX"
                : marker === "X"
                  ? "crewX"
                  : multipleNames
                    ? "crewAssignedMultiple"
                    : "crewAssigned";
          return (
            <span className={colorClass} key={`${assignment}-${index}`}>
              {displayAssignment}
            </span>
          );
        })}
      </div>
    ) : (
      "—"
    );
  };
  if (compact)
    return (
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Event</th>
              <th>Venue</th>
              <th>Crew Coverage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((row) => (
              <tr key={row.id}>
                <td>{dateLabel(row.start_date)}</td>
                <td>
                  <b>{row.client_name || row.title}</b>
                </td>
                <td>{row.event_type}</td>
                <td>{row.city || "—"}</td>
                <td>
                  {[
                    row.photo,
                    row.video,
                    row.candid,
                    row.cinematic,
                    row.drone,
                    row.assistant,
                    row.bts,
                  ]
                    .filter(Boolean)
                    .map(crewDisplayValue)
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
                <td>
                  <span className={`statusPill status-${String(row.status || "").toLowerCase().replaceAll(" ", "-")}`}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!events.length && <div className="empty">No events found.</div>}
      </div>
    );
  return (
    <div className={`table upcomingEventsTableWrap${fitColumns ? " fitUpcomingColumns" : ""}${fitPage ? ` ${fitPageClass}` : fitColumns ? " operationsUpcomingTable" : ""}${uniformColumns ? " uniformEventColumns" : ""}`}>
      <table
        className="upcomingEventsTable"
        style={fitPage ? { width: "100%", minWidth: 0, maxWidth: "100%", tableLayout: "fixed" } : undefined}
      >
        {fitPage && (
          <colgroup>
            {labels.map((label) => <col key={label} style={{ width: completedColumnWidth }} />)}
          </colgroup>
        )}
        <thead>
          <tr>
            {labels.map((label) => <th key={label} scope="col">{label}</th>)}
          </tr>
        </thead>
        <tbody>
          {events.map((row, index) => (
            <tr key={row.id}>
              <td className="srNo">{index + 1}</td>
              <td className={String(eventDateLabel(row)).trim().toUpperCase().startsWith("TBD") ? "tbdEventDate eventDateTbd" : undefined}>
                {plainUpcomingFields ? eventDateLabel(row) : <span className="upcomingEventDate">{eventDateLabel(row)}</span>}
              </td>
              <td>
                <b>{row.client_name || row.title}</b>
              </td>
              <td>{row.handled_by || "—"}</td>
              <td>{row.couple_name || "—"}</td>
              <td>{row.contact_no || "—"}</td>
              <td className={`eventTypeCell ${eventTypeTone(row.event_type)}`.trim()}>{plainUpcomingFields ? row.event_type : <span className="upcomingEventType">{row.event_type}</span>}</td>
              <td>{crew(row.photo)}</td>
              <td>{crew(row.video)}</td>
              <td>{crew(row.candid)}</td>
              <td>{crew(row.cinematic)}</td>
              <td>{crew(row.drone)}</td>
              <td>{crew(row.assistant)}</td>
              <td>{crew(row.bts)}</td>
              <td title={row.city || "—"}>
                {row.city || "—"}
              </td>
              <td>{formatTime(row.start_time)}</td>
              <td className="eventNotes" title={row.notes || "—"}>
                {row.notes || "—"}
              </td>
              <td>
                <div className="eventRowActions">
                  <button
                    className="message"
                    title="Generate event message"
                    onClick={() => onMessage?.(row)}
                  >
                    ✉
                  </button>
                  {onDuplicate && (
                    <button
                      className="duplicate"
                      title="Duplicate event"
                      onClick={() => onDuplicate(row)}
                    >
                      ⧉
                    </button>
                  )}
                  {edit && (
                    <button
                      title="Edit event and assign photographers"
                      onClick={() => edit({ ...row })}
                    >
                      ✎
                    </button>
                  )}
                  {remove && (
                    <button
                      className="delete"
                      title="Delete event"
                      onClick={() => remove(row.id)}
                    >
                      ×
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {fitPageClass === "operationsUpcomingTable" && (
        <p className="mobileTableScrollHint" aria-live="polite">
          ← Swipe the table to view all 18 columns →
        </p>
      )}
      {!events.length && <div className="empty">No events found.</div>}
    </div>
  );
}

function Calendar({
  events,
  month,
  setMonth,
  edit,
}: {
  events: Row[];
  month: Date;
  setMonth: (date: Date) => void;
  edit?: (row: Row) => void;
}) {
  const year = month.getFullYear(),
    index = month.getMonth(),
    first = new Date(year, index, 1),
    count = new Date(year, index + 1, 0).getDate(),
    offset = (first.getDay() + 6) % 7;
  const days = Array(offset)
    .fill(null)
    .concat(Array.from({ length: count }, (_, i) => i + 1));
  return (
    <section className="panel operationsCalendar">
      <div className="panelHead">
        <button onClick={() => setMonth(new Date(year, index - 1, 1))}>
          ‹
        </button>
        <h2>
          {month.toLocaleDateString("en-IN", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={() => setMonth(new Date(year, index + 1, 1))}>
          ›
        </button>
      </div>
      <div className="calendarGrid">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <b key={d}>{d}</b>
        ))}
        {days.map((day, i) => {
          const key = day
            ? `${year}-${String(index + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : "";
          return (
            <div key={i} className={!day ? "muted" : ""}>
              <span>{day}</span>
              {events
                .filter((e) => e.start_date === key)
                .map((e) => {
                  const eventName = e.couple_name || e.client_name || e.title || "Event";
                  const eventTime = formatTime(e.start_time, "Time TBD");
                  return edit ? (
                    <button key={e.id} onClick={() => edit({ ...e })}>
                      <span className="calendarEventName">{eventName}</span>
                      <span className="calendarEventTime">{eventTime}</span>
                    </button>
                  ) : (
                    <small key={e.id} className="calendarReadOnlyEvent">
                      <span className="calendarEventName">{eventName}</span>
                      <span className="calendarEventTime">{eventTime}</span>
                    </small>
                  );
                })}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function CrewTable({
  rows,
  edit,
  remove,
}: {
  rows: Row[];
  edit?: (row: Row) => void;
  remove?: (id: any) => void;
}) {
  // Older imports could create an identical photographer twice.  Keep the
  // earliest record visible while the backend migration removes those legacy
  // copies.  Mobile number is the stable identity when it is available.
  const visibleRows = Array.from(
    rows.reduce<Map<string, Row>>((unique, row) => {
      const mobile = String(row.mobile || "").replace(/\D/g, "").slice(-10);
      const identity = mobile
        ? `mobile:${mobile}`
        : `record:${String(row.name || "").trim().toLocaleLowerCase()}|${String(row.living_in || "").trim().toLocaleLowerCase()}|${String(row.work || "").trim().toLocaleLowerCase()}|${String(row.status || "").trim().toLocaleLowerCase()}`;
      const existing = unique.get(identity);
      if (!existing || Number(row.id) < Number(existing.id)) unique.set(identity, row);
      return unique;
    }, new Map<string, Row>()).values(),
  );
  const [serialOrder, setSerialOrder] = useState<"asc" | "desc">("asc");
  const displayedRows = serialOrder === "asc" ? visibleRows : [...visibleRows].reverse();

  return (
    <section className="photographerTablePanel">
        <table className="photographerTable">
          <thead>
            <tr>
              <th className="mobilePhotographerSerial">
                <button
                  type="button"
                  className="photographerSerialSort"
                  onClick={() => setSerialOrder((order) => order === "asc" ? "desc" : "asc")}
                  aria-label={`Sort serial number ${serialOrder === "asc" ? "descending" : "ascending"}`}
                  title={`Sort ${serialOrder === "asc" ? "descending" : "ascending"}`}
                >
                  No. <span aria-hidden="true">{serialOrder === "asc" ? "↑" : "↓"}</span>
                </button>
              </th>
              <th>Photographer</th>
              <th>Phone</th>
              <th>Base</th>
              <th>Speciality</th>
              <th>Availability</th>
              <th className="photographerActionsHead">Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, index) => {
              return <tr key={row.id}>
                <td className="mobilePhotographerSerial">{index + 1}</td>
                <td>
                  <span className="photographerIdentity">
                    <b>{row.name}</b>
                  </span>
                </td>
                <td><span className="photographerMobile">{row.mobile || "—"}</span></td>
                <td>{row.living_in || "—"}</td>
                <td><span className="photographerWork">{row.work || "—"}</span></td>
                <td>
                  <span className={`statusPill status-${String(row.status || "").toLowerCase().replaceAll(" ", "-")}`}>{row.status}</span>
                </td>
                <td>
                  <div className="rowActions">
                    {edit && (
                      <button
                        className="editAction"
                        title="Edit photographer"
                        aria-label="Edit photographer"
                        onClick={() => edit({ ...row })}
                      >
                        ✎
                      </button>
                    )}
                    {remove && (
                      <button
                        className="deleteAction"
                        title="Delete photographer"
                        aria-label="Delete photographer"
                        onClick={() => remove(row.id)}
                      >
                        ×
                      </button>
                    )}
                    {!edit && !remove && <small>View only</small>}
                  </div>
                </td>
              </tr>;
            })}
          </tbody>
        </table>
        {!visibleRows.length && <div className="empty">No photographers yet.</div>}
    </section>
  );
}

function LegacyEventModal({ draft, close, save, error }: any) {
  const fields = [
    ["client_name", "Client Name"],
    ["handled_by", "Handled By"],
    ["couple_name", "Couple Name"],
    ["contact_no", "Contact No"],
    ["title", "Event Title"],
    ["event_type", "Event Type"],
    ["start_date", "Event Date", "date"],
    ["start_time", "Start Time", "time"],
    ["end_time", "End Time", "time"],
    ["city", "City"],
    ["photo", "Photo"],
    ["video", "Video"],
    ["candid", "Candid"],
    ["cinematic", "Cinematic"],
    ["drone", "Drone"],
    ["assistant", "Assistant"],
    ["bts", "BTS"],
  ];
  return (
    <div className="modalBackdrop">
      <form className="modalCard operationModal" onSubmit={save}>
        <div className="modalHeader">
          <div>
            <small>OPERATIONS · UPCOMING EVENTS</small>
            <h2>{draft.id ? "Update Event" : "Add Event"}</h2>
            <p>Client, event, and photographer assignment details.</p>
          </div>
          <button type="button" onClick={close}>
            ×
          </button>
        </div>
        <div className="leadFormGrid">
          <label>
            Date Status
            <select
              name="date_status"
              defaultValue={draft.date_status || "Confirmed"}
            >
              <option>Confirmed</option>
              <option>TBD Month</option>
            </select>
          </label>
          <label>
            TBD Month
            <input
              name="tbd_month"
              type="month"
              defaultValue={draft.tbd_month || ""}
            />
          </label>
          {fields.map(([name, label, type]) => (
            <label key={name}>
              {label}
              <input
                name={name}
                type={type || "text"}
                required={["client_name", "title", "event_type"].includes(name)}
                defaultValue={(draft[name] || "")
                  .toString()
                  .slice(0, type === "time" ? 5 : undefined)}
              />
            </label>
          ))}
          <label>
            Status
            <select name="status" defaultValue={draft.status || "Scheduled"}>
              <option>Scheduled</option>
              <option>Confirmed</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </select>
          </label>
          <label className="wide">
            Notes
            <textarea name="notes" defaultValue={draft.notes || ""} />
          </label>
        </div>
        {error && <div className="formError">{error}</div>}
        <div className="modalFooter">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary">Save Event</button>
        </div>
      </form>
    </div>
  );
}
function EventModal({ draft, photographers, close, save, error }: any) {
  const [dateStatus, setDateStatus] = useState(
    draft.date_status || "Confirmed",
  );
  const crewFields = [
    ["photo", "Photo"],
    ["video", "Video"],
    ["candid", "Candid"],
    ["cinematic", "Cinematic"],
    ["drone", "Drone"],
    ["bts", "BTS"],
    ["assistant", "Assistant"],
  ];
  const crewOptions = [
    { value: "NA", label: "NA — Not Applicable" },
    { value: "X", label: "X — One person needs assignment" },
    { value: "XX", label: "XX — Two people need assignment" },
    ...photographers.map((person: Row) => ({
      value: person.mobile ? `${person.name} · ${person.mobile}` : person.name,
      label: person.mobile ? `${person.name} · ${person.mobile}` : person.name,
    })),
  ];
  const [crewSelections, setCrewSelections] = useState<
    Record<string, string[]>
  >(() =>
    Object.fromEntries(
      crewFields.map(([name]) => {
        const existing = String(draft[name] || "")
          .split(/\s*;\s*/)
          .map((value) => value.trim())
          .filter(Boolean);
        return [name, existing.length ? existing : [""]];
      }),
    ),
  );
  const updateCrewSelection = (field: string, index: number, value: string) =>
    setCrewSelections((current) => ({
      ...current,
      [field]: current[field].map((item, itemIndex) =>
        itemIndex === index ? value : item,
      ),
    }));
  const addCrewSelection = (field: string) =>
    setCrewSelections((current) => ({
      ...current,
      [field]: [...current[field], ""],
    }));
  const removeCrewSelection = (field: string, index: number) =>
    setCrewSelections((current) => {
      const remaining = current[field].filter(
        (_, itemIndex) => itemIndex !== index,
      );
      return { ...current, [field]: remaining.length ? remaining : [""] };
    });
  return (
    <div className="modalBackdrop">
      <form className="modalCard operationModal eventEditorModal" onSubmit={save}>
        <div className="modalHeader">
          <div>
            <small>OPERATIONS · UPCOMING EVENTS</small>
            <h2>{draft.id ? "Update Event" : "Add Event"}</h2>
            <p>
              Complete the client, event, and photographer assignment details.
            </p>
          </div>
          <button type="button" onClick={close}>
            ×
          </button>
        </div>
        <div className="operationForm">
          <section className="operationFormSection">
            <div className="operationSectionTitle">
              <span>PART 1</span>
              <b>Client &amp; Event Information</b>
            </div>
            <div className="operationFieldGrid">
              <label>
                Date Status
                <select
                  name="date_status"
                  value={dateStatus}
                  onChange={(e) => setDateStatus(e.target.value)}
                >
                  <option>Confirmed</option>
                  <option>TBD Month</option>
                </select>
              </label>
              {dateStatus === "Confirmed" ? (
                <label>
                  Event Date
                  <input
                    name="start_date"
                    type="date"
                    required
                    defaultValue={draft.start_date || ""}
                  />
                </label>
              ) : (
                <label>
                  Event Date (Month &amp; Year)
                  <input
                    name="tbd_month"
                    type="month"
                    required
                    defaultValue={draft.tbd_month || ""}
                  />
                </label>
              )}
              <label>
                Client Name
                <input
                  name="client_name"
                  required
                  defaultValue={draft.client_name || ""}
                />
              </label>
              <label>
                Handled By
                <input
                  name="handled_by"
                  required
                  defaultValue={draft.handled_by || ""}
                />
              </label>
              <label>
                Couple Name
                <input
                  name="couple_name"
                  required
                  defaultValue={draft.couple_name || ""}
                />
              </label>
              <label>
                Contact No.
                <input
                  name="contact_no"
                  type="tel"
                  required
                  defaultValue={draft.contact_no || ""}
                />
              </label>
              <label>
                Event
                <input
                  name="event_type"
                  required
                  defaultValue={draft.event_type || ""}
                />
              </label>
              <label>
                Status
                <select
                  name="status"
                  defaultValue={draft.status || "Scheduled"}
                >
                  <option>Scheduled</option>
                  <option>Confirmed</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </label>
            </div>
          </section>
          <section className="operationFormSection">
            <div className="operationSectionTitle">
              <span>PART 2</span>
              <b>Photographer Assignment</b>
            </div>
            <div className="operationFieldGrid assignmentGrid">
              {crewFields.map(([name, label]) => {
                const selected = crewSelections[name] || [""];
                return (
                  <div className="crewMultiField" key={name}>
                    <b>{label}</b>
                    <input
                      type="hidden"
                      name={name}
                      value={selected.filter(Boolean).join("; ")}
                    />
                    {selected.map((value, index) => (
                      <div
                        className="crewSelectionRow"
                        key={`${name}-${index}`}
                      >
                        <select
                          aria-label={`${label} assignment ${index + 1}`}
                          value={value}
                          onChange={(event) =>
                            updateCrewSelection(name, index, event.target.value)
                          }
                        >
                          <option value="">Select assignment</option>
                          {crewOptions.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                              disabled={
                                option.value !== value &&
                                selected.includes(option.value)
                              }
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                        {selected.length > 1 && (
                          <button
                            type="button"
                            className="removeCrewSelection"
                            title={`Remove ${label} assignment`}
                            aria-label={`Remove ${label} assignment ${index + 1}`}
                            onClick={() => removeCrewSelection(name, index)}
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="addCrewSelection"
                      onClick={() => addCrewSelection(name)}
                    >
                      ＋ Add Photographer
                    </button>
                  </div>
                );
              })}
              <label>
                Time
                <input
                  name="start_time"
                  type="time"
                  defaultValue={(draft.start_time || "").slice(0, 5)}
                />
              </label>
              <label>
                Venue
                <input name="city" defaultValue={draft.city || ""} />
              </label>
              <label className="wide">
                Notes
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={draft.notes || ""}
                />
              </label>
            </div>
          </section>
        </div>
        {error && <div className="formError">{error}</div>}
        <div className="modalFooter">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary">
            {draft.id ? "Save Changes" : "Add Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

function EventMessageModal({
  event,
  close,
}: {
  event: Row;
  close: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const message = eventMessage(event);
  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      const textArea = document.getElementById(
        "event-message-text",
      ) as HTMLTextAreaElement | null;
      textArea?.select();
      document.execCommand("copy");
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="modalBackdrop">
      <section className="eventMessageModal">
        <div className="modalHeader">
          <div>
            <small>EVENT MESSAGE</small>
            <h2>Copy WhatsApp Message</h2>
            <p>
              Review the generated message, copy it, and paste it into WhatsApp
              when ready.
            </p>
          </div>
          <button type="button" onClick={close} aria-label="Close">
            ×
          </button>
        </div>
        <div className="eventMessageBody">
          <textarea id="event-message-text" readOnly value={message} />
        </div>
        <div className="modalFooter">
          <button type="button" onClick={close}>
            Close
          </button>
          <button type="button" className="primary" onClick={copyMessage}>
            {copied ? "Copied ✓" : "Copy Message"}
          </button>
        </div>
      </section>
    </div>
  );
}

function CrewModal({ draft, close, save, error }: any) {
  const workTypes = [
    "Traditional Photo",
    "Traditional Video",
    "Candid",
    "Cinematic",
    "Drone",
  ];
  const [selectedWork, setSelectedWork] = useState<string[]>(
    String(draft.work || "")
      .split("; ")
      .filter(Boolean),
  );
  const toggleWork = (work: string) =>
    setSelectedWork((current) =>
      current.includes(work)
        ? current.filter((item) => item !== work)
        : [...current, work],
    );
  return (
    <div className="modalBackdrop">
      <form className="modalCard crewModal" onSubmit={save}>
        <div className="modalHeader">
          <div>
            <small>
              {draft.id ? "UPDATE CREW PROFILE" : "NEW CREW PROFILE"}
            </small>
            <h2>{draft.id ? "Edit Photographer" : "Add Photographer"}</h2>
            <p>Add contact and work details to your operations directory.</p>
          </div>
          <button type="button" onClick={close}>
            ×
          </button>
        </div>
        <div className="crewFormGrid">
          <label className="wide">
            Photographer&apos;s Name
            <input name="name" required defaultValue={draft.name || ""} />
          </label>
          <label>
            Mobile
            <input
              name="mobile"
              type="tel"
              required
              defaultValue={draft.mobile || ""}
            />
          </label>
          <label>
            Living In
            <input
              name="living_in"
              placeholder="City / Area"
              defaultValue={draft.living_in || ""}
            />
          </label>
          <fieldset className="wide crewWorkPicker">
            <legend>Work</legend>
            <input type="hidden" name="work" value={selectedWork.join("; ")} />
            <div>
              {workTypes.map((work) => (
                <label key={work}>
                  <input
                    type="checkbox"
                    checked={selectedWork.includes(work)}
                    onChange={() => toggleWork(work)}
                  />
                  <span>{work}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label>
            Status
            <select name="status" required defaultValue={draft.status || ""}>
              <option value="">Select status</option>
              <option>In-House</option>
              <option>Outside</option>
            </select>
          </label>
        </div>
        {error && <div className="formError">{error}</div>}
        <div className="modalFooter">
          <button type="button" onClick={close}>
            Cancel
          </button>
          <button className="primary">Save Photographer</button>
        </div>
      </form>
    </div>
  );
}
