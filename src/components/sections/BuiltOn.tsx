import { builtOn } from "@/content/pitch";
import { H2, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";

/** What ZAP! is made of, and why it fits the Living Worlds track. */
export function BuiltOn() {
  return (
    <section id="built-on" aria-labelledby="built-title" className={SECTION}>
      <div className={WRAP}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-20">
          <Reveal>
            <h2 id="built-title" className={H2}>
              {builtOn.title}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <dl className="border-t border-white/15">
              {builtOn.items.map((item) => (
                <div
                  key={item.name}
                  className="grid gap-1 border-b border-white/15 py-5 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] sm:gap-8"
                >
                  <dt className="text-lg font-medium tracking-[-0.01em]">{item.name}</dt>
                  <dd className="text-base leading-relaxed text-white/70 sm:text-lg">{item.role}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <Reveal className="mt-24 sm:mt-32">
          <figure className="mx-auto max-w-4xl border-l-2 border-white pl-6 sm:pl-10">
            <blockquote className="text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.2] font-medium tracking-[-0.03em]">
              {builtOn.trackFit}
            </blockquote>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
