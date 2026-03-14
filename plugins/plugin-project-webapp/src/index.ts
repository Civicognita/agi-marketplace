import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "web-app",
      label: "Web App",
      category: "web",
      hostable: true,
      defaultMeta: {
        type: "web-app",
        mode: "development",
        internalPort: null,
      },
      tools: [],
    });
  },
};

export default plugin;
