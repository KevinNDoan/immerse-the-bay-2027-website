# ZAP! pitch site

The pitch site for ZAP!, a Meta Quest 3 study tool built at Immerse the Bay 2027 for the Visko Living Worlds track. It reads like a pitch deck that scrolls. A pamphlet for judges sits alongside it: they scan a QR code and keep it as a PDF.

The product itself lives in `~/immerse-the-bay-2027`. Its `docs/design-system.md` sets the look: white on Void `#07050D`, Inter, playful and electric. The star, note and line images in `public/art/` are the designer's exports from that project.

## Getting started

Requires Node.js 20.9 or newer.

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

- `/` is the pitch: hero demo, the problem, how it works, a playable constellation, worlds, why a headset, what it's built on, questions judges ask, and a close with the QR code.
- `/pamphlet` is the judges' leave-behind. It is phone-first and prints to two Letter pages.
- `/zap-pamphlet.pdf` is the same pamphlet as a PDF, rendered once at build time.

## Environment

- `NEXT_PUBLIC_SITE_URL`: the public address of the site, with no trailing slash. Every QR code points to `<this>/pamphlet`. It defaults to `http://localhost:3000`, so set it before printing anything.

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
