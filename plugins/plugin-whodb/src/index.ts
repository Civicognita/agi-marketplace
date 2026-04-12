/**
 * WhoDB Plugin — modern database explorer.
 *
 * Replaces Adminer with a Go+React database management UI supporting
 * PostgreSQL, MariaDB, SQLite, Redis, MongoDB with AI-powered SQL,
 * schema visualization, and spreadsheet editing.
 *
 * Accessible at https://db.ai.on via Caddy subdomain reverse proxy.
 */

import { createPlugin } from "@aionima/sdk";

const WHODB_PORT = 5050;

export default createPlugin({
  async activate(api) {
    const log = api.getLogger();

    // Build AI provider env vars from gateway config
    const aiEnv: Record<string, string> = {};
    if (process.env["ANTHROPIC_API_KEY"]) {
      aiEnv["WHODB_ANTHROPIC_API_KEY"] = process.env["ANTHROPIC_API_KEY"];
    }
    if (process.env["OPENAI_API_KEY"]) {
      aiEnv["WHODB_OPENAI_API_KEY"] = process.env["OPENAI_API_KEY"];
    }
    // Ollama — running on host, accessible from container via host.containers.internal
    aiEnv["WHODB_OLLAMA_HOST"] = "host.containers.internal";
    aiEnv["WHODB_OLLAMA_PORT"] = "11434";

    // Register WhoDB as a container service
    api.registerService({
      id: "whodb",
      name: "WhoDB",
      description: "Modern database explorer with AI-powered SQL, schema visualization, and spreadsheet editing",
      containerImage: "clidey/whodb:latest",
      defaultPort: 8080,
      env: {
        WHODB_PORT: "8080",
        ...aiEnv,
      },
      volumes: [
        "whodb-data:/data",
      ],
      healthCheck: "wget -q --spider http://localhost:8080 || exit 1",
    });

    // Register subdomain route: db.ai.on → WhoDB container
    // The ServiceManager allocates ports from 5000-5099. We use a fixed port
    // via service overrides so the Caddy config is stable across restarts.
    api.registerSubdomainRoute({
      subdomain: "db",
      description: "WhoDB Database Explorer",
      target: WHODB_PORT,
    });

    // Register to DB Portal on startup
    api.registerHook("gateway:startup", async () => {
      try {
        const config = api.getConfig();
        const baseDomain = ((config["hosting"] as Record<string, unknown> | undefined)?.["baseDomain"] as string) ?? "ai.on";
        await fetch("http://localhost:3100/api/db-portal/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: "whodb",
            name: "WhoDB",
            description: "Database explorer — PostgreSQL, MariaDB, SQLite, Redis, MongoDB",
            url: `https://db.${baseDomain}`,
            icon: "database",
          }),
        });
        log.info("WhoDB registered in DB portal");
      } catch {
        log.warn("Failed to register WhoDB in DB portal");
      }
    });

    // Agent tool: query databases through WhoDB
    api.registerAgentTool({
      name: "query_database",
      description: "Run a SQL query against a project database. Supports PostgreSQL, MariaDB, and SQLite. Returns query results as JSON.",
      inputSchema: {
        type: "object",
        properties: {
          sql: { type: "string", description: "The SQL query to execute" },
          database: { type: "string", description: "Database type: postgres, mariadb, sqlite" },
          host: { type: "string", description: "Database host (default: localhost)" },
          port: { type: "number", description: "Database port" },
          dbName: { type: "string", description: "Database name" },
          user: { type: "string", description: "Database user" },
          password: { type: "string", description: "Database password" },
        },
        required: ["sql", "database"],
      },
      handler: async (input) => {
        const { sql, database, host, port, dbName, user, password } = input as {
          sql: string; database: string; host?: string; port?: number;
          dbName?: string; user?: string; password?: string;
        };

        // Direct database query via WhoDB's API
        try {
          const res = await fetch(`http://localhost:${WHODB_PORT}/api/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              type: database,
              credentials: {
                host: host ?? "host.containers.internal",
                port: String(port ?? (database === "postgres" ? 5432 : 3306)),
                database: dbName ?? "postgres",
                user: user ?? (database === "postgres" ? "postgres" : "root"),
                password: password ?? "aionima-root",
              },
              query: sql,
            }),
          });
          const data = await res.json() as unknown;
          return data;
        } catch (err) {
          return { error: `WhoDB query failed: ${err instanceof Error ? err.message : String(err)}. Is WhoDB running? Start it from the Services page.` };
        }
      },
    });

    // Settings page
    api.registerSettingsPage({
      id: "whodb",
      label: "WhoDB",
      description: "Database management tool settings.",
      icon: "database",
      position: 72,
      sections: [
        {
          id: "whodb-service",
          label: "WhoDB Service",
          type: "service-control",
          serviceIds: ["whodb"],
          configPath: "plugins.whodb",
          fields: [],
        },
      ],
    });

    log.info("WhoDB plugin activated — access at https://db.ai.on");
  },
});
