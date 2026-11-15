import { PortalScene } from "@/components/scene";
import { product, steps, worlds } from "@/content/pitch";
import { CONTENT, DARK, H2, LABELS, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/**
 * The start of the dark half, where Harvey shows its client stories: the heading on the left with a button
 * on the right, then a big screen (the portal into one star's world) beside the three things that make a
 * world more than a video.
 */
export function Worlds() {
  return (
    <section id="step-inside" aria-labelledby="worlds-title" data-tone="dark" className={`${DARK} ${SECTION}`}>
      <div className={CONTENT}>
        <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 id="worlds-title" className={H2}>
              {worlds.title}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">{steps[3].text}</p>
          </div>
          <a
            href="#try"
            className="inline-flex min-h-11 shrink-0 items-center self-start rounded-lg border-2 border-white/35 px-4 text-sm font-medium transition-colors hover:border-white sm:self-auto"
          >
            {LABELS.tryIt}
          </a>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <Reveal className="screen relative aspect-square overflow-hidden rounded-2xl bg-void-lift shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] sm:aspect-[16/10] lg:col-span-8 lg:aspect-auto lg:h-[min(56svh,520px)]">
            <div className="absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-center text-sm text-white/70">
              {product.tryExamples[0]}
            </div>
            <PortalScene />
          </Reveal>
          <Reveal delay={0.06} className="lg:col-span-4">
            <dl className="border-t-2 border-white/15">
              {worlds.points.map((p) => (
                <div key={p.title} className="border-b-2 border-white/10 py-5">
                  <dt className="text-lg font-medium">{p.title}</dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-white/70">{p.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
