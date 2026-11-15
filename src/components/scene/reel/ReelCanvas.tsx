"use client";

// The demo reel: the four "How it works" beats on a loop, about three seconds each, with a slow
// handheld drift, ending on the portal step-inside. A quick fade from the void hides each cut between
// the steps scene and the portal. Pauses offscreen; with reduced motion it holds on the zap.

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { SceneCanvas } from "../internal/SceneCanvas";
import { PORTAL_FOV, PortalRig } from "../internal/PortalRig";
import { StepsWorld, type Step } from "../steps/StepsCanvas";
import { usePrefersReducedMotion } from "../internal/motion";

type Beat = { kind: "steps"; step: Step; seconds: number } | { kind: "portal"; entered: boolean; seconds: number };

const BEATS: Beat[] = [
  { kind: "steps", step: 0, seconds: 3 },
  { kind: "steps", step: 1, seconds: 3 },
  { kind: "steps", step: 2, seconds: 3 },
  { kind: "portal", entered: false, seconds: 1.2 },
  { kind: "portal", entered: true, seconds: 2.6 },
];
const HOLD: Beat = { kind: "steps", step: 2, seconds: 0 };

export default function ReelCanvas() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced || !visible) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % BEATS.length), BEATS[index].seconds * 1000);
    return () => window.clearTimeout(id);
  }, [index, reduced, visible]);

  const beat = reduced ? HOLD : BEATS[index];

  return (
    <div className="absolute inset-0">
      <SceneCanvas
        variant="reel"
        onVisible={setVisible}
        camera={{ position: [0, 0, 8], fov: PORTAL_FOV, near: 0.05, far: 80 }}
      >
        {beat.kind === "steps" ? (
          <StepsWorld key="steps" step={beat.step} reduced={reduced} drift distance={6.4} />
        ) : (
          <PortalRig key="portal" entered={beat.entered} reduced={reduced} interactive={false} drift />
        )}
      </SceneCanvas>
      {reduced ? null : (
        <AnimatePresence initial={false}>
          <motion.div
            key={beat.kind}
            className="pointer-events-none absolute inset-0 bg-void"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
        </AnimatePresence>
      )}
    </div>
  );
}
