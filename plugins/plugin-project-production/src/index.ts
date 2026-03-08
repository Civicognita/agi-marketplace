import type { AionimaPlugin, AionimaPluginAPI } from "@aionima/plugins";

const plugin: AionimaPlugin = {
  async activate(api: AionimaPluginAPI) {
    api.registerProjectType({
      id: "production",
      label: "General Production",
      category: "administration",
      hostable: false,
      defaultMeta: {
        type: "production",
        mode: "production",
        internalPort: null,
      },
      tools: [
        { id: "status-board", label: "Status Board", description: "View project status dashboard", action: "ui" },
        { id: "timeline", label: "Timeline", description: "View project timeline", action: "ui" },
      ],
    });

    api.registerSettingsPage({
      id: "project-production",
      label: "Administrative Projects",
      description: "General production/administration project type for task management and operations.",
      icon: "briefcase",
      position: 98,
      sections: [],
    });
  },
};

export default plugin;
