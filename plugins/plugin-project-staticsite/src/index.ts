import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "static-site",
      label: "Static Site",
      category: "web",
      hostable: true,
      defaultMeta: {
        type: "static-site",
        docRoot: "dist",
        mode: "production",
        internalPort: null,
      },
      tools: [],
    });
  },
};

export default plugin;
