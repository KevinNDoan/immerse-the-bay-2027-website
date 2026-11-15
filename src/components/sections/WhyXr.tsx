"use client";

import { useEffect, useState } from "react";
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
 * large on the right, and three bars underneath that fill as the claims rotate. Clicking a bar shows that
 * claim; hovering or focusing pauses; reduced motion stops the rotation.
 */
export function WhyXr() {
  const reduce = useReducedMotion();
  const [at, setAt] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setTimeout(() => setAt((i) => (i + 1) % whyXr.claims.length), HOLD);
    return () => clearTimeout(t);
  }, [at, paused, reduce]);

  const claim = whyXr.claims[at];

  return (
    <section
      id="why"
      aria-labelledby="why-title"
      className={`${SECTION} bg-white/25 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-[28px]`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className={CONTENT}>
        <Reveal>
          <h2 id="why-title" className={H2}>
            {whyXr.title}
          </h2>
        </Reveal>
        <div data-noscript-hide="why" className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className={`aspect-[4/3] overflow-hidden rounded-2xl lg:col-span-5 lg:aspect-square ${SCREEN}`}>
            <Picture key={at} name={PICTURE[at]} scale={1.6} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7" aria-live={paused ? "polite" : "off"}>
            <p className="text-[clamp(1.625rem,2.8vw,2.25rem)] leading-[1.2] font-normal tracking-[-0.02em] text-balance">
              {claim.text}
            </p>
            <p className="mt-6 text-base font-medium">{claim.title}</p>
          </div>
        </div>

        {/* The bars: one per claim, the current one filling over the hold time. */}
        <div data-noscript-hide="why" className="mt-10 grid grid-cols-3 gap-4" role="group" aria-label={whyXr.title}>
          {whyXr.claims.map((c, i) => (
            <button
              key={c.title}
              type="button"
              onClick={() => setAt(i)}
              aria-pressed={at === i}
              aria-label={c.title}
              className="group flex min-h-11 items-center"
            >
              <span className="relative block h-0.5 w-full overflow-hidden rounded-full bg-ink/15">
                <span
                  key={at === i ? `on-${at}` : "off"}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-full bg-ink",
                    at === i ? (reduce || paused ? "w-full" : "animate-[fill_linear_forwards]") : "w-0",
                  )}
                  style={at === i && !reduce && !paused ? { animationDuration: `${HOLD}ms` } : undefined}
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
