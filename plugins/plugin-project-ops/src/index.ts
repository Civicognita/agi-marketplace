import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "ops",
      label: "Ops",
      category: "ops",
      hostable: false,
      defaultMeta: {
        type: "ops",
        mode: "production",
        internalPort: null,
      },
      tools: [],
    });
  },
};

export default plugin;
