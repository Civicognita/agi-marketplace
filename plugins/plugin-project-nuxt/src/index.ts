import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "nuxt",
      label: "Nuxt",
      category: "web",
      hostable: true,
      containerConfig: {
        image: "node:22-alpine",
        internalPort: 3000,
        volumeMounts: (projectPath) => [
          `${projectPath}:/app:Z`,
        ],
        env: (meta) => ({
          PORT: String(meta.internalPort ?? 3000),
          NODE_ENV: meta.mode,
        }),
        command: (meta) => {
          if (!meta.startCommand) return ["npm", "start"];
          return meta.startCommand.split(/\s+/);
        },
      },
      defaultMeta: {
        type: "nuxt",
        docRoot: ".",
        startCommand: "npm start",
        mode: "production",
        internalPort: null,
      },
      logSources: [
        { id: "container", label: "Container Output", type: "container" },
      ],
      tools: [
        { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
        { id: "npm-dev", label: "npm run dev", description: "Start dev server", action: "shell", command: "npm run dev" },
        { id: "npm-build", label: "npm run build", description: "Build for production", action: "shell", command: "npm run build" },
        { id: "npm-start", label: "npm start", description: "Start production server", action: "shell", command: "npm start" },
      ],
    });

    api.registerSettingsPage({
      id: "project-nuxt",
      label: "Nuxt Projects",
      description: "Nuxt project type with Node container hosting.",
      icon: "box",
      position: 92,
      sections: [],
    });
  },
};

export default plugin;
