"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { demoVideo } from "@/content/pitch";
import { DemoReel } from "@/components/scene";
import { cn } from "@/lib/utils";
import { CONTENT, LABELS, PILL, PILL_DARK } from "./layout";

const FRAME =
  "relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(120%_90%_at_50%_0%,rgb(255_255_255/0.06),transparent_60%),linear-gradient(180deg,#140d26,#07050d)]";

/**
 * The demo, right under the hero. With a recorded video it plays muted and looping, with a pause button;
 * with reduced motion it waits for a press. Until the video exists, the in-browser reel plays instead.
 */
export function Demo() {
  return (
    <section id="demo" aria-labelledby="demo-caption" className={`${CONTENT} scroll-mt-24`}>
      <div className={FRAME}>
        {demoVideo.src ? <DemoVideo src={demoVideo.src} poster={demoVideo.poster} /> : <DemoReel className="absolute inset-0" />}
      </div>
      <p id="demo-caption" className="mt-4 text-sm leading-relaxed text-white/70">
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
        className={cn(PILL, PILL_DARK, "absolute right-3 bottom-3 bg-void/70 backdrop-blur-md sm:right-4 sm:bottom-4")}
      >
        {playing ? <Pause aria-hidden className="size-4" /> : <Play aria-hidden className="size-4" />}
        {playing ? LABELS.pauseDemo : LABELS.playDemo}
      </button>
    </>
  );
}
