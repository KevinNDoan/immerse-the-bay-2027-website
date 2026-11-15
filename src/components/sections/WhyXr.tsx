import { whyXr } from "@/content/pitch";
import { H2, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";

/** Three claims for why this needs a headset, one per row, set large. */
export function WhyXr() {
  return (
    <section id="why" aria-labelledby="why-title" className={SECTION}>
      <div className={WRAP}>
        <Reveal>
          <h2 id="why-title" className={`${H2} max-w-[14ch]`}>
            {whyXr.title}
          </h2>
        </Reveal>
        <div className="mt-16 sm:mt-24">
          {whyXr.claims.map((c) => (
            <Reveal
              key={c.title}
              className="grid gap-4 border-t border-white/15 py-10 sm:py-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-16"
            >
              <h3 className="text-[clamp(2rem,4.4vw,3.5rem)] leading-[1] font-medium tracking-[-0.04em]">{c.title}</h3>
              <p className="max-w-[44ch] text-lg leading-relaxed text-white/70 md:pt-2">{c.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
