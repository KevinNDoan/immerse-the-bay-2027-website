import { numbers } from "@/content/pitch";
import { CONTENT, H2, SECTION, SPLIT_LEFT, SPLIT_RIGHT } from "./layout";
import { Reveal } from "./Reveal";

/**
 * Harvey's stats band: the heading on the left, and on the right big figures stacked down the page, each
 * under a rule with a short line beneath. The band is a slightly deeper silver glass so it reads as its own
 * stop.
 */
export function Numbers() {
  return (
    <section
      id="numbers"
      aria-labelledby="numbers-title"
      className={`${SECTION} bg-white/25 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-[28px]`}
    >
      <div className={`${CONTENT} grid gap-10 lg:grid-cols-12 lg:gap-8`}>
        <Reveal className={SPLIT_LEFT}>
          <h2 id="numbers-title" className={H2}>
            {numbers.title}
          </h2>
        </Reveal>
        <dl className={`${SPLIT_RIGHT} grid gap-x-8 sm:grid-cols-2`}>
          {numbers.items.map((n, i) => (
            <Reveal key={n.value} delay={(i % 2) * 0.06} className="border-t-2 border-ink/15 pt-5 pb-8">
              <dt className="sr-only">{n.label}</dt>
              <dd>
                <span className="block text-[clamp(3rem,5.6vw,4.5rem)] leading-none font-normal tracking-[-0.04em]">{n.value}</span>
                <span className="mt-3 block max-w-[28ch] text-[15px] leading-snug text-ink/75">{n.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
