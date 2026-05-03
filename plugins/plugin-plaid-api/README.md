# plugin-plaid-api

System-level Plaid integration for Aionima. Registers 4 agent tools globally
to Aion's tool palette so Aion can read bank accounts directly. MApps
(Accounting Ledger / Budget Tracker / Expense Reports) are secondary
consumers via mini-agent auto-discovery.

## Architecture

The Plaid integration spans three repos:

| Repo | Role |
|------|------|
| `agi-local-id` | Hosts Plaid Link OAuth flow + UI ("Connect Bank Account") + per-item access_token storage. Mirrors the GitHub provider pattern at `feedback_id_owns_identity_not_agi`. |
| `agi` Vault | Single source of truth for `PLAID_CLIENT_ID` + `PLAID_SECRET` (system-level credentials). Both Local-ID (during OAuth) and this plugin (during tool calls) resolve from Vault at runtime. |
| `agi-marketplace` (this plugin) | Registers 4 tool definitions globally. Tool handlers fetch access_tokens from Local-ID broker, fetch credentials from Vault, then call Plaid SDK. |

This plugin **never collects credentials** in agi config. Per CLAUDE.md
`prohibited_actions`, that role belongs in Local-ID and Vault.

## Status

| Phase | Tracking | Status | Repo |
|-------|----------|--------|------|
| 1 — scaffold + 4 tool stubs | t611 | shipped (cycle 205, reworked cycle 210) | `agi-marketplace` |
| 2 — Local-ID Plaid provider + OAuth flow + token broker | t614 | backlog | `agi-local-id` |
| 3 — agi tool handlers wire to broker + Plaid SDK calls | t615 | backlog (blocked on t614) | `agi-marketplace` |
| 4 — `federation-identity.md` doc note explaining the broker pattern | t616 | backlog (blocked on t614 + t615) | `agi` |

Tool stubs throw `notImplemented` errors today. The catalog entry and tool
registration surfaces are wired so users can install the plugin and observe
what tools it provides; actual Plaid API calls light up in t615.

## Tools

| Tool | Description |
|------|-------------|
| `plaid:list-accounts` | List linked bank accounts (id, name, type, mask, parent item id) |
| `plaid:fetch-transactions` | Fetch transactions for an account in a date range |
| `plaid:get-balance` | Current balance for an account |
| `plaid:identity-verify` | Account holder identity fields (name, email, phone, address). Ships in t615 alongside the other 3 tools per Q-9 owner answer cycle 209. |

Once t615 lands, mini-agents in the Accounting / Budget Tracker / Expense
Reports MApps can auto-discover these tools and call them through their
`toolMode=auto` dispatch (cycle-191 Hybrid mini-agent shape) without
explicit per-MApp tool whitelisting.

## Setup (when t614 ships)

1. **Create Vault entries** for Plaid credentials via the agi dashboard's
   Vault tab:
   - `Plaid Client ID` (type: key) → returns a stable Vault entry ID
   - `Plaid Secret` (type: password) → returns a stable Vault entry ID
2. **Configure Local-ID** to reference those Vault entries via env vars
   `PLAID_CLIENT_ID_VAULT_REF` and `PLAID_SECRET_VAULT_REF`, plus `PLAID_ENV`
   (`sandbox` | `development` | `production` — Plaid's product tier; not
   agi's hosting environment terminology).
3. **Connect a bank account** via Local-ID's `/dashboard` "Connect Bank
   Account" button (Plaid Link widget opens, user authenticates with their
   bank, access_token stored in Local-ID's encrypted connections table).
4. **Aion (and MApp mini-agents) can now call the 4 Plaid tools** directly.

Per CLAUDE.md `prohibited_actions`, Claude (and any agent) never enters or
pre-fills the Plaid Client ID / Secret. Owner enters them in the Vault
dashboard manually.

## ADF classification

`0AGENT + 0FUNC`:

- **0AGENT**: extends Aion's tool palette globally with 4 Plaid actions
- **0FUNC**: external-data integration that any tool consumer (Aion direct,
  MApp mini-agents, Workflows) can call through the registered tools

## Cross-MApp composition (post-t615)

Once t615 lights up, Aion and MApp mini-agents gain external-data hooks:

- **Aion direct**: read account balances + transactions + identity for any
  agentic task involving financial state
- **Accounting Ledger MApp**: auto-categorize a Plaid transaction into chart
  of accounts via the categorize prompt
- **Budget Tracker MApp**: pull actuals directly from Plaid transactions
  instead of relying solely on Accounting's ledger
- **Expense Reports MApp**: match a Plaid card transaction to an expense
  report submission

Cross-MApp compositions remain via filesystem-shared-state at
`<projectPath>/k/mapps/`; Plaid is the upstream data source feeding any
MApp that needs it.

See `agi/docs/agents/federation-identity.md` (t616) for the canonical
broker-pattern documentation once it lands.
