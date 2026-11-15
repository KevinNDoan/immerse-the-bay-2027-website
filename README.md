# ZAP! pitch site

A live hackathon presentation for ZAP!, a spatial knowledge space for Meta Quest built at Immerse the Bay. The homepage uses floating Three.js worlds, a four-step interaction story, a destination selector, and a playable constellation. Its visual direction takes inspiration from Immersive Garden's Louis Vuitton Collectibles experience, using ZAP!'s own objects, identity, and project story.

## Getting started

Requires Node.js 22 or newer.

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Commands

```sh
npm run dev         # Development server
npm run build       # Production build, including the overview PDF
npm start           # Serve the production build
npm run lint        # ESLint
npm run typecheck   # Generate route types and check TypeScript
npm run check:copy  # Check the project's copy conventions
```

## Pages and interactions

- `/`: Eight presentation sections: opening, why VR, interaction, worlds, idea map, build, lessons, and next steps. Content follows the team's supplied Devpost description. Headset footage opens in a simple modal player when the presenter requests it.
- `/pamphlet`: The judges' overview. It supports print and offline reading after the first visit in production.
- `/zap-pamphlet.pdf`: The overview PDF, generated at build time.

The browser constellation is an interaction sketch for the current visit. Add up to eight ideas, drag them to arrange, or select two to connect. Keyboard users can Tab to an idea, use arrow keys to move it, and Enter or Space to select it. A selected idea can be removed, and Start over restores the examples.

Wheel and trackpad gestures ease between section stops, with one transition per gesture. Arrow keys, Page Up/Down, Space, Home, End, and section links use the same navigation. Desktop presentation sections fit one viewport, with exactly one stop at each section start and no intermediate or footer stops. Compact screens and zoomed layouts use native scrolling to keep longer content accessible. Touch uses native section snapping, and system reduced-motion preferences disable animated transitions. Dialogs, video controls, and the constellation keep their own interactions.

Run the scroll regression checks with `node --experimental-strip-types --test scripts/section-scroll.test.mjs`.

The optional headset demo and destination stills come from the actual product recording. The floating hero combines captured world imagery with decorative Three.js objects, and the browser constellation remains an interaction sketch. The copy distinguishes the project's three prepared environments from its future ambitions.

Animation can be paused in the hero and respects system reduced-motion preferences. Canvases stop rendering offscreen, cap pixel density, and fall back to CSS illustrations if WebGL fails. Existing local Bricolage Grotesque fonts eliminate font-service requests during builds.

## Project structure

- `src/components/experience/`: The active homepage, styles, presentation copy, procedural Three.js scenes, and constellation playground.
- `src/content/pitch.ts`: Shared copy for the overview, PDF, and retained legacy presentation components.
- `src/components/sections/SmoothScroll.tsx`: Active section navigation controller using Lenis.
- Other files in `src/components/sections/` and `src/components/scene/`: Earlier presentation components retained for reuse.
- `src/app/pamphlet/`, `src/app/zap-pamphlet.pdf/`: The overview page and PDF route.
- `src/lib/`: Site URL, QR helpers, and shared utilities.
- `public/art/`: Original ZAP! branding and artwork.
- `public/media/zap/`: Optimized headset tour, descriptive captions, and product stills.
- `docs/product-recording.md`: Observations, source timestamps, and media provenance.
- `scripts/prepare-product-media.py`: Optional ffmpeg export helper; takes the original recording path as an argument.
- `assets/fonts/`: Local Bricolage Grotesque fonts and their SIL OFL license.

## Product recording

The 91-second silent demo opens only on request, with native playback and fullscreen controls and optional descriptive captions. There is no chapter sidebar or video narration section. Closing the player stops playback. The optimized MP4 is about 7 MB; the 1.7 GB source stays outside the repository. To regenerate the media, run the optional Python helper with ffmpeg installed. See `docs/product-recording.md` for exact source ranges.

## Deployment configuration

Set `NEXT_PUBLIC_SITE_URL` to the deployment's public address before building. The PDF and QR codes bake this URL into their output. Without it, they use `http://localhost:3000` and the build prints a warning.

## Libraries

Next.js 16, React 19, Three.js, React Three Fiber, drei, Tailwind CSS v4, Lucide, and the existing PDF and QR tooling. No additional dependencies are required for the redesign.
