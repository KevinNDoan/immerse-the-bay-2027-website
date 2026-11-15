import { whyXr } from "@/content/pitch";
import { CARD, CONTENT, H2, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/** Three claims for why this needs a headset, one card each. */
export function WhyXr() {
  return (
    <section id="why" aria-labelledby="why-title" className={`${CONTENT} ${SECTION}`}>
      <Reveal>
        <h2 id="why-title" className={`${H2} max-w-[16ch]`}>
          {whyXr.title}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">
        {whyXr.claims.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.05} className={`${CARD} flex flex-col p-6 sm:p-7`}>
            <h3 className="text-[clamp(1.5rem,2.4vw,1.875rem)] leading-[1.1] font-medium tracking-[-0.03em]">{c.title}</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-white/70">{c.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
