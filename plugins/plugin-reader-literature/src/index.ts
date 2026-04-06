import { createPlugin } from "@aionima/sdk";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const assetsDir = resolve(__dirname, "../assets/reader");

export default createPlugin({
  async activate(api) {
    // Stack: nginx container serving the e-reader SPA with project content
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

    // Dashboard panel: "Reader" tab for writing projects
    api.registerProjectPanel({
      id: "literature-reader",
      label: "Reader",
      projectTypes: ["writing"],
      widgets: [
        {
          type: "status-display" as const,
          statusEndpoint: "/status?path={projectPath}",
          title: "Reader Status",
        },
        {
          type: "iframe" as const,
          src: "/reader-frame?path={projectPath}",
          title: "Reader Preview",
          height: "600px",
        },
      ],
    });

    // HTTP route: status endpoint for the reader panel
    api.registerHttpRoute("get", "/status", async (req) => {
      const path = (req.query as Record<string, string>).path ?? "";
      const config = api.getProjectConfig(path);
      const hosting = config?.hosting as Record<string, unknown> | undefined;
      return {
        status: 200,
        body: {
          status: hosting ? "active" : "not configured",
          hostname: hosting?.hostname ?? "unknown",
          type: hosting?.type ?? "writing",
          url: hosting?.hostname ? `https://${String(hosting.hostname)}.ai.on` : null,
        },
      };
    });

    // HTTP route: redirect iframe to the reader's *.ai.on URL
    api.registerHttpRoute("get", "/reader-frame", async (req, reply) => {
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
