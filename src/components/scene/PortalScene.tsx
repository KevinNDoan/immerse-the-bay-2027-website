"use client";

// "Step inside a star": a round portal framed by a glowing star, with a small monochrome world inside.
// Click the portal or the button to step inside; click again, the button, or Escape to step back out.

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SceneFallback } from "./internal/SceneFallback";

const PortalCanvas = dynamic(() => import("./portal/PortalCanvas"), {
  ssr: false,
  loading: () => <SceneFallback variant="portal" />,
});

export type PortalSceneProps = { className?: string };

export function PortalScene({ className }: PortalSceneProps) {
  const [entered, setEntered] = useState(false);
  const toggle = useCallback(() => setEntered((v) => !v), []);

  useEffect(() => {
    if (!entered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEntered(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [entered]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div aria-hidden="true" className="absolute inset-0">
        <PortalCanvas entered={entered} onToggle={toggle} />
      </div>
      <button
        type="button"
        onClick={toggle}
        className="absolute bottom-4 left-1/2 min-h-11 -translate-x-1/2 rounded-full border border-white/15 bg-void/70 px-5 text-sm font-medium text-white backdrop-blur-md transition-[background-color,border-color,transform] hover:border-white/40 hover:bg-void/85 active:scale-[0.97]"
      >
        {entered ? "Step back out" : "Step inside"}
      </button>
    </div>
  );
}
