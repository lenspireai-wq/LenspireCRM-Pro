"use client";
import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // The CRM contains live booking and payment information.  Serving a
    // cached page when a phone temporarily loses signal can show staff an
    // out-of-date workspace and makes Chrome report an "offline copy".
    // Remove older workers and their caches instead of registering a PWA
    // worker, so each successful visit always loads the current CRM.
    void navigator.serviceWorker.getRegistrations().then((registrations) =>
      Promise.all(registrations.map((registration) => registration.unregister())),
    );
    if ("caches" in window) {
      void caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key.startsWith("lenspirecrm-")).map((key) => caches.delete(key))),
      );
    }
  }, []);
  return null;
}
