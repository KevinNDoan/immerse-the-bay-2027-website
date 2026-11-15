import { builtOn, builtOnHeading } from "@/content/pitch";
import { CONTENT, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/**
 * Harvey's logo wall, as ZAP!'s parts: a centred heading, then each part's name set like a wordmark in a quiet
 * row, with what it does in small type under it. Names only, no borrowed logos. Why it fits the track closes
 * the section.
 */
export function BuiltOn() {
  return (
    <section id="built-on" aria-labelledby="built-title" className={`${CONTENT} ${SECTION} text-center`}>
      <Reveal>
        <h2 id="built-title" className="text-[clamp(1.5rem,2.6vw,2.125rem)] leading-[1.15] font-normal tracking-[-0.025em]">
          {builtOnHeading}
        </h2>
      </Reveal>
      <Reveal delay={0.06}>
        <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {builtOn.items.map((item) => (
            <li key={item.name} className="flex flex-col items-center gap-2">
              <span className="text-xl font-semibold tracking-[-0.03em] text-ink/80">{item.name}</span>
              <span className="max-w-[22ch] text-[13px] leading-snug text-ink/65">{item.role}</span>
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.1}>
        <p className="mx-auto mt-14 max-w-2xl text-base leading-relaxed text-ink/75 sm:text-lg">{builtOn.trackFit}</p>
      </Reveal>
    </section>
  );
}
