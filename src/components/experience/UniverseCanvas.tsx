"use client";

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { CatmullRomCurve3, Group, MathUtils, Mesh, Vector3 } from "three";
import { GlassShell, MarbleBody, WorldInterior } from "./MarbleObjects";

export type UniverseProps = {
  variant: "hero" | "space" | "ritual" | "world" | "connections" | "build" | "future";
  world?: number;
  step?: number;
  spread?: boolean;
  connected?: boolean;
  assembled?: boolean;
  paused?: boolean;
  onReady?: (ready: boolean) => void;
  onSelectWorld?: (world: number) => void;
};
type Point = [number, number, number];

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

function Marble({ world = 0, position, scale = 1, paused = false, phase = 0, empty = false, onChoose }: {
  world?: number; position: Point; scale?: number; paused?: boolean; phase?: number; empty?: boolean; onChoose?: () => void;
}) {
  const group = useRef<Group>(null);
  const interior = useRef<Group>(null);
  const time = useRef(0);
  const drag = useRef<{ x: number; distance: number } | null>(null);
  const [hovered, setHovered] = useState(false);
  const { invalidate, gl } = useThree();
  useEffect(() => {
    if (hovered) gl.domElement.style.cursor = "grab";
    return () => { gl.domElement.style.cursor = ""; };
  }, [hovered, gl]);
  useFrame((_, delta) => {
    if (!group.current || !interior.current) return;
    const dt = Math.min(delta, 0.04);
    if (!paused) time.current += dt;
    const drift = paused ? 0 : Math.sin(time.current * 0.55 + phase) * 0.09;
    const targetScale = scale * (hovered && !drag.current ? 1.035 : 1);
    group.current.position.x = paused ? position[0] : MathUtils.damp(group.current.position.x, position[0], 4, dt);
    group.current.position.y = paused ? position[1] : MathUtils.damp(group.current.position.y, position[1] + drift, 4, dt);
    group.current.position.z = paused ? position[2] : MathUtils.damp(group.current.position.z, position[2], 4, dt);
    group.current.scale.setScalar(paused ? targetScale : MathUtils.damp(group.current.scale.x, targetScale, 4, dt));
    if (!paused && !drag.current) interior.current.rotation.y += dt * 0.075;
  });
  function down(event: ThreeEvent<PointerEvent>) {
    event.stopPropagation();
    drag.current = { x: event.clientX, distance: 0 };
    (event.target as Element | null)?.setPointerCapture(event.pointerId);
    gl.domElement.style.cursor = "grabbing";
  }
  function move(event: ThreeEvent<PointerEvent>) {
    if (!drag.current || !interior.current) return;
    event.stopPropagation();
    const dx = event.clientX - drag.current.x;
    drag.current.distance += Math.abs(dx);
    drag.current.x = event.clientX;
    interior.current.rotation.y += dx * 0.012;
    invalidate();
  }
  function up(event: ThreeEvent<PointerEvent>) {
    if (!drag.current) return;
    event.stopPropagation();
    if (drag.current.distance < 6) onChoose?.();
    drag.current = null;
    (event.target as Element | null)?.releasePointerCapture(event.pointerId);
    gl.domElement.style.cursor = hovered ? "grab" : "";
  }
  return <group ref={group} position={position} scale={scale}
    onPointerDown={down} onPointerMove={move} onPointerUp={up}
    onPointerCancel={() => { drag.current = null; gl.domElement.style.cursor = ""; }}
    onPointerOver={event => { event.stopPropagation(); setHovered(true); }}
    onPointerOut={() => setHovered(false)}>
    <group ref={interior} rotation={[0.08, phase * 0.3, -0.08]}><MarbleBody world={world} empty={empty} /></group>
  </group>;
}

function Connection({ start, end, paused = false, bend = 0.4 }: { start: Point; end: Point; paused?: boolean; bend?: number }) {
  const curve = useMemo(() => new CatmullRomCurve3([
    new Vector3(...start),
    new Vector3((start[0] + end[0]) / 2, (start[1] + end[1]) / 2 + bend, -0.5),
    new Vector3(...end),
  ]), [start[0], start[1], start[2], end[0], end[1], end[2], bend]);
  const spark = useRef<Mesh>(null);
  const progress = useRef(0.45);
  useFrame((_, delta) => {
    if (!spark.current) return;
    if (!paused) progress.current = (progress.current + Math.min(delta, 0.04) * 0.18) % 1;
    curve.getPoint(progress.current, spark.current.position);
  });
  return <>
    <mesh><tubeGeometry args={[curve, 40, 0.018, 6, false]} /><meshStandardMaterial color="#d8be61" emissive="#c4a246" emissiveIntensity={0.3} metalness={0.55} roughness={0.2} /></mesh>
    <mesh ref={spark}><sphereGeometry args={[0.065, 12, 12]} /><meshBasicMaterial color="#fff0ad" /></mesh>
  </>;
}

