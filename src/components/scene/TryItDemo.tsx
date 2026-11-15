"use client";

// The interactive "Try it" toy: a topic input with example chips, the void canvas, a one-line hint
// and a Clear button. The controls render on the server; the canvas lazy-loads with a same-size fallback.

import { useCallback, useReducer, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { product } from "@/content/pitch";
import { SceneFallback } from "./internal/SceneFallback";
import { now } from "./internal/motion";
import { initialState, reducer } from "./tryit/model";

const TryItCanvas = dynamic(() => import("./tryit/TryItCanvas"), {
  ssr: false,
  loading: () => <SceneFallback variant="tryit" />,
});

export type TryItDemoProps = { className?: string };

const HINT = "Drag from star to star to zap them, or tap a faint star to keep it.";
const FULL = "The sky is full. Clear it to start again.";

export function TryItDemo({ className }: TryItDemoProps) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [value, setValue] = useState("");
  const box = useRef({ w: 960, h: 600 });
  const onBox = useCallback((w: number, h: number) => {
    box.current = { w, h };
  }, []);

  const add = (label: string) => {
    if (!label.trim()) return;
    dispatch({ type: "add", label, now: now(), box: box.current });
  };

  const real = state.stars.filter((s) => s.kind === "real" && s.fadeAt === undefined);
  const lastReal = real.at(-1);
  const status = state.full
    ? FULL
    : lastReal
      ? `${real.length} ${real.length === 1 ? "star" : "stars"}, ${state.links.length} ${state.links.length === 1 ? "line" : "lines"}. Newest: ${lastReal.label}.`
      : "";

  return (
    <div className={cn("w-full", className)}>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          add(value);
          setValue("");
        }}
      >
        <label htmlFor="tryit-topic" className="sr-only">
          {product.tryPrompt}
        </label>
        <input
          id="tryit-topic"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={product.tryPrompt}
          maxLength={40}
          autoComplete="off"
          enterKeyHint="go"
          className="h-12 min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 text-base text-white transition-colors placeholder:text-white/60 hover:border-white/30 focus-visible:border-white/70 focus-visible:outline-none"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-full bg-white px-5 text-base font-medium text-void transition-[background-color,transform] hover:bg-white/85 active:scale-[0.97]"
        >
          Add
        </button>
      </form>

      <div className="mt-3 flex flex-wrap gap-2" aria-label="Examples">
        {product.tryExamples.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => add(ex)}
            className="min-h-11 rounded-full border border-white/15 px-4 text-sm text-white/70 transition-[color,border-color,transform] hover:border-white/40 hover:text-white active:scale-[0.97]"
          >
            {ex}
          </button>
        ))}
      </div>

      <div className="relative mt-4 aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/15 bg-void-lift/30 sm:aspect-[16/10] sm:max-h-[72svh]">
        <TryItCanvas state={state} dispatch={dispatch} onBox={onBox} />
        {state.stars.length === 0 ? (
          <p className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 px-6 text-center text-sm text-white/60">
            Your sky is empty. Add a topic to make a star.
          </p>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-sm text-white/70">{state.full ? FULL : HINT}</p>
        <button
          type="button"
          onClick={() => dispatch({ type: "clear" })}
          disabled={state.stars.length === 0}
          className="min-h-11 shrink-0 rounded-full border border-white/15 px-4 text-sm text-white transition-[border-color,opacity] hover:border-white/40 disabled:opacity-40"
        >
          Clear
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {status}
      </p>
    </div>
  );
}
