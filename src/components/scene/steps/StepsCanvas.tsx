"use client";

// "How it works" illustration. One hero star travels through the four steps:
// 0 Say it: pops into the hand with sparks, a note and a mic hint.
// 1 Throw it: glides off into the constellation and starts to bob.
// 2 Zap it: a bolt snaps to a neighbour and settles into a line; a dashed suggested line shows too.
// 3 Step inside: the camera rushes at the star until its glow fills the frame.
// Every value springs toward the open step's target, so changes animate in either direction.

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SceneCanvas } from "../internal/SceneCanvas";
import { Star, type StarFrame } from "../internal/Star";
import { Link, type PointGetter } from "../internal/Link";
import { Note } from "../internal/Note";
import { TIMING, clamp01, damp, easeOutBack, now, stepSpring, usePrefersReducedMotion, type Spring } from "../internal/motion";

export type Step = 0 | 1 | 2 | 3;
export type StepsCanvasProps = { step: Step; className?: string };

const CAM_Z = 8;
const TOPIC = "Volcanoes";

const C: { p: [number, number, number]; s: number; phase: number }[] = [
  { p: [-1.7, 1.25, -1.5], s: 0.7, phase: 0.3 },
  { p: [-0.45, 1.9, -2.5], s: 0.55, phase: 1.9 },
  { p: [1.15, 1.35, -1], s: 0.8, phase: 3.1 },
  { p: [2.05, -0.15, -2], s: 0.65, phase: 4.4 },
  { p: [-2.0, -0.55, -2], s: 0.6, phase: 5.2 },
  { p: [-0.95, 0.35, -3], s: 0.5, phase: 2.4 },
];
const C_LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 4],
  [4, 5],
];
const ZAP_TO = 2;
const SUGGEST_TO = 3;

// The hero star's target per step.
const HERO: Record<Step, { p: [number, number, number]; scale: number; grab: number }> = {
  0: { p: [0.35, -0.12, 3.2], scale: 1.2, grab: 1 },
  1: { p: [0.15, -0.2, -0.4], scale: 1, grab: 0 },
  2: { p: [0.15, -0.2, -0.4], scale: 1, grab: 0 },
  3: { p: [0.15, -0.2, -0.4], scale: 1, grab: 0 },
};
const CAMERA: Record<Step, [number, number, number]> = {
  0: [0, 0, CAM_Z],
  1: [0, 0, CAM_Z],
  2: [0, 0, CAM_Z],
  3: [0.15, -0.2, 0.75],
};

const bob = (t: number, phase: number, amp = 0.06) => amp * Math.sin((t / TIMING.bobPeriod) * Math.PI * 2 + phase);

type Runtime = {
  started: boolean;
  born: number;
  prevStep: Step;
  zapBorn: number;
  hx: Spring;
  hy: Spring;
  hz: Spring;
  hs: Spring;
  cx: Spring;
  cy: Spring;
  cz: Spring;
  grab: number;
  settle: number; // 0 in the hand, 1 hanging in the constellation (bob strength)
  zap: number; // link visibility
  dash: number;
  inside: number; // 0..1 how far into step 3
  constellation: number;
  note: number;
  noteScale: number;
  mic: number;
};

function makeRuntime(step: Step): Runtime {
  const h = HERO[step];
  const c = CAMERA[step];
  return {
    started: false,
    born: 0,
    prevStep: step,
    zapBorn: -10,
    hx: { x: h.p[0], v: 0 },
    hy: { x: h.p[1], v: 0 },
    hz: { x: h.p[2], v: 0 },
    hs: { x: 1, v: 0 },
    cx: { x: c[0], v: 0 },
    cy: { x: c[1], v: 0 },
    cz: { x: c[2], v: 0 },
    grab: h.grab,
    settle: step === 0 ? 0 : 1,
    zap: step >= 2 ? 1 : 0,
    dash: step === 2 ? 1 : 0,
    inside: step === 3 ? 1 : 0,
    constellation: 1,
    note: 0,
    noteScale: 1,
    mic: 0,
  };
}

