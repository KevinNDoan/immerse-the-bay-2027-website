import { builtOn } from "@/content/pitch";
import { CARD, CONTENT, H2, SECTION, SUB } from "./layout";
import { Reveal } from "./Reveal";

/** What ZAP! is made of, as a wall of plain cards, with why it fits the track under the heading. */
export function BuiltOn() {
  return (
    <section id="built-on" aria-labelledby="built-title" className={`${CONTENT} ${SECTION}`}>
      <Reveal className="max-w-2xl">
        <h2 id="built-title" className={H2}>
          {builtOn.title}
        </h2>
        <p className={`${SUB} mt-5`}>{builtOn.trackFit}</p>
      </Reveal>
      <ul className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {builtOn.items.map((item, i) => (
          <li key={item.name} className="flex">
            <Reveal delay={(i % 3) * 0.05} className={`${CARD} flex flex-1 flex-col overflow-hidden`}>
              <p className="grid min-h-28 flex-1 place-items-center px-5 py-8 text-center text-xl font-medium tracking-[-0.02em]">
                {item.name}
              </p>
              <p className="border-t border-white/10 px-5 py-3.5 text-sm text-white/70">{item.role}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
