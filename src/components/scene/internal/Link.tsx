"use client";

// A line between two stars, drawn as camera-facing textured strips (design-system.md section 5.5).
// mode "zap": a bolt snaps across in 0.1 s, flashes, then calms into line_soft over 0.3 s.
// mode "drag": a jittery bolt that follows the pointer while the user draws a line.
// mode "dash": a suggested line at 40%. mode "soft": a settled line from the start.

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
  type Camera,
  type Texture,
} from "three";
import { STRIP_ASPECT, useArt } from "./art";
import { TIMING, clamp01, easeOutCubic, now } from "./motion";

export type PointGetter = (out: Vector3, t: number) => void;
export type LinkMode = "zap" | "drag" | "dash" | "soft";

type LinkProps = {
  from: PointGetter;
  to: PointGetter;
  mode: LinkMode;
  /** When the zap starts, on the now() clock. Ignored by other modes. */
  born?: () => number;
  /** Overall opacity multiplier, read every frame. */
  alpha?: () => number;
  /** Width of the settled line in world units. */
  width?: number;
  /** Reduced motion: zaps appear settled (a short fade, no bolt). */
  reduced?: boolean;
};

const A = new Vector3();
const B = new Vector3();
const TIP = new Vector3();
const DIR = new Vector3();
const SIDE = new Vector3();
const VIEW = new Vector3();
const MID = new Vector3();

function makeStripGeometry(): BufferGeometry {
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(12), 3));
  g.setAttribute("uv", new BufferAttribute(new Float32Array(8), 2));
  g.setIndex([0, 2, 1, 1, 2, 3]);
  return g;
}

/** Writes a camera-facing quad from a to b. Returns false when the strip is too short to draw. */
function writeStrip(
  geo: BufferGeometry,
  a: Vector3,
  b: Vector3,
  width: number,
  aspect: number,
  u0: number,
  camera: Camera,
): boolean {
  DIR.subVectors(b, a);
  const len = DIR.length();
  if (len < 1e-4) return false;
  MID.addVectors(a, b).multiplyScalar(0.5);
  VIEW.subVectors(camera.position, MID).normalize();
  SIDE.crossVectors(DIR, VIEW);
  if (SIDE.lengthSq() < 1e-10) return false;
  SIDE.normalize().multiplyScalar(width / 2);
  const p = geo.getAttribute("position") as BufferAttribute;
  p.setXYZ(0, a.x - SIDE.x, a.y - SIDE.y, a.z - SIDE.z);
  p.setXYZ(1, a.x + SIDE.x, a.y + SIDE.y, a.z + SIDE.z);
  p.setXYZ(2, b.x - SIDE.x, b.y - SIDE.y, b.z - SIDE.z);
  p.setXYZ(3, b.x + SIDE.x, b.y + SIDE.y, b.z + SIDE.z);
  p.needsUpdate = true;
  const L = len / (width * aspect);
  const uv = geo.getAttribute("uv") as BufferAttribute;
  uv.setXY(0, u0, 0);
  uv.setXY(1, u0, 1);
  uv.setXY(2, u0 + L, 0);
  uv.setXY(3, u0 + L, 1);
  uv.needsUpdate = true;
  geo.computeBoundingSphere();
  return true;
}

