"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { whyXr } from "@/content/pitch";
import { cn } from "@/lib/utils";
import { CONTENT, H2, SCREEN, SECTION } from "./layout";
import { NoscriptList } from "./NoscriptList";
import { Picture, type PictureName } from "./pictures";
import { Reveal } from "./Reveal";

/** One picture per claim: the orbit for memory, the request marker for hands-on study, the rush for presence. */
const PICTURE: readonly PictureName[] = ["remember", "steer", "enter"];
/** How long each claim stays up before the next, in ms. */
const HOLD = 7000;

/**
 * Harvey's quote band, holding the three reasons it has to be a headset: a picture on the left, the claim set
 * large on the right, and three bars underneath. The current bar fills over the hold time and the next claim
 * comes up when it is full, so the bar and the rotation can never drift apart.
 *
 * It pauses while the pointer is over it or focus is inside it, and a visible button pauses it for good
 * (WCAG 2.2.2). Choosing a claim with its bar also stops the rotation. Reduced motion never rotates.
 */
export function WhyXr() {
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [stopped, setStopped] = useState(false);
  /** What a screen reader hears, set only when someone picks a claim, never on the automatic rotation. */
  const [announce, setAnnounce] = useState("");

  const rotating = !reduce && !stopped;
  const running = rotating && !hovering && !focusWithin;
  const claim = whyXr.claims[at];

  const pick = (i: number) => {
    setAt(i);
    setStopped(true);
    setAnnounce(`${whyXr.claims[i].title}. ${whyXr.claims[i].text}`);
  };

  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className={`${SECTION} bg-white/25 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-[28px]`}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocusWithin(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusWithin(false);
      }}
    >
      <div className={CONTENT}>
        <Reveal className="flex items-end justify-between gap-6">
          <h2 id="why-title" className={H2}>
            {whyXr.title}
          </h2>
          {!reduce && (
            <button
              type="button"
              onClick={() => setStopped((s) => !s)}
              aria-pressed={stopped}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-lg border-2 border-ink/25 px-3.5 text-sm font-medium transition-colors hover:border-ink"
            >
              {stopped ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
              {stopped ? "Play" : "Pause"}
            </button>
          )}
        </Reveal>

        <div data-noscript-hide="why" className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className={`aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-5 lg:aspect-square ${SCREEN}`}>
            <Picture key={at} name={PICTURE[at]} scale={1.6} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="text-[clamp(1.625rem,2.8vw,2.25rem)] leading-[1.2] font-normal tracking-[-0.02em] text-balance">
              {claim.text}
            </p>
            <p className="mt-6 text-base font-medium">{claim.title}</p>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>

        {/* The bars: one per claim. The current one fills over the hold time and pauses with the rotation. */}
        <div data-noscript-hide="why" className="mt-10 grid grid-cols-3 gap-4" role="group" aria-label={whyXr.title}>
          {whyXr.claims.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => pick(i)}
              aria-pressed={at === i}
              aria-label={c.title}
              className="flex min-h-11 items-center"
            >
              <span className="relative block h-0.5 w-full overflow-hidden rounded-full bg-ink/15">
                <span
                  key={at === i ? `on-${at}` : "off"}
                  onAnimationEnd={() => setAt((n) => (n + 1) % whyXr.claims.length)}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-ink",
                    at !== i ? "w-0" : rotating ? "animate-[fill_linear_forwards]" : "w-full",
                  )}
                  style={
                    at === i && rotating
                      ? { animationDuration: `${HOLD}ms`, animationPlayState: running ? "running" : "paused" }
                      : undefined
                  }
                />
              </span>
            </button>
          ))}
        </div>
        <NoscriptList scope="why" items={whyXr.claims} />
      </div>
    </section>
  );
}
