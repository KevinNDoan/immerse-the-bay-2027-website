import Image from "next/image";
import { worlds } from "@/content/pitch";
import { H2, LEAD, SECTION, WRAP } from "./layout";
import { Reveal } from "./Reveal";
import s from "./worlds.module.css";

/** The words in the frame's spoken-request pill. Not in pitch.ts; an example request, as the headset shows it. */
const SPOKEN_REQUEST = "Show me the eruption";

// Three ridgelines, each drawn over a 2400-wide box whose right half repeats the left, so they loop.
const RIDGES = [
  {
    cls: s.far,
    fill: "#2a2632",
    d: "M0 250 C150 200 260 170 400 205 S640 150 800 190 S1050 230 1200 250 C1350 200 1460 170 1600 205 S1840 150 2000 190 S2250 230 2400 250 V675 H0 Z",
  },
  {
    cls: s.mid,
    fill: "#1a1622",
    d: "M0 360 C120 330 220 250 330 270 S470 360 600 330 S820 230 960 280 S1120 370 1200 360 C1320 330 1420 250 1530 270 S1670 360 1800 330 S2020 230 2160 280 S2320 370 2400 360 V675 H0 Z",
  },
  {
    cls: s.near,
    fill: "#0d0a14",
    d: "M0 470 C140 440 260 410 400 450 S650 520 820 470 S1080 430 1200 470 C1340 440 1460 410 1600 450 S1850 520 2020 470 S2280 430 2400 470 V675 H0 Z",
  },
] as const;

/** Inside a star: a living world, steered live, with the marker that shows a request is on its way. */
export function Worlds() {
  return (
    <section id="worlds" aria-labelledby="worlds-title" className={SECTION}>
      <div className={WRAP}>
        <Reveal className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-20">
          <h2 id="worlds-title" className={`${H2} max-w-[12ch]`}>
            {worlds.title}
          </h2>
          <p className={LEAD}>{worlds.text}</p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14 sm:mt-20">
          {/* A picture of a world, not the world: it repeats what the text says, so screen readers skip it. */}
          <div className={s.frame} aria-hidden>
            <div className={s.light} />
            {RIDGES.map((r) => (
              <div key={r.cls} className={`${s.ridge} ${r.cls}`}>
                <svg viewBox="0 0 2400 675" preserveAspectRatio="none">
                  <path d={r.d} fill={r.fill} />
                </svg>
              </div>
            ))}
            <div className={s.haze} />
            <div className={s.answer} />
            <div className={s.request}>
              <div className={s.marker}>
                <Image src="/art/marker_track.png" alt="" width={960} height={960} sizes="56px" />
                <Image src="/art/marker_fill.png" alt="" width={960} height={960} sizes="56px" className={s.fill} />
              </div>
              <p className={s.pill}>
                <Image src="/art/icon_mic.png" alt="" width={192} height={192} sizes="18px" />
                {SPOKEN_REQUEST}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 sm:mt-20 md:grid-cols-3 md:gap-12">
          {worlds.points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06} className="border-t border-white/15 pt-6">
              <h3 className="text-xl font-medium tracking-[-0.02em]">{p.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-white/70">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
