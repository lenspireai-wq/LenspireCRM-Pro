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
      <form onSubmit={submit}>
        <small>LENSPIRECRM · CLIENT PORTAL</small>
        <h1>Client Login</h1>
        <p>Sign in to view your event, payments and deliveries.</p>
        <label>
          Studio ID
          <input
            required
            value={studio}
            onChange={(e) => setStudio(e.target.value)}
            placeholder="studio-name"
          />
        </label>
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <label className="clientShowPassword">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />{" "}
          Show password
        </label>
        {error && <div className="error">{error}</div>}
        <button className="primary" disabled={busy}>
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
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
