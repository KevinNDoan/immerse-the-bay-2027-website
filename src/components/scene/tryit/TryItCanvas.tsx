"use client";

// The canvas half of the "Try it" toy. State lives in the parent (TryItDemo) so the input and
// buttons render on the server; this file only draws it and turns pointer gestures into actions:
// - tap a faint suggested star to keep it
// - drag from one star and release on another to zap them together
// Touch works: a touch that starts on a star stops the page from scrolling, any other touch scrolls.

import { useCallback, useEffect, useRef, type Dispatch } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { SceneCanvas } from "../internal/SceneCanvas";
import { Star, type StarFrame } from "../internal/Star";
import { Link, type PointGetter } from "../internal/Link";
import { Note } from "../internal/Note";
import { TIMING, clamp01, easeOutBack, now, usePrefersReducedMotion } from "../internal/motion";
import type { TAction, TState, TStar } from "./model";

const CAM_Z = 8;
const FOV = 40;
const HIT_PX = 30;

type Env = { halfW: number; halfH: number; reduced: boolean };
type Drag = {
  active: boolean;
  from: number;
  pointerId: number;
  /** Pointer in world space (z = 0). */
  at: Vector3;
  hover: number | null;
  /** For suggested stars: a tap keeps them. */
  downOn: number | null;
  downX: number;
  downY: number;
};

function starPos(st: TStar, env: Env, t: number, out: Vector3) {
  out.set(st.nx * env.halfW, st.ny * env.halfH, 0);
  if (!env.reduced) out.y += 0.045 * Math.sin((t / TIMING.bobPeriod) * Math.PI * 2 + st.id * 1.37);
  return out;
}

function suggestionAppear(st: TStar) {
  return st.born + 0.35 + st.order * TIMING.twinkle;
}

