import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
    api.registerStack({
      id: "stack-laravel",
      label: "Laravel",
      description: "Laravel PHP framework — routing, Eloquent ORM, Blade templates",
      category: "framework",
      projectCategories: ["web"],
      compatibleLanguages: ["php"],
      requirements: [
        { id: "php-runtime", label: "PHP Runtime", type: "expected" },
        { id: "laravel", label: "Laravel Framework", type: "provided" },
      ],
      containerConfig: {
        image: "php:8.3-apache",
        internalPort: 80,
        shared: false,
        docRoot: "public",
        volumeMounts: (ctx) => [
          `${ctx.projectPath}:/var/www/html:Z`,
        ],
        env: () => ({}),
        command: (ctx) => {
          // Fix storage permissions — mounted files are owned by the host user's GID.
          // Add www-data to that group so Apache can write to storage/ and bootstrap/cache/.
          // Then ensure group-write bits are set on the directories Laravel needs.
          const fixPerms = [
            "HOST_GID=$(stat -c %g /var/www/html)",
            "groupadd -g $HOST_GID hostgroup 2>/dev/null || true",
            "usermod -aG $HOST_GID www-data 2>/dev/null || usermod -aG hostgroup www-data 2>/dev/null || true",
            "chmod -R g+w /var/www/html/storage /var/www/html/bootstrap/cache 2>/dev/null || true",
          ].join(" && ");
          if (ctx.mode === "development") {
            return ["bash", "-c", `${fixPerms} && php artisan serve --host=0.0.0.0 --port=80`];
          }
          return [
            "bash", "-c",
            `${fixPerms} && sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf /etc/apache2/apache2.conf && a2enmod rewrite && docker-php-entrypoint apache2-foreground`,
          ];
        },
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
        { title: "Log Files", content: "**Laravel logs:** `storage/logs/laravel.log`\n\n**Apache logs:** Available in the container at `/var/log/apache2/error.log` and `/var/log/apache2/access.log`. View them with the Terminal tool or `podman logs`." },
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
});
