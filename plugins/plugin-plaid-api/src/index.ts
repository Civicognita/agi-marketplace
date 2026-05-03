/**
 * plugin-plaid-api — Plaid API consumer plugin (s147 t611 / t614 / t615 / t616).
 *
 * System-level integration. Tools register globally to Aion's tool palette
 * so Aion can read bank accounts directly. MApps (Accounting Ledger /
 * Budget Tracker / Expense Reports) are secondary consumers via mini-agent
 * auto-discovery.
 *
 * Architecture (cycle 211 plan; Phases 1-3 shipped):
 *   - Plaid Link OAuth flow lives in Local-ID at /api/auth/plaid-link/* —
 *     mirrors the existing GitHub provider pattern. Owner connects banks
 *     via the Local-ID dashboard's browser-side Plaid Link widget.
 *   - PLAID_CLIENT_ID + PLAID_SECRET live as Vault entries (gateway-scoped,
 *     TPM2-sealed via the existing ~/.agi/secrets/vault/ pipeline). Vault
 *     entry IDs come from owner-set env vars
 *     (PLAID_CLIENT_ID_VAULT_REF + PLAID_SECRET_VAULT_REF). Per
 *     `feedback_localid_private_be_careful_what_ships_in_agi`, nothing
 *     Plaid-related is hardcoded in this source.
 *   - Multi-bank support via role-encoding: Local-ID stores each linked
 *     Plaid item as a connections row with role="plaid-item:<itemId>".
 *
 * Tool handlers fetch the access_token from Local-ID's broker, fetch
 * PLAID_CLIENT_ID + PLAID_SECRET from agi Vault, then call Plaid's API
 * directly via fetch() (no `plaid` npm SDK dependency — keeps the plugin
 * dependency surface minimal and matches the Local-ID side).
 *
 * ADF classification: 0AGENT + 0FUNC.
 *
 * See agi/docs/agents/federation-identity.md § Plaid integration for the
 * canonical broker-pattern documentation (s147 t616).
 */

import { createPlugin, defineTool } from "@agi/sdk";

// ---------------------------------------------------------------------------
// Plaid environment URLs (public Plaid product tier endpoints)
// ---------------------------------------------------------------------------

const PLAID_API_BASE = {
  sandbox: "https://sandbox.plaid.com",
  development: "https://development.plaid.com",
  production: "https://production.plaid.com",
} as const;

type PlaidEnv = keyof typeof PLAID_API_BASE;

function getPlaidEnv(): PlaidEnv {
  const env = (process.env.PLAID_ENV ?? "sandbox").toLowerCase();
  if (env === "sandbox" || env === "development" || env === "production") return env;
  return "sandbox";
}

// ---------------------------------------------------------------------------
// Vault helper — reads PLAID_CLIENT_ID + PLAID_SECRET via the gateway's
// own Vault HTTP API. The plugin runs inside the gateway process, so the
// fetch goes to localhost — same private-network gate used by Local-ID
// when it reads the same entries during OAuth.
// ---------------------------------------------------------------------------

interface PlaidCreds {
  clientId: string;
  secret: string;
}

async function fetchVaultValue(vaultEntryId: string): Promise<string> {
  const base = process.env.LOCAL_GATEWAY_URL ?? "http://localhost:3100";
  const url = `${base}/api/vault/${encodeURIComponent(vaultEntryId)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`vault read failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const body = (await res.json()) as { value?: string };
  if (typeof body.value !== "string" || body.value.length === 0) {
    throw new Error("vault entry returned empty value");
  }
  return body.value;
}

async function getPlaidCreds(): Promise<PlaidCreds> {
  const clientIdRef = process.env.PLAID_CLIENT_ID_VAULT_REF;
  const secretRef = process.env.PLAID_SECRET_VAULT_REF;
  if (!clientIdRef || !secretRef) {
    throw new Error(
      "Plaid is not configured: set PLAID_CLIENT_ID_VAULT_REF + " +
        "PLAID_SECRET_VAULT_REF env vars on the gateway, pointing to Vault " +
        "entries holding the Plaid client_id + secret. Create the entries " +
        "in the dashboard's Vault tab.",
    );
  }
  const [clientId, secret] = await Promise.all([
    fetchVaultValue(clientIdRef),
    fetchVaultValue(secretRef),
  ]);
  return { clientId, secret };
}

