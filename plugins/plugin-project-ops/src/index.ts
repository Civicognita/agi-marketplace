import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
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
});
