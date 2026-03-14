import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
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
});
