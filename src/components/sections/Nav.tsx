"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CONTENT, LABELS } from "./layout";

const LINKS = [
  { id: "how", label: LABELS.howItWorks },
  { id: "try", label: LABELS.tryIt },
  { id: "step-inside", label: LABELS.stepInside },
  { id: "questions", label: LABELS.questions },
] as const;

/** The id of the section crossing the middle of the screen, or null between sections. */
function useActiveSection() {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    const sections = [...document.querySelectorAll<HTMLElement>("main > section[id]")];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      // A one-pixel band across the middle of the viewport: whichever section covers it is the current one.
      { rootMargin: "-50% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}

/**
 * A quiet bar fixed to the top: the wordmark, the four sections in the middle, the pamphlet on the right.
 * It is clear over the hero and fades in a blurred backing once you scroll. The current section gets a soft
 * pill that slides between links, which also tells the room where the pitch is.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));
  const active = useActiveSection();

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 bg-white/30 shadow-[inset_0_-1px_0_rgb(255_255_255/0.6),0_10px_30px_rgb(11_8_20/0.08)] backdrop-blur-[28px] backdrop-saturate-150 transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div className={cn(CONTENT, "relative grid h-16 grid-cols-[1fr_auto] items-center md:grid-cols-[1fr_auto_1fr]")}>
        <Link href="#top" aria-label={LABELS.home} className="flex min-h-11 items-center justify-self-start rounded-md">
          <Image src="/art/zap-wordmark.png" alt="" width={819} height={340} preload className="-ml-1 h-9 w-auto" />
        </Link>

        <nav aria-label="Sections" className="hidden items-center md:flex">
          {LINKS.map((l) => {
            const on = active === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center px-3.5 text-sm transition-colors duration-150",
                  on ? "text-ink" : "text-ink/65 hover:text-ink",
                )}
              >
                {on && (
                  <motion.span
                    layoutId="nav-current"
                    aria-hidden
                    className="absolute inset-x-0.5 inset-y-1.5 rounded-full bg-white/55 shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_2px_8px_rgb(11_8_20/0.08)]"
                    transition={reduce ? { duration: 0 } : SPRING}
                  />
                )}
                <span className="relative">{l.label}</span>
              </a>
            );
          })}
        </nav>

        <Link
          href="/pamphlet"
          className="group flex min-h-11 items-center gap-1 justify-self-end text-sm text-ink/80 transition-colors duration-150 hover:text-ink"
        >
          {LABELS.pamphlet}
          <ArrowUpRight
            aria-hidden
            className="size-4 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </header>
  );
}
