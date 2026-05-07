import { createPlugin } from "@agi/sdk";

export default createPlugin({
  async activate(api) {
    api.registerProjectType({
      id: "monorepo",
      label: "Monorepo",
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
