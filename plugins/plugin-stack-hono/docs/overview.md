# Hono API

Lightweight Node.js API framework with Drizzle ORM for type-safe database access and Lucia for session-based authentication. Built for auth services, internal APIs, and microservices.

## What It Provides

- Hono web framework (similar to Express, but lighter and fully typed)
- Drizzle ORM for schema-first database access
- Lucia for session management and auth
- TypeScript strict mode throughout

## Dependencies

Requires a **Node.js Runtime** and a **database** stack (PostgreSQL recommended, SQLite supported).

## Getting Started

```bash
npm install
npx drizzle-kit push     # Push schema to database (development)
npm run dev              # Start dev server
npm run build            # Production build
```

## Key Directories

- `src/` — Application source
- `src/routes/` — Hono route handlers
- `src/db/` — Drizzle schema and database connection (`src/db/schema.ts`)
- `src/auth/` — Lucia auth configuration
- `drizzle.config.ts` — Drizzle Kit configuration

## Agent Notes

- Routes: `app.get('/path', handler)` — Hono provides full TypeScript inference on request/response
- Schema changes in development: edit `src/db/schema.ts`, then `npx drizzle-kit push`
- Schema changes in production: `npx drizzle-kit generate` then `npx drizzle-kit migrate`
- Sessions: create on login, validate on each request via Lucia middleware
- Password hashing: Argon2 — never store plaintext passwords
- PostgreSQL client: `postgres` package (not `pg`)

## Available Tools

npm install, npm run dev, npm run build, npx drizzle-kit push, npx drizzle-kit generate.
