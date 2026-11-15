"use client";

// Hero background: an ambient constellation that bobs, drifts and leans toward the cursor.
// Each new entry in `topics` pops in as a star with a sticky note clear of the hero copy,
// then a bolt snaps to the nearest star and calms into a line.
//
// The hero copy sits left-aligned and vertically centred. Each layout tier defines a "copy zone"
// in screen-normalised space; stars inside it are dimmed and lines that cross it are hidden.

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Group, MathUtils, Vector3 } from "three";
import { SceneCanvas } from "../internal/SceneCanvas";
import { Star, type StarFrame } from "../internal/Star";
import { Link, type PointGetter } from "../internal/Link";
import { Note } from "../internal/Note";
import { TIMING, clamp01, damp, easeOutBack, now, usePrefersReducedMotion } from "../internal/motion";

export type HeroConstellationProps = { topics: string[]; className?: string };

const CAM_Z = 10;
const FOV = 45;
const TAN = Math.tan(MathUtils.degToRad(FOV / 2));

type Tier = "phone" | "mid" | "wide";
type Env = { aspect: number; tier: Tier; reduced: boolean };
type Node = { nx: number; ny: number; z: number; s: number; phase: number };
type Slot = { nx: number; ny: number; z: number };

const tierFor = (width: number): Tier => (width < 768 ? "phone" : width < 1100 ? "mid" : "wide");

/** Where the hero copy sits, per tier: x below `x` and |y| below `y` (screen-normalised, y up). */
const COPY_ZONE: Record<Tier, { x: number; y: number }> = {
  wide: { x: 0.46, y: 0.5 },
  mid: { x: 0.56, y: 0.52 },
  phone: { x: 2, y: 0.56 },
};

const inZone = (nx: number, ny: number, tier: Tier) => nx < COPY_ZONE[tier].x && Math.abs(ny) < COPY_ZONE[tier].y;

// Ambient stars in screen-normalised space (-1..1) at a depth.
const AMBIENT: Node[] = [
  { nx: 0.22, ny: 0.66, z: -2, s: 0.75, phase: 0.1 },
  { nx: 0.42, ny: 0.84, z: -3.5, s: 0.6, phase: 1.7 },
  { nx: 0.66, ny: 0.62, z: -1, s: 0.9, phase: 2.9 },
  { nx: 0.86, ny: 0.32, z: -2.5, s: 0.7, phase: 4.2 },
  { nx: 0.9, ny: -0.18, z: -1.5, s: 0.8, phase: 5.1 },
  { nx: 0.74, ny: -0.6, z: -3, s: 0.6, phase: 0.8 },
  { nx: 0.46, ny: -0.82, z: -1, s: 0.8, phase: 3.3 },
  { nx: 0.2, ny: -0.6, z: -4, s: 0.5, phase: 2.2 },
  { nx: 0.3, ny: 0.1, z: -5, s: 0.45, phase: 4.8 },
  { nx: -0.3, ny: 0.86, z: -5, s: 0.4, phase: 1.1 },
  { nx: -0.76, ny: 0.74, z: -4, s: 0.45, phase: 3.9 },
  { nx: -0.92, ny: -0.3, z: -5, s: 0.4, phase: 0.5 },
  { nx: -0.56, ny: -0.86, z: -3.5, s: 0.5, phase: 2.6 },
  { nx: -0.16, ny: -0.92, z: -4.5, s: 0.4, phase: 5.6 },
];

const AMBIENT_LINES: [number, number][] = [
  [0, 2],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
];

// Where new topics land, per tier. Wide: right of centre, in front of the constellation.
// Mid: the right edge. Phone: the band above the headline.
const SLOTS: Record<Tier, Slot[]> = {
  wide: [
    { nx: 0.6, ny: 0.22, z: 1.2 },
    { nx: 0.76, ny: -0.16, z: 0.8 },
    { nx: 0.56, ny: -0.4, z: 1.4 },
    { nx: 0.8, ny: 0.48, z: 0.6 },
    { nx: 0.66, ny: -0.66, z: 1 },
    { nx: 0.5, ny: 0.62, z: 0.9 },
  ],
  mid: [
    { nx: 0.7, ny: 0.3, z: 1 },
    { nx: 0.74, ny: -0.12, z: 0.8 },
    { nx: 0.4, ny: 0.66, z: 1 },
    { nx: 0.7, ny: -0.56, z: 0.8 },
    { nx: 0.72, ny: 0.66, z: 0.6 },
    { nx: 0.3, ny: -0.66, z: 1 },
  ],
  phone: [
    { nx: 0.34, ny: 0.72, z: 1 },
    { nx: 0.66, ny: 0.62, z: 0.8 },
    { nx: -0.1, ny: 0.66, z: 1.2 },
    { nx: 0.64, ny: -0.72, z: 0.6 },
    { nx: 0.1, ny: 0.78, z: 1 },
    { nx: 0.4, ny: 0.6, z: 0.9 },
  ],
};
const VISIBLE_TOPICS = 6;
const RECEDE = -2.5;