export function Link({ from, to, mode, born, alpha, width = 0.09, reduced = false }: LinkProps) {
  const art = useArt();
  const line = useRef<Mesh>(null);
  const bolt = useRef<Mesh>(null);
  const spark = useRef<Sprite>(null);
  const jitter = useRef({ next: 0, u: 0, tex: 0 });

  useEffect(() => {
    const l = line.current;
    const b = bolt.current;
    if (l) {
      l.geometry.dispose();
      l.geometry = makeStripGeometry();
    }
    if (b) {
      b.geometry.dispose();
      b.geometry = makeStripGeometry();
    }
    return () => {
      l?.geometry.dispose();
      b?.geometry.dispose();
    };
  }, []);

  useFrame(({ camera }) => {
    const l = line.current;
    const bo = bolt.current;
    const sp = spark.current;
    if (!l || !bo || !sp || !l.geometry.getAttribute("position") || !bo.geometry.getAttribute("position")) return;
    const t = now();
    const k = alpha ? clamp01(alpha()) : 1;
    from(A, t);
    to(B, t);

    let lineAlpha = 0;
    let lineWidth = width;
    let boltAlpha = 0;
    let boltWidth = width * 3.2;
    let boltReach = 1;
    let sparkAlpha = 0;
    let lineMap: Texture = art.lineSoft;

    if (mode === "soft") {
      lineAlpha = 0.85;
    } else if (mode === "dash") {
      lineAlpha = 0.4;
      lineMap = art.lineDash;
    } else if (mode === "drag") {
      boltAlpha = 0.95;
    } else {
      const tau = t - (born ? born() : 0);
      if (tau < 0) {
        lineAlpha = 0;
      } else if (reduced) {
        lineAlpha = 0.85 * clamp01(tau / 0.2);
      } else {
        const snapT = clamp01(tau / TIMING.snap);
        const calmT = clamp01((tau - TIMING.snap) / TIMING.calm);
        boltReach = easeOutCubic(snapT);
        const flash = tau < TIMING.snap ? 0 : Math.max(0, 1 - (tau - TIMING.snap) / 0.12);
        boltAlpha = 1 - easeOutCubic(calmT);
        boltWidth = width * (3.2 + 1.2 * flash);
        lineAlpha = 0.85 * easeOutCubic(calmT) + 0.15 * flash;
        lineWidth = width * (1 + 1.4 * (1 - easeOutCubic(calmT)));
        sparkAlpha = tau < TIMING.snap ? 0 : flash;
      }
    }

    // Settled or dashed line.
    const lm = l.material as MeshBasicMaterial;
    if (lm.map !== lineMap) {
      lm.map = lineMap;
      lm.needsUpdate = true;
    }
    lm.opacity = lineAlpha * k;
    l.visible = lineAlpha * k > 0.002 && writeStrip(l.geometry, A, B, lineWidth, STRIP_ASPECT.lineSoft, 0, camera);

    // Bolt: swap strips and slide them every few frames so it crackles.
    if (boltAlpha * k > 0.002) {
      const j = jitter.current;
      if (reduced) {
        j.tex = 0;
        j.u = 0;
      } else if (t >= j.next) {
        j.next = t + 0.045 + Math.random() * 0.03;
        j.u = Math.random();
        j.tex = (j.tex + 1 + Math.floor(Math.random() * 2)) % 3;
      }
      TIP.copy(A).lerp(B, boltReach);
      const bm = bo.material as MeshBasicMaterial;
      const map = art.bolts[j.tex];
      if (bm.map !== map) {
        bm.map = map;
        bm.needsUpdate = true;
      }
      bm.opacity = boltAlpha * k;
      bo.visible = writeStrip(bo.geometry, A, TIP, boltWidth, STRIP_ASPECT.bolt, j.u, camera);
    } else {
      bo.visible = false;
    }

    // Flash spark where the bolt lands.
    sp.visible = sparkAlpha * k > 0.002;
    if (sp.visible) {
      sp.position.copy(B);
      const s = width * 9 * (1 + 0.6 * (1 - sparkAlpha));
      sp.scale.set(s, s, 1);
      (sp.material as SpriteMaterial).opacity = sparkAlpha * k;
    }
  });

  const meshMat = (map: Texture) => (
    <meshBasicMaterial
      map={map}
      transparent
      depthWrite={false}
      depthTest={false}
      blending={AdditiveBlending}
      side={DoubleSide}
      toneMapped={false}
    />
  );

  return (
    <group>
      <mesh ref={line} frustumCulled={false} visible={false}>
        {meshMat(art.lineSoft)}
      </mesh>
      <mesh ref={bolt} frustumCulled={false} visible={false}>
        {meshMat(art.bolt1)}
      </mesh>
      <sprite ref={spark} visible={false}>
        <spriteMaterial map={art.lineSpark} transparent depthWrite={false} depthTest={false} blending={AdditiveBlending} toneMapped={false} />
      </sprite>
    </group>
  );
}
