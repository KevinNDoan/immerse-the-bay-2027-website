"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { problem } from "@/content/pitch";
import { LEAD, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";

const noop = () => () => {};

/** True once the page is running in the browser. False on the server and during hydration. */
function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** The problem in one line, lighting up word by word as it scrolls up the screen. */
export function Problem() {
  const ref = useRef<HTMLHeadingElement>(null);
  const mounted = useMounted();
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.4"] });
  const words = problem.statement.split(" ");
  // The server and no-JS visitors get the plain sentence, fully lit.
  const animated = mounted && !reduce;

  return (
    <section aria-labelledby="problem-title" className={SECTION}>
      <div className={`${WRAP} text-center`}>
        <h2
          ref={ref}
          id="problem-title"
          className="mx-auto max-w-[14ch] text-[clamp(3rem,9vw,7.5rem)] leading-[0.92] font-medium tracking-[-0.05em]"
        >
          {words.map((word, i) => (
            <span key={i}>
              {animated ? (
                <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {word}
                </Word>
              ) : (
                word
              )}
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <Reveal>
          <p className={`${LEAD} mx-auto mt-10 max-w-2xl`}>{problem.text}</p>
        </Reveal>
      </div>
    </section>
  );
}

function Word({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: string;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  const y = useTransform(progress, range, [10, 0]);
  return (
    <motion.span style={{ opacity, y }} className="inline-block">
      {children}
    </motion.span>
  );
}
