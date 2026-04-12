# Nuxt

Vue.js framework with server-side rendering, file-based routing, and auto-imports. Runs in `ghcr.io/civicognita/node:22`.

## What It Provides

- Nuxt 3 + Vue.js in a container
- SSR and SSG modes
- File-based routing via the `pages/` directory
- Auto-imports for composables, components, and utilities — no manual import statements needed
- Static site generation with `nuxi generate`

## Getting Started

```bash
npm install
npx nuxi dev       # Dev server on :3000
npx nuxi build     # Production build
npx nuxi preview   # Preview production build locally
```

## Key Directories

- `pages/` — File-based routes (`pages/about.vue` becomes `/about`)
- `components/` — Auto-imported Vue components
- `composables/` — Auto-imported Vue composables
- `layouts/` — Page layout wrappers
- `server/api/` — Nitro server API routes
- `nuxt.config.ts` — Nuxt configuration

## Agent Notes

- Components in `components/` are globally available — no import needed
- Composables in `composables/` follow the `useXxx` naming convention and are auto-imported
- Server routes go in `server/api/` and run on Nitro
- `useState()` is the Nuxt way to share reactive state between components and server

## Available Tools

npm install, nuxi dev, nuxi build, nuxi preview, nuxi generate.
