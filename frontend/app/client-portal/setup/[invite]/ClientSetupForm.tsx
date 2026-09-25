"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api, apiAssetUrl } from "@/lib/api";

type InviteDetails = {
  studio: { name: string; logo_url?: string };
  client_name: string;
  couple_name?: string;
  display_name: string;
};

export default function ClientSetupForm() {
  const { invite } = useParams<{ invite: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fallbackStudioName = searchParams.get("studio")?.trim() || "Your Studio";
  const fallbackCoupleName = searchParams.get("couple")?.trim() || "";
  const [details, setDetails] = useState<InviteDetails | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const studioName = details?.studio.name || fallbackStudioName;
  const coupleName = details?.couple_name || fallbackCoupleName;

  useEffect(() => {
    let active = true;
    api.get<InviteDetails>("/client-portal/auth/setup/", { params: { token: invite } })
      .then(({ data }) => { if (active) setDetails(data); })
      .catch(() => { /* PIN submission displays the canonical invite error. */ });
    return () => { active = false; };
  }, [invite]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirm) { setError("PINs do not match."); return; }
    setBusy(true); setError("");
    try {
      const { data } = await api.post("/client-portal/auth/setup/", { token: invite, password });
      router.replace(data.portal_url);
    } catch (problem: any) {
      setError(problem.response?.data?.password || problem.response?.data?.detail || "Could not create PIN.");
    } finally { setBusy(false); }
  };

  return <main className="clientAuth clientAuthLight"><div className="clientAuthShell"><section className="clientAuthIntro" aria-label={`${studioName} client portal`}>{details?.studio.logo_url && <img className="clientAuthStudioLogo" src={apiAssetUrl(details.studio.logo_url)} alt={`${studioName} logo`} />}<h1>Your event, all in one beautiful place.</h1>{coupleName && <p className="clientAuthCouple">Welcome, {coupleName}</p>}<p className="clientAuthIntroCopy">Set up secure access to your event details, payments and final deliveries.</p><div className="clientAuthOwnership"><p>For help, contact <b>{studioName}</b>.</p><p><b>{studioName}</b> uses LenspireAI as its technology service provider. All studio services, client relationships, and content provided through this portal are owned and managed by {studioName}.</p></div><p className="clientAuthSecurity"><b>⌁</b> Private and secure client access</p></section><form onSubmit={submit}><div className="clientAuthBrand"><small>{studioName.toUpperCase()} · CLIENT PORTAL</small><span>{details?.display_name ? `Secure access for ${details.display_name}` : `Secure access from ${studioName}`}</span></div><div className="clientAuthHeading"><h2>Create your 4-digit PIN</h2><p>This invitation can be used only once.</p></div><label>New PIN<div className="clientAuthInput"><i>◈</i><input type={show ? "text" : "password"} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required value={password} onChange={event => setPassword(event.target.value.replace(/\D/g, ""))} /></div></label><label>Confirm PIN<div className="clientAuthInput"><i>◈</i><input type={show ? "text" : "password"} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required value={confirm} onChange={event => setConfirm(event.target.value.replace(/\D/g, ""))} /></div></label><label className="clientShowPassword"><input type="checkbox" checked={show} onChange={event => setShow(event.target.checked)} /> Show PIN</label>{error && <div className="error">{error}</div>}<button className="primary" disabled={busy}>{busy ? "Creating…" : "Create PIN & Open Portal"}</button></form></div></main>;
}
