"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LABELS, PILL, PILL_PRIMARY } from "./layout";

const LINKS = [
  { id: "how", label: LABELS.howItWorks },
  { id: "try", label: LABELS.tryIt },
  { id: "step-inside", label: LABELS.stepInside },
  { id: "questions", label: LABELS.questions },
] as const;

/** The bar's height in px; the dark switch reads a band exactly this tall at the top of the viewport. */
const BAR = 72;

/**
 * Whether the bar is over the dark half: a band as tall as the bar, at the top of the viewport, reads the
 * data-tone of whichever section (or the footer) is under it. Rebuilt when the viewport changes height.
 */
function useDarkUnderBar() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const parts = [...document.querySelectorAll<HTMLElement>("main > section, body footer")];
    let io: IntersectionObserver | null = null;
    const build = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) if (e.isIntersecting) setDark((e.target as HTMLElement).dataset.tone === "dark");
        },
        { rootMargin: `0px 0px -${Math.max(0, window.innerHeight - BAR)}px 0px` },
      );
      parts.forEach((p) => io!.observe(p));
    };
    build();
    window.addEventListener("resize", build);
    return () => {
      window.removeEventListener("resize", build);
      io?.disconnect();
    };
  }, []);
  return dark;
}

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
 * Harvey's bar: full width and 72px tall, on a solid backing the colour of the page under it. The wordmark
 * sits at the left edge, the four sections in the middle, and two buttons at the right edge, one outlined and
 * one filled. Over the dark half it turns dark. The current section gets a thin underline that slides between
 * links, which also tells the room where the pitch is.
 */
export function Nav() {
  const reduce = useReducedMotion();
  const active = useActiveSection();
  const dark = useDarkUnderBar();
  const [menu, setMenu] = useState(false);

  // The phone menu closes with Escape, and whenever the screen grows past the phone layout.
  useEffect(() => {
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setMenu(false);
    window.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      window.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [menu]);

  return (
    <header
      data-tone={dark ? "dark" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-300",
        dark ? "bg-void text-white" : "bg-[#e3e7ec]/90 text-ink backdrop-blur-xl backdrop-saturate-150",
      )}
    >
      <div className="relative grid h-[72px] grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 md:grid-cols-[1fr_auto_1fr]">
        <Link href="#top" aria-label={LABELS.home} className="flex min-h-11 items-center justify-self-start rounded-md">
          <Image src="/art/zap-wordmark.png" alt="" width={819} height={340} preload className="-ml-1 h-9 w-auto" />
        </Link>

        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const on = active === l.id;
            return (
              <a
                key={l.id}
                href={`#${l.id}`}
                aria-current={on ? "location" : undefined}
                className={cn(
                  "relative flex min-h-11 items-center px-3.5 text-[15px] transition-colors duration-150",
                  dark ? (on ? "text-white" : "text-white/70 hover:text-white") : on ? "text-ink" : "text-ink/70 hover:text-ink",
                )}
              >
                {l.label}
                {on && (
                  <motion.span
                    layoutId="nav-current"
                    aria-hidden
                    className={cn("absolute inset-x-3.5 bottom-2 h-0.5 rounded-full", dark ? "bg-white" : "bg-ink")}
                    transition={reduce ? { duration: 0 } : SPRING}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 justify-self-end">
          <Link
            href="/pamphlet"
            className={cn(
              PILL,
              "hidden rounded-lg border-2 px-3.5 text-sm sm:inline-flex",
              dark ? "border-white/40 text-white hover:border-white" : "border-ink/30 text-ink hover:border-ink",
            )}
          >
            {LABELS.pamphlet}
          </Link>
          <a href="#demo" className={cn(PILL, PILL_PRIMARY, "rounded-lg px-3.5 text-sm shadow-none")}>
            {LABELS.watchDemo}
          </a>
          {/* Phones: the sections and the pamphlet move into a menu, as Harvey's do. */}
          <button
            type="button"
            aria-expanded={menu}
            aria-controls="nav-menu"
            aria-label={LABELS.menu}
            onClick={() => setMenu((m) => !m)}
            className={cn(
              "grid size-11 place-items-center rounded-lg border-2 md:hidden",
              dark ? "border-white/40 hover:border-white" : "border-ink/30 hover:border-ink",
            )}
          >
            {menu ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </div>

      <nav
        id="nav-menu"
        aria-label="Sections"
        hidden={!menu}
        className={cn("border-t-2 px-5 pb-5 sm:px-8 md:hidden", dark ? "border-white/10" : "border-ink/10")}
      >
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={() => setMenu(false)}
                className={cn("flex min-h-12 items-center border-b-2 text-lg", dark ? "border-white/10" : "border-ink/10")}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link href="/pamphlet" className="flex min-h-12 items-center text-lg">
              {LABELS.pamphlet}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
