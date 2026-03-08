import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "laravel",
      label: "Laravel",
      category: "web",
      hostable: true,
      containerConfig: {
        image: "php:8.3-apache",
        internalPort: 80,
        volumeMounts: (projectPath) => [
          `${projectPath}:/var/www/html:Z`,
        ],
        env: () => ({}),
        command: (meta) => {
          const docRoot = meta.docRoot ?? "public";
          return [
            "bash", "-c",
            `sed -i 's|/var/www/html|/var/www/html/${docRoot}|g' /etc/apache2/sites-available/000-default.conf /etc/apache2/apache2.conf && a2enmod rewrite && docker-php-entrypoint apache2-foreground`,
          ];
        },
      },
      defaultMeta: {
        type: "laravel",
        docRoot: "public",
        startCommand: null,
        mode: "production",
        internalPort: null,
      },
      logSources: [
        { id: "container", label: "Container Output", type: "container" },
        { id: "laravel-log", label: "Laravel Log", type: "container-file", containerPath: "/var/www/html/storage/logs/laravel.log" },
      ],
      tools: [
        { id: "composer-install", label: "composer install", description: "Install PHP dependencies", action: "shell", command: "composer install" },
        { id: "artisan-migrate", label: "artisan migrate", description: "Run database migrations", action: "shell", command: "php artisan migrate" },
        { id: "artisan-serve", label: "artisan serve", description: "Start development server", action: "shell", command: "php artisan serve" },
        { id: "npm-install", label: "npm install", description: "Install frontend dependencies", action: "shell", command: "npm install" },
        { id: "npm-dev", label: "npm run dev", description: "Start Vite dev server", action: "shell", command: "npm run dev" },
        { id: "artisan-cache-clear", label: "artisan cache:clear", description: "Clear application cache", action: "shell", command: "php artisan cache:clear" },
      ],
    });

    api.registerSettingsPage({
      id: "project-laravel",
      label: "Laravel Projects",
      description: "Laravel project type with Apache container hosting.",
      icon: "box",
      position: 94,
      sections: [],
    });
  },
};

export default plugin;
