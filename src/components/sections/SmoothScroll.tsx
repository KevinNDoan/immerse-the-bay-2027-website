"use client";

import "lenis/dist/lenis.css";
import { ReactLenis, useLenis } from "lenis/react";
import Snap from "lenis/snap";
import { useReducedMotion } from "motion/react";
import { useEffect, type ReactNode } from "react";

/** Every top-level section is one stop in the pitch. */
const SLIDES = "main > section";
/** How long a move between sections takes, in seconds, and its curve: a quick start and a soft landing. */
const DURATION = 0.9;
const EASE = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

const NEXT_KEYS = new Set(["ArrowDown", "ArrowRight", "PageDown"]);
const PREV_KEYS = new Set(["ArrowUp", "ArrowLeft", "PageUp"]);

/** Keys pressed while typing, or inside a widget that uses the arrows itself, are left alone. */
function isForSomethingElse(e: KeyboardEvent) {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return true;
  const t = e.target instanceof HTMLElement ? e.target : null;
  if (!t) return false;
  if (t.isContentEditable || t.closest("input, textarea, select, [data-pitch-keys='off']")) return true;
  // Space presses a focused button or link.
  return e.key === " " && t.closest("button, a, summary, [role='button']") !== null;
}

/**
 * Where the next or previous press should land. Normally that is the top of the next or previous section.
 * A section taller than the screen (a small laptop, or an open question) is paged through first, so nothing
 * in it gets skipped.
 */
function stop(dir: 1 | -1, from: number) {
  const vh = window.innerHeight;
  const max = document.documentElement.scrollHeight - vh;
  const slides = [...document.querySelectorAll<HTMLElement>(SLIDES)].map((el, i) => {
    const r = el.getBoundingClientRect();
    const top = i === 0 ? 0 : Math.round(r.top + window.scrollY);
    return { top, bottom: Math.round(r.bottom + window.scrollY) };
  });
  if (slides.length === 0) return null;

  const EPS = 4;
  let cur = 0;
  slides.forEach((s, i) => {
    if (s.top <= from + EPS) cur = i;
  });
  const s = slides[cur];

  if (dir === 1) {
    if (s.bottom > from + vh + EPS) return Math.min(from + vh * 0.85, s.bottom - vh);
    return Math.min(slides[cur + 1]?.top ?? max, max);
  }
  if (from > s.top + EPS) return Math.max(s.top, from - vh * 0.85);
  return slides[cur - 1]?.top ?? 0;
}

/**
 * Pitch controls. Arrow keys, Page Up and Page Down (what most presentation clickers send) and Space step
 * through the page one section at a time. With a wheel or trackpad, a scroll that stops near the top of a
 * section settles onto it; touch scrolling is left alone.
 */
function PitchControls({ smooth }: { smooth: boolean }) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    // Only settles when a scroll stops within about one wheel notch of a section top, so a slow, deliberate
    // scroll is never dragged back.
    const snap = new Snap(lenis, { type: "proximity", distanceThreshold: 90, debounce: 350, duration: DURATION, easing: EASE });
    snap.addElements([...document.querySelectorAll<HTMLElement>(SLIDES)], { align: ["start"] });
    return () => snap.destroy();
  }, [lenis]);

  useEffect(() => {
    // Where the last key press sent the page, and until when that move runs. Lenis only updates its own target
    // as a scripted move animates, so a quick second press has to count from here instead.
    let pending: { to: number; until: number } | null = null;
    const onKey = (e: KeyboardEvent) => {
      const dir = NEXT_KEYS.has(e.key) || (e.key === " " && !e.shiftKey) ? 1 : PREV_KEYS.has(e.key) || e.key === " " ? -1 : 0;
      if (dir === 0 || isForSomethingElse(e)) return;
      // Mid-move, count from where the page is heading, so quick presses keep advancing.
      const moving = pending && performance.now() < pending.until;
      const to = stop(dir, moving && pending ? pending.to : lenis ? lenis.targetScroll : window.scrollY);
      if (to === null) return;
      e.preventDefault();
      // A held key would race through the whole pitch; one press, one section.
      if (e.repeat) return;
      pending = { to, until: performance.now() + DURATION * 1000 + 50 };
      if (lenis) lenis.scrollTo(to, { duration: DURATION, easing: EASE });
      else window.scrollTo({ top: to, behavior: smooth ? "smooth" : "auto" });
    };
    // A wheel, touch or pointer scroll takes over from a key move, so the next key press counts from where
    // the page really is.
    const drop = () => {
      pending = null;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", drop, { passive: true });
    window.addEventListener("touchstart", drop, { passive: true });
    window.addEventListener("pointerdown", drop, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", drop);
      window.removeEventListener("touchstart", drop);
      window.removeEventListener("pointerdown", drop);
    };
  }, [lenis, smooth]);

  return null;
}

/**
 * Smooth wheel scrolling and the pitch controls for the whole page. Anyone who asked for reduced motion gets
 * native scrolling, and the keys jump straight to each section.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <>
        <PitchControls smooth={false} />
        {children}
      </>
    );
  }
  return (
    <ReactLenis root options={{ anchors: true, autoRaf: true, lerp: 0.12 }}>
      <PitchControls smooth />
      {children}
    </ReactLenis>
  );
}
