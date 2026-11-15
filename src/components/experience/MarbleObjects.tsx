"use client";

import { useMemo } from "react";
import { CatmullRomCurve3, Group, Vector3 } from "three";

function Rod({ start, end, color = "#f4e3b8", radius = 0.035 }: { start: [number, number, number]; end: [number, number, number]; color?: string; radius?: number }) {
  const a = new Vector3(...start);
  const b = new Vector3(...end);
  const midpoint = a.clone().add(b).multiplyScalar(0.5);
  const direction = b.clone().sub(a);
  const rotation = new Vector3(0, 1, 0).angleTo(direction);
  const axis = new Vector3(0, 1, 0).cross(direction).normalize();
  return (
    <mesh position={midpoint} quaternion={new Group().quaternion.setFromAxisAngle(axis, rotation)}>
      <cylinderGeometry args={[radius, radius, direction.length(), 8]} />
      <meshStandardMaterial color={color} metalness={0.35} roughness={0.25} />
    </mesh>
  );
}

function DNA() {
  const points = useMemo(() => Array.from({ length: 29 }, (_, i) => {
    const t = i / 28;
    const a = t * Math.PI * 3.3;
    return [Math.cos(a) * 0.48, (t - 0.5) * 2.5, Math.sin(a) * 0.48] as [number, number, number];
  }), []);
  const curves = useMemo(() => [1, -1].map(sign => new CatmullRomCurve3(points.map(p => new Vector3(p[0] * sign, p[1], p[2] * sign)))), [points]);
  return (
    <group rotation={[0.15, 0, -0.35]}>
      {curves.map((curve, i) => <mesh key={i}><tubeGeometry args={[curve, 80, 0.075, 10, false]} /><meshStandardMaterial color={i ? "#f2994c" : "#24d3b2"} metalness={0.15} roughness={0.25} /></mesh>)}
      {points.filter((_, i) => i % 2 === 0).map((p, i) => <Rod key={i} start={p} end={[-p[0], p[1], -p[2]]} color={i % 2 ? "#eee5c6" : "#de7460"} radius={0.035} />)}
    </group>
  );
}

function Tower({ position = [0, 0, 0], scale = 1 }: { position?: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.29, 0]}><boxGeometry args={[0.43, 0.65, 0.43]} /><meshStandardMaterial color="#d1c3a6" roughness={0.8} /></mesh>
      <mesh position={[0, 0.63, 0]}><boxGeometry args={[0.53, 0.12, 0.53]} /><meshStandardMaterial color="#ede0bf" /></mesh>
      {[-1, 1].flatMap(x => [-1, 1].map(z => <mesh key={`${x}-${z}`} position={[x * 0.21, 0.76, z * 0.21]}><boxGeometry args={[0.12, 0.19, 0.12]} /><meshStandardMaterial color="#ede0bf" /></mesh>))}
      <mesh position={[0, 0.35, 0.218]}><boxGeometry args={[0.12, 0.23, 0.014]} /><meshStandardMaterial color="#444d42" /></mesh>
      <mesh position={[0.218, 0.35, 0]}><boxGeometry args={[0.014, 0.23, 0.12]} /><meshStandardMaterial color="#444d42" /></mesh>
      {[0.06, 0.19, 0.48].map(y => <mesh key={y} position={[0, y, 0.22]}><boxGeometry args={[0.43, 0.009, 0.008]} /><meshStandardMaterial color="#ab9f86" /></mesh>)}
    </group>
  );
}

