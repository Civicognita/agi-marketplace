/**
 * Adminer Plugin — database management tool for the DB portal.
 *
 * Registers an Adminer container service, a settings page for managing it,
 * and registers Adminer as a tool in the system DB portal.
 */

import type { AionimaPluginAPI } from "@aionima/plugins";

const ADMINER_PORT = 5050;

export async function activate(api: AionimaPluginAPI): Promise<void> {
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

  // Reverse proxy to Adminer container
  api.registerHttpRoute("GET", "/adminer/*", async (req, reply) => {
    const path = req.params["*"] || "";
    try {
      const upstream = `http://localhost:${ADMINER_PORT}/${path}`;
      const headers: Record<string, string> = {};
      if (req.headers?.["cookie"]) {
        headers["cookie"] = Array.isArray(req.headers["cookie"])
          ? req.headers["cookie"].join("; ")
          : req.headers["cookie"];
      }
      const res = await fetch(upstream, { headers });
      const body = await res.text();
      reply.code(res.status).send(body);
    } catch {
      reply.code(502).send({ error: "Adminer service not reachable" });
    }
  });

  // Register Adminer as a tool in the system DB portal
  api.registerHttpRoute("POST", "/api/internal/adminer-register", async (_req, reply) => {
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
}
