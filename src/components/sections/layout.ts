// Shared layout classes and short labels for the sections, after the React Bits landing page: one centred
// column about 1160px wide, roomy sections, frosted glass cards on the silver sky, dark screens for the 3D.
// The section order and rhythm follow Harvey's platform page: light on top, the product rows on the dark Void.

/** Wraps the whole page. Glows can reach past the column; never let them scroll the page sideways. */
export const PAGE = "relative isolate min-h-dvh overflow-x-clip";

/** The page column: 20px gutters on phones, 32px from sm up, about 1160px of content. */
export const CONTENT = "mx-auto w-full max-w-[1224px] px-5 sm:px-8";

/**
 * A section is one stop in the pitch: from tablet width up, at least a screen tall with its content centred in
 * it and room at the top for the fixed nav. Phones get natural heights, with no empty screens between.
 * Keys and the wheel move between them (see SmoothScroll.tsx).
 */
export const SECTION = "flex flex-col justify-center pt-16 pb-8 md:min-h-svh md:pt-24 md:pb-14 lg:pt-20 lg:pb-10";

/** The page title, Harvey-sized: big, regular weight, tight, over two lines. */
export const H1 = "text-[clamp(3rem,6.6vw,5.5rem)] leading-[0.98] font-normal tracking-[-0.04em] text-balance";

/** A section heading: quieter than the title, regular weight, sitting in the left columns. */
export const H2 = "text-[clamp(1.875rem,3.2vw,2.625rem)] leading-[1.08] font-normal tracking-[-0.03em] text-balance";

/** The headings-left, content-right split most sections use: 5 columns, a gap, then 6. */
export const SPLIT_LEFT = "lg:col-span-5";
export const SPLIT_RIGHT = "lg:col-span-6 lg:col-start-7";

/**
 * The dark half of the page, as on Harvey's: the Void, full bleed, white text. A section that uses it also
 * sets data-tone="dark", which the nav reads to turn itself dark while it is over one.
 */
export const DARK = "bg-void text-white";

/** The short line under a section heading. White at 70% is the floor for body text on the void. */
export const SUB = "text-base leading-relaxed text-ink/70 sm:text-lg";

/** A frosted glass panel, the design system's recipe: white at 30%, blur 28, a soft inner glow and top edge, no outline. */
export const CARD = `rounded-2xl ${"bg-white/30 backdrop-blur-[28px] backdrop-saturate-150"} ${"shadow-[inset_0_0_10px_rgb(255_255_255/0.55),inset_0_1px_0_rgb(255_255_255/0.6),0_10px_30px_rgb(11_8_20/0.12)]"}`;

/**
 * A dark "screen" for anything that shows the headset's void: the demo, the Try it canvas, the portal and the
 * small How it works pictures. Their star art is white, so it needs the Void behind it.
 */
export const SCREEN =
  "screen bg-[radial-gradient(120%_90%_at_50%_0%,rgb(255_255_255/0.07),transparent_60%),linear-gradient(180deg,#140d26,#07050d)] text-white";

/** The page's buttons: rounded pills, 44px tall, a slight press. */
export const PILL =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-[1.125rem] text-[15px] font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:active:scale-100";
/** Lightning yellow, the brand's one accent, with Ink text. */
export const PILL_PRIMARY = "bg-zap text-ink shadow-[0_6px_20px_rgb(11_8_20/0.14)] hover:bg-[#ffe03d]";
/** A glass pill: the same frosted recipe as the cards, at pill size. */
export const PILL_GLASS =
  "bg-white/40 text-ink backdrop-blur-[20px] shadow-[inset_0_0_8px_rgb(255_255_255/0.6),inset_0_1px_0_rgb(255_255_255/0.7),0_6px_20px_rgb(11_8_20/0.1)] hover:bg-white/60";
export const PILL_QUIET = "text-ink/70 hover:bg-white/40 hover:text-ink";
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
