"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function ClientLoginForm() {
  const router = useRouter(),
    params = useSearchParams();
  const [studio, setStudio] = useState(params.get("studio") || ""),
    [email, setEmail] = useState(""),
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
        email,
        password,
      });
      router.replace(data.portal_url);
    } catch (problem: any) {
      setError(problem.response?.data?.detail || "Could not sign in.");
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="clientAuth">
      <div className="clientAuthShell">
        <section className="clientAuthIntro" aria-label="Client portal overview">
          <div className="clientAuthIntroMark">LP</div>
          <p className="clientAuthEyebrow">LENSPIRECRM · CLIENT PORTAL</p>
          <h1>Your event, all in one beautiful place.</h1>
          <p className="clientAuthIntroCopy">Review your event details, payments and final deliveries whenever you need them.</p>
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
            <input required value={studio} onChange={(e) => setStudio(e.target.value)} placeholder="studio-name" />
          </label>
          <label>
            Email address
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Enter your password" />
          </label>
          <label className="clientShowPassword">
            <input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Show password
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
