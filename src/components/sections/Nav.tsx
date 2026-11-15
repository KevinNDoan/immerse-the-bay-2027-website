"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { close } from "@/content/pitch";
import { PAMPHLET_PDF_PATH } from "@/lib/site";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { LABELS, PILL, PILL_PRIMARY, PILL_QUIET } from "./layout";

const LINKS = [
  { href: "#how", label: LABELS.howItWorks },
  { href: "#try", label: LABELS.tryIt },
  { href: "#step-inside", label: LABELS.stepInside },
  { href: "#questions", label: LABELS.questions },
] as const;

/** How far down the page, in px, before the bar tucks into its floating shape. */
const TUCK_AT = 24;

/**
 * At the top of the page the bar spans the page, flat. Once you scroll it springs into a centred, rounded,
 * blurred bar at the content width, and stays there until you are back at the top.
 */
export function Nav() {
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const [tucked, setTucked] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setTucked(y > TUCK_AT));

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <motion.div
        initial={false}
        animate={{
          maxWidth: tucked ? 1160 : 1440,
          backgroundColor: tucked ? "rgba(7, 5, 13, 0.72)" : "rgba(7, 5, 13, 0)",
          borderColor: tucked ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0)",
          paddingLeft: tucked ? 8 : 16,
          paddingRight: tucked ? 8 : 16,
        }}
        transition={reduce ? { duration: 0 } : SPRING}
        className={`mx-auto flex h-14 items-center gap-2 rounded-2xl border ${tucked ? "backdrop-blur-xl backdrop-saturate-150" : ""}`}
      >
        <Link href="#top" aria-label={LABELS.home} className="flex min-h-11 shrink-0 items-center rounded-full px-2.5">
          <Image src="/art/wordmark.png" alt="" width={1600} height={600} preload className="h-6 w-auto" />
        </Link>
        <nav aria-label="Sections" className="ml-4 hidden items-center lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex min-h-11 items-center rounded-full px-3 text-[15px] text-white/70 transition-colors duration-150 hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <Link href="/pamphlet" className={cn(PILL, PILL_QUIET, "hidden sm:inline-flex")}>
            {LABELS.pamphlet}
          </Link>
          <a href={PAMPHLET_PDF_PATH} download className={`${PILL} ${PILL_PRIMARY}`}>
            {close.pdfLabel}
          </a>
        </div>
      </motion.div>
    </header>
  );
}
