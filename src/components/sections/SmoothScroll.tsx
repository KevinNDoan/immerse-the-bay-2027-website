"use client";

import "lenis/dist/lenis.css";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Smooth wheel scrolling for the whole page, off for anyone who asked for reduced motion.
 * Anchor links go through Lenis too; it honours each section's scroll-margin-top, so they land below the nav.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <ReactLenis root options={{ anchors: true, autoRaf: true, lerp: 0.12 }}>
      {children}
    </ReactLenis>
  );
}
