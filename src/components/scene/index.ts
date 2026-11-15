// Public entry for the 3D scenes. Each export is a client component that lazy-loads its canvas
// (next/dynamic, ssr: false) and shows a static fallback of the same size while loading or without WebGL,
// so these can be imported straight into server or client components.

export { HeroConstellation, type HeroConstellationProps } from "./HeroConstellation";
export { StepsScene, type StepsSceneProps } from "./StepsScene";
export { TryItDemo, type TryItDemoProps } from "./TryItDemo";
export { PortalScene, type PortalSceneProps } from "./PortalScene";
export { DemoReel, type DemoReelProps } from "./DemoReel";
