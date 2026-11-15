import type { ReactNode } from "react";
import { product, steps, worlds } from "@/content/pitch";
import b from "./bento.module.css";
import { CARD, CONTENT, H2, LABELS, SECTION } from "./layout";
import { Reveal } from "./Reveal";

/** A plain <img> for the small art: these are decorative and tiny, so next/image buys nothing here. */
function Art({ src, className, size }: { src: string; className?: string; size: number }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`/art/${src}.png`} alt="" width={size} height={size} className={className} />;
}

function Star({ className }: { className?: string }) {
  return (
    <span className={`${b.star} ${className ?? ""}`}>
      <Art src="star_glow" size={112} className={b.glow} />
      <Art src="star_core" size={28} className={b.core} />
    </span>
  );
}

const VISUALS: ReactNode[] = [
  // Say it
  <div key="say" className={b.sayRow}>
    <span className={b.mic}>
      <Art src="icon_mic" size={24} />
    </span>
    <span className={b.note}>
      <Art src="note_compact" size={104} />
      <Star className={b.noteStar} />
      <span className={b.noteText}>{product.tryExamples[0]}</span>
    </span>
    <span className={b.ideas}>
      <Art src="star_ring_dashed" size={26} />
      <Art src="star_ring_dashed" size={26} />
      <Art src="star_ring_dashed" size={26} />
    </span>
  </div>,
  // Throw it
  <Star key="throw" className={b.throw} />,
  // Zap it
  <div key="zap" className={b.zap}>
    <Star />
    <span className={b.link}>
      <Art src="line_soft" size={256} className={b.soft} />
      <Art src="line_bolt_01" size={256} className={b.bolt} />
    </span>
    <Star />
  </div>,
  // Step inside
  <Star key="enter" className={b.enter} />,
  // You steer
  <div key="steer" className={b.request}>
    <span className={b.marker}>
      <Art src="marker_track" size={52} />
      <Art src="marker_fill" size={52} className={b.fill} />
    </span>
    <span className={b.pill}>
      <Art src="icon_mic" size={16} />
      {LABELS.spokenRequest}
    </span>
  </div>,
  // It remembers
  <div key="remember" className="grid place-items-center">
    <Art src="star_orbit" size={150} className={b.orbit} />
    <Star className={b.remember} />
  </div>,
];

const CARDS = [
  ...steps.map((s) => ({ title: s.title, text: s.text })),
  ...worlds.points.slice(0, 2).map((p) => ({ title: p.title, text: p.text })),
];

// React Bits' bento rhythm on 12 columns: wide, narrow, medium, then medium, wide, narrow.
const SPANS = ["lg:col-span-5", "lg:col-span-3", "lg:col-span-4", "lg:col-span-4", "lg:col-span-5", "lg:col-span-3"];

/** The loop in six cards: the four steps, then what it is like inside a world. */
export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className={`${CONTENT} ${SECTION}`}>
      <Reveal>
        <h2 id="how-title" className={H2}>
          {LABELS.howItWorks}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12">
        {CARDS.map((c, i) => (
          <Reveal key={c.title} delay={(i % 3) * 0.05} className={`${CARD} flex flex-col overflow-hidden ${SPANS[i]}`}>
            <div
              aria-hidden
              className="h-44 border-b border-white/10 bg-[radial-gradient(80%_70%_at_50%_45%,rgb(255_255_255/0.05),transparent_70%)] sm:h-52"
            >
              <div className={b.stage}>{VISUALS[i]}</div>
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <h3 className="text-lg font-medium tracking-[-0.015em]">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{c.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
