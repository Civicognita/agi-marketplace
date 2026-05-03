/**
 * plugin-plaid-api — Plaid API consumer plugin (s147 t611).
 *
 * Status:
 *   - Phase 1 ✓ (scaffold): plugin lifecycle, settings page for credentials,
 *     4 tool stubs throwing notImplemented, ADF classification (0AGENT + 0FUNC)
 *   - Phase 2 (deferred): Plaid Link OAuth flow + link_token exchange
 *   - Phase 3 (deferred): real Plaid API SDK calls for the 4 tools
 *   - Phase 4 (deferred): TPM2-sealed credential storage wiring
 *
 * Architecture rationale: the t611 description named `defineProvider` but
 * that builder is specifically for LLM Providers (Anthropic/OpenAI/Ollama).
 * Plaid is an external-API consumer — the right SDK shape is `defineTool`
 * for each agent action plus `defineSettingsPage` for credentials. Owner's
 * actual intent ("API consumer service") matches this shape.
 *
 * Security posture:
 *   - Credentials (Plaid Client ID + Secret) are owner-entered at install
 *     time. Per CLAUDE.md § prohibited_actions, Claude never enters or
 *     pre-fills these fields.
 *   - TPM2 sealing of the secret happens via the existing ~/.agi/secrets/
 *     infrastructure when Phase 4 lands. Today the settings page collects
 *     credentials into config; the sealing migration is a follow-up.
 *   - Plaid Link OAuth flow (Phase 2) follows the Local-ID-owns-identity
 *     rule: the plugin serves a redirect endpoint for the Plaid hosted Link
 *     flow but does not implement an account/auth UI. Plaid is an external
 *     API the plugin consumes; user identity within Aionima still flows
 *     through Local-ID.
 *
 * ADF classification: 0AGENT + 0FUNC
 *   - 0AGENT: registers 4 agent tools (list-accounts, fetch-transactions,
 *     get-balance, identity-verify) into the project's tool palette
 *   - 0FUNC: external-data integration that mini-agents in the Accounting
 *     / Budget Tracker / Expense Reports MApps can auto-discover and call
 *     once their per-screen agentic dispatch lands (deferred until screens
 *     runtime supports it; cycle-202 only proved componentRef element
 *     dispatch)
 */

import { createPlugin, defineSettingsPage, defineTool } from "@agi/sdk";

const NOT_IMPLEMENTED = (op: string) =>
  `plugin-plaid-api:${op} is registered but not yet implemented. ` +
  `Awaiting Phase 2 (Plaid Link OAuth) + Phase 3 (real Plaid API SDK calls). ` +
  `Settings page collects credentials; tool handlers throw until phases ship.`;

function notImplemented(op: string) {
  return async () => {
    throw new Error(NOT_IMPLEMENTED(op));
  };
}

export default createPlugin({
  async activate(api) {
    const log = api.getLogger();
    log.info("plugin-plaid-api Phase 1 scaffold activating");

    api.registerSettingsPage(
      defineSettingsPage("plaid-api", "Plaid")
        .description(
          "Connect a Plaid account to enable bank-account linking, " +
          "transaction fetching, balance checks, and identity verification " +
          "for use by Accounting / Budget Tracker / Expense Reports MApps " +
          "and any other tool consumer.",
        )
        .icon("link")
        .position(70)
        .section({
          id: "plaid-credentials",
          label: "Plaid Credentials",
          description:
            "Enter your Plaid client credentials. Get them from the " +
            "Plaid dashboard at dashboard.plaid.com. Sandbox credentials " +
            "are safe to use during setup; switch to development or " +
            "production once linked accounts are live. These secrets " +
            "will be TPM2-sealed once Phase 4 ships.",
          configPath: "plugins.plaidApi",
          fields: [
            {
              id: "enabled",
              label: "Enabled",
              type: "toggle",
              configKey: "enabled",
            },
            {
              id: "environment",
              label: "Plaid Environment",
              type: "select",
              configKey: "environment",
              options: [
                { value: "sandbox", label: "Sandbox (test data)" },
                { value: "development", label: "Development (real institutions, limited)" },
                { value: "production", label: "Production (live)" },
              ],
              placeholder: "sandbox",
            },
            {
              id: "clientId",
              label: "Client ID",
              type: "text",
              configKey: "clientId",
              placeholder: "5e..." ,
            },
            {
              id: "secret",
              label: "Secret",
              type: "password",
              configKey: "secret",
            },
          ],
        })
        .build(),
    );

    api.registerTool(
      defineTool(
        "plaid:list-accounts",
        "List all bank accounts linked via Plaid for the current project. Returns account id, name, official name, type, subtype, and last-four mask.",
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
        "Verify the account holder identity for a linked Plaid account. Returns name, email, phone, and address fields Plaid has on file. KYC use case — owner-judgment-gated whether to ship in Phase 2 or defer for regulatory reasons.",
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

    log.info("plugin-plaid-api Phase 1 scaffold activated; 4 tool stubs registered, all throwing notImplemented until Phase 2/3 ship");
  },
});
