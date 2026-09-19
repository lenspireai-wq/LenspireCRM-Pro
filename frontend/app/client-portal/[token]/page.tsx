"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/date-format";

const money = (value: any) => Number(value || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });
const date = (value: any) => formatDate(value, "TBD");
const eventDate = (event: any) => event.date_status === "TBD Month" && event.tbd_month ? `TBD · ${date(`${event.tbd_month}-01`)}` : date(event.start_date);
const mapLink = (value: any) => String(value || "").match(/https?:\/\/[^\s]+/)?.[0] || "";
const venueText = (value: any) => String(value || "").replace(/https?:\/\/[^\s]+/, "").trim();

export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [pending, setPending] = useState<{ deliverable: any; action: "approve" | "changes" } | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [message, setMessage] = useState("");
  const load = () => api.get(`/client-portal/${token}/`).then(({ data }) => setData(data)).catch((problem) => setError(problem.response?.data?.detail || "This portal is unavailable."));
  useEffect(() => {
    const documentRoot = document.documentElement;
    const previousTheme = documentRoot.dataset.theme;
    const previousColorScheme = documentRoot.style.colorScheme;
    documentRoot.dataset.theme = "light";
    documentRoot.style.colorScheme = "light";
    return () => {
      documentRoot.dataset.theme = previousTheme;
      documentRoot.style.colorScheme = previousColorScheme;
    };
  }, []);
  useEffect(() => { void load(); }, [token]);
  const feedback = async (deliverable: any, action: "approve" | "changes", feedbackMessage = "") => {
    if (action === "changes" && !feedbackMessage.trim()) return;
    setBusy(deliverable.id);
    try { await api.post(`/client-portal/${token}/`, { deliverable: deliverable.id, action, message: feedbackMessage.trim() }); setPending(null); setMessage(""); await load(); }
    catch (problem: any) { window.alert(problem.response?.data?.detail || "Could not submit feedback."); }
    finally { setBusy(null); }
  };
  if (error) return <main className="clientPortal"><section className="clientPortalHero"><img src="/ankit-studios-logo.png" alt="Ankit Studios" /><small>ANKIT STUDIOS · CLIENT PORTAL</small><h1>Portal unavailable</h1><p>{error}</p></section></main>;
  if (!data) return <main className="clientPortal"><section className="clientPortalHero"><img src="/ankit-studios-logo.png" alt="Ankit Studios" /><small>ANKIT STUDIOS · CLIENT PORTAL</small><h1>Opening secure portal…</h1></section></main>;
  const booking = data.booking;
  const nextEvent = [...data.events]
    .filter((event: any) => event.start_date && event.start_date >= new Date().toISOString().slice(0, 10) && event.status !== "Cancelled")
    .sort((first: any, second: any) => String(first.start_date).localeCompare(String(second.start_date)))[0];
  return <main className="clientPortal">
    <section className="clientPortalHero">
      <div className="clientPortalHeroGlow" aria-hidden="true" />
      <div className="clientPortalHeroTop"><img className="clientPortalStudioLogo" src={data.studio.logo_url || "/ankit-studios-logo.png"} alt={data.studio.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/ankit-studios-logo.png"; }} /><span>Private client space</span></div>
      <small>{data.studio.name} · CLIENT PORTAL</small>
      <h1>{booking.couple_name || booking.client_name}</h1>
      <p>{booking.code} <i>•</i> {booking.event_type} <i>•</i> {date(booking.event_date)}</p>
      {nextEvent && <aside className="clientPortalHeroFeature"><small>UP NEXT</small><b>{nextEvent.event_type}</b><span>{eventDate(nextEvent)}{nextEvent.start_time ? ` · ${formatTime(nextEvent.start_time)}` : ""}</span></aside>}
      <div className="clientPortalHeroFooter"><span>✦ Your event journey, beautifully organised</span><b>Powered by LenspireAI</b></div>
    </section>
    <section className="clientPortalStats"><article><small>Total Booking</small><b>{money(booking.total)}</b></article><article><small>Received</small><b>{money(booking.received)}</b></article><article><small>Balance</small><b>{money(booking.balance)}</b></article></section>
    {data.read_only_preview && <p className="clientPortalPreviewBanner">Studio preview · Read-only client view</p>}
    <section className="clientPortalGrid">
      <section className="clientPortalCard clientPortalEvents"><div className="clientPortalCardTitle"><span>01</span><div><small>YOUR CELEBRATION</small><h2>Events</h2></div></div>{data.events.length ? data.events.map((event: any, index: number) => <div className="clientPortalRow" key={event.id || index}><i>{String(index + 1).padStart(2, "0")}</i><div><b>{event.event_type}</b><span>{eventDate(event)}</span></div><button className="clientEventDetails" type="button" onClick={() => setSelectedEvent(event)}>View details</button><em>{event.status}</em></div>) : <p>No event details available.</p>}</section>
      <section className="clientPortalCard clientPortalPayments"><div className="clientPortalCardTitle"><span>02</span><div><small>BOOKING LEDGER</small><h2>Payment Summary</h2></div></div>{data.payments.length ? data.payments.map((payment: any, index: number) => <div className="clientPortalRow" key={index}><div><b>{payment.payment_type}{payment.percent ? ` · ${payment.percent}%` : ""}</b><span>{date(payment.paid_at || payment.due_date)}</span></div><strong>{money(payment.amount)}</strong><em>{payment.status}</em></div>) : <p>No payment entries yet.</p>}</section>
    </section>
    <section className="clientPortalCard clientPortalQuotations"><div className="clientPortalCardTitle"><span>03</span><div><small>YOUR DOCUMENTS</small><h2>Quotations</h2></div></div>{data.quotations?.length ? data.quotations.map((quotation: any) => <article className="clientQuotation" key={quotation.id}><div><b>{quotation.name}</b><span>Uploaded {date(quotation.created_at)}</span></div><a href={`${api.defaults.baseURL}/client-portal/${encodeURIComponent(token)}/quotations/${quotation.id}/`} target="_blank" rel="noopener noreferrer">View quotation <i>↗</i></a></article>) : <p>Your quotation will appear here once shared by the studio.</p>}</section>
      <section className="clientPortalCard clientPortalDeliveries"><div className="clientPortalCardTitle"><span>04</span><div><small>FINAL MEMORIES</small><h2>Gallery Delivery & Approval</h2></div></div>{data.deliverables.length ? data.deliverables.map((item: any) => <article className={`clientDeliverable ${item.thumbnail_url ? "hasThumbnail" : ""}`} key={item.id}>{item.thumbnail_url && <img className="clientGalleryThumbnail" src={item.thumbnail_url} alt={`${item.name} preview`} onError={(event) => { event.currentTarget.style.display = "none"; event.currentTarget.parentElement?.classList.remove("hasThumbnail"); }} />}<div className="clientDeliverableTop"><div className="clientDeliverableIcon">✦</div><div><b>{item.name}</b><span>{item.status}</span></div></div><a href={item.drive_link} target="_blank" rel="noopener noreferrer">Open Gallery <i>↗</i></a>{item.status === "Client Approved" ? <p className="clientApproved">✓ Approved</p> : data.read_only_preview ? <p className="clientPreviewNotice">Studio preview · Approval actions are disabled.</p> : <div className="clientFeedback"><button disabled={busy === item.id} onClick={() => setPending({deliverable:item,action:"approve"})}>✓ Approve</button><button disabled={busy === item.id} onClick={() => setPending({deliverable:item,action:"changes"})}>✎ Request Changes</button></div>}{item.revision_notes && <p>{item.revision_notes}</p>}</article>) : <p>Your gallery will appear here when it is ready.</p>}</section>
    <footer>For help, contact {data.studio.phone || data.studio.email || data.studio.name}.</footer>
    {pending && <div className="clientFeedbackBackdrop"><section className="clientFeedbackModal"><h2>{pending.action === "approve" ? `Approve ${pending.deliverable.name}?` : `Request changes to ${pending.deliverable.name}`}</h2><p>{pending.action === "approve" ? "Confirm that this work is accepted." : "Tell the production team exactly what should be revised."}</p>{pending.action === "changes" && <textarea autoFocus rows={5} value={message} onChange={(event)=>setMessage(event.target.value)} placeholder="Enter the changes required…"/>}<div><button onClick={()=>{setPending(null);setMessage("")}}>Cancel</button><button className="primary" disabled={busy === pending.deliverable.id || (pending.action === "changes" && !message.trim())} onClick={()=>feedback(pending.deliverable,pending.action,message)}>{pending.action === "approve" ? "Confirm Approval" : "Submit Changes"}</button></div></section></div>}
    {selectedEvent && <div className="clientFeedbackBackdrop" role="dialog" aria-modal="true" aria-label="Event details"><section className="clientFeedbackModal clientEventModal"><small>READ-ONLY EVENT FORM</small><h2>{selectedEvent.event_type}</h2><dl><div><dt>Event date</dt><dd>{eventDate(selectedEvent)}</dd></div><div><dt>Time</dt><dd>{formatTime(selectedEvent.start_time, "To be confirmed")}{selectedEvent.end_time ? ` – ${formatTime(selectedEvent.end_time)}` : ""}</dd></div><div><dt>Venue / city</dt><dd>{venueText(selectedEvent.city) || "To be confirmed"}{mapLink(selectedEvent.city) && <a className="clientEventMapLink" href={mapLink(selectedEvent.city)} target="_blank" rel="noopener noreferrer">Open in Maps ↗</a>}</dd></div><div><dt>Status</dt><dd>{selectedEvent.status}</dd></div></dl><div><button className="primary" onClick={() => setSelectedEvent(null)}>Close</button></div></section></div>}
  </main>;
}
