import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "api-service",
      label: "API Service",
      category: "app",
      hostable: true,
      defaultMeta: {
        type: "api-service",
        mode: "development",
        internalPort: null,
      },
      tools: [],
    });
  },
};

export default plugin;