function Scene({
  state,
  env,
  drag,
  reduced,
  onViewport,
}: {
  state: TState;
  env: React.RefObject<Env>;
  drag: React.RefObject<Drag>;
  reduced: boolean;
  onViewport: (halfW: number, halfH: number) => void;
}) {
  useFrame((s) => onViewport(s.viewport.width / 2, s.viewport.height / 2));

  const byId = new Map(state.stars.map((st) => [st.id, st]));
  const getter =
    (st: TStar): PointGetter =>
    (out, t) =>
      starPos(st, env.current, t, out);

  /** Fade multiplier for a star that is on its way out. */
  const fade = (st: TStar, t: number) => (st.fadeAt === undefined ? 1 : clamp01(1 - (t - st.fadeAt) / 0.4));

  return (
    <>
      {state.stars.map((st) => {
        const parent = st.parent !== undefined ? byId.get(st.parent) : undefined;
        return st.kind === "suggested" && parent ? (
          <Link
            key={`d${st.id}`}
            mode="dash"
            from={getter(parent)}
            to={getter(st)}
            width={0.075}
            alpha={() => {
              const t = now();
              return clamp01((t - suggestionAppear(st)) / 0.25) * fade(st, t);
            }}
          />
        ) : null;
      })}
      {state.links.map((l) => {
        const a = byId.get(l.a);
        const b = byId.get(l.b);
        if (!a || !b) return null;
        return (
          <Link
            key={`l${l.id}`}
            mode="zap"
            reduced={reduced}
            from={getter(a)}
            to={getter(b)}
            born={() => l.born}
            width={0.085}
          />
        );
      })}
      <Link
        mode="drag"
        reduced={reduced}
        from={(out, t) => {
          const st = byId.get(drag.current.from);
          if (st) starPos(st, env.current, t, out);
        }}
        to={(out) => {
          const d = drag.current;
          const target = d.hover !== null ? byId.get(d.hover) : undefined;
          if (target) starPos(target, env.current, now(), out);
          else out.copy(d.at);
        }}
        width={0.085}
        alpha={() => (drag.current.active ? 1 : 0)}
      />
      {state.stars.map((st) => (
        <Star
          key={st.id}
          size={st.kind === "real" ? 1.2 : 0.95}
          drive={(f: StarFrame, t) => {
            const e = env.current;
            starPos(st, e, t, f.position);
            const d = drag.current;
            const out = fade(st, t);
            if (st.kind === "suggested") {
              const since = t - suggestionAppear(st);
              const inT = clamp01(since / 0.25);
              f.scale = e.reduced ? 1 : easeOutBack(inT, 1.4);
              f.opacity = 0.4 * (e.reduced ? inT : inT * (0.85 + 0.15 * Math.sin(t * 3 + st.id))) * out;
              f.dashed = 1;
              f.sparkle = e.reduced ? 0 : Math.max(0, 1 - Math.abs(since - 0.15) / 0.35) * 2.2;
              f.ring = 0;
              f.grab = 0;
              return;
            }
            const age = t - st.born;
            const kept = st.keptAt !== undefined ? t - st.keptAt : 99;
            const p = clamp01(age / TIMING.pop);
            f.scale = e.reduced ? 1 : st.keptAt !== undefined ? 0.85 + 0.15 * easeOutBack(clamp01(kept / TIMING.pop)) : easeOutBack(p);
            f.opacity = (e.reduced ? (st.keptAt !== undefined ? 0.4 + 0.6 * clamp01(kept / 0.25) : p) : 1) * out;
            f.dashed = st.keptAt !== undefined ? clamp01(1 - kept / 0.2) : 0;
            const isSource = d.active && d.from === st.id;
            const isHover = d.active && d.hover === st.id;
            f.ring = isSource || isHover ? 1 : 0;
            f.grab = isSource ? 0.6 : Math.max(0, 1 - age / 0.8) * (e.reduced ? 0 : 1);
            f.glow = isHover ? 1.5 : 1;
            f.sparkle = 0;
          }}
        >
          <Note
            text={st.label}
            variant={st.kind === "real" ? "note" : "label"}
            size="sm"
            offsetY={st.kind === "real" ? 18 : 16}
            tilt={st.kind === "real" ? st.tilt : 0}
            drive={(o, t) => {
              const out = fade(st, t);
              if (st.kind === "suggested") {
                const inT = clamp01((t - suggestionAppear(st) - 0.1) / 0.25);
                o.opacity = inT * out;
                o.scale = 1;
                return;
              }
              const start = st.keptAt ?? st.born + 0.05;
              const p = clamp01((t - start) / TIMING.pop);
              o.opacity = (env.current.reduced ? p : clamp01(p * 3)) * out;
              o.scale = env.current.reduced ? 1 : easeOutBack(p);
            }}
          />
        </Star>
      ))}
    </>
  );
}

export type TryItCanvasProps = {
  state: TState;
  dispatch: Dispatch<TAction>;
  /** Reports the box size in CSS pixels, for placing new stars. */
  onBox?: (w: number, h: number) => void;
};

