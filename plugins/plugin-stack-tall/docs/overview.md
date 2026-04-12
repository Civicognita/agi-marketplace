# TALL Stack

TALL is the standard Aionima pattern for PHP web applications. It combines Tailwind CSS for styling, Alpine.js for lightweight browser interactivity, Laravel as the PHP framework, and Livewire for reactive server-driven components.

## What It Provides

- Everything from the Laravel stack
- Livewire for reactive components without writing a separate API
- Alpine.js for simple client-side behaviour inside Blade templates
- Vite for asset bundling and hot module replacement
- Flux Pro UI components available via `<flux:*>` Blade tags

## Dependencies

This stack expects both **Laravel** and **Tailwind CSS** stacks to be present on the project.

## Initial Setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve     # Backend on :8000
npm run dev           # Vite HMR on :5173
```

## Key Directories

- `app/Livewire/` — Livewire component PHP classes
- `resources/views/livewire/` — Livewire Blade templates
- `resources/css/app.css` — Tailwind entry point
- `routes/web.php` — Web routes
- `database/migrations/` — Database schema migrations

## Working with Livewire

Scaffold a new component with:

```bash
php artisan make:livewire ComponentName
```

This creates both the PHP class and the Blade view. Tailwind classes go directly in the template — no separate CSS per component. Tests use PestPHP: `php artisan test`.

## Available Tools

Migrate, Seed, Test, Optimize, Clear Cache, Full Reset, make:livewire, artisan serve, npm run dev.
