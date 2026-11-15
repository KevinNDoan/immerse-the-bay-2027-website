"use client";

import { SceneCanvas } from "../internal/SceneCanvas";
import { PORTAL_FOV, PortalRig } from "../internal/PortalRig";
import { usePrefersReducedMotion } from "../internal/motion";

export type PortalCanvasProps = { entered: boolean; onToggle: () => void };

export default function PortalCanvas({ entered, onToggle }: PortalCanvasProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <SceneCanvas variant="portal" camera={{ position: [0, 0, 7], fov: PORTAL_FOV, near: 0.05, far: 80 }}>
      <PortalRig entered={entered} reduced={reduced} onToggle={onToggle} />
    </SceneCanvas>
  );
}
