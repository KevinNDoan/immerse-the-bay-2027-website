"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { demoVideo } from "@/content/pitch";
import { DemoReel } from "@/components/scene";
import { cn } from "@/lib/utils";
import { CONTENT, LABELS, PILL, SCREEN } from "./layout";

const FRAME = `relative w-full overflow-hidden rounded-2xl ${SCREEN}`;

/**
 * The demo, right under the hero. With a recorded video it plays muted and looping, with a pause button;
 * with reduced motion it waits for a press. Until the video exists, the in-browser reel plays instead.
 */
export function Demo() {
  return (
    <section id="demo" aria-labelledby="demo-caption" className="flex flex-col justify-center px-4 pb-4 md:min-h-svh md:pt-[88px] md:pb-6">
      {/* Harvey's hero media: nearly edge to edge, 16px in from each side, and never taller than the screen
          leaves room for, so it fits as one stop. */}
      <div className={`${FRAME} h-[min(calc(100svh-10rem),calc((100vw-2rem)*0.5625))] min-h-64`}>
        {demoVideo.src ? <DemoVideo src={demoVideo.src} poster={demoVideo.poster} /> : <DemoReel className="absolute inset-0" />}
      </div>
      <p id="demo-caption" className={`${CONTENT} mt-4 text-sm leading-relaxed text-ink/70`}>
        {demoVideo.label}
      </p>
    </section>
  );
}

function DemoVideo({ src, poster }: { src: string; poster: string | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);

  // Start it once mounted, unless the visitor asked for reduced motion. The server sends it paused.
  useEffect(() => {
    if (reduce || !ref.current) return;
    ref.current.play().catch(() => {});
  }, [reduce]);

  return (
    <>
      <video
        ref={ref}
        src={src}
        poster={poster ?? undefined}
        muted
        loop
        playsInline
        preload="metadata"
        aria-describedby="demo-caption"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 size-full object-cover"
      />
      <button
        type="button"
        onClick={() => (playing ? ref.current?.pause() : ref.current?.play().catch(() => {}))}
        className={cn(PILL, "absolute right-3 bottom-3 bg-white/90 text-ink shadow-[0_6px_20px_rgb(0_0_0/0.3)] hover:bg-white sm:right-4 sm:bottom-4")}
      >
        {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
        {playing ? LABELS.pauseDemo : LABELS.playDemo}
      </button>
    </>
  );
}
