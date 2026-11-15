// Static stand-in shown while a scene loads and when WebGL is unavailable: the void with a few
// CSS-drawn soft stars and one settled line. It fills its parent, so swapping it out causes no layout shift.
// No hooks and no three.js, so it is safe to render on the server and in next/dynamic's `loading`.

import { cn } from "@/lib/utils";

type FallbackStar = { x: number; y: number; r: number; o: number };

const LAYOUTS: Record<"hero" | "steps" | "tryit" | "portal" | "reel", FallbackStar[]> = {
  hero: [
    { x: 62, y: 30, r: 7, o: 0.9 },
    { x: 74, y: 48, r: 10, o: 1 },
    { x: 86, y: 34, r: 6, o: 0.8 },
    { x: 80, y: 68, r: 5, o: 0.7 },
    { x: 56, y: 62, r: 4, o: 0.5 },
    { x: 92, y: 58, r: 4, o: 0.6 },
    { x: 18, y: 18, r: 3, o: 0.35 },
    { x: 34, y: 80, r: 3, o: 0.3 },
  ],
  steps: [
    { x: 30, y: 30, r: 6, o: 0.8 },
    { x: 52, y: 22, r: 4, o: 0.6 },
    { x: 70, y: 36, r: 5, o: 0.7 },
    { x: 58, y: 64, r: 10, o: 1 },
    { x: 24, y: 58, r: 4, o: 0.5 },
  ],
  portal: [
    { x: 50, y: 50, r: 22, o: 0.9 },
    { x: 50, y: 50, r: 22, o: 0.9 },
    { x: 18, y: 24, r: 3, o: 0.4 },
    { x: 84, y: 72, r: 3, o: 0.35 },
  ],
  reel: [
    { x: 40, y: 40, r: 7, o: 0.8 },
    { x: 56, y: 30, r: 4, o: 0.6 },
    { x: 66, y: 46, r: 5, o: 0.7 },
    { x: 52, y: 64, r: 10, o: 1 },
    { x: 30, y: 58, r: 4, o: 0.5 },
  ],
  tryit: [
    { x: 38, y: 42, r: 9, o: 1 },
    { x: 60, y: 30, r: 5, o: 0.5 },
    { x: 64, y: 58, r: 5, o: 0.5 },
    { x: 22, y: 66, r: 3, o: 0.35 },
    { x: 82, y: 22, r: 3, o: 0.3 },
  ],
};

export function SceneFallback({
  variant = "hero",
  className,
}: {
  variant?: keyof typeof LAYOUTS;
  className?: string;
}) {
  const stars = LAYOUTS[variant];
  const [a, b] = [stars[0], stars[1]];
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line
          x1={a.x}
          y1={a.y}
          x2={b.x}
          y2={b.y}
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="0.3"
          vectorEffect="non-scaling-stroke"
          style={{ strokeWidth: 1.5 }}
        />
      </svg>
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.r * 10,
            height: s.r * 10,
            transform: "translate(-50%, -50%)",
            opacity: s.o,
            background: `radial-gradient(circle, #fff 0, #fff ${s.r * 0.9}px, rgb(255 255 255 / 0.28) ${s.r * 1.4}px, rgb(255 255 255 / 0.06) ${s.r * 3}px, transparent 70%)`,
          }}
        />
      ))}
    </div>
  );
}
