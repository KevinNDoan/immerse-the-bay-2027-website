// State for the "Try it" toy. A pure reducer: times come in on actions and randomness is seeded
// from the state, so React can replay it safely.

import { prng } from "../internal/motion";
import { suggestionsFor } from "./suggestions";

export const MAX_STARS = 24;

export type TStar = {
  id: number;
  label: string;
  kind: "real" | "suggested";
  parent?: number;
  /** Position in the box, -1..1 on both axes (y up). */
  nx: number;
  ny: number;
  born: number;
  /** For suggestions: which of the three, so they twinkle in one after another. */
  order: number;
  keptAt?: number;
  fadeAt?: number;
  tilt: number;
};

export type TLink = { id: number; a: number; b: number; born: number };

export type TState = { stars: TStar[]; links: TLink[]; nextId: number; full: boolean };

export type TAction =
  | { type: "add"; label: string; now: number; box: Box }
  | { type: "keep"; id: number; now: number }
  | { type: "link"; a: number; b: number; now: number }
  | { type: "clear" };

export const initialState: TState = { stars: [], links: [], nextId: 1, full: false };

/** The canvas box in CSS pixels. Placement works in pixels so notes fit on any screen. */
export type Box = { w: number; h: number };

// A star's footprint: the star plus the note (or label) hanging below it.
const FOOT_W = 132;
const FOOT_H = 104;

function limits(box: Box) {
  const hw = box.w / 2;
  const hh = box.h / 2;
  return {
    x: Math.max(0.1, 1 - 72 / hw),
    yMin: Math.min(-0.1, -1 + 104 / hh),
    yMax: Math.max(0.1, 1 - 34 / hh),
  };
}

/** How far apart two stars are in footprints; 1 or more means their notes do not touch. */
function sep(ax: number, ay: number, bx: number, by: number, box: Box) {
  const dx = (Math.abs(ax - bx) * box.w) / 2 / FOOT_W;
  const dy = (Math.abs(ay - by) * box.h) / 2 / FOOT_H;
  return Math.max(dx, dy) + 0.15 * Math.min(dx, dy);
}

function liveStars(s: TState) {
  return s.stars.filter((st) => st.fadeAt === undefined);
}

function placeTopic(s: TState, box: Box): { nx: number; ny: number } {
  const live = liveStars(s);
  const L = limits(box);
  if (live.length === 0) return { nx: box.w < 600 ? 0 : -0.15, ny: 0.15 };
  const rand = prng(s.nextId * 7919);
  let best = { nx: 0, ny: 0 };
  let bestScore = -Infinity;
  for (let i = 0; i < 120; i++) {
    const nx = (rand() * 2 - 1) * L.x;
    const ny = L.yMin + rand() * (L.yMax - L.yMin);
    let nearest = Infinity;
    for (const st of live) nearest = Math.min(nearest, sep(nx, ny, st.nx, st.ny, box));
    // Prefer room around it, then a little pull toward the middle.
    const score = Math.min(nearest, 1.6) - 0.2 * Math.hypot(nx, ny);
    if (score > bestScore) {
      bestScore = score;
      best = { nx, ny };
    }
  }
  return best;
}

function placeSuggestions(s: TState, parent: { nx: number; ny: number }, box: Box, count: number) {
  const live = liveStars(s);
  const L = limits(box);
  const rand = prng(s.nextId * 104729);
  const rPx = Math.min(170, Math.max(112, 0.24 * Math.min(box.w, box.h * 1.4)));
  // Skip the sector straight below the parent, where its note hangs.
  const angles = Array.from({ length: 24 }, (_, i) => (i / 24) * Math.PI * 2 + rand() * 0.12).filter((a) => {
    const deg = (a * 180) / Math.PI;
    return deg < 210 || deg > 330;
  });
  const picked: { nx: number; ny: number }[] = [];
  for (let k = 0; k < count; k++) {
    let best: { nx: number; ny: number } | null = null;
    let bestScore = -Infinity;
    for (const a of angles) {
      const nx = parent.nx + (Math.cos(a) * rPx) / (box.w / 2);
      const ny = parent.ny + (Math.sin(a) * rPx) / (box.h / 2);
      if (Math.abs(nx) > L.x || ny < L.yMin || ny > L.yMax) continue;
      let nearest = Infinity;
      for (const st of live) nearest = Math.min(nearest, sep(nx, ny, st.nx, st.ny, box));
      for (const p of picked) nearest = Math.min(nearest, sep(nx, ny, p.nx, p.ny, box));
      if (nearest > bestScore) {
        bestScore = nearest;
        best = { nx, ny };
      }
    }
    if (best) picked.push(best);
  }
  return picked;
}

function prune(stars: TStar[], now: number) {
  return stars.filter((st) => st.fadeAt === undefined || now - st.fadeAt < 0.6);
}

export function reducer(s: TState, a: TAction): TState {
  switch (a.type) {
    case "clear":
      return { ...initialState, nextId: s.nextId };
    case "add": {
      const label = a.label.trim().slice(0, 40);
      if (!label) return s;
      // Pending suggestions from the last topic fade away.
      let stars = prune(s.stars, a.now).map((st) =>
        st.kind === "suggested" && st.fadeAt === undefined ? { ...st, fadeAt: a.now } : st,
      );
      const realCount = stars.filter((st) => st.kind === "real").length;
      if (realCount >= MAX_STARS) return { ...s, stars, full: true };
      const base: TState = { ...s, stars };
      const pos = placeTopic(base, a.box);
      let id = s.nextId;
      const topic: TStar = { id: id++, label, kind: "real", ...pos, born: a.now, order: 0, tilt: ((id % 5) - 2) * 1.2 };
      stars = [...stars, topic];
      const room = MAX_STARS - realCount - 1;
      const ideas = suggestionsFor(label).slice(0, Math.max(0, Math.min(3, room)));
      const spots = placeSuggestions({ ...base, stars, nextId: id }, pos, a.box, ideas.length);
      spots.forEach((p, i) => {
        stars.push({
          id: id++,
          label: ideas[i],
          kind: "suggested",
          parent: topic.id,
          ...p,
          born: a.now,
          order: i,
          tilt: ((id % 5) - 2) * 1.2,
        });
      });
      return { ...s, stars, nextId: id, full: false };
    }
    case "keep": {
      const target = s.stars.find((st) => st.id === a.id);
      if (!target || target.kind !== "suggested" || target.fadeAt !== undefined) return s;
      const stars = prune(s.stars, a.now).map((st) => {
        if (st.id === a.id) return { ...st, kind: "real" as const, keptAt: a.now };
        if (st.kind === "suggested" && st.parent === target.parent && st.fadeAt === undefined)
          return { ...st, fadeAt: a.now };
        return st;
      });
      const links =
        target.parent !== undefined
          ? [...s.links, { id: s.nextId, a: target.parent, b: target.id, born: a.now }]
          : s.links;
      return { ...s, stars, links, nextId: s.nextId + 1 };
    }
    case "link": {
      if (a.a === a.b) return s;
      const exists = s.links.some((l) => (l.a === a.a && l.b === a.b) || (l.a === a.b && l.b === a.a));
      if (exists) return s;
      return { ...s, links: [...s.links, { id: s.nextId, a: a.a, b: a.b, born: a.now }], nextId: s.nextId + 1 };
    }
  }
}
