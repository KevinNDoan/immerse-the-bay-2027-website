"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { pamphlet, steps } from "@/content/pitch";
import { StepsScene } from "@/components/scene";
import { H2, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";

type Step = 0 | 1 | 2 | 3;

/** How long each step stays open while the section plays by itself, in ms. */
const AUTO_MS = 5000;
const DESKTOP = "(min-width: 1024px)";

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/**
 * The four steps on the right; on the left a scene that follows the open step. On a desktop screen it plays
 * through the steps by itself while on screen, and stops for good the moment the visitor touches it.
 */
export function HowItWorks() {
  const [step, setStep] = useState<Step>(0);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const desktop = useMediaQuery(DESKTOP);
  const playing = !touched && inView && desktop && !reduce;

  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStep((s) => ((s + 1) % steps.length) as Step), AUTO_MS);
    return () => window.clearTimeout(id);
  }, [playing, step]);

  const stop = () => setTouched(true);

  return (
    <section id="how" aria-labelledby="how-title" className={SECTION}>
      <div className={WRAP}>
        <Reveal className="mb-16 text-center sm:mb-20">
          <h2 id="how-title" className={H2}>
            {pamphlet.howTitle}
          </h2>
        </Reveal>

        <div ref={ref} className="grid items-start gap-10 lg:grid-cols-2 lg:gap-20">
          <Reveal className="lg:sticky lg:top-24">
            <StepsScene
              step={step}
              className="aspect-[4/3] overflow-hidden rounded-3xl border border-white/15 bg-void-lift/50 sm:aspect-square"
            />
          </Reveal>

          <Reveal delay={0.08}>
            <Accordion
              type="single"
              value={String(step)}
              onValueChange={(v) => v && setStep(Number(v) as Step)}
              onPointerDown={stop}
              onKeyDown={stop}
              className="border-t border-white/15"
            >
              {steps.map((s, i) => (
                <AccordionItem key={s.title} value={String(i)} className="relative border-b border-white/15">
                  <AccordionTrigger className="items-center rounded-none py-6 text-[clamp(1.75rem,3.2vw,2.5rem)] leading-tight font-medium tracking-[-0.035em] text-white/50 hover:text-white/80 hover:no-underline aria-expanded:text-white **:data-[slot=accordion-trigger-icon]:hidden">
                    {s.title}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-[46ch] pb-7 text-lg leading-relaxed text-white/70">
                    {s.text}
                  </AccordionContent>
                  {playing && step === i ? (
                    <motion.span
                      key={step}
                      aria-hidden
                      className="absolute inset-x-0 -bottom-px h-px origin-left bg-white"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                    />
                  ) : null}
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
