"use client";
import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Register the short-lived retirement worker once.  It replaces any
    // previously installed offline worker, clears its cached bundles, and
    // unregisters itself.  This is essential for phones that still have an
    // older worker controlling the CRM after a previous release.
    void navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then((registration) => registration.update())
      .catch((error) => console.warn("CRM cache cleanup failed", error));
  }, []);
  return null;
}
