"use client";
import { useMemo, useState } from "react";
import { useApiMutation, useApiCollectionQuery, queryKeys } from "@/lib/query";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/date-format";

type CalendarEvent = {
  id: number;
  title: string;
  client_name?: string;
  couple_name?: string;
  contact_no?: string;
  event_type?: string;
  start_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  city?: string;
  status: string;
  notes?: string;
  handled_by?: string;
  date_status?: string;
  tbd_month?: string;
};

const STATUS_COLORS: Record<string, string> = {
  Scheduled: "var(--info)",
  Confirmed: "var(--success)",
  Completed: "var(--brand)",
  Cancelled: "var(--danger)",
  "In Progress": "var(--warning)",
};

const EVENT_TYPES = ["Wedding", "Pre-Wedding", "Engagement", "Reception", "Other"];

const startOfWeek = (date: Date) => {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
};

const startOfMonth = (date: Date) => {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
};

const isoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatTime = (value?: string | null) => {
  if (!value) return "—";
  const [hour, minute] = value.split(":");
  if (minute === undefined) return value;
  const hourNumber = Number(hour);
  if (Number.isNaN(hourNumber)) return value;
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const display = ((hourNumber + 11) % 12) + 1;
  return `${display}:${minute} ${suffix}`;
};

export default function CalendarWorkspace() {
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [selectedDate, setSelectedDate] = useState<string>(isoDate(today));
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [editing, setEditing] = useState<CalendarEvent | null>(null);

  const range = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const gridStart = startOfWeek(monthStart);
    const gridEnd = addDays(gridStart, 41);
    return { from: isoDate(gridStart), to: isoDate(gridEnd) };
  }, [cursor]);

  const { data, isLoading, isError, refetch } = useApiCollectionQuery<CalendarEvent>(
    queryKeys.events(range),
    `/events/?calendar_from=${range.from}&calendar_to=${range.to}&calendar_month=${isoDate(startOfMonth(cursor)).slice(0, 7)}&ordering=start_date,start_time,id`,
  );

  const events = useMemo(() => data?.results || [], [data?.results]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const event of events) {
      const key = event.date_status === "TBD Month" && event.tbd_month
        ? `${event.tbd_month}-01`
        : event.start_date;
      if (!key) continue;
      if (!map[key]) map[key] = [];
      map[key].push(event);
    }
    return map;
  }, [events]);

  const filteredEventsForDay = (key: string) => eventsByDate[key] || [];

  const moveMutation = useApiMutation<{ id: number; start_date: string }, CalendarEvent>({
    mutationFn: async ({ id, start_date }) => (await api.patch(`/events/${id}/`, { start_date })).data,
    onSuccess: () => refetch(),
  });

  const handleShift = (id: number, days: number) => {
    const event = events.find((row) => row.id === id);
    if (!event?.start_date) return;
    const next = addDays(new Date(event.start_date), days);
    moveMutation.mutate({ id, start_date: isoDate(next) });
  };

  const days = useMemo(() => {
    const gridStart = startOfWeek(startOfMonth(cursor));
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
  }, [cursor]);

  const selectedEvents = filteredEventsForDay(selectedDate);

  return (
    <section className="workspace calendar">
      <div className="calNav">
        <button className="billBtn" onClick={() => setCursor((c) => addDays(c, -30))} aria-label="Previous">‹</button>
        <strong>{cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</strong>
        <button className="billBtn" onClick={() => setCursor((c) => addDays(c, 30))} aria-label="Next">›</button>
      </div>

      {isLoading ? <p>Loading events…</p> : null}
      {isError ? <p role="alert">Could not load events. <button onClick={() => refetch()}>Retry</button></p> : null}

      <div className="calGrid calGridMonth">
        <div className="calHeader">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="calCells calCellsMonth">
          {days.map((day) => {
            const key = isoDate(day);
            const isCurrentMonth = day.getMonth() === cursor.getMonth();
            const isToday = key === isoDate(today);
            const isSelected = key === selectedDate;
            const dayEvents = filteredEventsForDay(key);
            return (
              <div
                key={key}
                className={`calCell${isCurrentMonth ? "" : " muted"}${isToday ? " today" : ""}${isSelected ? " selected" : ""}`}
                onClick={() => {
                  setSelectedDate(key);
                  setCursor(day);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = Number(e.dataTransfer.getData("text/plain"));
                  if (Number.isFinite(id)) {
                    moveMutation.mutate({ id, start_date: key });
                  }
                }}
              >
                <div className="calCellHead">
                  <span>{day.getDate()}</span>
                  {dayEvents.length > 0 ? <small>{dayEvents.length}</small> : null}
                </div>
                <ul>
                  {dayEvents.slice(0, 3).map((event) => (
                    <li
                      key={event.id}
                      className={event.date_status === "TBD Month" ? "calTbdEvent" : undefined}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", String(event.id))}
                      onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                      style={{ borderLeft: `3px solid ${STATUS_COLORS[event.status] || "var(--muted)"}` }}
                    >
                      <strong>{event.date_status === "TBD Month" ? "TBD" : formatTime(event.start_time)}</strong>
                      <span>{event.client_name || event.title}</span>
                    </li>
                  ))}
                  {dayEvents.length > 3 ? <li className="calMore">+ {dayEvents.length - 3} more</li> : null}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="calSidePanel">
        <header>
          <h2>{formatDate(selectedDate)}</h2>
          <button className="billBtn primary" onClick={() => setEditing({ id: 0, title: "", client_name: "", event_type: "Wedding", start_date: selectedDate, start_time: "10:00", status: "Scheduled" })}>New event</button>
        </header>
        {selectedEvents.length === 0 ? <p className="dashEmpty">No events scheduled.</p> : null}
        <ul>
          {selectedEvents.map((event) => (
            <li key={event.id}>
              <div>
                <strong>{event.client_name || event.title}</strong>
                <span>{event.event_type} · {event.city || "—"}</span>
                <small>{formatTime(event.start_time)} → {formatTime(event.end_time)} · {event.status}</small>
              </div>
              <div className="calCardActions">
                <button className="billBtn" onClick={() => setSelectedEvent(event)}>View</button>
                <button className="billBtn" onClick={() => setEditing(event)}>Edit</button>
                <button className="billBtn" onClick={() => handleShift(event.id, -1)} title="Move to previous day">‹-1d</button>
                <button className="billBtn" onClick={() => handleShift(event.id, 1)} title="Move to next day">+1d›</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedEvent ? <EventDetail event={selectedEvent} onClose={() => setSelectedEvent(null)} onEdit={(event) => { setSelectedEvent(null); setEditing(event); }} /> : null}
      {editing ? (
        <EventEditor
          event={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refetch(); }}
        />
      ) : null}
    </section>
  );
}

const EventDetail = ({ event, onClose, onEdit }: { event: CalendarEvent; onClose: () => void; onEdit: (event: CalendarEvent) => void }) => (
  <div className="billModalBackdrop" role="dialog" aria-modal="true" aria-label={event.title} onClick={onClose}>
    <div className="billModal" onClick={(e) => e.stopPropagation()}>
      <header><h2>{event.title || event.client_name || "Event"}</h2><button className="billBtn" onClick={onClose} aria-label="Close">×</button></header>
      <div className="calDetail">
        <p><strong>Client:</strong> {event.client_name || "—"}</p>
        <p><strong>Couple:</strong> {event.couple_name || "—"}</p>
        <p><strong>Type:</strong> {event.event_type || "—"}</p>
        <p><strong>Date:</strong> {event.start_date}</p>
        <p><strong>Time:</strong> {formatTime(event.start_time)} – {formatTime(event.end_time)}</p>
        <p><strong>City:</strong> {event.city || "—"}</p>
        <p><strong>Handled by:</strong> {event.handled_by || "—"}</p>
        <p><strong>Status:</strong> <span className="billStatus" style={{ background: STATUS_COLORS[event.status] || "var(--muted)" }}>{event.status}</span></p>
        {event.notes ? <p><strong>Notes:</strong> {event.notes}</p> : null}
        <div className="billActions">
          <button className="billBtn" onClick={onClose}>Close</button>
          <button className="billBtn primary" onClick={() => onEdit(event)}>Edit</button>
        </div>
      </div>
    </div>
  </div>
);

const EventEditor = ({ event, onClose, onSaved }: { event: CalendarEvent; onClose: () => void; onSaved: () => void }) => {
  const [title, setTitle] = useState(event.title);
  const [clientName, setClientName] = useState(event.client_name || "");
  const [eventType, setEventType] = useState(event.event_type || "Wedding");
  const [startDate, setStartDate] = useState(event.start_date || "");
  const [startTime, setStartTime] = useState(event.start_time || "");
  const [endTime, setEndTime] = useState(event.end_time || "");
  const [city, setCity] = useState(event.city || "");
  const [status, setStatus] = useState(event.status);
  const [notes, setNotes] = useState(event.notes || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isNew = !event.id;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        title: title || clientName || "Event",
        client_name: clientName,
        event_type: eventType,
        start_date: startDate,
        start_time: startTime || null,
        end_time: endTime || null,
        city,
        status,
        notes,
      };
      if (isNew) {
        await api.post("/events/", payload);
      } else {
        await api.patch(`/events/${event.id}/`, payload);
      }
      onSaved();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Could not save event");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="billModalBackdrop" role="dialog" aria-modal="true" aria-label={isNew ? "New event" : "Edit event"} onClick={onClose}>
      <div className="billModal" onClick={(e) => e.stopPropagation()}>
        <header><h2>{isNew ? "New event" : `Edit ${event.title || event.client_name || "event"}`}</h2><button className="billBtn" onClick={onClose} aria-label="Close">×</button></header>
        <form className="billForm" onSubmit={submit}>
          <label>Title<input value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <div className="billFormRow">
            <label>Client<input value={clientName} onChange={(e) => setClientName(e.target.value)} /></label>
            <label>Event type
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                {EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <label>City<input value={city} onChange={(e) => setCity(e.target.value)} /></label>
          </div>
          <div className="billFormRow">
            <label>Date<input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></label>
            <label>Start time<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></label>
            <label>End time<input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></label>
            <label>Status
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                {Object.keys(STATUS_COLORS).map((entry) => <option key={entry} value={entry}>{entry}</option>)}
              </select>
            </label>
          </div>
          <label>Notes<textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} /></label>
          {error ? <p className="error">{error}</p> : null}
          <div className="billActions">
            <button type="button" className="billBtn" onClick={onClose}>Cancel</button>
            <button type="submit" className="billBtn primary" disabled={submitting}>{submitting ? "Saving…" : isNew ? "Create event" : "Save changes"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
