import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
    api.registerStack({
      id: "stack-php-app",
      label: "PHP App",
      description: "Generic PHP application hosting with Apache",
      category: "framework",
      projectCategories: ["web"],
      compatibleLanguages: ["php"],
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
        command: (ctx) => {
          if (ctx.mode === "development") {
            return ["php", "-S", "0.0.0.0:80", "-t", "/var/www/html"];
          }
          return [
            "bash", "-c",
            "a2enmod rewrite && docker-php-entrypoint apache2-foreground",
          ];
        },
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
});
