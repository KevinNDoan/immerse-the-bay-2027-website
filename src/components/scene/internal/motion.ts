// Small motion helpers shared by the three scenes. Timings follow design-system.md section 6:
// pops in a quarter second with overshoot, bolts snap in a tenth and calm in a third, bob every four seconds.

import { useSyncExternalStore } from "react";

export const TIMING = {
  pop: 0.25,
  snap: 0.1,
  calm: 0.3,
  bobPeriod: 4,
  twinkle: 0.5,
} as const;

/** Seconds on one clock for every scene, so event handlers and frame loops agree. */
export function now(): number {
  return performance.now() / 1000;
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Ease out with overshoot. Springy, not floaty. */
export function easeOutBack(t: number, overshoot = 2.2): number {
  const x = clamp01(t) - 1;
  return 1 + (overshoot + 1) * x * x * x + overshoot * x * x;
}

export function easeOutCubic(t: number): number {
  const x = 1 - clamp01(t);
  return 1 - x * x * x;
}

export function smoothstep(e0: number, e1: number, v: number): number {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
}

/** Frame-rate independent exponential approach. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-lambda * dt));
}

/** A one-dimensional spring with a little overshoot. Mutates and returns the state. */
export type Spring = { x: number; v: number };
export function stepSpring(s: Spring, target: number, dt: number, stiffness = 170, zeta = 0.62): Spring {
  const c = 2 * Math.sqrt(stiffness) * zeta;
  const a = stiffness * (target - s.x) - c * s.v;
  s.v += a * dt;
  s.x += s.v * dt;
  return s;
}

/** Seeded PRNG (mulberry32), so layouts are stable and render stays pure. */
export function prng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const mq = window.matchMedia(REDUCED_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribeReduced,
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(REDUCED_QUERY).matches : false),
    () => false,
  );
}
