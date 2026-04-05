import { createPlugin } from "@aionima/sdk";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = resolve(__dirname, "../assets/gallery");

export default createPlugin({
  async activate(api) {
    api.registerStack({
      id: "stack-media-gallery",
      label: "Media Gallery",
      description: "Responsive gallery viewer for image and video projects",
      category: "workflow",
      projectCategories: ["media"],
      requirements: [],
      containerConfig: {
        image: "nginx:alpine",
        internalPort: 80,
        shared: false,
        volumeMounts: (ctx) => [
          `${ctx.projectPath}:/usr/share/nginx/html/media:ro,Z`,
          `${assetsDir}:/usr/share/nginx/html:ro,Z`,
        ],
        env: () => ({}),
      },
      installActions: [],
      devCommands: {},
      guides: [
        {
          title: "Media Gallery",
          content:
            "Place images (`.jpg`, `.png`, `.gif`, `.svg`, `.webp`) and videos (`.mp4`, `.webm`) in your project directory.\n" +
            "The gallery serves them in a responsive grid at your project's `*.ai.on` URL.\n\n" +
            "Subdirectories are shown as album sections.",
        },
      ],
      tools: [],
      icon: "image",
    });
  },
});
