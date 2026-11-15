// Shared layout classes and short labels for the sections, after the React Bits landing page: one centred
// column about 1160px wide, roomy sections, and dark raised cards with a hairline border.

/** Wraps the whole page. Glows can reach past the column; never let them scroll the page sideways. */
export const PAGE = "relative isolate min-h-dvh overflow-x-clip";

/** The page column: 20px gutters on phones, 32px from sm up, about 1160px of content. */
export const CONTENT = "mx-auto w-full max-w-[1224px] px-5 sm:px-8";

/** A section: roomy space above and below, and room under the nav when an anchor lands on it. */
export const SECTION = "scroll-mt-24 py-20 sm:py-28";

/** A section heading, React Bits size: about 48px, medium weight, tight. */
export const H2 = "text-[clamp(2rem,4.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.036em] text-balance";

/** The short line under a section heading. White at 70% is the floor for body text on the void. */
export const SUB = "text-base leading-relaxed text-white/70 sm:text-lg";

/** A dark raised card with a hairline border. */
export const CARD = "rounded-2xl border border-white/10 bg-white/[0.035]";

/** The page's buttons: rounded pills, 44px tall, a slight press. */
export const PILL =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-[1.125rem] text-[15px] font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:active:scale-100";
export const PILL_PRIMARY = "bg-white text-void hover:bg-white/85";
export const PILL_DARK = "border border-white/15 bg-white/[0.06] text-white hover:bg-white/[0.12]";
export const PILL_QUIET = "text-white/70 hover:bg-white/10 hover:text-white";
export const PILL_LG = "min-h-12 px-6 text-base";

// Short labels that are not in pitch.ts. Each one names an action or a place on the page, nothing more.
export const LABELS = {
  howItWorks: "How it works",
  tryIt: "Try it",
  stepInside: "Step inside",
  questions: "Questions",
  pamphlet: "Pamphlet",
  watchDemo: "Watch the demo",
  openPamphlet: "Read the pamphlet",
  playDemo: "Play the demo",
  pauseDemo: "Pause the demo",
  faqSub: "Plain answers to the things we get asked most at the table.",
  footerPitch: "The pitch",
  footerTake: "Take it with you",
  home: "ZAP!, back to the top",
  /** An example spoken request, as the headset shows it in its pill. */
  spokenRequest: "Show me the eruption",
} as const;
