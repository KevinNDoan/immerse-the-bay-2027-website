import { tryIt } from "@/content/pitch";
import { TryItDemo } from "@/components/scene";
import { H2, LEAD, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";

/** A small version of the void, right in the page. */
export function TryIt() {
  return (
    <section id="try" aria-labelledby="try-title" className={SECTION}>
      <div className={WRAP}>
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 id="try-title" className={H2}>
            {tryIt.title}
          </h2>
          <p className={`${LEAD} mt-6`}>{tryIt.text}</p>
        </Reveal>
        <Reveal delay={0.08} className="mt-14 sm:mt-16">
          <TryItDemo />
        </Reveal>
        <p className="mt-6 text-center text-sm text-white/70">{tryIt.note}</p>
      </div>
    </section>
  );
}