// ---------------------------------------------------------------------------
// Local-ID broker — fetches a fresh Plaid access_token for a given item
// ---------------------------------------------------------------------------

async function getPlaidToken(itemId: string): Promise<string> {
  const base = process.env.LOCAL_ID_BASE_URL ?? "https://id.ai.on";
  const role = `plaid-item:${itemId}`;
  const url = `${base}/api/auth/plaid-link/token?provider=plaid&role=${encodeURIComponent(role)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5_000) });
  if (res.status === 404) {
    throw new Error(
      `No Plaid item linked with itemId="${itemId}". ` +
        `Connect a bank account at ${base}/dashboard.`,
    );
  }
  if (!res.ok) {
    throw new Error(
      `Plaid token unavailable from Local-ID (HTTP ${res.status}). ` +
        `Connect a bank at ${base}/dashboard or check Local-ID is running.`,
    );
  }
  const body = (await res.json()) as { accessToken?: string };
  if (!body.accessToken) {
    throw new Error("Local-ID returned empty Plaid access token");
  }
  return body.accessToken;
}

interface PlaidItem {
  itemId: string;
  accountLabel: string;
  institutionId: string | null;
  connectedAt: string;
}

async function listPlaidItems(): Promise<PlaidItem[]> {
  const base = process.env.LOCAL_ID_BASE_URL ?? "https://id.ai.on";
  const res = await fetch(`${base}/api/auth/plaid-link/items`, {
    signal: AbortSignal.timeout(5_000),
  });
  if (!res.ok) {
    throw new Error(
      `Failed to list Plaid items from Local-ID (HTTP ${res.status}). ` +
        `Check Local-ID is running at ${base}.`,
    );
  }
  return (await res.json()) as PlaidItem[];
}

// ---------------------------------------------------------------------------
// Plaid API helper — single HTTP entrypoint for /accounts/get,
// /transactions/get, /accounts/balance/get, /identity/get
// ---------------------------------------------------------------------------

interface PlaidErrorBody {
  error_code?: string;
  error_message?: string;
  error_type?: string;
  display_message?: string;
}

async function plaidApiCall<T>(endpoint: string, body: object): Promise<T> {
  const env = getPlaidEnv();
  const res = await fetch(`${PLAID_API_BASE[env]}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000),
  });
  const data = (await res.json()) as Record<string, unknown> & PlaidErrorBody;
  if (!res.ok) {
    const code = data.error_code ?? "unknown";
    const message = data.display_message ?? data.error_message ?? `HTTP ${res.status}`;
    const err = new Error(`Plaid ${endpoint} ${code}: ${message}`);
    (err as Error & { plaidErrorCode?: string }).plaidErrorCode = code;
    throw err;
  }
  return data as T;
}

// ---------------------------------------------------------------------------
// Plaid response types (only the fields we surface to the agent)
// ---------------------------------------------------------------------------

interface RawPlaidAccount {
  account_id: string;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
  balances?: {
    available: number | null;
    current: number | null;
    limit: number | null;
    iso_currency_code: string | null;
  };
}

interface RawPlaidTransaction {
  transaction_id: string;
  account_id: string;
  amount: number;
  iso_currency_code: string | null;
  date: string;
  authorized_date: string | null;
  name: string;
  merchant_name: string | null;
  category: string[] | null;
  pending: boolean;
}

interface RawPlaidIdentityOwner {
  names: string[];
  emails: Array<{ data: string; primary: boolean; type: string }>;
  phone_numbers: Array<{ data: string; primary: boolean; type: string }>;
  addresses: Array<{
    data: { street: string; city: string; region: string | null; postal_code: string | null; country: string | null };
    primary: boolean;
  }>;
}

// ---------------------------------------------------------------------------
// Plugin
// ---------------------------------------------------------------------------

