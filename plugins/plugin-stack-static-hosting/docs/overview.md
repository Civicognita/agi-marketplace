# Static Hosting

nginx-based static file hosting for pre-built websites. Serves any `dist/` directory as a static site with no runtime dependencies.

## What It Provides

- nginx:alpine container serving static files
- Read-only mount of the project's `dist/` directory
- Suitable for any static output: HTML, CSS, JS, images

## When to Use This Stack

Use Static Hosting when your project produces static output that does not need a Node.js or other runtime process in production:

- Sites built by a static site generator (Astro, Eleventy, Hugo)
- Pre-rendered output from frameworks configured for full SSG
- Plain HTML/CSS/JS projects with no build step (put files in `dist/` directly)

For React + Vite projects, the **React (Vite)** stack already includes nginx production hosting and is the better choice.

## Getting Started

Build your site first, then Aionima serves from `dist/`:

```bash
npm run build    # Or whatever produces your output directory
```

The container mounts `dist/` as `/usr/share/nginx/html`. If your build outputs to a different directory, adjust the volume mount path in the project's hosting settings.

## Tools

- **Build** — Runs `npm run build` to produce the static output.
- **Preview** — Runs `npx serve dist` to preview locally before hosting.
