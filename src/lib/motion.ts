import type { Transition, Variants } from "motion/react";

// ZAP!'s motion, in one place. Quick, playful, electric: things pop in with a small overshoot and settle fast.
// Springier than Slab, never slow or floaty (design-system.md section 6). Everything here stands still for
// someone who asked their system for reduced motion: Reveal shows content at once, and the CSS loops in
// sections.module.css stop.

/** For things that appear: a quick pop with a small overshoot, like a new star landing in the hand. */
export const POP: Transition = { type: "spring", stiffness: 500, damping: 22, mass: 0.9 };

/** For things that slide to a new place: snappy, with barely any overshoot. */
export const SPRING: Transition = { type: "spring", stiffness: 560, damping: 38, mass: 0.9 };

/** The curve for fades and short moves that should not bounce. */
export const EASE_OUT_CURVE = [0.16, 1, 0.3, 1] as const;
export const EASE_OUT: Transition = { duration: 0.32, ease: EASE_OUT_CURVE };

/** How far a block travels as it rises into place, in px. */
export const RISE = 24;

/** The pause between children that come in one after another, in seconds. */
export const STAGGER = 0.06;

/** Where an element counts as "in view": a little above the bottom edge, so it pops as it settles in. */
export const IN_VIEW_MARGIN = "0px 0px -8% 0px";

/** A parent that brings its `riseItem` children in one after another. */
export const staggerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: STAGGER } },
};

/** One child of a `staggerList`: rises a few pixels and pops into place. */
export const riseItem: Variants = {
  hidden: { opacity: 0, y: RISE * 0.5 },
  show: { opacity: 1, y: 0, transition: { ...POP, opacity: EASE_OUT } },
};
