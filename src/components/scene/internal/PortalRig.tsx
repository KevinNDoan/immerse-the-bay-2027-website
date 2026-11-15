"use client";

// The "step inside a star" moment, built on drei's MeshPortalMaterial.
// In the void: one big star (glow, ring, an orbiting spark) framing a round portal.
// Inside the portal: a small monochrome world (rolling ridges, a soft sun, drifting sparkles, fog).
// `entered` springs a progress value: the camera dollies in and the portal's `blend` goes 0 to 1,
// at which point the world fills the frame. Reduced motion: no dolly or lean, blend crossfades.

import { useEffect, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { MeshPortalMaterial, Sparkles, useCursor } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Group,
  MathUtils,
  PlaneGeometry,
  Sprite,
  SpriteMaterial,
} from "three";
import { useArt } from "./art";
import { clamp01, damp, now, smoothstep, stepSpring, type Spring } from "./motion";

export const PORTAL_FOV = 40;
const RADIUS = 1.25;
// drei renders the portal scene directly once blend is exactly 1, which skips its own colour pass and
// makes the world jump lighter. Stopping just short keeps the look identical from outside to inside.
const BLEND_MAX = 0.999;
const WORLD_BG = "#120d22";

type PortalRigProps = {
  entered: boolean;
  reduced: boolean;
  /** Click handling and hover lean. Off for the demo reel. */
  interactive?: boolean;
  onToggle?: () => void;
  /** A slow handheld drift, so the demo reel reads like footage. */
  drift?: boolean;
};

/** Rolling ridges: a ground plane pushed up by a few layered waves, rising toward the horizon. */
function makeTerrain(): BufferGeometry {
  const g = new PlaneGeometry(80, 50, 200, 120);
  g.rotateX(-Math.PI / 2);
  const p = g.getAttribute("position");
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const z = p.getZ(i) - 15; // plane spans z from +10 to -40, wider than any view through the portal
    const far = clamp01(-z / 30);
    const h =
      Math.sin(x * 0.35 + z * 0.12) * 0.55 +
      Math.sin(x * 0.9 - z * 0.3 + 1.7) * 0.22 +
      Math.sin(x * 0.17 + 2.4) * Math.cos(z * 0.21) * 0.9 +
      Math.abs(Math.sin(x * 0.11 - z * 0.05)) * 2.6 * far;
    p.setXYZ(i, x, -1.7 + h * (0.35 + far), z);
  }
  g.computeVertexNormals();
  return g;
}

function World({ reduced }: { reduced: boolean }) {
  const art = useArt();
  const [terrain] = useState(makeTerrain);
  useEffect(() => () => terrain.dispose(), [terrain]);
  const sun = useRef<Sprite>(null);

  useFrame(() => {
    const s = sun.current;
    if (!s || reduced) return;
    const t = now();
    const k = 1 + 0.04 * Math.sin(t * 1.3);
    s.scale.set(6.5 * k, 6.5 * k, 1);
  });

  return (
    <>
      <color attach="background" args={[WORLD_BG]} />
      <fog attach="fog" args={[WORLD_BG, 3, 26]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[0, 3, -20]} intensity={2.4} color="#ffffff" />
      <hemisphereLight args={[new Color("#d8d4e6"), new Color("#07050d"), 0.5]} />
      <mesh geometry={terrain}>
        <meshStandardMaterial color="#9a95ad" roughness={0.95} metalness={0} flatShading />
      </mesh>
      <sprite ref={sun} position={[0.6, 1.4, -24]} scale={[6.5, 6.5, 1]}>
        <spriteMaterial map={art.glow} transparent depthWrite={false} blending={AdditiveBlending} fog={false} toneMapped={false} />
      </sprite>
      <sprite position={[0.6, 1.4, -23.9]} scale={[1.6, 1.6, 1]}>
        <spriteMaterial map={art.core} transparent depthWrite={false} blending={AdditiveBlending} fog={false} toneMapped={false} />
      </sprite>
      <Sparkles
        count={70}
        scale={[10, 4, 16]}
        position={[0, 0.6, -7]}
        size={2.4}
        speed={reduced ? 0 : 0.35}
        opacity={0.7}
        color="#ffffff"
        noise={0.6}
      />
    </>
  );
}

type Runtime = { p: Spring; blend: number; hover: number; lx: number; ly: number; orbit: number };

