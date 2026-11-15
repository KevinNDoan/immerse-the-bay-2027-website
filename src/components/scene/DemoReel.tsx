"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SceneFallback } from "./internal/SceneFallback";

const ReelCanvas = dynamic(() => import("./reel/ReelCanvas"), {
  ssr: false,
  loading: () => <SceneFallback variant="reel" />,
});

export type DemoReelProps = { className?: string };

/** Decorative stand-in for the demo video: a 16:9 loop of the four steps, ending on the step inside. */
export function DemoReel({ className }: DemoReelProps) {
  return (
    <div aria-hidden="true" className={cn("relative aspect-video w-full overflow-hidden", className)}>
      <ReelCanvas />
    </div>
  );
}
