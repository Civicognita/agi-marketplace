import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
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
});
