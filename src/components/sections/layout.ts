// Shared layout classes for the sections, so every slide sits on the same grid.

/** The page column: 20px gutters on phones, wider on larger screens. */
export const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

/** A section: generous space above and below, and room under the sticky nav when an anchor lands on it. */
export const SECTION = "scroll-mt-16 py-28 sm:py-36 lg:py-44";

/** A section heading. Big, tight, confident. */
export const H2 = "text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.04em]";

/** Body text that sits under a heading. White at 70% is the floor for body text on the void. */
export const LEAD = "text-lg leading-relaxed text-white/70 sm:text-xl";
