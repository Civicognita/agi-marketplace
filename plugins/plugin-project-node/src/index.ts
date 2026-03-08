import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "node",
      label: "Node.js",
      category: "app",
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
          if (!meta.startCommand) return null;
          return meta.startCommand.split(/\s+/);
        },
      },
      defaultMeta: {
        type: "node",
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
        { id: "npm-test", label: "npm test", description: "Run tests", action: "shell", command: "npm test" },
      ],
    });

    api.registerSettingsPage({
      id: "project-node",
      label: "Node.js Projects",
      description: "Node.js project type with container hosting support.",
      icon: "box",
      position: 90,
      sections: [],
    });
  },
};

export default plugin;