export default function TryItCanvas({ state, dispatch, onBox }: TryItCanvasProps) {
  const reduced = usePrefersReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const env = useRef<Env>({ halfW: 4, halfH: 3, reduced });
  const drag = useRef<Drag>({
    active: false,
    from: -1,
    pointerId: -1,
    at: new Vector3(),
    hover: null,
    downOn: null,
    downX: 0,
    downY: 0,
  });
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  }, [state]);
  useEffect(() => {
    env.current.reduced = reduced;
  }, [reduced]);
  const onViewport = useCallback((halfW: number, halfH: number) => {
    env.current.halfW = halfW;
    env.current.halfH = halfH;
  }, []);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const tmp = new Vector3();

    const report = () => {
      const r = el.getBoundingClientRect();
      if (r.height > 0) onBox?.(r.width, r.height);
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);

    /** Pointer to world (z = 0) and the nearest star within reach, if any. */
    const locate = (clientX: number, clientY: number) => {
      const r = el.getBoundingClientRect();
      const ndcX = ((clientX - r.left) / r.width) * 2 - 1;
      const ndcY = 1 - ((clientY - r.top) / r.height) * 2;
      const e = env.current;
      const world = new Vector3(ndcX * e.halfW, ndcY * e.halfH, 0);
      const t = now();
      let best: TStar | null = null;
      let bestD = HIT_PX;
      for (const st of latest.current.stars) {
        if (st.fadeAt !== undefined) continue;
        if (st.kind === "suggested" && t < suggestionAppear(st)) continue;
        starPos(st, e, t, tmp);
        const sx = ((tmp.x / e.halfW) * 0.5 + 0.5) * r.width;
        const sy = (0.5 - (tmp.y / e.halfH) * 0.5) * r.height;
        const d = Math.hypot(sx - (clientX - r.left), sy - (clientY - r.top));
        if (d < bestD) {
          bestD = d;
          best = st;
        }
      }
      return { world, star: best };
    };

    const onDown = (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      const { world, star } = locate(ev.clientX, ev.clientY);
      if (!star) return;
      const d = drag.current;
      d.downX = ev.clientX;
      d.downY = ev.clientY;
      d.pointerId = ev.pointerId;
      d.at.copy(world);
      d.hover = null;
      if (star.kind === "suggested") {
        d.downOn = star.id;
        d.active = false;
      } else {
        d.downOn = null;
        d.active = true;
        d.from = star.id;
      }
      el.setPointerCapture?.(ev.pointerId);
      ev.preventDefault();
    };

    const onMove = (ev: PointerEvent) => {
      const d = drag.current;
      const { world, star } = locate(ev.clientX, ev.clientY);
      if (d.pointerId !== ev.pointerId || (!d.active && d.downOn === null)) {
        if (ev.pointerType === "mouse") el.style.cursor = star ? (star.kind === "suggested" ? "pointer" : "grab") : "";
        return;
      }
      d.at.copy(world);
      d.hover = d.active && star && star.kind === "real" && star.id !== d.from ? star.id : null;
      el.style.cursor = d.active ? "grabbing" : "pointer";
    };

    const onUp = (ev: PointerEvent) => {
      const d = drag.current;
      if (d.pointerId !== ev.pointerId) return;
      const { star } = locate(ev.clientX, ev.clientY);
      if (d.downOn !== null) {
        const moved = Math.hypot(ev.clientX - d.downX, ev.clientY - d.downY);
        if (star && star.id === d.downOn && moved < 24) dispatch({ type: "keep", id: star.id, now: now() });
      } else if (d.active && star && star.kind === "real" && star.id !== d.from) {
        dispatch({ type: "link", a: d.from, b: star.id, now: now() });
      }
      d.active = false;
      d.downOn = null;
      d.hover = null;
      d.pointerId = -1;
      el.style.cursor = "";
      if (el.hasPointerCapture?.(ev.pointerId)) el.releasePointerCapture(ev.pointerId);
    };

    const onCancel = (ev: PointerEvent) => {
      const d = drag.current;
      if (d.pointerId !== ev.pointerId) return;
      d.active = false;
      d.downOn = null;
      d.hover = null;
      d.pointerId = -1;
    };

    // Stop the page from scrolling only when a touch starts on a star.
    const onTouchStart = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      if (touch && locate(touch.clientX, touch.clientY).star) ev.preventDefault();
    };
    const onTouchMove = (ev: TouchEvent) => {
      if (drag.current.active || drag.current.downOn !== null) ev.preventDefault();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onCancel);
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onCancel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [dispatch, onBox]);

  return (
    <SceneCanvas
      variant="tryit"
      containerRef={box}
      camera={{ position: [0, 0, CAM_Z], fov: FOV, near: 0.1, far: 40 }}
    >
      <Scene state={state} env={env} drag={drag} reduced={reduced} onViewport={onViewport} />
    </SceneCanvas>
  );
}
