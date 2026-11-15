import type { ReactNode } from "react";
import { product } from "@/content/pitch";
import { LABELS } from "./layout";
import b from "./pictures.module.css";

// Small looping pictures made from the designer's art in public/art. They are white art, so they always sit
// on a dark panel. Cheap CSS loops, no canvases; they stand still with reduced motion (pictures.module.css).

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

export type PictureName = "say" | "throw" | "zap" | "enter" | "steer" | "remember";

const PICTURES: Record<PictureName, ReactNode> = {
  // The mic, then a note pops into place with its star, and three suggestions twinkle in.
  say: (
    <div className={b.sayRow}>
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
    </div>
  ),
  // A star is thrown, glides, and settles.
  throw: <Star className={b.throw} />,
  // A bolt snaps between two stars, flashes, and calms into a soft line.
  zap: (
    <div className={b.zap}>
      <Star />
      <span className={b.link}>
        <Art src="line_soft" size={256} className={b.soft} />
        <Art src="line_bolt_01" size={256} className={b.bolt} />
      </span>
      <Star />
    </div>
  ),
  // A star rushes at you and opens out.
  enter: <Star className={b.enter} />,
  // The pending-instruction marker fills, with the spoken request beside it.
  steer: (
    <div className={b.request}>
      <span className={b.marker}>
        <Art src="marker_track" size={52} />
        <Art src="marker_fill" size={52} className={b.fill} />
      </span>
      <span className={b.pill}>
        <Art src="icon_mic" size={16} />
        {LABELS.spokenRequest}
      </span>
    </div>
  ),
  // A star with its orbit: it keeps a picture of where you went.
  remember: (
    <div className="grid place-items-center">
      <Art src="star_orbit" size={150} className={b.orbit} />
      <Star className={b.remember} />
    </div>
  ),
};

/**
 * One picture, centred in whatever box it is given. `scale` enlarges the whole drawing for the big panels,
 * since the art is drawn at card size.
 */
export function Picture({ name, scale = 1 }: { name: PictureName; scale?: number }) {
  return (
    <div aria-hidden className={b.stage}>
      <div style={scale === 1 ? undefined : { transform: `scale(${scale})` }}>{PICTURES[name]}</div>
    </div>
  );
}
