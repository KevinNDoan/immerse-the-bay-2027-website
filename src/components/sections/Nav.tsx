"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll } from "motion/react";
import { Button } from "@/components/ui/button";
import { pamphlet } from "@/content/pitch";
import { WRAP } from "./layout";

/** The page's sections, as the nav links to them. Titles come from the pitch copy where it has one. */
const LINKS = [
  { href: "#how", label: pamphlet.howTitle },
  { href: "#try", label: "Try it" },
  { href: "#questions", label: "Questions" },
] as const;

/** The bar that stays at the top, with a thin line along its bottom edge that fills as you read. */
export function Nav() {
  const { scrollYProgress } = useScroll();
  return (
    <header className="sticky top-0 z-40 border-b border-white/15 bg-void/70 backdrop-blur-xl backdrop-saturate-150">
      <div className={`${WRAP} flex h-16 items-center gap-8`}>
        <Link href="#top" aria-label="ZAP!, back to the top" className="-mx-2 flex h-11 items-center rounded-lg px-2">
          <Image src="/art/wordmark.png" alt="" width={1600} height={600} preload className="h-7 w-auto" />
        </Link>
        <nav aria-label="Sections" className="ml-auto hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="flex h-11 items-center rounded-md text-[15px] text-white/70 transition-colors hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button asChild variant="outline" className="ml-auto h-11 rounded-full px-5 text-[15px] md:ml-0">
          <Link href="/pamphlet">Pamphlet</Link>
        </Button>
      </div>
      <motion.div
        aria-hidden
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 -bottom-px h-px origin-left bg-white"
      />
    </header>
  );
}
