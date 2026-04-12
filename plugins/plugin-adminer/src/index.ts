/**
 * Adminer Plugin — database management tool for the DB portal.
 *
 * Registers an Adminer container service, a settings page for managing it,
 * and registers Adminer as a tool in the system DB portal.
 */

import { createPlugin } from "@aionima/sdk";

const ADMINER_PORT = 5050;

export default createPlugin({
  async activate(api) {
  const log = api.getLogger();

  // Register Adminer as a container service
  api.registerService({
    id: "adminer",
    name: "Adminer",
    description: "Lightweight database management UI",
    containerImage: "adminer:latest",
    defaultPort: ADMINER_PORT,
    env: {
      ADMINER_DEFAULT_SERVER: "host.containers.internal",
      ADMINER_DESIGN: "dracula",
    },
    volumes: [],
    healthCheck: "wget -q --spider http://localhost:8080 || exit 1",
  });

  // Reverse proxy to Adminer container — all HTTP methods (GET, POST for login/queries)
  for (const method of ["GET", "POST"] as const) {
    api.registerHttpRoute(method, "/adminer/*", async (req, reply) => {
      const path = req.params["*"] || "";
      try {
        const upstream = `http://localhost:${ADMINER_PORT}/${path}`;
        const headers: Record<string, string> = {
          "content-type": req.headers?.["content-type"] as string ?? "text/html",
        };
        if (req.headers?.["cookie"]) {
          headers["cookie"] = Array.isArray(req.headers["cookie"])
            ? req.headers["cookie"].join("; ")
            : req.headers["cookie"];
        }
        const init: RequestInit = { method, headers };
        if (method === "POST" && req.body) {
          // Forward the raw body for form submissions
          init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
        }
        const res = await fetch(upstream, init);
        // Forward response headers (especially Set-Cookie for Adminer sessions)
        const setCookie = res.headers.get("set-cookie");
        if (setCookie) reply.header("set-cookie", setCookie);
        const ct = res.headers.get("content-type") ?? "text/html";
        reply.header("content-type", ct);
        const body = await res.text();
        reply.code(res.status).send(body);
      } catch {
        reply.code(502).send({ error: "Adminer service not reachable. Start it from the Services page." });
      }
    }, { raw: true });
  }

  // Register Adminer as a tool in the system DB portal
  api.registerHttpRoute("POST", "/adminer-register", async (_req, reply) => {
    reply.send({ ok: true });
  });

  // Register tool in DB portal on startup
  api.registerHook("gateway:startup", async () => {
    try {
      await fetch("http://localhost:3100/api/db-portal/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: "adminer",
          name: "Adminer",
          description: "Browse and manage databases — PostgreSQL, MySQL, SQLite",
          url: "/adminer/",
          icon: "🗃️",
        }),
      });
      log.info("Adminer registered in DB portal");
    } catch {
      log.warn("Failed to register Adminer in DB portal (will retry on next request)");
    }
  });

  // Settings page
  api.registerSettingsPage({
    id: "adminer",
    label: "Adminer",
    description: "Database management tool settings.",
    icon: "database",
    position: 72,
    sections: [
      {
        id: "adminer-service",
        label: "Adminer Service",
        type: "service-control",
        serviceIds: ["adminer"],
        configPath: "plugins.adminer",
        fields: [],
      },
    ],
  });

  log.info("Adminer plugin activated");
  },
});
