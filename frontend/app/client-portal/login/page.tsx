"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, getSignInErrorMessage } from "@/lib/api";

function ClientLoginForm() {
  const router = useRouter(),
    params = useSearchParams();
  const [studio, setStudio] = useState(params.get("studio") || ""),
    [clientId, setClientId] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [show, setShow] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const { data } = await api.post("/client-portal/auth/login/", {
        studio,
        client_id: clientId,
        password,
      });
      router.replace(data.portal_url);
    } catch (problem: unknown) {
      setError(getSignInErrorMessage(problem));
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="clientAuth clientAuthLight">
      <div className="clientAuthShell">
        <section className="clientAuthIntro" aria-label="Client portal overview">
          <img
            className="clientAuthLenspireLogo"
            src="/login/lenspire-wordmark.png"
            alt="Lenspire.ai — See, Create, Inspire"
          />
          <h1>Your event, all in one beautiful place.</h1>
          <p className="clientAuthIntroCopy">Review your event details, payments and final deliveries whenever you need them. Sign in with the Client ID shared by your studio.</p>
          <div className="clientAuthFeatures">
            <span>✦ Event details</span><span>✦ Payment tracking</span><span>✦ Secure deliveries</span>
          </div>
          <p className="clientAuthSecurity"><b>⌁</b> Private and secure client access</p>
        </section>
        <form onSubmit={submit}>
          <div className="clientAuthBrand"><img src="/ankit-studios-logo.png" alt="Ankit Studios" /><small>ANKIT STUDIOS · CLIENT PORTAL</small><span>Powered by LenspireCRM</span></div>
          <div className="clientAuthHeading"><h2>Welcome back</h2><p>Sign in to access your personal event space.</p></div>
          <label>
            Studio ID
            <div className="clientAuthInput"><i>◇</i><input required value={studio} onChange={(e) => setStudio(e.target.value)} placeholder="studio-name" /></div>
          </label>
          <label>
            Client ID
            <div className="clientAuthInput"><i>♟</i><input required value={clientId} onChange={(e) => setClientId(e.target.value)} autoComplete="username" placeholder="e.g. BKG-00001" /></div>
          </label>
          <label>
            4-digit PIN
            <div className="clientAuthInput"><i>◈</i><input type={show ? "text" : "password"} inputMode="numeric" pattern="[0-9]{4}" maxLength={4} required value={password} onChange={(e) => setPassword(e.target.value.replace(/\D/g, ""))} autoComplete="current-password" placeholder="••••" /></div>
          </label>
          <label className="clientShowPassword">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show PIN
          </label>
          {error && <div className="error">{error}</div>}
          <button className="primary" disabled={busy}>{busy ? "Signing in…" : "Sign in to portal"}<span aria-hidden="true">→</span></button>
          <p className="clientAuthHelp">Need access? Please contact your photography studio.</p>
        </form>
      </div>
    </main>
  );
}
export default function ClientLoginPage() {
  return (
    <Suspense fallback={<main className="clientAuth">Loading…</main>}>
      <ClientLoginForm />
    </Suspense>
  );
}