export default createPlugin({
  async activate(api) {
    const log = api.getLogger();
    log.info("plugin-plaid-api activating with real Plaid handlers");

    // ─────────────────────────────────────────────────────────────────────
    // plaid:list-accounts — aggregates accounts across ALL linked items
    // ─────────────────────────────────────────────────────────────────────
    api.registerTool(
      defineTool(
        "plaid:list-accounts",
        "List all bank accounts linked via Plaid across every connected institution. Returns each account with its parent Plaid item id (use that in fetch-transactions / get-balance / identity-verify), name, type, subtype, last-four mask, and available balance.",
      )
        .inputSchema({
          type: "object",
          properties: {},
          additionalProperties: false,
        })
        .handler(async () => {
          const items = await listPlaidItems();
          if (items.length === 0) {
            const base = process.env.LOCAL_ID_BASE_URL ?? "https://id.ai.on";
            return {
              accounts: [],
              note: `No banks linked yet. Connect one at ${base}/dashboard.`,
            };
          }

          const creds = await getPlaidCreds();
          const aggregated: Array<{
            itemId: string;
            institutionLabel: string;
            accountId: string;
            name: string;
            officialName: string | null;
            type: string;
            subtype: string | null;
            mask: string | null;
            availableBalance: number | null;
            currentBalance: number | null;
            isoCurrencyCode: string | null;
          }> = [];

          for (const item of items) {
            try {
              const token = await getPlaidToken(item.itemId);
              const data = await plaidApiCall<{ accounts: RawPlaidAccount[] }>(
                "/accounts/get",
                {
                  client_id: creds.clientId,
                  secret: creds.secret,
                  access_token: token,
                },
              );
              for (const account of data.accounts) {
                aggregated.push({
                  itemId: item.itemId,
                  institutionLabel: item.accountLabel,
                  accountId: account.account_id,
                  name: account.name,
                  officialName: account.official_name,
                  type: account.type,
                  subtype: account.subtype,
                  mask: account.mask,
                  availableBalance: account.balances?.available ?? null,
                  currentBalance: account.balances?.current ?? null,
                  isoCurrencyCode: account.balances?.iso_currency_code ?? null,
                });
              }
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err);
              log.warn(`list-accounts: skipping item ${item.itemId}: ${message}`);
            }
          }

          return { accounts: aggregated };
        })
        .build(),
    );

    // ─────────────────────────────────────────────────────────────────────
    // plaid:fetch-transactions
    // ─────────────────────────────────────────────────────────────────────
    api.registerTool(
      defineTool(
        "plaid:fetch-transactions",
        "Fetch transactions from a linked Plaid item within a date range. Paginates automatically. Returns transactions with id, account, amount (positive=debit/expense, negative=credit/income per Plaid convention), date, merchant name, category list, and pending status.",
      )
        .inputSchema({
          type: "object",
          properties: {
            itemId: {
              type: "string",
              description: "Plaid item id (from list-accounts output)",
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
            accountIds: {
              type: "array",
              items: { type: "string" },
              description: "Optional: filter to specific account_ids within the item",
            },
          },
          required: ["itemId", "startDate", "endDate"],
          additionalProperties: false,
        })
        .handler(async (input) => {
          const itemId = String(input.itemId ?? "");
          const startDate = String(input.startDate ?? "");
          const endDate = String(input.endDate ?? "");
          const accountIds = Array.isArray(input.accountIds)
            ? (input.accountIds as unknown[]).map((v) => String(v))
            : undefined;

          if (!itemId || !startDate || !endDate) {
            throw new Error("itemId, startDate, and endDate are required");
          }

          const [token, creds] = await Promise.all([
            getPlaidToken(itemId),
            getPlaidCreds(),
          ]);

          const all: RawPlaidTransaction[] = [];
          let offset = 0;
          const PAGE = 100;
          let total = Infinity;

          while (offset < total) {
            const data = await plaidApiCall<{
              transactions: RawPlaidTransaction[];
              total_transactions: number;
            }>("/transactions/get", {
              client_id: creds.clientId,
              secret: creds.secret,
              access_token: token,
              start_date: startDate,
              end_date: endDate,
              options: {
                count: PAGE,
                offset,
                ...(accountIds ? { account_ids: accountIds } : {}),
              },
            });
            all.push(...data.transactions);
            total = data.total_transactions;
            offset += data.transactions.length;
            if (data.transactions.length === 0) break; // safety
          }

          return {
            count: all.length,
            transactions: all.map((t) => ({
              id: t.transaction_id,
              accountId: t.account_id,
              amount: t.amount,
              isoCurrencyCode: t.iso_currency_code,
              date: t.date,
              authorizedDate: t.authorized_date,
              name: t.name,
              merchantName: t.merchant_name,
              category: t.category,
              pending: t.pending,
            })),
          };
        })
        .build(),
    );

    // ─────────────────────────────────────────────────────────────────────
    // plaid:get-balance
    // ─────────────────────────────────────────────────────────────────────
    api.registerTool(
      defineTool(
        "plaid:get-balance",
        "Get current balances for accounts on a linked Plaid item. Returns available, current, and limit balances per account along with the ISO currency code.",
      )
        .inputSchema({
          type: "object",
          properties: {
            itemId: {
              type: "string",
              description: "Plaid item id (from list-accounts output)",
            },
            accountIds: {
              type: "array",
              items: { type: "string" },
              description: "Optional: filter to specific account_ids within the item",
            },
          },
          required: ["itemId"],
          additionalProperties: false,
        })
        .handler(async (input) => {
          const itemId = String(input.itemId ?? "");
          const accountIds = Array.isArray(input.accountIds)
            ? (input.accountIds as unknown[]).map((v) => String(v))
            : undefined;

          if (!itemId) throw new Error("itemId is required");

          const [token, creds] = await Promise.all([
            getPlaidToken(itemId),
            getPlaidCreds(),
          ]);

          const data = await plaidApiCall<{ accounts: RawPlaidAccount[] }>(
            "/accounts/balance/get",
            {
              client_id: creds.clientId,
              secret: creds.secret,
              access_token: token,
              ...(accountIds ? { options: { account_ids: accountIds } } : {}),
            },
          );

          return {
            balances: data.accounts.map((a) => ({
              accountId: a.account_id,
              name: a.name,
              available: a.balances?.available ?? null,
              current: a.balances?.current ?? null,
              limit: a.balances?.limit ?? null,
              isoCurrencyCode: a.balances?.iso_currency_code ?? null,
            })),
          };
        })
        .build(),
    );

    // ─────────────────────────────────────────────────────────────────────
    // plaid:identity-verify (KYC) — ships per Q-9 owner answer cycle 211
    // ─────────────────────────────────────────────────────────────────────
    api.registerTool(
      defineTool(
        "plaid:identity-verify",
        "Fetch account holder identity fields (name, email, phone, address) for accounts on a linked Plaid item. KYC use case — Plaid's Identity product is gated to certain use cases under their Service Agreement; owner is responsible for ensuring lawful use.",
      )
        .inputSchema({
          type: "object",
          properties: {
            itemId: {
              type: "string",
              description: "Plaid item id (from list-accounts output)",
            },
          },
          required: ["itemId"],
          additionalProperties: false,
        })
        .handler(async (input) => {
          const itemId = String(input.itemId ?? "");
          if (!itemId) throw new Error("itemId is required");

          const [token, creds] = await Promise.all([
            getPlaidToken(itemId),
            getPlaidCreds(),
          ]);

          const data = await plaidApiCall<{
            accounts: Array<RawPlaidAccount & { owners: RawPlaidIdentityOwner[] }>;
          }>("/identity/get", {
            client_id: creds.clientId,
            secret: creds.secret,
            access_token: token,
          });

          return {
            accounts: data.accounts.map((a) => ({
              accountId: a.account_id,
              name: a.name,
              owners: (a.owners ?? []).map((o) => ({
                names: o.names,
                emails: o.emails.map((e) => ({ value: e.data, primary: e.primary, type: e.type })),
                phones: o.phone_numbers.map((p) => ({ value: p.data, primary: p.primary, type: p.type })),
                addresses: o.addresses.map((addr) => ({ ...addr.data, primary: addr.primary })),
              })),
            })),
          };
        })
        .build(),
    );

    log.info(
      "plugin-plaid-api activated; 4 tools registered (list-accounts, fetch-transactions, get-balance, identity-verify) — calling Plaid via Local-ID broker + agi Vault credentials",
    );
  },
});
