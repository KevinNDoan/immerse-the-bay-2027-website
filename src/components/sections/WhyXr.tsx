import { whyXr } from "@/content/pitch";
import { CONTENT, H2, SCREEN, SECTION } from "./layout";
import { Picture, type PictureName } from "./pictures";
import { Reveal } from "./Reveal";

/** One picture per claim: the orbit for memory, the request marker for hands-on study, the rush for presence. */
const PICTURE: readonly PictureName[] = ["remember", "steer", "enter"];

/**
 * Harvey's "why" row: the heading on the left, then three tall picture tiles, each with its title and a few
 * lines under it, outside the tile.
 */
export function WhyXr() {
  return (
    <section id="why" aria-labelledby="why-title" className={`${CONTENT} ${SECTION}`}>
      <Reveal>
        <h2 id="why-title" className={`${H2} max-w-[18ch]`}>
          {whyXr.title}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-10 sm:mt-12 md:grid-cols-3 md:gap-5">
        {whyXr.claims.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.06}>
            <div className={`aspect-[4/3] overflow-hidden rounded-2xl md:aspect-[5/6] lg:aspect-square ${SCREEN}`}>
              <Picture name={PICTURE[i]} scale={1.5} />
            </div>
            <h3 className="mt-5 text-xl font-medium tracking-[-0.015em]">{c.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/75">{c.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
