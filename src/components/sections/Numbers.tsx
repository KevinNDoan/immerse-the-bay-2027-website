import { numbers } from "@/content/pitch";
import { CONTENT, DARK, H2, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/**
 * Harvey's stats, on the dark half: the heading on the left, then one ruled row per figure across the page,
 * the label on the left and the figure large on the right.
 */
export function Numbers() {
  return (
    <section id="numbers" aria-labelledby="numbers-title" data-tone="dark" className={`${DARK} ${SECTION}`}>
      <div className={CONTENT}>
        <Reveal>
          <h2 id="numbers-title" className={`${H2} max-w-[18ch]`}>
            {numbers.title}
          </h2>
        </Reveal>
        {/* A plain list, so each row reads once, label then figure. */}
        <ul className="mt-12 border-b-2 border-white/10">
          {numbers.items.map((n, i) => (
            <li key={n.value} className="border-t-2 border-white/10">
              <Reveal delay={i * 0.04} className="grid items-baseline gap-2 py-5 sm:grid-cols-12 sm:gap-8 sm:py-6">
                <span className="text-[15px] leading-snug text-white/75 sm:col-span-5">{n.label}</span>
                <span className="text-[clamp(2.75rem,5.2vw,4.25rem)] leading-none font-normal tracking-[-0.04em] sm:col-span-6 sm:col-start-7">
                  {n.value}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
