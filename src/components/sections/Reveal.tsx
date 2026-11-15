"use client";

import { useAnimate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, type ComponentProps } from "react";
import { EASE_OUT, IN_VIEW_MARGIN, POP, RISE } from "@/lib/motion";

/**
 * A block that rises into place the first time it scrolls into view.
 *
 * The server sends it visible, so it reads without JavaScript. After the page loads, only blocks still below
 * the fold are hidden, so nothing on screen blinks. With reduced motion on, it simply stays put.
 */
export function Reveal({ delay = 0, children, ...rest }: ComponentProps<"div"> & { delay?: number }) {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduce = useReducedMotion();
  const inView = useInView(scope, { once: true, margin: IN_VIEW_MARGIN });
  const armed = useRef(false);

  // Hide it, but only if it starts below the fold and the visitor is fine with motion.
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    if (reduce) {
      if (armed.current) {
        armed.current = false;
        animate(el, { opacity: 1, y: 0 }, { duration: 0 });
      }
      return;
    }
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    armed.current = true;
    animate(el, { opacity: 0, y: RISE }, { duration: 0 });
  }, [animate, reduce, scope]);

  // Pop it in once it scrolls into view.
  useEffect(() => {
    if (!inView || !armed.current) return;
    armed.current = false;
    animate(scope.current, { opacity: 1, y: 0 }, { ...POP, delay, opacity: { ...EASE_OUT, delay } });
  }, [animate, delay, inView, scope]);

  return (
    <div ref={scope} {...rest}>
      {children}
    </div>
  );
}
