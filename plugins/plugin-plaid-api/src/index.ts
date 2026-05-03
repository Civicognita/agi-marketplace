/**
 * plugin-plaid-api — Plaid API consumer plugin (s147 t611).
 *
 * Status:
 *   - Phase 1 ✓ (scaffold): plugin lifecycle + 4 tool stubs throwing
 *     notImplemented + ADF classification (0AGENT + 0FUNC)
 *   - t614 (deferred — agi-local-id repo): Plaid Link OAuth flow + token
 *     broker route lives in Local-ID, mirroring the GitHub provider pattern
 *   - t615 (deferred — this plugin): tool handlers fetch access_tokens from
 *     Local-ID broker, fetch PLAID_CLIENT_ID + PLAID_SECRET from agi Vault,
 *     then call Plaid SDK. identity-verify ships alongside the other 3 tools
 *     per Q-9 owner answer cycle 209.
 *   - t616 (deferred — agi/docs): federation-identity.md doc note explaining
 *     the broker pattern, mirroring the GitHub flow doc
 *
 * Architecture (cycle 209 owner-corrected):
 *   - **System-level integration**, not per-project plugin. Tools register
 *     globally to the agent's tool palette so Aion can read bank accounts
 *     directly. MApps (Accounting / Budget Tracker / Expenses) are secondary
 *     consumers via mini-agent auto-discovery.
 *   - **OAuth in Local-ID** per `feedback_third_party_oauth_lives_in_localid`:
 *     same pattern as the existing GitHub provider. Local-ID hosts the
 *     "Connect Bank Account" UI + Plaid Link widget + token storage.
 *   - **Secrets in agi Vault** per owner directive cycle 209: PLAID_CLIENT_ID
 *     and PLAID_SECRET live as Vault entries (gateway-scoped, TPM2-sealed via
 *     the existing ~/.agi/secrets/vault/ pipeline). Both Local-ID (during
 *     OAuth) and this plugin (during tool calls) resolve from Vault at
 *     runtime; no plugin-side credential collection.
 *   - **No defineSettingsPage**: this plugin does not collect credentials.
 *     The cycle-205 settings page was removed cycle 210 in line with the
 *     corrected architecture.
 *
 * ADF classification: 0AGENT + 0FUNC
 *   - 0AGENT: registers 4 agent tools (list-accounts, fetch-transactions,
 *     get-balance, identity-verify) into Aion's tool palette globally
 *   - 0FUNC: external-data integration that any tool consumer (Aion direct,
 *     MApp mini-agents, Workflows) can call through the registered tools
 */

import { createPlugin, defineTool } from "@agi/sdk";

const NOT_IMPLEMENTED = (op: string) =>
  `plugin-plaid-api:${op} is registered but not yet implemented. ` +
  `Awaiting t614 (Local-ID Plaid provider — agi-local-id repo) + ` +
  `t615 (agi-side tool handlers wire to Local-ID broker + Plaid SDK calls). ` +
  `Tool handler will throw until t614 + t615 ship.`;

function notImplemented(op: string) {
  return async () => {
    throw new Error(NOT_IMPLEMENTED(op));
  };
}

export default createPlugin({
  async activate(api) {
    const log = api.getLogger();
    log.info("plugin-plaid-api Phase 1 scaffold activating");

    api.registerTool(
      defineTool(
        "plaid:list-accounts",
        "List all bank accounts linked via Plaid. Returns account id, name, official name, type, subtype, last-four mask, and the parent Plaid item id.",
      )
        .inputSchema({
          type: "object",
          properties: {},
          additionalProperties: false,
        })
        .handler(notImplemented("list-accounts"))
        .build(),
    );

    api.registerTool(
      defineTool(
        "plaid:fetch-transactions",
        "Fetch transactions from a linked Plaid account within a date range. Paginates automatically. Returns transactions with amount, date, merchant, category, and pending status.",
      )
        .inputSchema({
          type: "object",
          properties: {
            accountId: {
              type: "string",
              description: "Plaid account_id from list-accounts",
            },
            startDate: {
              type: "string",
              format: "date",
              description: "ISO date YYYY-MM-DD (inclusive)",
            },
            endDate: {
              type: "string",
              format: "date",
              description: "ISO date YYYY-MM-DD (inclusive)",
            },
          },
          required: ["accountId", "startDate", "endDate"],
          additionalProperties: false,
        })
        .handler(notImplemented("fetch-transactions"))
        .build(),
    );

    api.registerTool(
      defineTool(
        "plaid:get-balance",
        "Get the current balance for a linked Plaid account. Returns available, current, and limit balances along with the ISO currency code.",
      )
        .inputSchema({
          type: "object",
          properties: {
            accountId: {
              type: "string",
              description: "Plaid account_id from list-accounts",
            },
          },
          required: ["accountId"],
          additionalProperties: false,
        })
        .handler(notImplemented("get-balance"))
        .build(),
    );

    api.registerTool(
      defineTool(
        "plaid:identity-verify",
        "Verify the account holder identity for a linked Plaid account. Returns name, email, phone, and address fields Plaid has on file. Ships in t615 alongside the other 3 tools per Q-9 owner answer cycle 209.",
      )
        .inputSchema({
          type: "object",
          properties: {
            accountId: {
              type: "string",
              description: "Plaid account_id from list-accounts",
            },
          },
          required: ["accountId"],
          additionalProperties: false,
        })
        .handler(notImplemented("identity-verify"))
        .build(),
    );

    log.info("plugin-plaid-api Phase 1 scaffold activated; 4 tool stubs registered, all throwing notImplemented until t614 + t615 ship");
  },
});
