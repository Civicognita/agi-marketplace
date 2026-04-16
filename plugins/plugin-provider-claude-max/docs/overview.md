# Claude Max Provider

## Overview

Uses your Claude Max (or Pro) subscription to power Aion instead of consuming Anthropic API credits. Reads OAuth tokens from Claude Code's credential file (`~/.claude/.credentials.json`) and authenticates via the Anthropic SDK's native `authToken` mechanism.

No API key needed. No per-token billing. Uses whatever model access your Claude subscription includes.

## Available Models

| Model | Description |
|-------|-------------|
| claude-opus-4-6 | Most capable — complex reasoning, long context |
| claude-sonnet-4-6 | Balanced — capable and fast, recommended for most tasks |
| claude-haiku-4-5 | Fastest — lightweight tasks and high-throughput pipelines |

Model availability depends on your subscription tier (Pro, Max, etc.).

## Prerequisites

- **Claude Code** must be installed and authenticated on this machine. Run `claude` in a terminal at least once and complete the OAuth login flow. This creates `~/.claude/.credentials.json` with the access + refresh tokens.
- A **Claude Max** or **Claude Pro** subscription on the authenticated account.

## Setup

1. Ensure Claude Code is authenticated (`~/.claude/.credentials.json` exists).
2. Install this plugin from the Plugin Marketplace (Settings > Plugins > Browse).
3. Set `agent.provider` to `"claude-max"` in Settings > Gateway > General.
4. Restart the gateway. The plugin loads, reads the OAuth token, and Aion starts using your subscription.

If the configured provider is `"claude-max"` and the plugin isn't installed yet, the gateway auto-installs it from the marketplace on boot.

## Token Refresh

The access token has an expiry (typically weeks). The plugin re-reads `~/.claude/.credentials.json` on every LLM invocation, so if Claude Code refreshes the token in the background, Aion picks it up automatically. If the token expires and Claude Code isn't running to refresh it, the plugin throws an error with instructions to re-authenticate.

## Configuration

| Setting | Value |
|---------|-------|
| `agent.provider` | `"claude-max"` in `gateway.json` |
| Credentials | Automatic — read from `~/.claude/.credentials.json` |
| API Key | Not used — OAuth bearer auth replaces the `x-api-key` header |

## Rate Limits

Rate limits are governed by your subscription tier (`rateLimitTier` in the credentials file). Claude Max typically provides higher limits than API access. The plugin surfaces the tier and token expiry in its boot log:

```
provider-claude-max: loaded max subscription (tier: default_claude_max_20x, token expires in ~168h)
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Claude Max credentials not found" | Run `claude` CLI and authenticate |
| "OAuth token expired" | Open Claude Code to trigger a token refresh, then restart the gateway |
| Plugin not loading | Check Settings > Plugins — is it installed? If not, install from Browse tab or set `agent.provider: "claude-max"` and restart (auto-installs) |
