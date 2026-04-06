import { createPlugin } from "@aionima/sdk";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = resolve(__dirname, "../assets/gallery");

export default createPlugin({
  async activate(api) {
    // Stack: nginx container serving the gallery SPA with project media
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

    // Dashboard panel: "Gallery" tab for art projects
    api.registerProjectPanel({
      id: "media-gallery",
      label: "Gallery",
      projectTypes: ["art"],
      widgets: [
        {
          type: "status-display" as const,
          statusEndpoint: "/status?path={projectPath}",
          title: "Gallery Status",
        },
        {
          type: "iframe" as const,
          src: "/gallery-frame?path={projectPath}",
          title: "Gallery Preview",
          height: "600px",
        },
      ],
    });

    // HTTP route: status endpoint for the gallery panel
    api.registerHttpRoute("get", "/status", async (req) => {
      const path = (req.query as Record<string, string>).path ?? "";
      const config = api.getProjectConfig(path);
      const hosting = config?.hosting as Record<string, unknown> | undefined;
      return {
        status: 200,
        body: {
          status: hosting ? "active" : "not configured",
          hostname: hosting?.hostname ?? "unknown",
          type: hosting?.type ?? "art",
          url: hosting?.hostname ? `https://${String(hosting.hostname)}.ai.on` : null,
        },
      };
    });

    // HTTP route: redirect iframe to the gallery's *.ai.on URL
    api.registerHttpRoute("get", "/gallery-frame", async (req, reply) => {
      const path = (req.query as Record<string, string>).path ?? "";
      const config = api.getProjectConfig(path);
      const hosting = config?.hosting as Record<string, unknown> | undefined;
      const hostname = hosting?.hostname as string | undefined;
      if (hostname) {
        return reply.redirect(`https://${hostname}.ai.on`);
      }
      return { status: 404, body: { error: "Project hosting not configured" } };
    });
  },
});
