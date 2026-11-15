import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { product } from "@/content/pitch";
import { CONTENT, H1, LABELS, PILL, PILL_LG, PILL_PRIMARY } from "./layout";

/**
 * Harvey's hero: the title large over two lines on the left, and on the right a short paragraph with one
 * button. The demo sits right under it, full width.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className={`${CONTENT} pt-32 pb-10 sm:pt-40 sm:pb-14`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1 id="hero-title" className={`${H1} lg:col-span-6`}>
          {product.headline}
        </h1>
        <div className="lg:col-span-4 lg:col-start-9 lg:pb-2">
          <p className="text-base leading-relaxed text-pretty text-ink/75 sm:text-lg">{product.lead}</p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#demo" className={`${PILL} ${PILL_PRIMARY} ${PILL_LG}`}>
              {LABELS.watchDemo}
              <ArrowDown aria-hidden className="size-4" />
            </a>
            <Link
              href="/pamphlet"
              className="flex min-h-11 items-center text-[15px] text-ink/75 underline decoration-ink/30 underline-offset-4 hover:text-ink hover:decoration-ink"
            >
              {LABELS.openPamphlet}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
