"use client";

import { useState } from "react";
import { StepsScene } from "@/components/scene";
import { steps } from "@/content/pitch";
import { cn } from "@/lib/utils";
import { CONTENT, H2, LABELS, SCREEN, SECTION } from "./layout";
import { Reveal } from "./Reveal";

type StepIndex = 0 | 1 | 2 | 3;

/**
 * Harvey's product list: the heading on the left with a ruled list of the four moves under it, and a big
 * screen on the right. The open move shows its words, and the 3D scene on the right follows it. Every move
 * is a real button, so it works from the keyboard, and the list reads in full without JavaScript.
 */
export function HowItWorks() {
  const [open, setOpen] = useState<StepIndex>(0);

  return (
    <section id="how" aria-labelledby="how-title" className={`${CONTENT} ${SECTION}`}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className="lg:col-span-4">
          <h2 id="how-title" className={H2}>
            {LABELS.howItWorks}
          </h2>
          <ol className="mt-8 border-b-2 border-ink/10">
            {steps.map((s, i) => {
              const on = open === i;
              return (
                <li key={s.title} className="relative border-t-2 border-ink/10">
                  {/* The open move's rule turns Ink, as Harvey marks its open product. */}
                  <span aria-hidden className={cn("absolute -top-0.5 left-0 h-0.5 bg-ink transition-[width] duration-300", on ? "w-1/3" : "w-0")} />
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`how-text-${i}`}
                    onClick={() => setOpen(i as StepIndex)}
                    className={cn(
                      "flex min-h-14 w-full items-center text-left text-xl tracking-[-0.015em] transition-colors",
                      on ? "text-ink" : "text-ink/60 hover:text-ink",
                    )}
                  >
                    {s.title}
                  </button>
                  <p
                    id={`how-text-${i}`}
                    className={cn("pb-5 text-[15px] leading-relaxed text-ink/75", !on && "hidden")}
                  >
                    {s.text}
                  </p>
                </li>
              );
            })}
          </ol>
          {/* Without JavaScript the buttons do nothing, so show every move's words. */}
          <noscript>
            <style>{`[id^="how-text-"]{display:block!important}`}</style>
          </noscript>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-7 lg:col-start-6">
          <div className={`relative aspect-[4/3] overflow-hidden rounded-2xl ${SCREEN}`}>
            <StepsScene step={open} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
