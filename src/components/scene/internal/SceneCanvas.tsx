"use client";

// The shared canvas shell for every scene:
// - transparent, dpr [1, 2], so the page's void gradient shows through
// - renders only while on screen (IntersectionObserver drives frameloop "always" / "never")
// - keeps the static fallback underneath until the art has loaded, then fades it out
// - falls back for good when WebGL is unavailable or the context fails

import { Component, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { cn } from "@/lib/utils";
import { loadArt } from "./art";
import { SceneFallback } from "./SceneFallback";

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    onReady();
  }, [onReady]);
  return null;
}

type SceneCanvasProps = {
  variant: "hero" | "steps" | "tryit";
  camera: CanvasProps["camera"];
  className?: string;
  /** Class for the <canvas> wrapper R3F creates. */
  canvasClassName?: string;
  children: ReactNode;
  /** Called with the container so scenes can attach native listeners. */
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export function SceneCanvas({ variant, camera, className, canvasClassName, children, containerRef }: SceneCanvasProps) {
  const [webgl] = useState(hasWebGL);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");
  const [ready, setReady] = useState(false);
  const localRef = useRef<HTMLDivElement>(null);
  const box = containerRef ?? localRef;

  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [box]);

  // Start fetching art as soon as the shell mounts, even before the canvas is on screen.
  useEffect(() => {
    loadArt().catch(() => {});
  }, []);

  const markReady = useCallback(() => setReady(true), []);
  const fallback = <SceneFallback variant={variant} />;

  return (
    <div ref={box} className={cn("absolute inset-0 isolate overflow-hidden", className)}>
      <div
        className={cn("absolute inset-0 transition-opacity duration-500", ready && webgl ? "opacity-0" : "opacity-100")}
      >
        {fallback}
      </div>
      {webgl ? (
        <CanvasBoundary fallback={fallback}>
          <Canvas
            className={canvasClassName}
            style={{ position: "absolute", inset: 0 }}
            dpr={[1, 2]}
            frameloop={visible ? "always" : "never"}
            camera={camera}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power", premultipliedAlpha: true }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <Suspense fallback={null}>
              {children}
              <ReadySignal onReady={markReady} />
            </Suspense>
          </Canvas>
        </CanvasBoundary>
      ) : null}
    </div>
  );
}