/** The steps illustration, without its canvas. `drift` adds a slow handheld camera sway (demo reel). */
export function StepsWorld({
  step,
  reduced,
  drift = false,
  distance = CAM_Z,
}: {
  step: Step;
  reduced: boolean;
  drift?: boolean;
  /** Camera distance for steps 0 to 2. Wide boxes can come closer. */
  distance?: number;
}) {
  const rt = useRef<Runtime | null>(null);
  // Notes are sized in pixels, so small boxes get the small note and a shorter drop.
  const boxH = useThree((s) => s.size.height);
  const compact = boxH < 400;
  const drop = Math.min(1, Math.max(0.55, boxH / 480));

  const get = (): Runtime => {
    if (!rt.current) {
      rt.current = makeRuntime(step);
      if (step !== 3) rt.current.cz.x = distance;
    }
    return rt.current;
  };

  useFrame((state, delta) => {
    const r = get();
    const t = now();
    const dt = Math.min(delta, 1 / 30);
    if (!r.started) {
      r.started = true;
      r.born = t;
      if (step >= 2) r.zapBorn = -10;
    }
    if (step !== r.prevStep) {
      if (step === 2 && r.prevStep < 2) r.zapBorn = t;
      r.prevStep = step;
    }
    const h = HERO[step];
    const c = step === 3 ? CAMERA[3] : ([0, 0, distance] as const);
    if (reduced) {
      r.hx.x = h.p[0];
      r.hy.x = h.p[1];
      r.hz.x = h.p[2];
      r.hs.x = h.scale;
      r.cx.x = c[0];
      r.cy.x = c[1];
      r.cz.x = c[2];
    } else {
      // Throwing and pulling back use a quick spring with a small overshoot.
      stepSpring(r.hx, h.p[0], dt, 120, 0.7);
      stepSpring(r.hy, h.p[1], dt, 120, 0.7);
      stepSpring(r.hz, h.p[2], dt, 120, 0.72);
      const age = t - r.born;
      const pop = age < TIMING.pop ? easeOutBack(age / TIMING.pop) * h.scale : null;
      if (pop !== null) r.hs.x = pop;
      else stepSpring(r.hs, h.scale, dt, 220, 0.55);
      // The camera rush is fast in, a touch slower out.
      const k = step === 3 ? 90 : 70;
      stepSpring(r.cx, c[0], dt, k, 0.9);
      stepSpring(r.cy, c[1], dt, k, 0.9);
      stepSpring(r.cz, c[2], dt, k, 0.92);
    }
    const rate = reduced ? 30 : 8;
    r.grab = damp(r.grab, h.grab, rate, dt);
    r.settle = damp(r.settle, step === 0 ? 0 : 1, reduced ? 30 : 3, dt);
    r.zap = damp(r.zap, step >= 2 ? 1 : 0, rate, dt);
    r.dash = damp(r.dash, step === 2 ? 1 : 0, rate, dt);
    r.inside = damp(r.inside, step === 3 ? 1 : 0, reduced ? 30 : 5, dt);
    r.constellation = damp(r.constellation, step === 0 ? 0.55 : 1, rate, dt);
    r.note = damp(r.note, step === 3 ? 0 : 1, reduced ? 30 : 12, dt);
    r.noteScale = damp(r.noteScale, step === 0 ? 1 : 0.92, rate, dt);
    r.mic = damp(r.mic, step === 0 ? 1 : 0, rate, dt);
    state.camera.position.set(r.cx.x, r.cy.x, r.cz.x);
    if (drift && !reduced) {
      const sway = 1 - r.inside;
      state.camera.position.x += 0.22 * Math.sin(t * 0.31) * sway;
      state.camera.position.y += 0.12 * Math.sin(t * 0.23 + 1) * sway;
      state.camera.rotation.z = 0.012 * Math.sin(t * 0.17) * sway;
    }
  });

  const heroPos: PointGetter = (out, t) => {
    const r = get();
    const hand = (1 - r.settle) * 0.035;
    out.set(
      r.hx.x + hand * Math.sin(t * 1.7),
      r.hy.x + (reduced ? 0 : bob(t, 0.8, 0.07 * r.settle) + hand * Math.sin(t * 2.3 + 1)),
      r.hz.x,
    );
  };
  const cPos =
    (i: number): PointGetter =>
    (out, t) => {
      const n = C[i];
      out.set(n.p[0], n.p[1] + (reduced ? 0 : bob(t, n.phase)), n.p[2]);
    };

  return (
    <>
      {C.map((n, i) => (
        <Star
          key={i}
          size={1.0 * n.s}
          drive={(f: StarFrame, t) => {
            const r = get();
            cPos(i)(f.position, t);
            f.opacity = r.constellation * (1 - 0.7 * r.inside);
            if (i === ZAP_TO) {
              const since = t - r.zapBorn - TIMING.snap;
              f.ring = since > 0 && !reduced ? Math.max(0, 1 - since / 0.5) : 0;
              f.glow = 1 + 0.8 * (since > 0 && !reduced ? Math.max(0, 1 - since / 0.4) : 0);
            }
          }}
        />
      ))}
      {C_LINES.map(([a, b]) => (
        <Link key={`${a}-${b}`} mode="soft" from={cPos(a)} to={cPos(b)} width={0.08} alpha={() => get().constellation * 0.8 * (1 - get().inside)} />
      ))}
      <Link
        mode="dash"
        from={heroPos}
        to={cPos(SUGGEST_TO)}
        width={0.08}
        alpha={() => get().dash * (1 - get().inside)}
      />
      <Link
        mode="zap"
        reduced={reduced}
        from={heroPos}
        to={cPos(ZAP_TO)}
        born={() => get().zapBorn}
        width={0.09}
        alpha={() => get().zap * (1 - get().inside)}
      />
      <Star
        size={1.3}
        drive={(f: StarFrame, t) => {
          const r = get();
          heroPos(f.position, t);
          f.scale = r.hs.x * (1 + 0.6 * r.inside);
          f.grab = r.grab;
          // Inside: the hard core melts into the glow so the frame fills with a soft white bloom.
          f.core = 1 - 0.85 * r.inside;
          f.glow = 1 + 1.2 * r.inside;
        }}
      >
        <Note
          text={TOPIC}
          size={compact ? "sm" : "md"}
          offsetY={22}
          tilt={-2}
          drive={(o) => {
            const r = get();
            o.opacity = r.note * clamp01((r.hs.x - 0.2) * 1.5);
            o.scale = r.noteScale * (reduced ? 1 : Math.max(0, Math.min(1.1, r.hs.x / HERO[0].scale)));
            // Clear the bigger, nearer star (and its sparks) while it is in the hand.
            o.y = (26 + 30 * (1 - r.settle)) * drop;
          }}
        />
        <Note
          variant="mic"
          middle
          offsetX={-90}
          drive={(o) => {
            o.opacity = get().mic;
            o.scale = 1;
          }}
        />
      </Star>
    </>
  );
}

export default function StepsCanvas({ step, className }: StepsCanvasProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <SceneCanvas variant="steps" className={className} camera={{ position: [0, 0, CAM_Z], fov: 40, near: 0.05, far: 40 }}>
      <StepsWorld step={step} reduced={reduced} />
    </SceneCanvas>
  );
}
