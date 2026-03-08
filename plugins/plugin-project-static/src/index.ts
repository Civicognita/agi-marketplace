import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "static",
      label: "Static Site",
      category: "web",
      hostable: true,
      containerConfig: {
        image: "nginx:alpine",
        internalPort: 80,
        volumeMounts: (projectPath, meta) => {
          const docRoot = meta.docRoot ?? "dist";
          return [`${projectPath}/${docRoot}:/usr/share/nginx/html:ro,Z`];
        },
        env: () => ({}),
      },
      defaultMeta: {
        type: "static",
        docRoot: "dist",
        startCommand: null,
        mode: "production",
        internalPort: null,
      },
      logSources: [
        { id: "container", label: "Access Log", type: "container" },
      ],
      tools: [
        { id: "build", label: "Build", description: "Build static site", action: "shell", command: "npm run build" },
        { id: "preview", label: "Preview", description: "Preview locally", action: "shell", command: "npx serve dist" },
      ],
    });

    api.registerSettingsPage({
      id: "project-static",
      label: "Static Site Projects",
      description: "Static site project type with nginx container hosting.",
      icon: "box",
      position: 96,
      sections: [],
    });
  },
};

export default plugin;
