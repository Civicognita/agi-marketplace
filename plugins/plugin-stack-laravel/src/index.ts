import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerStack({
      id: "stack-laravel",
      label: "Laravel",
      description: "Laravel PHP framework — routing, Eloquent ORM, Blade templates",
      category: "framework",
      projectCategories: ["web"],
      requirements: [
        { id: "php-runtime", label: "PHP Runtime", type: "expected" },
        { id: "laravel", label: "Laravel Framework", type: "provided" },
      ],
      containerConfig: {
        image: "php:8.3-apache",
        internalPort: 80,
        shared: false,
        volumeMounts: (ctx) => [
          `${ctx.projectPath}:/var/www/html:Z`,
        ],
        env: () => ({}),
        command: () => [
          "bash", "-c",
          "sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf /etc/apache2/apache2.conf && a2enmod rewrite && docker-php-entrypoint apache2-foreground",
        ],
        healthCheck: "curl -sf http://localhost/ || exit 1",
      },
      installActions: [
        { id: "composer.require.laravel/laravel", label: "Install Laravel", command: "composer require laravel/laravel ." },
        { id: "composer.install", label: "Install Dependencies", command: "composer install" },
        { id: "npm.install", label: "Install Frontend Deps", command: "npm install", optional: true },
      ],
      devCommands: {
        dev: "php artisan serve",
        build: "npm run build",
        test: "php artisan test",
        lint: "vendor/bin/pint",
      },
      guides: [
        { title: "Getting Started", content: "Run `php artisan serve` to start the development server.\n\nDatabase: configure `.env` with your DB connection, then `php artisan migrate`." },
      ],
      tools: [
        { id: "composer-install", label: "composer install", description: "Install PHP dependencies", action: "shell", command: "composer install" },
        { id: "artisan-migrate", label: "artisan migrate", description: "Run database migrations", action: "shell", command: "php artisan migrate" },
        { id: "artisan-serve", label: "artisan serve", description: "Start development server", action: "shell", command: "php artisan serve" },
        { id: "npm-install", label: "npm install", description: "Install frontend dependencies", action: "shell", command: "npm install" },
        { id: "npm-dev", label: "npm run dev", description: "Start Vite dev server", action: "shell", command: "npm run dev" },
        { id: "artisan-cache-clear", label: "artisan cache:clear", description: "Clear application cache", action: "shell", command: "php artisan cache:clear" },
      ],
      icon: "box",
    });
  },
};

export default plugin;