function toWorld(out: Vector3, nx: number, ny: number, z: number, aspect: number) {
  const halfH = (CAM_Z - z) * TAN;
  return out.set(nx * halfH * aspect, ny * halfH, z);
}

function ambientPos(i: number, env: Env, t: number, out: Vector3) {
  const n = AMBIENT[i];
  toWorld(out, n.nx, n.ny, n.z, env.aspect);
  if (!env.reduced) {
    out.y += 0.07 * Math.sin((t / TIMING.bobPeriod) * Math.PI * 2 + n.phase);
    out.x += 0.12 * Math.sin(t * 0.11 + n.phase * 1.7);
  }
  return out;
}

function ambientAlpha(i: number, env: Env) {
  const n = AMBIENT[i];
  if (inZone(n.nx, n.ny, env.tier)) return env.tier === "phone" ? 0.14 : 0.22;
  if (env.tier === "phone") return 0.5;
  return n.nx < -0.05 ? 0.4 : 1;
}

/** True when a straight line between two screen points stays out of the copy zone. */
function clearOfCopy(ax: number, ay: number, bx: number, by: number, tier: Tier) {
  for (let k = 0; k <= 8; k++) {
    const f = k / 8;
    if (inZone(ax + (bx - ax) * f, ay + (by - ay) * f, tier)) return false;
  }
  return true;
}

const topicSlot = (index: number, tier: Tier) => SLOTS[tier][index % SLOTS[tier].length];

type Target = { kind: "ambient" | "topic"; i: number } | null;

/** Nearest star the new topic can link to without the line crossing the copy. Pure. */
function nearestTarget(index: number, tier: Tier): Target {
  const aspect = tier === "phone" ? 9 / 19 : tier === "mid" ? 1 : 16 / 9;
  const s = topicSlot(index, tier);
  const here = toWorld(new Vector3(), s.nx, s.ny, s.z, aspect);
  const there = new Vector3();
  let best: Target = null;
  let bestD = Infinity;
  AMBIENT.forEach((n, i) => {
    if (n.nx < -0.05 || inZone(n.nx, n.ny, tier) || !clearOfCopy(s.nx, s.ny, n.nx, n.ny, tier)) return;
    const d = toWorld(there, n.nx, n.ny, n.z, aspect).distanceTo(here);
    if (d < bestD) {
      bestD = d;
      best = { kind: "ambient", i };
    }
  });
  if (index > 0) {
    const p = topicSlot(index - 1, tier);
    if (clearOfCopy(s.nx, s.ny, p.nx, p.ny, tier)) {
      const d = toWorld(there, p.nx, p.ny, p.z + RECEDE, aspect).distanceTo(here);
      if (d < bestD * 0.9) best = { kind: "topic", i: index - 1 };
    }
  }
  return best;
}

type TopicRuntime = { born: number; depth: number; vis: number };

function Scene({ topics, reduced }: { topics: string[]; reduced: boolean }) {
  const width = useThree((s) => s.size.width);
  const tier = tierFor(width);
  const env = useRef<Env>({ aspect: 16 / 9, tier, reduced });
  const lean = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [initialCount] = useState(topics.length);
  const runtimes = useRef(new Map<number, TopicRuntime>());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const e = env.current;
    e.aspect = state.size.width / Math.max(1, state.size.height);
    e.tier = tierFor(state.size.width);
    e.reduced = reduced;
    const g = lean.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 20);
    const tx = reduced ? 0 : pointer.current.x;
    const ty = reduced ? 0 : pointer.current.y;
    g.rotation.y = damp(g.rotation.y, tx * 0.045, 3, dt);
    g.rotation.x = damp(g.rotation.x, ty * 0.03, 3, dt);
  });

  const runtimeFor = (index: number): TopicRuntime => {
    const map = runtimes.current;
    let r = map.get(index);
    if (!r) {
      r = { born: index < initialCount ? -10 : now(), depth: 0, vis: 0 };
      map.set(index, r);
    }
    return r;
  };

  const ambientGetter =
    (i: number): PointGetter =>
    (out, t) =>
      ambientPos(i, env.current, t, out);

  const first = Math.max(0, topics.length - VISIBLE_TOPICS - 1);
  const shown = topics.slice(first).map((text, k) => ({ text, index: first + k }));
  const latest = topics.length - 1;

  return (
    <group ref={lean}>
      {AMBIENT.map((n, i) => (
        <Star
          key={`a${i}`}
          size={0.95 * n.s}
          drive={(f: StarFrame, t) => {
            ambientPos(i, env.current, t, f.position);
            f.opacity = ambientAlpha(i, env.current);
            f.sparkle = env.current.reduced ? 0 : Math.max(0, Math.sin(t * 0.9 + n.phase * 3) - 0.92) * 8;
          }}
        />
      ))}
      {AMBIENT_LINES.map(([a, b]) => (
        <Link
          key={`l${a}-${b}`}
          mode="soft"
          from={ambientGetter(a)}
          to={ambientGetter(b)}
          width={0.1}
          alpha={() => {
            const e = env.current;
            const A = AMBIENT[a];
            const B = AMBIENT[b];
            if (!clearOfCopy(A.nx, A.ny, B.nx, B.ny, e.tier)) return 0;
            return e.tier === "phone" ? 0.3 : 0.5;
          }}
        />
      ))}
      {shown.map(({ text, index }) => (
        <TopicNode
          key={index}
          index={index}
          text={text}
          isLatest={index === latest}
          leaving={index < topics.length - VISIBLE_TOPICS}
          tier={tier}
          reduced={reduced}
          env={env}
          runtime={runtimeFor}
          ambientGetter={ambientGetter}
        />
      ))}
    </group>
  );
}

