# Immerse the Bay 2027

A basic website built with Next.js, React, TypeScript, and Tailwind CSS. Uses the
App Router and npm.

## Getting started

Requires Node.js 20.9 or newer.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Changes to `src/app/page.tsx` appear
automatically while the development server is running.

## Commands

```sh
npm run dev        # Start the development server
npm run build      # Create a production build
npm start          # Serve the production build
npm run lint       # Check ESLint rules
npm run typecheck  # Generate route types and check TypeScript
```

## Project structure

- `src/app/page.tsx` — home page
- `src/app/layout.tsx` — shared layout and page metadata
- `src/app/globals.css` — Tailwind CSS and global styles
- `src/app/icon.svg` — site icon
- `next.config.ts` — Next.js configuration

The starter has no environment variables or external services to configure.
See the [Next.js documentation](https://nextjs.org/docs) for routing and other
framework features.
