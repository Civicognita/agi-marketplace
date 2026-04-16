# React (Vite)

React single-page application built with Vite. In development, Vite serves with hot module replacement. In production, the compiled `dist/` output is served by nginx (Alpine).

## What It Provides

- React + Vite development toolchain
- Fast HMR in development via Vite dev server
- Production serving via nginx:alpine from the `dist/` directory
- Standard npm build lifecycle

## Getting Started

```bash
npm install
npm run dev        # Vite dev server (default :5173)
npm run build      # Production build → dist/
npm run preview    # Preview the production build locally
```

## Key Directories

- `src/` — Application source code
- `src/main.tsx` — Entry point
- `src/App.tsx` — Root component
- `public/` — Static assets copied as-is to `dist/`
- `dist/` — Production build output (served by nginx)
- `vite.config.ts` — Vite configuration

## Production Notes

The production container mounts `dist/` as a read-only volume into nginx. Run `npm run build` before deploying or use the Aionima hosting build step. If your output directory is not `dist/`, adjust the volume mount path in the container config.

## Available Tools

npm install, npm run dev, npm run build, npm run preview.
