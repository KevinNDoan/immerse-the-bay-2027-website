# ZAP! pitch site

The pitch site for ZAP!, a Meta Quest 3 study tool built at Immerse the Bay 2027 for the Visko Living Worlds track. It reads like a pitch deck that scrolls, one screen per section. A one-page overview for judges sits alongside it: they scan a QR code, read it like a shared doc, and it keeps working offline.

The product itself lives in `~/immerse-the-bay-2027`. Its `docs/design-system.md` sets the look (updated 2026-11-15): the designer's silver sky behind frosted white glass panels, Ink text, lightning yellow `#FFD60A` as the one accent, and Bricolage Grotesque for all text. The 3D pieces (demo, Try it, portal) stay dark Void "screens", because their white star art needs a dark backdrop. Everything in `public/art/` is the designer's export from that project: `zap-wordmark.png` and `zap-icon.png` are the final logo, `sky.webp` is the sky panorama (lightened to screen silver `#DADEE3` and overlaid with the app icon's scanlines in `globals.css`, so the yellow logo sits cleanly on it), and the star, note and line images feed the 3D. The PDF uses the Bricolage Grotesque files in `assets/fonts/` (SIL OFL, licence alongside).

## Getting started

Requires Node.js 22 or newer.

```sh
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL once deployed
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Commands

```sh
npm run dev         # Start the development server
npm run build       # Create a production build (also builds the pamphlet PDF)
npm start           # Serve the production build
npm run lint        # Check ESLint rules
npm run typecheck   # Generate route types and check TypeScript
npm run check:copy  # Fail on em dashes, dot separators, emoji or all-caps labels in src/
```

## Pages

- `/` is the pitch, laid out like Harvey's platform page (harvey.ai/platform). The light half: hero, demo, why it has to be a headset, ZAP! in numbers, and the playable constellation. The dark half: one row per move (say it, throw it, zap it, step inside, with the portal), what it's built on, questions judges ask, and a close with the QR code. The nav turns dark over the dark half.
- `/pamphlet` is the judges' overview, styled like a shared doc. Once opened it is saved for offline reading by `public/sw.js` (production builds only), and it prints on one Letter page.
- `/zap-pamphlet.pdf` is the same overview as a one-page PDF, rendered once at build time.

## Pitching

Every top-level section fills at least one screen. Arrow keys, Space, Page Up and Page Down (what most presentation clickers send) move one section at a time, and a wheel or trackpad scroll that stops near a section settles onto it. Sections taller than the screen are paged through before moving on. The code is in `src/components/sections/SmoothScroll.tsx`.

## Environment

- `NEXT_PUBLIC_SITE_URL`: the public address of the site, with no trailing slash. Every QR code points to `<this>/pamphlet`, and the PDF bakes it in at build time, so it must be set when you build (on Vercel, as a project environment variable). Without it the codes point to `http://localhost:3000` and the build prints a warning.

## Project structure

- `src/content/pitch.ts`: every word of the pitch. The site, the pamphlet page and the PDF all read from it.
- `src/components/sections/`: one file per section of the landing page.
- `src/components/scene/`: the React Three Fiber constellation scenes and the Try it demo.
- `src/components/ui/`: shadcn components.
- `src/lib/`: `site.ts` for the site URL, `qr.ts` for server-side QR codes, `motion.ts` for motion constants.
- `src/app/pamphlet/`, `src/app/zap-pamphlet.pdf/`: the pamphlet page and PDF route.
- `scripts/check-copy.mjs`: the copy rules check.

## Libraries

Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui (Radix), Motion, Three.js with React Three Fiber and drei, Lenis, qrcode, and @react-pdf/renderer.
