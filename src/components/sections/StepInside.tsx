import { product, worlds } from "@/content/pitch";
import { PortalScene } from "@/components/scene";
import { CARD, CONTENT, H2, LABELS, PILL, PILL_DARK, SECTION, SUB } from "./layout";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/** The third world point, the one not shown in the How it works cards. */
const CONTEXT = worlds.points[2];

/** Inside a star: the words on the left, and on the right a window onto one star's world. */
export function StepInside() {
  return (
    <section id="step-inside" aria-labelledby="step-title" className={`${CONTENT} ${SECTION}`}>
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <h2 id="step-title" className={H2}>
            {worlds.title}
          </h2>
          <p className={`${SUB} mt-5`}>{worlds.text}</p>
          <div className="mt-6 border-t border-white/10 pt-5">
            <h3 className="font-medium">{CONTEXT.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{CONTEXT.text}</p>
          </div>
          <a href="#try" className={`${PILL} ${PILL_DARK} mt-8`}>
            {LABELS.tryIt}
          </a>
        </Reveal>

        <Reveal delay={0.08} className={cn(CARD, "overflow-hidden bg-void-lift/60 shadow-[0_24px_64px_rgb(0_0_0/0.45)] lg:col-span-7")}>
          <div className="flex h-11 items-center justify-center border-b border-white/10 text-sm text-white/70">
            {product.tryExamples[0]}
          </div>
          {/* Taller on phones, so the Step inside button sits clear of the portal's rim. */}
          <div className="relative aspect-square w-full sm:aspect-[4/3]">
            <PortalScene />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
