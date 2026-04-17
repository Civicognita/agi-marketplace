/**
 * provider-claude-max — LLM provider plugin that uses Claude Max subscription
 * OAuth tokens instead of API credits.
 *
 * Reads credentials from ~/.claude/.credentials.json (shared with Claude Code).
 * Uses the Anthropic SDK's native `authToken` option which sends
 * `Authorization: Bearer <token>` instead of `x-api-key: <key>`.
 */
import { createPlugin, defineSettingsPage } from "@aionima/sdk";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { createHash } from "node:crypto";
// The plugin build tool injects `const require = createRequire("/opt/aionima/package.json")`
// at the top of dist/index.js. This require resolves from the gateway's
// node_modules where @anthropic-ai/sdk lives. Declare it so TypeScript
// accepts the call in ESM source.
declare const require: (id: string) => Record<string, unknown>;

interface ClaudeCredentials {
  claudeAiOauth: {
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
    scopes: string[];
    subscriptionType: string;
    rateLimitTier: string;
  };
}

const CREDENTIALS_PATH = join(homedir(), ".claude", ".credentials.json");

function loadCredentials(): ClaudeCredentials["claudeAiOauth"] | null {
  if (!existsSync(CREDENTIALS_PATH)) return null;
  try {
    const raw = readFileSync(CREDENTIALS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as ClaudeCredentials;
    return parsed.claudeAiOauth ?? null;
  } catch {
    return null;
  }
}

function getAccessToken(): string {
  const creds = loadCredentials();
  if (!creds) {
    throw new Error(
      `Claude Max credentials not found at ${CREDENTIALS_PATH}. ` +
      "Run Claude Code once to authenticate, then restart the gateway.",
    );
  }
  if (Date.now() > creds.expiresAt) {
    const fresh = loadCredentials();
    if (!fresh || Date.now() > fresh.expiresAt) {
      throw new Error(
        "Claude Max OAuth token expired. Open Claude Code to refresh it, then restart the gateway.",
      );
    }
    return fresh.accessToken;
  }
  return creds.accessToken;
}

export default createPlugin({
  activate(api) {
    const log = api.getLogger();

    const creds = loadCredentials();
    if (!creds) {
      log.warn(
        `provider-claude-max: no credentials at ${CREDENTIALS_PATH} — ` +
        "provider will error on first invocation. Run Claude Code to authenticate.",
      );
    } else {
      const plan = creds.subscriptionType ?? "unknown";
      const tier = creds.rateLimitTier ?? "unknown";
      const expiresIn = Math.max(0, Math.round((creds.expiresAt - Date.now()) / 3600_000));
      log.info(
        `provider-claude-max: loaded ${plan} subscription (tier: ${tier}, ` +
        `token expires in ~${String(expiresIn)}h)`,
      );
    }

    // Settings page — custom section with connect/disconnect UX.
    // The "claude-max-connection" section ID maps to ClaudeMaxConnectionSection
    // in the dashboard's customSectionMap (PluginSettingsRenderer.tsx).
    api.registerSettingsPage(
      defineSettingsPage("provider-claude-max", "Claude Max")
        .description("Use your Claude Max subscription instead of API credits")
        .icon("sparkles")
        .position(11)
        .section({
          id: "claude-max-connection",
          label: "Connection",
          type: "custom",
        })
        .build(),
    );

    // Register the LLM provider factory. When agent.provider is set to
    // "claude-max" in gateway.json, the LLM factory calls this factory
    // to construct the Anthropic client with OAuth bearer auth.
    api.registerProvider({
      id: "claude-max",
      name: "Claude Max (subscription)",
      description: "Uses your Claude Max subscription via OAuth tokens. No API credit cost.",
      defaultModel: "claude-sonnet-4-6",
      envKey: "",
      requiresApiKey: false,
      models: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
      factory: (config: { defaultModel?: string; maxTokens?: number; maxRetries?: number; retryBaseMs?: number }) => {
        const Anthropic = require("@anthropic-ai/sdk").default as { new(opts: Record<string, unknown>): { messages: { create(body: unknown): Promise<Record<string, unknown>> }; _options: Record<string, unknown> } };
        let currentToken = getAccessToken();
        const client = new Anthropic({
          authToken: currentToken,
          defaultHeaders: {
            "anthropic-beta": "claude-code-20250219,oauth-2025-04-20",
          },
        });
        const defaultModel = config.defaultModel ?? "claude-sonnet-4-6";
        const maxTokens = config.maxTokens ?? 8192;
        const maxRetries = config.maxRetries ?? 3;
        const retryBaseMs = config.retryBaseMs ?? 1000;

        function refreshToken(): void {
          const fresh = getAccessToken();
          if (fresh !== currentToken) {
            currentToken = fresh;
            client._options = { ...client._options, authToken: fresh };
          }
        }
        function isRetryable(err: unknown): boolean {
          if (err && typeof err === "object" && "status" in err) {
            return [429, 500, 502, 503, 529].includes((err as { status: number }).status);
          }
          return false;
        }
        function sleep(ms: number): Promise<void> {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        async function callWithRetry(fn: () => Promise<unknown>): Promise<unknown> {
          let lastError: unknown;
          for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try { return await fn(); } catch (err) {
              lastError = err;
              if (!isRetryable(err) || attempt === maxRetries) throw err;
              await sleep(retryBaseMs * Math.pow(2, attempt) + Math.floor(Math.random() * 500));
            }
          }
          throw lastError;
        }
        function buildMessages(msgs: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
          return msgs.filter((m) => m.role !== "system").map((m) => {
            if (typeof m.content === "string") return { role: m.role, content: m.content };
            if (Array.isArray(m.content)) {
              return { role: m.role, content: (m.content as Array<Record<string, unknown>>).map((b) => {
                if (b.type === "text") return { type: "text", text: b.text };
                if (b.type === "tool_use") return { type: "tool_use", id: b.id, name: b.name, input: b.input };
                if (b.type === "tool_result") return { type: "tool_result", tool_use_id: b.tool_use_id, content: typeof b.content === "string" ? b.content : JSON.stringify(b.content) };
                if (b.type === "image") return { type: "image", source: b.source };
                if (b.type === "thinking") return { type: "thinking", thinking: b.thinking };
                return b;
              }) };
            }
            return { role: m.role, content: String(m.content ?? "") };
          });
        }
        function buildTools(tools: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
          return tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.input_schema }));
        }
        function mapResponse(resp: Record<string, unknown>): Record<string, unknown> {
          const content = resp.content as Array<Record<string, unknown>>;
          const usage = resp.usage as { input_tokens: number; output_tokens: number };
          return {
            text: content.filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n"),
            toolCalls: content.filter((b) => b.type === "tool_use").map((b) => ({ id: b.id, name: b.name, input: b.input })),
            contentBlocks: content,
            thinkingBlocks: content.filter((b) => b.type === "thinking").map((b) => ({ type: "thinking", thinking: b.thinking })),
            usage: { inputTokens: usage.input_tokens, outputTokens: usage.output_tokens },
            model: resp.model,
            stopReason: resp.stop_reason,
          };
        }

        return {
          async invoke(params: Record<string, unknown>) {
            refreshToken();
            const model = (params.model as string) ?? defaultModel;
            const baseMax = (params.maxTokens as number) ?? maxTokens;
            const thinking = params.thinking as { type: string; budget_tokens?: number } | undefined;
            const thinkingBudget = thinking?.type === "enabled" ? (thinking.budget_tokens ?? 0) : 0;
            const req: Record<string, unknown> = {
              model, max_tokens: thinkingBudget > 0 ? thinkingBudget + baseMax : baseMax,
              system: params.system as string,
              messages: buildMessages(params.messages as Array<Record<string, unknown>>),
              metadata: { user_id: createHash("sha256").update(String(params.entityId ?? "")).digest("hex") },
            };
            if (params.tools) req.tools = buildTools(params.tools as Array<Record<string, unknown>>);
            if (thinking) req.thinking = thinking;
            return mapResponse(await callWithRetry(() => client.messages.create(req)) as Record<string, unknown>);
          },
          async continueWithToolResults(params: Record<string, unknown>) {
            refreshToken();
            const original = params.original as Record<string, unknown>;
            const model = (original.model as string) ?? defaultModel;
            const baseMax = (original.maxTokens as number) ?? maxTokens;
            const thinking = original.thinking as { type: string; budget_tokens?: number } | undefined;
            const thinkingBudget = thinking?.type === "enabled" ? (thinking.budget_tokens ?? 0) : 0;
            const messages = buildMessages(original.messages as Array<Record<string, unknown>>);
            messages.push({ role: "assistant", content: params.assistantContent as unknown[] });
            messages.push({ role: "user", content: (params.toolResults as Array<Record<string, unknown>>).map((r) => ({
              type: "tool_result", tool_use_id: r.tool_use_id, content: typeof r.content === "string" ? r.content : JSON.stringify(r.content),
            })) });
            const req: Record<string, unknown> = {
              model, max_tokens: thinkingBudget > 0 ? thinkingBudget + baseMax : baseMax,
              system: original.system as string, messages,
              metadata: { user_id: createHash("sha256").update(String(original.entityId ?? "")).digest("hex") },
            };
            if (original.tools) req.tools = buildTools(original.tools as Array<Record<string, unknown>>);
            if (thinking) req.thinking = thinking;
            return mapResponse(await callWithRetry(() => client.messages.create(req)) as Record<string, unknown>);
          },
          async summarize(text: string, prompt: string) {
            refreshToken();
            const resp = await client.messages.create({ model: defaultModel, max_tokens: 1024, system: prompt, messages: [{ role: "user" as const, content: text }] });
            return (resp.content as Array<{ type: string; text?: string }>).filter((b) => b.type === "text").map((b) => b.text ?? "").join("\n");
          },
        };
      },
    });

    log.info("provider-claude-max activated");
  },
});
