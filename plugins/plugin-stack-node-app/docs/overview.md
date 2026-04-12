# Node.js App

Generic Node.js application hosting. Suitable for any Node.js project that starts with `npm run dev` in development or `npm start` in production. Runs in `ghcr.io/civicognita/node:22`.

## What It Provides

- Node.js 22 container
- Development mode: `npm run dev`
- Production mode: `npm start`
- Standard npm lifecycle scripts wired to Aionima tools

## Getting Started

```bash
npm install
npm run dev     # Development server (typically on :3000)
npm start       # Production server
npm run build   # Build step (if the project has one)
npm test        # Run tests
```

The container exposes port 3000 by default. If your app uses a different port, set `PORT` in the project's environment variables.

## When to Use This Stack

Use Node.js App for projects that don't fit a more specific stack:

- Express.js or Fastify APIs without Drizzle/Lucia
- Custom CLI tools served as a web process
- Monorepo packages that host their own server
- Any project where `npm start` is the entry point

For opinionated frameworks, prefer the dedicated stack (Next.js, Nuxt, Hono).

## Available Tools

npm install, npm run dev, npm run build, npm test.
