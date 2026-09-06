"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";

const money = (value: any) => Number(value || 0).toLocaleString("en-IN", { style: "currency", currency: "INR" });
const date = (value: any) => value ? new Date(`${String(value).slice(0, 10)}T00:00:00`).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "TBD";

export default function ClientPortalPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<number | null>(null);
  const [pending, setPending] = useState<{ deliverable: any; action: "approve" | "changes" } | null>(null);
  const [message, setMessage] = useState("");
  const load = () => api.get(`/client-portal/${token}/`).then(({ data }) => setData(data)).catch((problem) => setError(problem.response?.data?.detail || "This portal is unavailable."));
  useEffect(() => { void load(); }, [token]);
  const feedback = async (deliverable: any, action: "approve" | "changes", feedbackMessage = "") => {
    if (action === "changes" && !feedbackMessage.trim()) return;
    setBusy(deliverable.id);
    try { await api.post(`/client-portal/${token}/`, { deliverable: deliverable.id, action, message: feedbackMessage.trim() }); setPending(null); setMessage(""); await load(); }
    catch (problem: any) { window.alert(problem.response?.data?.detail || "Could not submit feedback."); }
    finally { setBusy(null); }
  };
  if (error) return <main className="clientPortal"><section className="clientPortalHero"><small>LENSPIRECRM · CLIENT PORTAL</small><h1>Portal unavailable</h1><p>{error}</p></section></main>;
  if (!data) return <main className="clientPortal"><section className="clientPortalHero"><small>LENSPIRECRM · CLIENT PORTAL</small><h1>Opening secure portal…</h1></section></main>;
  const booking = data.booking;
  return <main className="clientPortal">
    <section className="clientPortalHero">
      {data.studio.logo_url && <img src={data.studio.logo_url} alt="Studio logo" />}
      <small>{data.studio.name} · CLIENT PORTAL</small>
      <h1>{booking.couple_name || booking.client_name}</h1>
      <p>{booking.code} · {booking.event_type} · {date(booking.event_date)}</p>
    </section>
    <section className="clientPortalStats"><article><small>Total Booking</small><b>{money(booking.total)}</b></article><article><small>Received</small><b>{money(booking.received)}</b></article><article><small>Balance</small><b>{money(booking.balance)}</b></article></section>
    <section className="clientPortalCard"><h2>Events</h2>{data.events.length ? data.events.map((event: any, index: number) => <div className="clientPortalRow" key={index}><b>{event.event_type}</b><span>{date(event.start_date)} · {event.status}</span></div>) : <p>No event details available.</p>}</section>
    <section className="clientPortalCard"><h2>Payment Summary</h2>{data.payments.length ? data.payments.map((payment: any, index: number) => <div className="clientPortalRow" key={index}><b>{payment.payment_type} · {money(payment.amount)}</b><span>{date(payment.paid_at || payment.due_date)} · {payment.status}</span></div>) : <p>No payment entries yet.</p>}</section>
    <section className="clientPortalCard"><h2>Gallery Delivery & Approval</h2>{data.deliverables.length ? data.deliverables.map((item: any) => <article className="clientDeliverable" key={item.id}><div><b>{item.name}</b><span>{item.status}</span></div><a href={item.drive_link} target="_blank" rel="noopener noreferrer">View Gallery</a>{item.status === "Client Approved" ? <p className="clientApproved">✓ Approved</p> : <div className="clientFeedback"><button disabled={busy === item.id} onClick={() => setPending({deliverable:item,action:"approve"})}>✓ Approve</button><button disabled={busy === item.id} onClick={() => setPending({deliverable:item,action:"changes"})}>✎ Request Changes</button></div>}{item.revision_notes && <p>{item.revision_notes}</p>}</article>) : <p>Your gallery will appear here when it is ready.</p>}</section>
    <footer>For help, contact {data.studio.phone || data.studio.email || data.studio.name}.</footer>
    {pending && <div className="clientFeedbackBackdrop"><section className="clientFeedbackModal"><h2>{pending.action === "approve" ? `Approve ${pending.deliverable.name}?` : `Request changes to ${pending.deliverable.name}`}</h2><p>{pending.action === "approve" ? "Confirm that this work is accepted." : "Tell the production team exactly what should be revised."}</p>{pending.action === "changes" && <textarea autoFocus rows={5} value={message} onChange={(event)=>setMessage(event.target.value)} placeholder="Enter the changes required…"/>}<div><button onClick={()=>{setPending(null);setMessage("")}}>Cancel</button><button className="primary" disabled={busy === pending.deliverable.id || (pending.action === "changes" && !message.trim())} onClick={()=>feedback(pending.deliverable,pending.action,message)}>{pending.action === "approve" ? "Confirm Approval" : "Submit Changes"}</button></div></section></div>}
  </main>;
}
