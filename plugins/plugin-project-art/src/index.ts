import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "art",
      label: "Art Project",
      category: "media",
      hostable: false,
      defaultMeta: {
        type: "art",
        mode: "production",
        internalPort: null,
      },
      tools: [
        { id: "asset-gallery", label: "Asset Gallery", description: "Browse project assets", action: "ui" },
        { id: "export", label: "Export", description: "Export assets for production", action: "ui" },
      ],
    });

    api.registerSettingsPage({
      id: "project-art",
      label: "Media Projects",
      description: "Art/media project type for creative assets and multimedia content.",
      icon: "palette",
      position: 99,
      sections: [],
    });
  },
};

export default plugin;
