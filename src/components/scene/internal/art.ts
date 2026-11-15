// Loads the designer's FX images from /public/art once and shares them across every canvas on the page.
// A texture can be used by several WebGL renderers; each one uploads its own copy.

import { use } from "react";
import { RepeatWrapping, SRGBColorSpace, Texture, TextureLoader, ClampToEdgeWrapping } from "three";

const FILES = {
  core: "star_core",
  glow: "star_glow",
  ring: "star_ring",
  ringDashed: "star_ring_dashed",
  sparks: "star_sparks",
  sparkle: "star_sparkle",
  orbit: "star_orbit",
  lineSoft: "line_soft",
  lineDash: "line_dash",
  lineSpark: "line_spark",
  bolt1: "line_bolt_01",
  bolt2: "line_bolt_02",
  bolt3: "line_bolt_03",
} as const;

export type ArtKey = keyof typeof FILES;
export type Art = Record<ArtKey, Texture> & { bolts: Texture[] };

const REPEATING: ArtKey[] = ["lineSoft", "lineDash", "bolt1", "bolt2", "bolt3"];

let artPromise: Promise<Art> | null = null;

export function loadArt(): Promise<Art> {
  if (artPromise) return artPromise;
  const loader = new TextureLoader();
  const keys = Object.keys(FILES) as ArtKey[];
  artPromise = Promise.all(keys.map((k) => loader.loadAsync(`/art/${FILES[k]}.png`))).then((textures) => {
    const art = {} as Art;
    keys.forEach((k, i) => {
      const t = textures[i];
      t.colorSpace = SRGBColorSpace;
      if (REPEATING.includes(k)) {
        t.wrapS = RepeatWrapping;
        t.wrapT = ClampToEdgeWrapping;
      }
      t.anisotropy = 4;
      t.needsUpdate = true;
      art[k] = t;
    });
    art.bolts = [art.bolt1, art.bolt2, art.bolt3];
    return art;
  });
  // A failed load should be retryable on the next mount.
  artPromise.catch(() => {
    artPromise = null;
  });
  return artPromise;
}

/** Suspends until the art is loaded. Use inside <Suspense> in a canvas. */
export function useArt(): Art {
  return use(loadArt());
}

/** Width to height ratio of each strip image, used to repeat them at the right rate along a line. */
export const STRIP_ASPECT = {
  lineSoft: 4,
  lineDash: 4,
  bolt: 8,
} as const;