function Landscape({ tower = false }: { tower?: boolean }) {
  const wall = useMemo(() => Array.from({ length: 23 }, (_, i) => {
    const x = (i / 22 - 0.5) * 2.1;
    return [x, 0.02 + Math.cos(i / 22 * Math.PI * 1.6) * 0.15, Math.sin(i / 22 * Math.PI * 2) * 0.37] as [number, number, number];
  }), []);
  return (
    <group rotation={[0.12, -0.35, 0]} position={[0, -0.25, 0]}>
      <mesh position={[0, -0.17, 0]} scale={[1.2, 0.36, 1]}><icosahedronGeometry args={[1, 2]} /><meshStandardMaterial color="#889b69" flatShading roughness={0.9} /></mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[Math.sin(i * 2.4) * 0.85, -0.1 + (i % 3) * 0.08, Math.cos(i * 2.4) * 0.65]} rotation={[0, i, 0]} scale={[0.45, 0.35 + (i % 3) * 0.11, 0.45]}><icosahedronGeometry args={[1, 0]} /><meshStandardMaterial color={["#879c73", "#adc096", "#6e8766"][i % 3]} flatShading roughness={0.9} /></mesh>)}
      {wall.map((p, i) => <group key={i} position={p} rotation={[0, Math.cos(i / 22 * Math.PI * 2) * -0.9, 0]}>
        <mesh position={[0, 0.12, 0]}><boxGeometry args={[0.14, 0.28, 0.15]} /><meshStandardMaterial color="#cdbd9a" roughness={0.9} /></mesh>
        <mesh position={[0, 0.29, 0.065]}><boxGeometry args={[0.07, 0.08, 0.045]} /><meshStandardMaterial color="#ede0bf" /></mesh>
        <mesh position={[0, 0.29, -0.065]}><boxGeometry args={[0.07, 0.08, 0.045]} /><meshStandardMaterial color="#ede0bf" /></mesh>
      </group>)}
      <Tower position={wall[5]} scale={tower ? 1.65 : 0.8} />
      <Tower position={wall[17]} scale={0.6} />
    </group>
  );
}


export function WorldInterior({ world }: { world: number }) {
  return world === 2 ? <DNA /> : <Landscape tower={world === 1} />;
}

export const marbleTints = ["#d6ebd2", "#f4dcaf", "#ead0e7"];

export function GlassShell({ world = 0, half }: { world?: number; half?: "top" | "bottom" }) {
  return <mesh renderOrder={5}>
    <sphereGeometry args={[1.5, 48, 32, 0, Math.PI * 2, half === "bottom" ? Math.PI / 2 : 0, half ? Math.PI / 2 : Math.PI]} />
    <meshPhysicalMaterial color={marbleTints[world]} metalness={0} roughness={0.075} transmission={0.92} thickness={0.32} ior={1.22} clearcoat={1} clearcoatRoughness={0.04} envMapIntensity={1.8} attenuationColor={marbleTints[world]} attenuationDistance={4} />
  </mesh>;
}

export function MarbleBody({ world = 0, empty = false, wireframe = false }: { world?: number; empty?: boolean; wireframe?: boolean }) {
  return <>
    {!empty && <group scale={0.96}><WorldInterior world={world} /></group>}
    <GlassShell world={world} />
    <mesh rotation={[0.15, 0.25, -0.2]}>
      <torusGeometry args={[1.502, 0.007, 6, 96]} />
      <meshBasicMaterial color="#fff9e7" transparent opacity={0.45} depthWrite={false} />
    </mesh>
    <mesh position={[-0.57, 0.83, 1.1]} rotation={[0.3, -0.25, -0.5]} scale={[0.065, 0.32, 0.018]} renderOrder={6}>
      <sphereGeometry args={[1, 16, 12]} /><meshBasicMaterial color="#fffdf4" transparent opacity={0.85} depthWrite={false} />
    </mesh>
    <mesh position={[0.65, -0.7, 1.14]} rotation={[0.2, 0.3, -0.7]} scale={[0.025, 0.19, 0.012]} renderOrder={6}>
      <sphereGeometry args={[1, 12, 10]} /><meshBasicMaterial color="#e5f4ff" transparent opacity={0.6} depthWrite={false} />
    </mesh>
    {wireframe && <mesh scale={0.98}><icosahedronGeometry args={[1.5, 2]} /><meshBasicMaterial color="#e6dfb6" wireframe transparent opacity={0.18} /></mesh>}
  </>;
}