export function PortalRig({ entered, reduced, interactive = true, onToggle, drift = false }: PortalRigProps) {
  const art = useArt();
  const lean = useRef<Group>(null);
  const glow = useRef<Sprite>(null);
  const ring = useRef<Sprite>(null);
  const spark = useRef<Sprite>(null);
  // MeshPortalMaterial's ref is the portal material instance; `blend` is its uniform-backed property.
  const portal = useRef<{ blend: number } | null>(null);
  const rt = useRef<Runtime>({ p: { x: 0, v: 0 }, blend: 0, hover: 0, lx: 0, ly: 0, orbit: 0 });
  const [hovered, setHovered] = useState(false);
  useCursor(interactive && hovered);

  useFrame((state, delta) => {
    const r = rt.current;
    const dt = Math.min(delta, 1 / 30);
    const t = now();
    const target = entered ? 1 : 0;

    // Progress: a quick spring with a small overshoot, under a second end to end.
    if (reduced) {
      r.p.x = target;
      r.p.v = 0;
      r.blend = damp(r.blend, target, 9, dt);
      if (Math.abs(r.blend - target) < 0.002) r.blend = target;
      r.blend = Math.min(r.blend, BLEND_MAX);
    } else {
      stepSpring(r.p, target, dt, 140, 0.78);
      if (Math.abs(r.p.x - target) < 0.0015 && Math.abs(r.p.v) < 0.01) {
        r.p.x = target;
        r.p.v = 0;
      }
      const x = clamp01(r.p.x);
      r.blend = x >= 0.92 ? BLEND_MAX : x <= 0.12 ? 0 : Math.min(BLEND_MAX, smoothstep(0.12, 0.92, x));
    }
    if (portal.current) portal.current.blend = r.blend;

    // Camera: far enough to frame the whole star, then dolly to just in front of the portal.
    const aspect = state.size.width / Math.max(1, state.size.height);
    const tan = Math.tan(MathUtils.degToRad(PORTAL_FOV / 2));
    const far = Math.max(6, 2.7 / (tan * Math.min(aspect, 1.6)));
    const x = reduced ? 0 : clamp01(r.p.x);
    const dolly = x * x * (3 - 2 * x);
    const px = reduced ? 0 : state.pointer.x;
    const py = reduced ? 0 : state.pointer.y;
    let cx = px * 0.35 * (1 - 0.5 * dolly);
    let cy = py * 0.22 * (1 - 0.5 * dolly);
    if (drift && !reduced) {
      cx += 0.22 * Math.sin(t * 0.31);
      cy += 0.12 * Math.sin(t * 0.23 + 1);
    }
    state.camera.position.set(cx, cy, MathUtils.lerp(far, 0.55, dolly));
    state.camera.lookAt(0, 0, -2);

    // Hover: lean toward the cursor and brighten the ring.
    r.hover = damp(r.hover, interactive && hovered ? 1 : 0, 10, dt);
    const leanAmt = reduced ? 0 : 0.1 + 0.18 * r.hover;
    r.lx = damp(r.lx, -py * leanAmt, 8, dt);
    r.ly = damp(r.ly, px * leanAmt, 8, dt);
    const g = lean.current;
    if (g) {
      g.rotation.x = r.lx * (1 - dolly);
      g.rotation.y = r.ly * (1 - dolly);
      g.scale.setScalar(1 + 0.04 * r.hover);
    }

    const fade = 1 - r.blend / BLEND_MAX;
    const pulse = reduced ? 0 : 0.06 * Math.sin(t * 2.1);
    if (glow.current) {
      (glow.current.material as SpriteMaterial).opacity = (0.55 + 0.25 * r.hover + pulse) * fade;
    }
    if (ring.current) {
      const m = ring.current.material as SpriteMaterial;
      m.opacity = (0.32 + 0.5 * r.hover) * fade;
      m.rotation = reduced ? 0 : t * 0.08;
    }
    if (spark.current) {
      r.orbit += reduced ? 0 : dt * 0.6;
      const a = r.orbit + 0.6;
      spark.current.position.set(Math.cos(a) * RADIUS * 1.08, Math.sin(a) * RADIUS * 1.08, 0.02);
      (spark.current.material as SpriteMaterial).opacity = fade;
    }
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    if (!interactive) return;
    e.stopPropagation();
    onToggle?.();
  };

  return (
    <group ref={lean}>
      <sprite ref={glow} scale={[RADIUS * 3.9, RADIUS * 3.9, 1]} position={[0, 0, -0.05]}>
        <spriteMaterial map={art.glow} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </sprite>
      <mesh
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <circleGeometry args={[RADIUS, 96]} />
        <MeshPortalMaterial ref={portal as never} resolution={512} blur={0}>
          <World reduced={reduced} />
        </MeshPortalMaterial>
      </mesh>
      <sprite ref={ring} scale={[RADIUS * 2.55, RADIUS * 2.55, 1]} position={[0, 0, 0.01]}>
        <spriteMaterial map={art.ring} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </sprite>
      <sprite ref={spark} scale={[0.24, 0.24, 1]}>
        <spriteMaterial map={art.core} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </sprite>
    </group>
  );
}
