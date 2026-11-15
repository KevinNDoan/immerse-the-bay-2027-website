"use client";

// Live text that hangs off a star: the Paper sticky note (design-system.md 5.2) or the small
// suggested-topic label (5.4). Rendered as DOM with drei <Html> so the text stays crisp and selectable-free.
// Place it inside a <Star> so it follows the star; the frame loop only touches opacity and transform.

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { cn } from "@/lib/utils";

export type NoteLook = { opacity: number; scale: number; /** Overrides offsetY when set. */ y?: number };

type NoteProps = {
  text: string;
  variant?: "note" | "label";
  size?: "sm" | "md" | "lg";
  /** Pixels from the star's centre to the top of the note. */
  offsetY?: number;
  /** Small fixed tilt in degrees, so notes feel stuck on by hand. */
  tilt?: number;
  drive: (out: NoteLook, t: number, dt: number) => void;
};

const NOTE_SIZE = {
  sm: "min-w-[80px] max-w-[124px] min-h-[64px] px-2.5 py-2 text-[13px]",
  md: "min-w-[92px] max-w-[140px] min-h-[76px] px-3 py-2.5 text-[14px]",
  lg: "min-w-[108px] max-w-[164px] min-h-[88px] px-3 py-2.5 text-[16px]",
} as const;

export function Note({ text, variant = "note", size = "md", offsetY = 20, tilt = 0, drive }: NoteProps) {
  const el = useRef<HTMLDivElement>(null);
  const look = useRef<NoteLook>({ opacity: 0, scale: 0 });

  useFrame((_, delta) => {
    const l = look.current;
    drive(l, performance.now() / 1000, Math.min(delta, 1 / 20));
    const d = el.current;
    if (!d) return;
    const o = l.opacity < 0.01 ? 0 : l.opacity;
    d.style.opacity = String(o);
    d.style.visibility = o === 0 ? "hidden" : "visible";
    d.style.transform = `translate(-50%, ${(l.y ?? offsetY).toFixed(1)}px) rotate(${tilt}deg) scale(${l.scale.toFixed(4)})`;
  });

  return (
    <Html zIndexRange={[20, 0]} pointerEvents="none" style={{ pointerEvents: "none" }}>
      <div
        ref={el}
        aria-hidden="true"
        style={{ opacity: 0, visibility: "hidden", transformOrigin: "50% 0%" }}
        className={cn(
          "pointer-events-none select-none will-change-transform",
          variant === "note"
            ? cn(
                "w-max rounded-[5px] bg-paper font-medium leading-[1.15] text-ink",
                "shadow-[0_8px_24px_rgb(0_0_0/0.45),0_1px_0_rgb(255_255_255/0.6)_inset] hyphens-auto break-words",
                NOTE_SIZE[size],
              )
            : "whitespace-nowrap rounded-full border border-white/15 bg-void/70 px-2.5 py-1 text-[13px] leading-none text-white/70 backdrop-blur-sm",
        )}
        lang="en"
      >
        {text}
      </div>
    </Html>
  );
}
