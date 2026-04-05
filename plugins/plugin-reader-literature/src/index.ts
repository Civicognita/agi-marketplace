import { createPlugin } from "@aionima/sdk";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = resolve(__dirname, "../assets/reader");

export default createPlugin({
  async activate(api) {
    api.registerStack({
      id: "stack-literature-reader",
      label: "Literature Reader",
      description: "E-reader style viewer for markdown/text projects — book layout with dark mode",
      category: "workflow",
      projectCategories: ["literature"],
      requirements: [],
      containerConfig: {
        image: "nginx:alpine",
        internalPort: 80,
        shared: false,
        volumeMounts: (ctx) => [
          `${ctx.projectPath}:/usr/share/nginx/html/content:ro,Z`,
          `${assetsDir}:/usr/share/nginx/html:ro,Z`,
        ],
        env: () => ({}),
      },
      installActions: [],
      devCommands: {},
      guides: [
        {
          title: "Literature Reader",
          content:
            "Place `.md`, `.txt`, or `.rst` files in your project directory.\n" +
            "The reader serves them in a book-style layout at your project's `*.ai.on` URL.\n\n" +
            "Organize chapters with directories or numbered filenames.",
        },
      ],
      tools: [],
      icon: "book-open",
    });
  },
});
