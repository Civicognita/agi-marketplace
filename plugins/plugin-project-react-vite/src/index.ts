import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "react-vite",
      label: "React (Vite)",
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
        type: "react-vite",
        docRoot: "dist",
        startCommand: null,
        mode: "production",
        internalPort: null,
      },
      logSources: [
        { id: "container", label: "Access Log", type: "container" },
      ],
      tools: [
        { id: "npm-install", label: "npm install", description: "Install dependencies", action: "shell", command: "npm install" },
        { id: "npm-dev", label: "npm run dev", description: "Start Vite dev server", action: "shell", command: "npm run dev" },
        { id: "npm-build", label: "npm run build", description: "Build for production", action: "shell", command: "npm run build" },
      ],
    });

    api.registerSettingsPage({
      id: "project-react-vite",
      label: "React (Vite) Projects",
      description: "React (Vite) project type with nginx container hosting.",
      icon: "box",
      position: 95,
      sections: [],
    });
  },
};

export default plugin;
