"use client";

// One star, built from the designer's layers (design-system.md section 10, "How the star layers combine"):
// glow at the bottom, then ring / dashed ring / sparks / orbit, then the core on top.
// The scene drives every value per frame through `drive`, so nothing here re-renders while animating.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, Group, Sprite, SpriteMaterial, Vector3 } from "three";
import { useArt } from "./art";
import { now } from "./motion";

export type StarFrame = {
  position: Vector3;
  /** Overall size multiplier. 0 hides the star. */
  scale: number;
  /** Overall opacity, 0 to 1. Suggested stars use 0.4. */
  opacity: number;
  /** 0 to 1. Grabbed: brighter, larger, sparks. */
  grab: number;
  /** Solid ring (pointed at). */
  ring: number;
  /** Dashed ring (suggested). */
  dashed: number;
  /** Single sparkle twinkle. */
  sparkle: number;
  /** Visited orbit ring. */
  orbit: number;
  /** Extra glow multiplier, for flashes and the "step inside" bloom. */
  glow: number;
  /** Core opacity multiplier. */
  core: number;
};

export function makeStarFrame(): StarFrame {
  return {
    position: new Vector3(),
    scale: 1,
    opacity: 1,
    grab: 0,
    ring: 0,
    dashed: 0,
    sparkle: 0,
    orbit: 0,
    glow: 1,
    core: 1,
  };
}

type StarProps = {
  /** Diameter of the glow layer in world units. The core is a quarter of it. */
  size: number;
  drive: (f: StarFrame, t: number, dt: number) => void;
  /** Rendered after the sprites, inside the star's moving group (e.g. a note). */
  children?: React.ReactNode;
};

export function Star({ size, drive, children }: StarProps) {
  const art = useArt();
  const group = useRef<Group>(null);
  const glow = useRef<Sprite>(null);
  const ring = useRef<Sprite>(null);
  const dashed = useRef<Sprite>(null);
  const sparks = useRef<Sprite>(null);
  const sparkle = useRef<Sprite>(null);
  const orbit = useRef<Sprite>(null);
  const core = useRef<Sprite>(null);
  const frame = useRef<StarFrame | null>(null);

  useFrame((_, delta) => {
    if (!frame.current) frame.current = makeStarFrame();
    const f = frame.current;
    const t = now();
    drive(f, t, Math.min(delta, 1 / 20));
    const g = group.current;
    if (!g) return;
    g.position.copy(f.position);
    const visible = f.scale > 0.001 && f.opacity > 0.002;
    g.visible = visible;
    if (!visible) return;

    const s = size * f.scale;
    const o = f.opacity;
    const set = (sp: Sprite | null, scale: number, alpha: number, rot = 0) => {
      if (!sp) return;
      sp.visible = alpha > 0.002;
      sp.scale.set(s * scale, s * scale, 1);
      const m = sp.material as SpriteMaterial;
      m.opacity = alpha;
      m.rotation = rot;
    };
    set(glow.current, 1 + 0.2 * f.grab, Math.min(1, 0.55 * o * f.glow * (1 + 0.4 * f.grab)));
    set(ring.current, 0.5, o * f.ring);
    set(dashed.current, 0.5, o * f.dashed, t * 0.35);
    set(sparks.current, 0.65 * (1 + 0.3 * f.grab), o * f.grab * (0.75 + 0.25 * Math.sin(t * 9)), t * 0.6);
    set(sparkle.current, 0.6, o * f.sparkle, t * 0.8);
    set(orbit.current, 1, o * f.orbit);
    set(core.current, 0.25 * (1 + 0.3 * f.grab), Math.min(1, o * f.core * (0.95 + 0.05 * f.grab)));
  });

  const mat = (map: SpriteMaterial["map"]) => (
    <spriteMaterial map={map} transparent depthWrite={false} depthTest={false} blending={AdditiveBlending} toneMapped={false} />
  );

  return (
    <group ref={group}>
      <sprite ref={glow}>{mat(art.glow)}</sprite>
      <sprite ref={orbit}>{mat(art.orbit)}</sprite>
      <sprite ref={ring}>{mat(art.ring)}</sprite>
      <sprite ref={dashed}>{mat(art.ringDashed)}</sprite>
      <sprite ref={sparks}>{mat(art.sparks)}</sprite>
      <sprite ref={sparkle}>{mat(art.sparkle)}</sprite>
      <sprite ref={core}>{mat(art.core)}</sprite>
      {children}
    </group>
  );
}
