import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
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
});
