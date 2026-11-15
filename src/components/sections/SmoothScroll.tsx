"use client";

import "lenis/dist/lenis.css";
import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, type ReactNode } from "react";
import { nextSectionStop, sectionStops, SectionGesture } from "@/lib/section-scroll";

const SECTIONS = ".zap-experience main > section";
const DURATION = 0.95;
const ease = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
const INTERACTIVE = "input, textarea, select, button, a, summary, video, audio, [contenteditable]:not([contenteditable='false']), [role='slider'], [data-pitch-keys='off']";
const NATIVE_SCROLL = "dialog, [data-lenis-prevent], [data-scroll-native], textarea, select, [contenteditable]:not([contenteditable='false'])";

type Navigate = (id: string, immediate?: boolean) => void;

const nativeNavigate: Navigate = (id, immediate = false) => {
  const target = document.getElementById(id);
  target?.scrollIntoView({
    behavior: immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    block: "start",
  });
};

const SectionScrollContext = createContext<Navigate>(nativeNavigate);
export const useSectionScroll = () => useContext(SectionScrollContext);

/** Desktop gestures use a single controlled transition. Touch uses native CSS section snapping. */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const navigateRef = useRef<Navigate | null>(null);
  const navigate = useCallback<Navigate>((id, immediate = false) => {
    // Let React close a menu or dialog before scrolling to its destination.
    requestAnimationFrame(() => (navigateRef.current ?? nativeNavigate)(id, immediate));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const finePointer = window.matchMedia("(pointer: fine)");
    const presentationViewport = window.matchMedia("(min-width: 901px) and (min-height: 600px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let destroyController: (() => void) | undefined;

    function configure() {
      destroyController?.();
      destroyController = undefined;
      // Compact screens and zoomed layouts keep native scrolling so tall content stays accessible.
      if (!finePointer.matches || !presentationViewport.matches || reducedMotion.matches) return;
      const sections = [...document.querySelectorAll<HTMLElement>(SECTIONS)];
      if (!sections.length) return;
      root.dataset.zapScroll = "controlled";
      const gesture = new SectionGesture();
      let moving = false;
      let disposed = false;

      const getStops = () => sectionStops(
        sections.map(section => {
          const bounds = section.getBoundingClientRect();
          return { top: bounds.top + window.scrollY, bottom: bounds.bottom + window.scrollY };
        }),
        window.innerHeight,
        Math.max(0, root.scrollHeight - window.innerHeight),
      );

      const modalOpen = () => !!document.querySelector(".zap-experience dialog[open]");
      const lenis = new Lenis({
        autoRaf: true,
        anchors: false,
        duration: DURATION,
        easing: ease,
        syncTouch: false,
        allowNestedScroll: true,
        stopInertiaOnNavigate: true,
        virtualScroll: ({ deltaX, deltaY, event }) => {
          if (disposed || !event.type.includes("wheel")) return true;
          if (event.defaultPrevented || event.ctrlKey || event.shiftKey || Math.abs(deltaX) > Math.abs(deltaY)) return false;
          const target = event.target instanceof Element ? event.target : null;
          if (modalOpen() || target?.closest(NATIVE_SCROLL)) return false;
          if (!event.cancelable) return false;
          event.preventDefault();
          root.dataset.zapScroll = "controlled";
          const direction = gesture.sample(deltaY, performance.now(), moving);
          if (direction) goTo(nextSectionStop(getStops(), lenis.scroll, direction));
          return false;
        },
      });

      function goTo(position: number | HTMLElement, immediate = false) {
        if (disposed || modalOpen()) return;
        root.dataset.zapScroll = "controlled";
        lenis.start();
        lenis.resize();
        moving = true;
        lenis.scrollTo(position, {
          duration: DURATION,
          easing: ease,
          immediate,
          force: true,
          lock: true,
          onComplete: () => { moving = false; },
        });
      }

      navigateRef.current = (id, immediate = false) => {
        const target = document.getElementById(id);
        if (target) {
          gesture.reset();
          goTo(target, immediate);
        }
      };

      function onKey(event: KeyboardEvent) {
        const target = event.target instanceof Element ? event.target : null;
        if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey || modalOpen()) return;
        const pageKey = ["PageDown", "PageUp", "Home", "End"].includes(event.key);
        if (target?.closest(INTERACTIVE) && (!pageKey || target.closest("input, textarea, select, video, audio, [contenteditable], [role='slider'], [data-pitch-keys='off']"))) return;
        const forward = ["ArrowDown", "ArrowRight", "PageDown"].includes(event.key) || event.key === " " && !event.shiftKey;
        const backward = ["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key) || event.key === " " && event.shiftKey;
        if (!forward && !backward && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        if (event.repeat || moving) return;
        gesture.reset();
        const stops = getStops();
        const position = event.key === "Home" ? 0 : event.key === "End" ? stops.at(-1)! : nextSectionStop(stops, lenis.scroll, forward ? 1 : -1);
        goTo(position);
      }

      function onAnchor(event: MouseEvent) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || modalOpen()) return;
        const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
        if (!anchor || anchor.hasAttribute("download") || anchor.target && anchor.target !== "_self") return;
        const url = new URL(anchor.href, window.location.href);
        if (!url.hash || url.origin !== window.location.origin || url.pathname !== window.location.pathname || url.search !== window.location.search) return;
        let id: string;
        try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (!target) return;
        event.preventDefault();
        gesture.reset();
        goTo(target);
        if (window.location.hash !== url.hash) window.history.pushState(window.history.state, "", url.hash);
        if (!target.hasAttribute("tabindex")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }

      function cancelMotion() {
        const wasStopped = lenis.isStopped;
        lenis.stop();
        if (!wasStopped) lenis.start();
        moving = false;
        gesture.reset();
      }

      function onFocus() {
        // Tabbing can move the viewport. Stop an in-flight animation instead of pulling focus away.
        if (moving && document.activeElement?.matches(INTERACTIVE)) cancelMotion();
      }

      function onTouchStart() {
        cancelMotion();
        // Hybrid laptops can switch from trackpad to direct touch without changing pointer media queries.
        delete root.dataset.zapScroll;
      }

      const dialog = document.querySelector(".zap-experience dialog");
      const modalObserver = new MutationObserver(() => {
        cancelMotion();
        if (modalOpen()) lenis.stop();
        else lenis.start();
      });
      if (dialog) modalObserver.observe(dialog, { attributes: true, attributeFilter: ["open"] });
      if (modalOpen()) lenis.stop();

      window.addEventListener("keydown", onKey);
      window.addEventListener("click", onAnchor);
      window.addEventListener("resize", cancelMotion);
      window.addEventListener("touchstart", onTouchStart, { passive: true });
      document.addEventListener("focusin", onFocus);
      destroyController = () => {
        disposed = true;
        navigateRef.current = null;
        modalObserver.disconnect();
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("click", onAnchor);
        window.removeEventListener("resize", cancelMotion);
        window.removeEventListener("touchstart", onTouchStart);
        document.removeEventListener("focusin", onFocus);
        lenis.destroy();
        delete root.dataset.zapScroll;
      };
    }

    configure();
    finePointer.addEventListener("change", configure);
    presentationViewport.addEventListener("change", configure);
    reducedMotion.addEventListener("change", configure);
    return () => {
      finePointer.removeEventListener("change", configure);
      presentationViewport.removeEventListener("change", configure);
      reducedMotion.removeEventListener("change", configure);
      destroyController?.();
    };
  }, []);

  return <SectionScrollContext value={navigate}>{children}</SectionScrollContext>;
}
