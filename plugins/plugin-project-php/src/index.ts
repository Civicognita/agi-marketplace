import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "php",
      label: "PHP",
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
          if (docRoot === ".") return null;
          return [
            "bash", "-c",
            `sed -i 's|/var/www/html|/var/www/html/${docRoot}|g' /etc/apache2/sites-available/000-default.conf /etc/apache2/apache2.conf && a2enmod rewrite && docker-php-entrypoint apache2-foreground`,
          ];
        },
      },
      defaultMeta: {
        type: "php",
        docRoot: "public",
        startCommand: null,
        mode: "production",
        internalPort: null,
      },
      logSources: [
        { id: "container", label: "Container Output", type: "container" },
      ],
      tools: [
        { id: "composer-install", label: "composer install", description: "Install PHP dependencies", action: "shell", command: "composer install" },
      ],
    });

    api.registerSettingsPage({
      id: "project-php",
      label: "PHP Projects",
      description: "PHP project type with Apache container hosting.",
      icon: "box",
      position: 93,
      sections: [],
    });
  },
};

export default plugin;
