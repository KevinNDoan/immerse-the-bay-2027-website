"use client";

// DOM labels that follow 3D points, without drei <Html>.
// drei <Html> mounts a separate React root per label, which in Strict Mode logs
// "Attempted to synchronously unmount a root while React was already rendering". Here the labels are
// ordinary DOM in one layer next to the canvas; the canvas side only registers an entry and writes its
// projected position and look straight to the element's style each frame.

import { createContext, useContext, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

export type OverlayKind = "note" | "label" | "mic";
export type OverlaySize = "sm" | "md" | "lg";

export type OverlayItem = {
  id: string;
  kind: OverlayKind;
  text: string;
  size: OverlaySize;
};

export type OverlayStore = {
  add: (item: OverlayItem) => void;
  remove: (id: string) => void;
  bind: (id: string, el: HTMLDivElement | null) => void;
  el: (id: string) => HTMLDivElement | undefined;
  subscribe: (cb: () => void) => () => void;
  snapshot: () => OverlayItem[];
};

export function createOverlayStore(): OverlayStore {
  let items: OverlayItem[] = [];
  const els = new Map<string, HTMLDivElement>();
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach((l) => l());
  return {
    add(item) {
      const i = items.findIndex((x) => x.id === item.id);
      const old = items[i];
      if (old && old.text === item.text && old.size === item.size && old.kind === item.kind) return;
      items = i >= 0 ? items.map((x, k) => (k === i ? item : x)) : [...items, item];
      emit();
    },
    bind(id, el) {
      if (el) els.set(id, el);
      else els.delete(id);
    },
    el: (id) => els.get(id),
    remove(id) {
      const next = items.filter((i) => i.id !== id);
      if (next.length !== items.length) {
        items = next;
        emit();
      }
    },
    subscribe(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    snapshot: () => items,
  };
}

export const OverlayContext = createContext<OverlayStore | null>(null);
export const useOverlay = () => useContext(OverlayContext);

const NOTE_SIZE: Record<OverlaySize, string> = {
  sm: "min-w-[80px] max-w-[124px] min-h-[64px] px-2.5 py-2 text-[13px]",
  md: "min-w-[92px] max-w-[140px] min-h-[76px] px-3 py-2.5 text-[14px]",
  lg: "min-w-[108px] max-w-[164px] min-h-[88px] px-3 py-2.5 text-[16px]",
};

const EMPTY: OverlayItem[] = [];

/** The DOM layer. Render it next to the <Canvas>, inside the same positioned box. */
export function OverlayLayer({ store }: { store: OverlayStore }) {
  const items = useSyncExternalStore(store.subscribe, store.snapshot, () => EMPTY);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {items.map((item) => (
        <div
          key={item.id}
          ref={(el) => store.bind(item.id, el)}
          lang="en"
          className="absolute top-0 left-0 will-change-transform"
          style={{ opacity: 0, visibility: "hidden", transformOrigin: "50% 0%" }}
        >
          {item.kind === "note" ? (
            <div
              className={cn(
                "w-max rounded-[5px] bg-paper font-medium leading-[1.15] text-ink hyphens-auto break-words",
                "shadow-[0_8px_24px_rgb(0_0_0/0.45),0_1px_0_rgb(255_255_255/0.6)_inset]",
                NOTE_SIZE[item.size],
              )}
            >
              {item.text}
            </div>
          ) : item.kind === "label" ? (
            <div className="whitespace-nowrap rounded-full border border-white/15 bg-void/70 px-2.5 py-1 text-[13px] leading-none text-white/70 backdrop-blur-sm">
              {item.text}
            </div>
          ) : (
            <div className="relative grid size-10 place-items-center rounded-full bg-white shadow-[0_0_24px_rgb(255_255_255/0.35)]">
              <span className="absolute inset-0 rounded-full border-2 border-white/60 motion-safe:animate-ping" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/art/icon_mic.png" alt="" width={24} height={24} className="size-6 invert" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
