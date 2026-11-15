"use client";

import { useEffect, useState, type ReactNode } from "react";
import { pamphlet } from "@/content/pitch";

type State = "hidden" | "saving" | "ready" | "offline";

const LABEL: Record<Exclude<State, "hidden">, string> = {
  saving: pamphlet.offlineSaving,
  ready: pamphlet.offlineReady,
  offline: pamphlet.offlineNow,
};

const ICON: Record<Exclude<State, "hidden">, ReactNode> = {
  // An arrow into a tray: being saved.
  saving: (
    <>
      <path d="M12 4v10" />
      <path d="m8 10 4 4 4-4" />
      <path d="M5 19h14" />
    </>
  ),
  // A tick: saved.
  ready: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  // A crossed-out signal: no network, reading the saved copy.
  offline: (
    <>
      <path d="M2 8.8a15 15 0 0 1 4.2-2.6" />
      <path d="M8.5 16.4a5 5 0 0 1 7 0" />
      <path d="M5 12.9a10 10 0 0 1 5.2-2.8" />
      <path d="M22 8.8a15 15 0 0 0-11.2-3.8" />
      <path d="M19 12.9a10 10 0 0 0-2.4-1.7" />
      <path d="m3 3 18 18" />
    </>
  ),
};

/**
 * Keeps the overview and its PDF for offline reading. It registers public/sw.js (which answers only the
 * pamphlet, the PDF and their static files), then hands the worker every file this page loaded so a later
 * visit with no signal looks the same. It shows a small status beside the PDF button; on narrow phones only
 * its icon shows. Production only: a worker in dev would serve stale builds.
 */
export function OfflineStatus() {
  const [state, setState] = useState<State>("hidden");

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const sw = navigator.serviceWorker;
    let saved = false;

    const show = () => setState(!navigator.onLine && sw.controller ? "offline" : saved ? "ready" : "saving");
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== "zap-cached") return;
      // The worker says whether the page and PDF really were saved; if not, keep showing "saving".
      saved = e.data.ok === true;
      show();
    };
    sw.addEventListener("message", onMessage);
    window.addEventListener("online", show);
    window.addEventListener("offline", show);
    show();

    sw.register("/sw.js", { scope: "/" })
      .then(() => sw.ready)
      .then((reg) => {
        const urls = [location.pathname, ...performance.getEntriesByType("resource").map((e) => e.name)];
        reg.active?.postMessage({ type: "zap-cache", urls });
      })
      .catch(() => {
        // No signal: an already installed worker still serves the saved copy.
        if (!sw.controller) setState("hidden");
      });

    return () => {
      sw.removeEventListener("message", onMessage);
      window.removeEventListener("online", show);
      window.removeEventListener("offline", show);
    };
  }, []);

  if (state === "hidden") return null;
  return (
    <span className="doc-status" role="status">
      <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
        {ICON[state]}
      </svg>
      <span className="doc-status-text">{LABEL[state]}</span>
    </span>
  );
}
