/**
 * TALL Stack Plugin — Tailwind + Alpine/Livewire + Laravel + Livewire
 *
 * Registers the TALL framework stack definition for Laravel-based web apps.
 */

import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
    api.registerStack({
      id: "stack-tall",
      label: "TALL Stack",
      description:
        "Laravel full-stack with Livewire for reactive components, Tailwind CSS for styling, and Vite for asset bundling. The standard Aionima pattern for PHP web applications.",
      category: "framework",
      projectCategories: ["app", "web"],
      compatibleLanguages: ["php"],
      requirements: [
        { id: "laravel", label: "Laravel", type: "expected" },
        { id: "livewire", label: "Livewire", type: "provided" },
        { id: "alpine-js", label: "Alpine.js", type: "provided" },
        { id: "tailwind", label: "Tailwind CSS", type: "provided" },
        { id: "vite", label: "Vite", type: "provided" },
      ],
      installActions: [
        { id: "composer.require.livewire", label: "Install Livewire", command: "composer require livewire/livewire" },
        { id: "npm.install.tailwind", label: "Install Tailwind & Vite", command: "npm install -D tailwindcss @tailwindcss/vite" },
        { id: "npm.install.alpinejs", label: "Install Alpine.js", command: "npm install alpinejs" },
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
      logSources: [
        { id: "laravel-log", label: "Laravel Log", type: "container-file" as const, containerPath: "/var/www/html/storage/logs/laravel.log" },
      ],
      tools: [
        // Composer
        { id: "composer-install", label: "composer install", description: "Install PHP dependencies", action: "shell", command: "composer install" },
        { id: "composer-update", label: "composer update", description: "Update PHP dependencies", action: "shell", command: "composer update" },
        { id: "composer-dump", label: "composer dump-autoload", description: "Regenerate autoloader", action: "shell", command: "composer dump-autoload" },
        // Artisan — setup
        { id: "artisan-key-generate", label: "artisan key:generate", description: "Generate application key", action: "shell", command: "php artisan key:generate" },
        { id: "artisan-storage-link", label: "artisan storage:link", description: "Create storage symlink", action: "shell", command: "php artisan storage:link" },
        // Artisan — database
        { id: "artisan-migrate", label: "artisan migrate", description: "Run database migrations", action: "shell", command: "php artisan migrate" },
        { id: "artisan-migrate-status", label: "artisan migrate:status", description: "Show migration status", action: "shell", command: "php artisan migrate:status" },
        { id: "artisan-db-seed", label: "artisan db:seed", description: "Seed the database", action: "shell", command: "php artisan db:seed" },
        // Artisan — cache & optimization
        { id: "artisan-optimize", label: "artisan optimize", description: "Cache config, routes, views", action: "shell", command: "php artisan optimize" },
        { id: "artisan-optimize-clear", label: "artisan optimize:clear", description: "Clear all caches", action: "shell", command: "php artisan optimize:clear" },
        { id: "artisan-cache-clear", label: "artisan cache:clear", description: "Clear application cache", action: "shell", command: "php artisan cache:clear" },
        { id: "artisan-config-clear", label: "artisan config:clear", description: "Clear config cache", action: "shell", command: "php artisan config:clear" },
        // Artisan — info
        { id: "artisan-route-list", label: "artisan route:list", description: "List all routes", action: "shell", command: "php artisan route:list" },
        // Dev server + Vite
        { id: "artisan-serve", label: "artisan serve", description: "Start Laravel dev server", action: "shell", command: "php artisan serve" },
        { id: "npm-install", label: "npm install", description: "Install frontend dependencies", action: "shell", command: "npm install" },
        { id: "vite-dev", label: "npm run dev", description: "Start Vite HMR server", action: "shell", command: "npm run dev" },
        // Testing & REPL
        { id: "pest-test", label: "artisan test", description: "Run PestPHP tests", action: "shell", command: "php artisan test" },
        { id: "artisan-tinker", label: "artisan tinker", description: "Interactive REPL", action: "shell", command: "php artisan tinker" },
      ],
      icon: "layers",
    });
  },
});
