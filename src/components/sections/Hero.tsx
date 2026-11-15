"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { HeroConstellation } from "@/components/scene";
import { product } from "@/content/pitch";
import { POP } from "@/lib/motion";
import { WRAP } from "./layout";

/** Label on the hero's submit button. Not in pitch.ts; it names the action, nothing more. */
const MAKE_STAR = "Make a star";
/** The longest topic the hero takes, so a pasted paragraph does not become a star. */
const MAX_TOPIC = 40;
/** After this many stars the hero stops adding, so the sky stays readable. */
const MAX_STARS = 40;

/**
 * The first slide, which is also the first demo: type a topic and a star pops into the sky behind the
 * headline. Until the visitor types, the example topics arrive on their own, one after another.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const [topics, setTopics] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [announce, setAnnounce] = useState("");
  const touched = useRef(false);

  // The examples drift in by themselves until the visitor adds one of their own.
  useEffect(() => {
    const timers: number[] = [];
    const examples = product.tryExamples;
    if (reduce) {
      timers.push(window.setTimeout(() => !touched.current && setTopics([...examples]), 0));
    } else {
      examples.forEach((t, i) => {
        timers.push(
          window.setTimeout(() => {
            if (!touched.current) setTopics((prev) => (prev.includes(t) ? prev : [...prev, t]));
          }, 700 + i * 1300),
        );
      });
    }
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const topic = draft.trim().slice(0, MAX_TOPIC);
    if (!topic) return;
    touched.current = true;
    setDraft("");
    setTopics((prev) => {
      if (prev.length >= MAX_STARS || prev.some((p) => p.toLowerCase() === topic.toLowerCase())) return prev;
      return [...prev, topic];
    });
    setAnnounce(`${topic} is now a star.`);
  }

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate -mt-16 flex min-h-svh items-center overflow-hidden pt-16">
      <HeroConstellation topics={topics} className="absolute inset-0 -z-10" />
      {/* A soft pool of void behind the words, so stars never fight the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_15%_55%,rgb(7_5_13/0.75),transparent_70%)]"
      />

      <div className={`${WRAP} pointer-events-none py-24`}>
        <h1
          id="hero-title"
          className="max-w-[11ch] text-[clamp(3.5rem,11vw,8rem)] leading-[0.88] font-medium tracking-[-0.05em]"
        >
          {product.headline}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">{product.lead}</p>

        <form
          onSubmit={submit}
          className="pointer-events-auto mt-10 flex w-full max-w-md gap-2"
        >
          <label htmlFor="hero-topic" className="sr-only">
            {product.tryPrompt}
          </label>
          <input
            id="hero-topic"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={MAX_TOPIC}
            placeholder={product.tryPrompt}
            autoComplete="off"
            enterKeyHint="go"
            className="h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-base text-white backdrop-blur-md transition-colors placeholder:text-white/60 hover:border-white/30 focus-visible:border-white/70 focus-visible:outline-none"
          />
          <motion.button
            type="submit"
            whileTap={reduce ? undefined : { scale: 0.94 }}
            transition={POP}
            className="h-12 shrink-0 rounded-full bg-white px-5 text-base font-medium text-void transition-colors hover:bg-white/85"
          >
            {MAKE_STAR}
          </motion.button>
        </form>

        <p className="mt-6 text-sm text-white/70">{product.platform}</p>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </section>
  );
}
