# Tailwind CSS

Utility-first CSS framework with JIT compilation and responsive design utilities. Works with any frontend framework via Vite or PostCSS. This stack provides Tailwind tooling and is commonly added as a dependency of other stacks (Laravel, TALL, Next.js).

## What It Provides

- Tailwind CSS package and CLI
- Vite plugin for zero-config integration
- PostCSS plugin for non-Vite projects
- Build tool: `npx @tailwindcss/cli -o dist/styles.css --minify`

## Setup with Vite (recommended)

```bash
npm install -D tailwindcss @tailwindcss/vite
```

Add to `vite.config.ts`:

```typescript
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [tailwindcss()],
});
```

Import in your CSS entry point:

```css
@import 'tailwindcss';
```

## Setup with PostCSS

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
```

Add to `postcss.config.js`:

```javascript
export default { plugins: { '@tailwindcss/postcss': {} } };
```

## Available Tools

- **Build CSS** — Compiles Tailwind to a minified output file at `dist/styles.css`.
