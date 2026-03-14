import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerStack({
      id: "stack-php-app",
      label: "PHP App",
      description: "Generic PHP application hosting with Apache",
      category: "framework",
      projectCategories: ["web"],
      requirements: [
        { id: "php-runtime", label: "PHP Runtime", type: "expected" },
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
          "a2enmod rewrite && docker-php-entrypoint apache2-foreground",
        ],
      },
      installActions: [
        { id: "composer.install", label: "Install Dependencies", command: "composer install" },
      ],
      devCommands: {},
      guides: [
        { title: "Getting Started", content: "Place PHP files in the project root. Apache serves from the configured document root." },
      ],
      tools: [
        { id: "composer-install", label: "composer install", description: "Install PHP dependencies", action: "shell", command: "composer install" },
      ],
      icon: "box",
    });
  },
};

export default plugin;
