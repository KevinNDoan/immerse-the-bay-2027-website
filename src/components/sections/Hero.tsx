import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { product } from "@/content/pitch";
import { CONTENT, LABELS, PILL, PILL_DARK, PILL_LG, PILL_PRIMARY } from "./layout";

/**
 * A short, left-aligned hero: the headline over about seven columns with two buttons under it, and the
 * one-line pitch at the far right, level with the buttons. The demo video sits right below it.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className={`${CONTENT} scroll-mt-24 pt-16 pb-12 sm:pt-24 sm:pb-16`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-x-8">
        <div className="lg:col-span-7">
          <h1
            id="hero-title"
            className="text-[clamp(3rem,6.4vw,4.75rem)] leading-[0.98] font-medium tracking-[-0.036em] text-balance"
          >
            {product.headline}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className={`${PILL} ${PILL_PRIMARY} ${PILL_LG}`}>
              {LABELS.watchDemo}
              <ArrowDown aria-hidden className="size-4" />
            </a>
            <Link href="/pamphlet" className={`${PILL} ${PILL_DARK} ${PILL_LG}`}>
              {LABELS.openPamphlet}
            </Link>
          </div>
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:pb-1 lg:text-right">
          <p className="text-base leading-relaxed text-pretty text-white/70 sm:text-lg">{product.lead}</p>
          <p className="mt-3 text-sm text-white/70">{product.platform}</p>
        </div>
      </div>
    </section>
  );
}