function Voice({ paused }: { paused: boolean }) {
  const ref = useRef<Group>(null);
  const time = useRef(0);
  useFrame((_, delta) => {
    if (!ref.current) return;
    if (!paused) time.current += Math.min(delta, 0.04);
    ref.current.children.forEach((bar, i) => { bar.scale.y = 0.2 + Math.sin(i * 0.75 + time.current * 2.7) ** 2 * 0.8; });
  });
  return <group ref={ref} position={[2.3, -2.5, 0]}>{Array.from({ length: 21 }, (_, i) => <mesh key={i} position={[(i - 10) * 0.13, 0, 0]}><capsuleGeometry args={[0.018, 0.5, 2, 6]} /><meshStandardMaterial color="#b6a456" metalness={0.5} roughness={0.2} /></mesh>)}</group>;
}

function Assembly({ assembled, paused, narrow }: { assembled: boolean; paused: boolean; narrow: boolean }) {
  const top = useRef<Group>(null);
  const bottom = useRef<Group>(null);
  const model = useRef<Group>(null);
  useFrame((_, delta) => {
    const target = assembled ? 0 : 0.85;
    const dt = Math.min(delta, 0.04);
    if (top.current) top.current.position.y = paused ? target : MathUtils.damp(top.current.position.y, target, 4, dt);
    if (bottom.current) bottom.current.position.y = paused ? -target : MathUtils.damp(bottom.current.position.y, -target, 4, dt);
    if (model.current && !paused) model.current.rotation.y += dt * 0.12;
  });
  return <group position={narrow ? [0, -0.6, 0] : [2.5, -0.1, 0]} scale={narrow ? 1.25 : 1.5}>
    <group ref={model}><WorldInterior world={0} /></group>
    <group ref={top}><GlassShell world={0} half="top" /></group>
    <group ref={bottom}><GlassShell world={0} half="bottom" /></group>
    {!assembled && <mesh><icosahedronGeometry args={[1.42, 2]} /><meshBasicMaterial color="#8d9f77" wireframe transparent opacity={0.18} /></mesh>}
    {[0, 1, 2].map(i => <mesh key={i} position={[0, -2.5 - i * 0.11, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.1 - i * 0.2, 0.009, 6, 80]} /><meshBasicMaterial color="#b5a06a" transparent opacity={0.55 - i * 0.12} /></mesh>)}
  </group>;
}

