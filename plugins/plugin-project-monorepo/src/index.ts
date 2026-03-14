import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "monorepo",
      label: "Monorepo",
      category: "monorepo",
      hostable: false,
      defaultMeta: {
        type: "monorepo",
        mode: "development",
        internalPort: null,
      },
      tools: [],
    });
  },
};

export default plugin;
