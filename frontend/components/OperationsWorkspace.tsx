"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useApiMutation, useApiQuery, queryKeys, queryClient } from "@/lib/query";
import CalendarWorkspace from "@/components/CalendarWorkspace";

type View =
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
const dateLabel = (value?: string) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "TBD";
const ordinal = (day: number) => {
  const remainder = day % 100;
  if (remainder >= 11 && remainder <= 13) return `${day}th`;
  return `${day}${day % 10 === 1 ? "st" : day % 10 === 2 ? "nd" : day % 10 === 3 ? "rd" : "th"}`;
};
const crewMessageValue = (value: any) =>
  String(value || "")
    .split("; ")
    .map((item) => item.replace(/ · /g, " "))
    .join(" + ");
function eventMessage(event: Row) {
  const eventDate = event.start_date
    ? new Date(`${event.start_date}T00:00:00`)
    : null;
  const shortDate = eventDate
    ? `${ordinal(eventDate.getDate())} ${eventDate.toLocaleDateString("en-IN", { month: "short" })}`
    : "Date TBD";
  const fullDate = eventDate
    ? eventDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date to be confirmed";
  const day = eventDate
    ? eventDate.toLocaleDateString("en-IN", { weekday: "long" })
    : "Day to be confirmed";
  const eventTime = event.start_time
    ? new Date(`2000-01-01T${event.start_time}`).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Time to be confirmed";
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
  readOnly = false,
}: {
  readOnly?: boolean;
}) {
  const [view, setView] = useState<View>("Dashboard");
  const [photographers, setPhotographers] = useState<Row[]>([]);
  const [eventDraft, setEventDraft] = useState<Row | null>(null);
  const [crewDraft, setCrewDraft] = useState<Row | null>(null);
  const [messageEvent, setMessageEvent] = useState<Row | null>(null);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(() => new Date());
  const eventsQuery = useApiQuery<{ results: Row[] } | Row[]>(
    queryKeys.events(),
    "/events/?page_size=500&ordering=start_date",
  );
  const crewQuery = useApiQuery<{ results: Row[] } | Row[]>(
    ["photographers"],
    "/photographers/?page_size=500",
  );
  const loadCrew = () =>
    api.get("/photographers/").then((r) => setPhotographers(rows(r.data)));
  useEffect(() => {
    loadCrew();
  }, []);
  useEffect(() => {
    if (crewQuery.data) {
      setPhotographers(
        Array.isArray(crewQuery.data)
          ? crewQuery.data
          : crewQuery.data.results || [],
      );
    }
  }, [crewQuery.data]);
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
  const upcoming = useMemo(
    () => events.filter((e) => upcomingStatuses.has(e.status)),
    [events],
  );
  const completed = useMemo(
    () => events.filter((e) => e.status === "Completed"),
    [events],
  );

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

  return (
    <div className="operationsWorkspace">
      <header>
        <div>
          <small>OPERATIONS</small>
          <h1>{view}</h1>
          <p>Plan shoots, assign your crew, and track every event.</p>
        </div>
        <div className="operationsActions">
          {view !== "Photographers Details" && view !== "Completed Events" && (
            <>
              {!readOnly && (
                <button
                  className="primary"
                  onClick={() => setEventDraft({ ...blankEvent })}
                >
                  ＋ Add Event
                </button>
              )}
            </>
          )}
          {view === "Photographers Details" && !readOnly && (
            <button
              className="primary"
              onClick={() => setCrewDraft({ ...blankPhotographer })}
            >
              ＋ Add Photographer
            </button>
          )}
        </div>
      </header>
      <nav className="operationsTabs">
        {views.map((item) => (
          <button
            key={item}
            className={view === item ? "active" : ""}
            onClick={() => setView(item)}
          >
            {item}
          </button>
        ))}
      </nav>
      {view === "Dashboard" && (
        <Dashboard
          events={events}
          photographers={photographers}
          open={() => setView("Upcoming Events")}
        />
      )}
      {view === "Calendar" && <CalendarWorkspace />}
      {view === "Upcoming Events" && (
        <EventTable
          events={upcoming}
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
          rows={photographers}
          edit={readOnly ? undefined : setCrewDraft}
          remove={
            readOnly
              ? undefined
              : (id) => remove(`/photographers/${id}/`, loadCrew)
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
  open: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10),
    upcoming = events.filter((e) => upcomingStatuses.has(e.status));
  return (
    <>
      <section className="salesKpis">
        <article>
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
        <article>
          <span>Completed</span>
          <b>{events.filter((e) => e.status === "Completed").length}</b>
          <small>finished shoots</small>
        </article>
        <article>
          <span>Crew</span>
          <b>{photographers.length}</b>
          <small>photographers</small>
        </article>
      </section>
      <section className="panel">
        <div className="panelHead">
          <h2>Next Shoots</h2>
          <button
            className="iconOnlyAction viewAction"
            title="View all upcoming events"
            aria-label="View all upcoming events"
            onClick={open}
          >
            ◉
          </button>
        </div>
        <EventTable events={upcoming.slice(0, 8)} compact />
      </section>
    </>
  );
}

function EventTable({
  events,
  edit,
  remove,
  onMessage,
  onDuplicate,
  compact = false,
}: {
  events: Row[];
  edit?: (row: Row) => void;
  remove?: (id: any) => void;
  onMessage?: (row: Row) => void;
  onDuplicate?: (row: Row) => void;
  compact?: boolean;
}) {
  const crew = (value: any) => {
    const assignments = String(value || "")
      .split(/\s*;\s*/)
      .map((assignment) => assignment.trim())
      .filter(Boolean);
    const namedAssignments = assignments.filter(
      (assignment) => !["X", "XX", "NA"].includes(assignment.toUpperCase()),
    );
    const multipleNames = namedAssignments.length > 1;
    return assignments.length ? (
      <div className={`crewAssignments ${multipleNames ? "multipleCrew" : ""}`}>
        {assignments.map((assignment) => {
          const marker = assignment.toUpperCase();
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
            <span className={colorClass} key={assignment}>
              {assignment}
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
                    .join(" · ") || "—"}
                </td>
                <td>
                  <span className="statusPill">{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!events.length && <div className="empty">No events found.</div>}
      </div>
    );
  return (
    <div className="table upcomingEventsTableWrap">
      <table className="upcomingEventsTable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Client Name</th>
            <th>Handled By</th>
            <th>Couple Name</th>
            <th>Contact No.</th>
            <th>Event</th>
            <th>Photo</th>
            <th>Video</th>
            <th>Candid</th>
            <th>Cinematic</th>
            <th>Drone</th>
            <th>Assistant</th>
            <th>BTS</th>
            <th>Venue</th>
            <th>Time</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((row) => (
            <tr key={row.id}>
              <td>{dateLabel(row.start_date)}</td>
              <td>
                <b>{row.client_name || row.title}</b>
              </td>
              <td>{row.handled_by || "—"}</td>
              <td>{row.couple_name || "—"}</td>
              <td>{row.contact_no || "—"}</td>
              <td>{row.event_type}</td>
              <td>{crew(row.photo)}</td>
              <td>{crew(row.video)}</td>
              <td>{crew(row.candid)}</td>
              <td>{crew(row.cinematic)}</td>
              <td>{crew(row.drone)}</td>
              <td>{crew(row.assistant)}</td>
              <td>{crew(row.bts)}</td>
              <td>{row.city || "—"}</td>
              <td>{row.start_time?.slice(0, 5) || "—"}</td>
              <td className="eventNotes">{row.notes || "—"}</td>
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
                .map((e) =>
                  edit ? (
                    <button key={e.id} onClick={() => edit({ ...e })}>
                      {e.start_time?.slice(0, 5)} {e.client_name || e.title}
                    </button>
                  ) : (
                    <small key={e.id} className="calendarReadOnlyEvent">
                      {e.start_time?.slice(0, 5)} {e.client_name || e.title}
                    </small>
                  ),
                )}
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
  return (
    <section className="panel">
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Based In</th>
              <th>Work</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <b>{row.name}</b>
                </td>
                <td>{row.mobile || "—"}</td>
                <td>{row.living_in || "—"}</td>
                <td>{row.work || "—"}</td>
                <td>
                  <span className="statusPill">{row.status}</span>
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
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <div className="empty">No photographers yet.</div>}
      </div>
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
      <form className="modalCard operationModal" onSubmit={save}>
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
