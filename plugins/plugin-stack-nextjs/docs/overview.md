# Next.js

React framework with server-side rendering, file-based routing via the App Router, and Tailwind CSS. Used for marketing sites, dashboards, and full-stack web applications. Runs in `ghcr.io/civicognita/node:22`.

## What It Provides

- Next.js + React + Tailwind CSS in a single stack
- SSR and SSG support with App Router (Next.js 13+ convention)
- API routes via `app/api/` file-based handlers
- Container hosting: development with `npm run dev`, production with `npm run build && npm start`

## Getting Started

```bash
npm install
npm run dev       # Dev server on :3000
npm run build     # Production build
npm start         # Start production server
```

## Key Directories

- `app/` — App Router pages and layouts
- `app/layout.tsx` — Root layout (HTML shell, global providers)
- `app/page.tsx` — Home page (`/`)
- `app/api/` — API route handlers (`route.ts` files)
- `components/` — Shared React components
- `public/` — Static assets
- `next.config.ts` — Next.js configuration

## Agent Notes

- Pages map to filesystem: `app/about/page.tsx` becomes `/about`
- Server Components are the default; add `'use client'` for browser interactivity
- Client-accessible env vars must be prefixed `NEXT_PUBLIC_`
- Use `next/image` instead of raw `<img>` tags for automatic optimization
- TypeScript strict mode is standard

## Available Tools

npm install, npm run dev, npm run build, npm start.
