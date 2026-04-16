# Static Site Project Type

## Overview

Project type for static websites — HTML, CSS, JavaScript, and assets with no server-side runtime. Marked as hostable and defaults to production mode. Aionima serves the built output directory via nginx.

## Details

| Property | Value |
|----------|-------|
| ID | `static-site` |
| Category | web |
| Hostable | Yes |
| Default mode | production |
| Default doc root | `dist` |

## Usage

1. Create a new project and select **Static Site** as the project type.
2. Build your site to the `dist` directory (or configure an alternate doc root in the hosting panel).
3. Open the **Hosting** panel and deploy — no runtime container required.

## Hosting

- Static files are served directly from the configured `docRoot` on `<hostname>.ai.on`.
- No Node.js, Python, or other runtime is needed at serve time.
- Ideal for sites built with React + Vite, plain HTML, or any static generator that outputs to `dist`.

## Notes

- Stack plugins that produce static output (React + Vite, Tailwind, etc.) use this project type as their base.
- The `docRoot` defaults to `dist` but can be overridden in the hosting panel (e.g. `public`, `out`, `build`).
