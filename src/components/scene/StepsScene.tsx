"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { SceneFallback } from "./internal/SceneFallback";

const StepsCanvas = dynamic(() => import("./steps/StepsCanvas"), {
  ssr: false,
  loading: () => <SceneFallback variant="steps" />,
});

export type StepsSceneProps = {
  /** The open "How it works" step: 0 Say it, 1 Throw it, 2 Zap it, 3 Step inside. */
  step: 0 | 1 | 2 | 3;
  className?: string;
};

/** Illustration for the open step. Fills the box it is given (about 4:3 or square works best). */
export function StepsScene({ step, className }: StepsSceneProps) {
  return (
    <div aria-hidden="true" className={cn("relative h-full w-full", className)}>
      <StepsCanvas step={step} />
    </div>
  );
}
