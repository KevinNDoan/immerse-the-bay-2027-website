import { TryItDemo } from "@/components/scene";
import { tryIt } from "@/content/pitch";
import { CARD, CONTENT, H2, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/**
 * Where Harvey has a testimonial (picture left, words right), ZAP! puts the thing itself: the playable void on
 * the left, what it is on the right. We have no quotes yet, and a made-up one would not be honest.
 */
export function TryIt() {
  return (
    <section id="try" aria-labelledby="try-title" className={`${CONTENT} ${SECTION}`}>
      <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
        <Reveal className={`${CARD} p-3 sm:p-4 lg:col-span-7`}>
          <TryItDemo />
        </Reveal>
        <Reveal delay={0.06} className="lg:col-span-4 lg:col-start-9">
          <h2 id="try-title" className={H2}>
            {tryIt.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-ink/75 sm:text-lg">{tryIt.text}</p>
          <p className="mt-4 text-sm text-ink/70">{tryIt.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
