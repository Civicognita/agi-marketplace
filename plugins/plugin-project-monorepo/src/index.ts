import { createPlugin } from "@aionima/sdk";

export default createPlugin({
  async activate(api) {
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
});
