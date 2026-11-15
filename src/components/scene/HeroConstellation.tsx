"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SceneFallback } from "./internal/SceneFallback";

const HeroCanvas = dynamic(() => import("./hero/HeroCanvas"), {
  ssr: false,
  loading: () => <SceneFallback variant="hero" />,
});

export type HeroConstellationProps = {
  /** Topics shown so far. Each time this grows, the newest topic pops in as a star with a note. */
  topics: string[];
  className?: string;
};

/** Full-bleed background constellation. Fills its parent; give the parent a size and position. */
export function HeroConstellation({ topics, className }: HeroConstellationProps) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none relative h-full w-full", className)}>
      <HeroCanvas topics={topics} />
    </div>
  );
}
