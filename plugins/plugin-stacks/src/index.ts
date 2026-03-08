/**
 * Framework Stacks Plugin — registers high-level technology stack definitions.
 *
 * Stacks are version-agnostic technology descriptors that tell the system how
 * to treat a codebase: start/restart commands, build steps, install procedures,
 * and agent guides. They differ from runtimes (version-specific: Node 24, PHP 8.3)
 * and databases (version-specific: PostgreSQL 17, MariaDB 11.4).
 *
 * Each stack declares requirements via "expected" (must come from a runtime or
 * database stack) and "provided" (what this stack brings).
 */

import type { AionimaPluginAPI } from "@aionima/plugins";

export async function activate(api: AionimaPluginAPI): Promise<void> {
  const log = api.getLogger();

  // ---------------------------------------------------------------------------
  // TALL — Tailwind + Alpine/Livewire + Laravel + Livewire
  // ---------------------------------------------------------------------------

  api.registerStack({
    id: "stack-tall",
    label: "TALL Stack",
    description:
      "Laravel full-stack with Livewire for reactive components, Tailwind CSS for styling, and Vite for asset bundling. The standard Aionima pattern for PHP web applications.",
    category: "framework",
    projectCategories: ["app", "web"],
    requirements: [
      { id: "php", label: "PHP Runtime", type: "expected" },
      { id: "composer", label: "Composer", type: "expected" },
      { id: "laravel", label: "Laravel", type: "provided" },
      { id: "livewire", label: "Livewire", type: "provided" },
      { id: "tailwind", label: "Tailwind CSS", type: "provided" },
      { id: "vite", label: "Vite", type: "provided" },
    ],
    guides: [
      {
        title: "Development",
        content: [
          "## Getting Started",
          "",
          "TALL projects need two processes running: the PHP backend and the Vite dev server.",
          "",
          "```bash",
          "composer install        # PHP dependencies",
          "npm install             # Frontend dependencies (Tailwind, Vite)",
          "cp .env.example .env    # Environment config (if first time)",
          "php artisan key:generate",
          "php artisan migrate     # Database schema",
          "php artisan serve       # Backend on :8000",
          "npm run dev             # Vite HMR on :5173",
          "```",
          "",
          "## Key Directories",
          "",
          "- `app/Livewire/` — Livewire components (PHP logic)",
          "- `resources/views/livewire/` — Livewire Blade templates",
          "- `resources/css/app.css` — Tailwind entry point",
          "- `routes/web.php` — Web routes",
          "- `database/migrations/` — Schema migrations",
        ].join("\n"),
      },
      {
        title: "Agent Guide",
        content: [
          "## Working with TALL Projects",
          "",
          "- Livewire components have two parts: a PHP class (`app/Livewire/`) and a Blade view (`resources/views/livewire/`)",
          "- Use `php artisan make:livewire ComponentName` to scaffold both files",
          "- Tailwind classes are used directly in Blade templates — no separate CSS files per component",
          "- Database changes require a migration: `php artisan make:migration create_table_name`",
          "- Run `php artisan migrate` after adding migrations",
          "- Flux Pro UI components are available via `<flux:*>` Blade tags",
          "- Tests use PestPHP: `php artisan test` or `./vendor/bin/pest`",
        ].join("\n"),
      },
    ],
    tools: [
      { id: "artisan-serve", label: "php artisan serve", description: "Start Laravel dev server", action: "shell", command: "php artisan serve" },
      { id: "artisan-migrate", label: "php artisan migrate", description: "Run database migrations", action: "shell", command: "php artisan migrate" },
      { id: "composer-install", label: "composer install", description: "Install PHP dependencies", action: "shell", command: "composer install" },
      { id: "npm-install", label: "npm install", description: "Install frontend dependencies", action: "shell", command: "npm install" },
      { id: "vite-dev", label: "npm run dev", description: "Start Vite HMR server", action: "shell", command: "npm run dev" },
      { id: "artisan-tinker", label: "php artisan tinker", description: "Interactive REPL", action: "shell", command: "php artisan tinker" },
      { id: "pest-test", label: "php artisan test", description: "Run PestPHP tests", action: "shell", command: "php artisan test" },
    ],
    icon: "layers",
  });

  // ---------------------------------------------------------------------------
  // Next.js — Next.js + React + Tailwind CSS
  // ---------------------------------------------------------------------------

  api.registerStack({
    id: "stack-nextjs",
    label: "Next.js",
    description:
      "React framework with server-side rendering, file-based routing, and Tailwind CSS. Used for marketing sites, dashboards, and full-stack web apps.",
    category: "framework",
    projectCategories: ["app", "web"],
    requirements: [
      { id: "node", label: "Node.js Runtime", type: "expected" },
      { id: "nextjs", label: "Next.js", type: "provided" },
      { id: "react", label: "React", type: "provided" },
      { id: "tailwind", label: "Tailwind CSS", type: "provided" },
    ],
    guides: [
      {
        title: "Development",
        content: [
          "## Getting Started",
          "",
          "```bash",
          "npm install       # Install dependencies",
          "npm run dev       # Start dev server on :3000",
          "npm run build     # Production build",
          "npm start         # Start production server",
          "```",
          "",
          "## Key Directories",
          "",
          "- `app/` — App Router pages and layouts (Next.js 13+ convention)",
          "- `app/layout.tsx` — Root layout (HTML shell, providers)",
          "- `app/page.tsx` — Home page",
          "- `components/` — Shared React components",
          "- `public/` — Static assets",
          "- `next.config.ts` — Next.js configuration",
        ].join("\n"),
      },
      {
        title: "Agent Guide",
        content: [
          "## Working with Next.js Projects",
          "",
          "- Pages live in `app/` using file-based routing — `app/about/page.tsx` maps to `/about`",
          "- Server Components are the default; add `'use client'` directive for client interactivity",
          "- API routes go in `app/api/` as `route.ts` files",
          "- Tailwind classes are used directly in JSX — no separate CSS per component",
          "- Environment variables: prefix with `NEXT_PUBLIC_` for client-side access",
          "- Image optimization: use `next/image` instead of raw `<img>` tags",
          "- TypeScript strict mode is standard across all Aionima Next.js projects",
        ].join("\n"),
      },
    ],
    tools: [
      { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
      { id: "next-dev", label: "npm run dev", description: "Start Next.js dev server", action: "shell", command: "npm run dev" },
      { id: "next-build", label: "npm run build", description: "Production build", action: "shell", command: "npm run build" },
      { id: "next-start", label: "npm start", description: "Start production server", action: "shell", command: "npm start" },
    ],
    icon: "globe",
  });

  // ---------------------------------------------------------------------------
  // Hono API — Hono + Drizzle ORM + Lucia Auth
  // ---------------------------------------------------------------------------

  api.registerStack({
    id: "stack-hono-api",
    label: "Hono API",
    description:
      "Lightweight Node.js API framework with Drizzle ORM for type-safe database access and Lucia for session-based authentication. Built for auth services and microservices.",
    category: "framework",
    projectCategories: ["app"],
    requirements: [
      { id: "node", label: "Node.js Runtime", type: "expected" },
      { id: "database", label: "Database", description: "PostgreSQL or SQLite", type: "expected" },
      { id: "hono", label: "Hono", type: "provided" },
      { id: "drizzle", label: "Drizzle ORM", type: "provided" },
      { id: "lucia", label: "Lucia Auth", type: "provided" },
    ],
    guides: [
      {
        title: "Development",
        content: [
          "## Getting Started",
          "",
          "```bash",
          "npm install                 # Install dependencies",
          "npx drizzle-kit push        # Push schema to database",
          "npm run dev                 # Start dev server",
          "```",
          "",
          "## Key Directories",
          "",
          "- `src/` — Application source code",
          "- `src/routes/` — Hono route handlers",
          "- `src/db/` — Drizzle schema and connection",
          "- `src/auth/` — Lucia auth configuration",
          "- `drizzle.config.ts` — Drizzle Kit configuration",
        ].join("\n"),
      },
      {
        title: "Agent Guide",
        content: [
          "## Working with Hono API Projects",
          "",
          "- Routes are defined with `app.get()`, `app.post()`, etc. — similar to Express but lighter",
          "- Drizzle schema lives alongside code — `src/db/schema.ts` defines tables",
          "- Schema changes: edit schema file, then `npx drizzle-kit push` (dev) or `npx drizzle-kit generate` + `npx drizzle-kit migrate` (production)",
          "- Lucia handles sessions: create session on login, validate on each request via middleware",
          "- Password hashing uses Argon2 — never store plaintext passwords",
          "- Database connection via `postgres` package (not pg) for PostgreSQL",
          "- TypeScript strict mode; Hono provides full type inference on routes",
        ].join("\n"),
      },
    ],
    tools: [
      { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
      { id: "hono-dev", label: "npm run dev", description: "Start Hono dev server", action: "shell", command: "npm run dev" },
      { id: "hono-build", label: "npm run build", description: "Build for production", action: "shell", command: "npm run build" },
      { id: "drizzle-push", label: "npx drizzle-kit push", description: "Push schema to database", action: "shell", command: "npx drizzle-kit push" },
      { id: "drizzle-generate", label: "npx drizzle-kit generate", description: "Generate SQL migrations", action: "shell", command: "npx drizzle-kit generate" },
    ],
    icon: "zap",
  });

  log.info("Framework stacks registered: TALL, Next.js, Hono API");
}