function Scene(props: UniverseProps) {
  const { variant, world = 0, step = 0, spread = true, connected = false, assembled = false, paused = false, onReady, onSelectWorld } = props;
  const { viewport, size } = useThree();
  const narrow = size.width < 700;
  const root = useRef<Group>(null);
  const scale = Math.min(viewport.width / (narrow ? 8 : 15), viewport.height / (narrow ? 11 : 9));
  useEffect(() => { onReady?.(true); return () => onReady?.(false); }, [onReady]);
  useFrame(({ pointer }, delta) => {
    if (!root.current) return;
    const x = paused ? 0 : -pointer.y * 0.035;
    const y = paused ? 0 : pointer.x * 0.045;
    root.current.rotation.x = paused ? 0 : MathUtils.damp(root.current.rotation.x, x, 2, delta);
    root.current.rotation.y = paused ? 0 : MathUtils.damp(root.current.rotation.y, y, 2, delta);
  });
  const spacePositions: Point[] = spread
    ? (narrow ? [[-1.25, -0.6, 0], [1.6, 1.4, -0.8], [1.5, -2.8, 0]] : [[0.2, -0.7, 0.7], [3.8, 1.65, -0.4], [4.4, -2, 0.1]])
    : (narrow ? [[0, 1.25, 0], [0, -0.7, 0], [0, -2.65, 0]] : [[3, 1.8, 0], [3, -0.1, 0], [3, -2, 0]]);
  const graph: Point[] = narrow ? [[-1.8, 0.35, 0], [1.8, -0.4, -0.7], [0, -2.9, 0.3]] : [[-3.3, -0.8, 0.3], [0.7, 1, -0.5], [4.2, -1.5, 0.4]];
  return <>
    <ambientLight intensity={1.25} />
    <directionalLight position={[-4, 6, 7]} intensity={3.3} color="#fff5d9" />
    <directionalLight position={[5, -2, 4]} intensity={1.6} color="#e1d4ff" />
    <Environment resolution={64}>
      <Lightformer form="rect" intensity={5} color="#fff9e9" scale={[3, 7]} position={[-4, 3, 5]} target={[0, 0, 0]} />
      <Lightformer form="ring" intensity={3} color="#ffffff" scale={5} position={[5, 2, 2]} target={[0, 0, 0]} />
      <Lightformer form="rect" intensity={2} color="#d8d6ef" scale={[8, 2]} position={[0, -4, 5]} target={[0, 0, 0]} />
    </Environment>
    <group ref={root} scale={scale}>
      {variant === "hero" && <>
        <Marble world={0} position={narrow ? [-2.45, 2.75, 0] : [-5.2, 0.2, 0]} scale={narrow ? 0.8 : 1.18} phase={0.4} paused={paused} onChoose={() => onSelectWorld?.(0)} />
        <Marble world={2} position={narrow ? [2.25, -2.7, 0] : [5.1, 0.9, 0]} scale={narrow ? 0.8 : 1.1} phase={2} paused={paused} onChoose={() => onSelectWorld?.(2)} />
        <Marble world={1} position={narrow ? [2.3, 3.6, -1] : [2.6, -2.95, -1]} scale={0.48} phase={1} paused={paused} onChoose={() => onSelectWorld?.(1)} />
        <Marble empty position={narrow ? [-2.2, -3.7, -1] : [-3.2, -2.8, -1]} scale={0.25} paused={paused} />
      </>}
      {variant === "space" && <>
        {spread && <><Connection start={spacePositions[0]} end={spacePositions[1]} paused={paused} /><Connection start={spacePositions[0]} end={spacePositions[2]} paused={paused} /></>}
        {spacePositions.map((position, i) => <Marble key={i} world={i} position={position} scale={spread ? (i === 0 ? (narrow ? 0.85 : 1.3) : 0.68) : 0.48} phase={i} paused={paused} />)}
      </>}
      {variant === "ritual" && <>
        <Marble world={step === 3 ? 0 : 2} position={narrow ? [step === 2 ? -1 : 0, -0.7, 0] : [step === 1 ? 3.4 : step === 2 ? 0.9 : 2.3, step === 1 ? 0.8 : -0.1, 0]} scale={step === 3 ? (narrow ? 1.7 : 2.05) : (narrow ? 1 : 1.35)} phase={0.4} paused={paused} />
        {step === 0 && !narrow && <Voice paused={paused} />}
        {step === 2 && <><Marble world={1} position={narrow ? [2, 1, -0.3] : [4.7, 1.3, -0.5]} scale={0.65} phase={1.5} paused={paused} /><Connection start={narrow ? [-1, -0.7, 0] : [0.9, -0.1, 0]} end={narrow ? [2, 1, -0.3] : [4.7, 1.3, -0.5]} paused={paused} /></>}
      </>}
      {variant === "world" && [0, 1, 2].map(i => {
        const selected = i === world;
        const side = i === (world + 1) % 3 ? 1 : -1;
        return <Marble key={i} world={i} position={selected ? [0, narrow ? -0.2 : 0.2, 0.4] : [side * (narrow ? 2.9 : 4.9), narrow ? 1.5 : 0.1, -1]} scale={selected ? (narrow ? 1.6 : 1.5) : (narrow ? 0.4 : 0.7)} phase={i * 0.7} paused={paused} onChoose={() => onSelectWorld?.(i)} />;
      })}
      {variant === "connections" && <>
        {connected && <><Connection start={graph[0]} end={graph[1]} paused={paused} /><Connection start={graph[1]} end={graph[2]} paused={paused} /><Connection start={graph[2]} end={graph[0]} paused={paused} bend={-0.5} /></>}
        {graph.map((position, i) => <Marble key={i} world={i} position={position} scale={narrow ? 0.75 : 1.05} phase={i} paused={paused} />)}
      </>}
      {variant === "build" && <Assembly assembled={assembled} paused={paused} narrow={narrow} />}
      {variant === "future" && <>
        <Connection start={[-2.5, -1.5, 0]} end={[0.2, -0.4, -0.5]} paused={paused} />
        <Connection start={[0.2, -0.4, -0.5]} end={[3, -1.6, 0]} paused={paused} />
        <Marble world={0} position={[-2.5, -1.5, 0]} scale={narrow ? 0.72 : 0.95} paused={paused} />
        <Marble world={1} position={[0.2, -0.4, -0.5]} scale={narrow ? 0.55 : 0.72} paused={paused} phase={1} />
        <Marble world={2} position={[3, -1.6, 0]} scale={narrow ? 0.65 : 0.9} paused={paused} phase={2} />
        <Marble empty world={1} position={[4.5, 1.6, -1.5]} scale={0.3} paused={paused} phase={3} />
        <Marble empty world={2} position={[-4.7, 0.7, -1.5]} scale={0.23} paused={paused} phase={4} />
      </>}
    </group>
  </>;
}

export default function UniverseCanvas(props: UniverseProps) {
  const container = useRef<HTMLDivElement>(null);
  const [nearby, setNearby] = useState(false);
  const [available, setAvailable] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    if (!container.current) return;
    const observer = new IntersectionObserver(([entry]) => setNearby(entry.isIntersecting), { rootMargin: "150px" });
    observer.observe(container.current);
    const onVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);
  return <div ref={container} className="zap-canvas" aria-hidden="true">
    {nearby && available && <SceneBoundary onFailure={() => props.onReady?.(false)}><Canvas
      dpr={[1, 1.5]} camera={{ position: [0, 0, 16], fov: 35 }}
      frameloop={!pageVisible ? "never" : props.paused ? "demand" : "always"}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      fallback={<span />}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.transmissionResolutionScale = 0.5;
        gl.domElement.addEventListener("webglcontextlost", event => {
          event.preventDefault(); setAvailable(false); props.onReady?.(false);
        }, { once: true });
      }}
    ><Suspense fallback={null}><Scene {...props} /></Suspense></Canvas></SceneBoundary>}
  </div>;
}
