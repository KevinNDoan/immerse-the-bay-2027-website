"use client";

// Live text that hangs off a star: the Paper sticky note (design-system.md 5.2), the small
// suggested-topic label (5.4), or the mic hint. Place it inside a <Star> so it follows the star.
// The DOM lives in the scene's OverlayLayer; this component only registers it and, every frame,
// projects its 3D position to pixels and writes opacity and transform to the element.

import { useEffect, useId, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Vector3 } from "three";
import { useOverlay, type OverlaySize } from "./overlay";

export type NoteLook = { opacity: number; scale: number; /** Overrides offsetY when set. */ y?: number };

type NoteProps = {
  text?: string;
  variant?: "note" | "label" | "mic";
  size?: OverlaySize;
  /** Pixels from the star's centre to the top of the note. */
  offsetY?: number;
  /** Pixels to shift sideways (negative is left), measured from the note's centre. */
  offsetX?: number;
  /** Small fixed tilt in degrees, so notes feel stuck on by hand. */
  tilt?: number;
  /** Anchor at the note's vertical middle instead of its top (for the mic hint). */
  middle?: boolean;
  drive: (out: NoteLook, t: number, dt: number) => void;
};

const P = new Vector3();

export function Note({
  text = "",
  variant = "note",
  size = "md",
  offsetY = 20,
  offsetX = 0,
  tilt = 0,
  middle = false,
  drive,
}: NoteProps) {
  const store = useOverlay();
  const id = useId();
  const anchor = useRef<Group>(null);
  const look = useRef<NoteLook>({ opacity: 0, scale: 0 });

  useEffect(() => {
    if (!store) return;
    store.add({ id, kind: variant, text, size });
  }, [store, id, variant, text, size]);
  useEffect(() => {
    if (!store) return;
    return () => store.remove(id);
  }, [store, id]);

  useFrame(({ camera, size: px }, delta) => {
    const l = look.current;
    drive(l, performance.now() / 1000, Math.min(delta, 1 / 20));
    const el = store?.el(id);
    const g = anchor.current;
    if (!el || !g) return;
    g.getWorldPosition(P);
    P.project(camera);
    const behind = P.z > 1;
    const o = behind || l.opacity < 0.01 ? 0 : l.opacity;
    el.style.opacity = String(o);
    el.style.visibility = o === 0 ? "hidden" : "visible";
    if (o === 0) return;
    const x = (P.x * 0.5 + 0.5) * px.width;
    const y = (-P.y * 0.5 + 0.5) * px.height;
    const dy = middle ? "-50%" : `${(l.y ?? offsetY).toFixed(1)}px`;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(calc(-50% + ${offsetX}px), ${dy}) rotate(${tilt}deg) scale(${l.scale.toFixed(4)})`;
  });

  return <group ref={anchor} />;
}