function TopicNode({
  index,
  text,
  isLatest,
  leaving,
  tier,
  reduced,
  env,
  runtime,
  ambientGetter,
}: {
  index: number;
  text: string;
  isLatest: boolean;
  leaving: boolean;
  tier: Tier;
  reduced: boolean;
  env: React.RefObject<Env>;
  runtime: (index: number) => TopicRuntime;
  ambientGetter: (i: number) => PointGetter;
}) {
  const target = nearestTarget(index, tier);
  const phone = tier === "phone";

  // Live position of topic `i`: its slot, pushed back into the constellation once a newer topic arrives.
  const topicPos = (i: number, out: Vector3, t: number) => {
    const r = runtime(i);
    const e = env.current;
    const s = topicSlot(i, e.tier);
    toWorld(out, s.nx, s.ny, s.z + r.depth, e.aspect);
    if (!e.reduced) out.y += 0.06 * Math.sin((t / TIMING.bobPeriod) * Math.PI * 2 + i * 1.3);
    return out;
  };

  const drive = (f: StarFrame, t: number, dt: number) => {
    const r = runtime(index);
    const e = env.current;
    const age = t - r.born;
    const depthTarget = isLatest ? 0 : RECEDE;
    r.depth = e.reduced ? depthTarget : damp(r.depth, depthTarget, 5, dt);
    r.vis = damp(r.vis, leaving ? 0 : 1, 8, dt);
    topicPos(index, f.position, t);
    const p = clamp01(age / TIMING.pop);
    f.scale = e.reduced ? 1 : easeOutBack(p);
    f.opacity = (e.reduced ? p : 1) * r.vis * (e.tier === "phone" ? 0.7 : 1);
    f.grab = isLatest ? Math.max(0, 1 - age / 1.2) : 0;
    f.glow = 1 + 0.6 * Math.max(0, 1 - age / 0.6);
  };

  return (
    <>
      <Star size={phone ? 0.9 : 1.05} drive={drive}>
        <Note
          text={text}
          size={tier === "wide" ? "lg" : tier === "mid" ? "md" : "sm"}
          offsetY={phone ? 14 : 22}
          tilt={index % 2 ? 2 : -2}
          drive={(o, t, dt) => {
            const r = runtime(index);
            const e = env.current;
            const age = t - r.born - 0.06;
            const p = clamp01(age / TIMING.pop);
            const want = isLatest ? 1 : 0;
            o.opacity = damp(o.opacity, want * (e.reduced ? p : clamp01(p * 3)) * r.vis, 10, dt);
            o.scale = e.reduced ? 1 : isLatest ? easeOutBack(p) : damp(o.scale, 0.85, 10, dt);
          }}
        />
      </Star>
      {target ? (
        <Link
          mode="zap"
          reduced={reduced}
          born={() => runtime(index).born + 0.4}
          from={(out, t) => topicPos(index, out, t)}
          to={target.kind === "ambient" ? ambientGetter(target.i) : (out, t) => topicPos(target.i, out, t)}
          width={0.12}
          alpha={() => runtime(index).vis * (env.current.tier === "phone" ? 0.5 : 1)}
        />
      ) : null}
    </>
  );
}

export default function HeroCanvas({ topics, className }: HeroConstellationProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <SceneCanvas
      variant="hero"
      className={className}
      canvasClassName="pointer-events-none"
      camera={{ position: [0, 0, CAM_Z], fov: FOV, near: 0.1, far: 50 }}
    >
      <Scene topics={topics} reduced={reduced} />
    </SceneCanvas>
  );
}
