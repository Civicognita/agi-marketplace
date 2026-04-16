# Gmail Channel

## Overview

Gmail OAuth2 channel adapter for Aionima. Polls a Gmail inbox for incoming messages and sends replies as emails. Suitable for email-based agent workflows and support-style interactions.

## Capabilities

| Feature | Supported |
|---------|-----------|
| Text messages | Yes |
| Media (attachments) | No |
| Voice | No |
| Threads | No |
| Reactions | No |

## Setup

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and enable the **Gmail API**.
2. Create OAuth 2.0 credentials (type: Web application). Note the client ID and client secret.
3. Run the auth helper to obtain a refresh token: `pnpm tsx scripts/gmail-auth.ts`.
4. Open **Settings > Channels > Gmail** and fill in the credentials.

## Configuration Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `account` | Yes | — | Gmail address being polled |
| `clientId` | Yes | — | OAuth2 client ID from Google Cloud Console |
| `clientSecret` | Yes | — | OAuth2 client secret |
| `refreshToken` | Yes | — | OAuth2 refresh token from auth helper |
| `label` | No | INBOX | Gmail label to poll |
| `pollingIntervalMs` | No | 15000 | How often to check for new mail (ms) |
| `allowedAddresses` | No | (any) | Only respond to these sender addresses |
| `rateLimitPerMinute` | No | 20 | Max messages per sender per minute |
| `maxAgeMinutes` | No | 30 | Ignore messages older than this many minutes |

## Notes

- `maxAgeMinutes` prevents the bot from processing an inbox backlog when first enabled.
- Use `allowedAddresses` to restrict the bot to known senders in a controlled workflow.
