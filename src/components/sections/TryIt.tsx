import { TryItDemo } from "@/components/scene";
import { tryIt } from "@/content/pitch";
import { CARD, CONTENT, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/**
 * Harvey's centred feature (title, a line, then a big media panel), with the thing itself as the media: the
 * playable void, in a glass card.
 */
export function TryIt() {
  return (
    <section id="try" aria-labelledby="try-title" className={`${CONTENT} ${SECTION}`}>
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 id="try-title" className="text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.05] font-normal tracking-[-0.035em]">
          {tryIt.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink/75 sm:text-lg">{tryIt.text}</p>
      </Reveal>
      <Reveal delay={0.06} className={`${CARD} mx-auto mt-6 w-full max-w-5xl p-3 sm:p-4`}>
        <TryItDemo />
      </Reveal>
      <p className="mt-4 text-center text-sm text-ink/70">{tryIt.note}</p>
    </section>
  );
}
