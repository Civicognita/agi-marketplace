# Signal Channel

## Overview

Signal channel adapter for Aionima. Connects to a [signal-cli](https://github.com/AsamK/signal-cli) REST API to send and receive encrypted Signal messages. Phone numbers in the allow-list are stored as SHA-256 hashes — raw numbers are never written to disk.

## Capabilities

| Feature | Supported |
|---------|-----------|
| Text messages | Yes |
| Media | No |
| Voice | No |
| End-to-end encryption | Yes (via Signal protocol) |
| Reactions | No |

## Setup

1. Deploy the [signal-cli REST API container](https://github.com/bbernhard/signal-cli-rest-api) and register the bot's phone number.
2. Confirm the container is reachable (default: `http://localhost:8080`).
3. Open **Settings > Channels > Signal** and enter the signal-cli URL and the bot's registered phone number.

## Configuration Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `signalCliUrl` | Yes | — | Base URL of the signal-cli REST API |
| `accountNumber` | Yes | — | Bot's registered phone number (E.164 format, e.g. +15551234567) |
| `pollingIntervalMs` | No | 2000 | How often to poll signal-cli for new messages (ms) |
| `allowedNumbers` | No | (any) | SHA-256 hashes of phone numbers permitted to interact |
| `rateLimitPerMinute` | No | 15 | Max messages per user per minute |

## Notes

- `allowedNumbers` accepts SHA-256 hashes, not plain phone numbers, to minimize PII at rest.
- The adapter polls signal-cli rather than using webhooks, so no inbound port is needed.
- signal-cli must remain running independently; this plugin does not manage its lifecycle.
