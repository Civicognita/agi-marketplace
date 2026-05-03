# plugin-plaid-api

Plaid API consumer plugin for Aionima. Links bank accounts via Plaid Link
and exposes 4 agent tools for use by the Accounting Ledger, Budget Tracker,
and Expense Reports MApps (and any other tool consumer).

## Status

Phase 1 (this commit): scaffold only.

| Phase | Status | Scope |
|-------|--------|-------|
| 1 | shipped | Plugin scaffold + settings page + 4 tool stubs |
| 2 | deferred | Plaid Link OAuth + link_token exchange |
| 3 | deferred | Real Plaid API SDK calls for the 4 tools |
| 4 | deferred | TPM2-sealed credential storage migration |

Tool stubs throw `notImplemented` errors today. The catalog entry, settings
page, and tool registration surfaces are all wired so users can install
the plugin, see it in the dashboard, and observe what tools it provides;
actual Plaid API calls light up in Phase 2/3.

## Tools

| Tool | Description |
|------|-------------|
| `plaid:list-accounts` | List linked bank accounts (id, name, type, mask) |
| `plaid:fetch-transactions` | Fetch transactions for an account in a date range |
| `plaid:get-balance` | Current balance for an account |
| `plaid:identity-verify` | Account holder KYC fields (Phase 2 owner-judgment-gated) |

Once Phase 3 ships, mini-agents in the Accounting / Budget Tracker /
Expense Reports MApps can auto-discover these tools and call them through
their toolMode=auto dispatch (cycle-191 Hybrid mini-agent shape).

## Settings

Set credentials at `Settings → Integrations → Plaid`:

- **Enabled** toggle
- **Environment**: sandbox | development | production
- **Client ID**
- **Secret**

Per CLAUDE.md `prohibited_actions`, Claude (and any agent) never enters
or pre-fills these credential fields. Owner enters them manually at
install time.

## ADF classification

`0AGENT + 0FUNC`:

- **0AGENT**: extends the agent's tool palette with 4 Plaid actions
- **0FUNC**: external-data integration that other ADF surfaces (MApps,
  Workflows, Plugins) can consume through the registered tools

## Composition

Once Phase 3 lights up, the cross-MApp graph at four Ops MApps
(Accounting / Budget Tracker / Invoicing / Expense Reports) gains
external-data hooks:

- Accounting can auto-categorize a Plaid transaction into chart of
  accounts via the categorize prompt
- Budget Tracker can pull actuals directly from Plaid transactions
  instead of relying on Accounting's ledger
- Expense Reports can match a Plaid card transaction to an expense
  report submission

These compositions are deferred until Phase 3 ships and the screens
runtime adds per-screen agentic dispatch.
