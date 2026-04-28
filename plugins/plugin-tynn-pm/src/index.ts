/**
 * plugin-tynn-pm — Tynn-the-service as a marketplace plugin (s127).
 *
 * Currently a SCAFFOLD (s127 t486 + t487). Subsequent tasks fill in the
 * activate body:
 *   - t488: registerPmProvider({id: "tynn", factory: ...}) using the s118
 *           t434 SDK hook. Factory wraps a TynnPmProvider that speaks MCP
 *           against the configured tynn-MCP-server (via mcp-client) and
 *           projects the canonical PmProvider workflow shape.
 *   - t489: registerMcpServerTemplate({id: "tynn", ...}) so the per-project
 *           MCP tab dropdown surfaces "Tynn" as a configurable server with
 *           default command + env shape (TYNN_API_KEY, etc).
 *   - t490: future iteration — register an MApp definition for the Kanban
 *           view (deferred per s127 task list).
 *
 * Architecture rationale: tynn-lite stays baked-in as the file-based
 * fallback (always available, zero config). This plugin is the upgrade
 * path — installing it lets projects switch to tynn-the-service for the
 * full MCP-backed experience plus the future Kanban MApp.
 *
 * ADF classification: 0UX + 0AGENT
 *   - 0UX: future Kanban MApp (t490) extends the dashboard's project surface
 *   - 0AGENT: PmProvider registration extends the agent's tool palette with
 *     the canonical PM workflow tools (list-tasks, set-status, add-comment, etc)
 */

import { createPlugin } from "@agi/sdk";

export default createPlugin({
  async activate(api) {
    const log = api.getLogger();

    // s127 t488 (next cycle) — register the tynn PmProvider via the
    // definePmProvider builder. Factory will instantiate a TynnPmProvider
    // wrapping mcp-client against the configured server URL + bearer token.

    // s127 t489 (next cycle) — register the MCP server template via
    // api.registerMcpServerTemplate({id: "tynn", ...}) so the per-project
    // MCP tab dropdown shows "Tynn" with default command/env shape. This
    // replaces the temporary built-in template at server-runtime-state.ts:2017.

    log.info("plugin-tynn-pm scaffold activated (s127 t486+t487; full registration lands in t488/t489)");
  },
});
