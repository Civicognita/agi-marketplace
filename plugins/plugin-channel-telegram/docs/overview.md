# Telegram Channel

## Overview

Telegram channel adapter for Aionima. Uses [Grammy](https://grammy.dev/) with long-polling — no webhook setup required. Once configured, Aionima receives and replies to Telegram messages through the gateway pipeline.

## Capabilities

| Feature | Supported |
|---------|-----------|
| Text messages | Yes |
| Media (images, files) | Yes |
| Voice messages | Yes |
| Threads | Yes |
| Reactions | No |
| Ephemeral messages | No |

## Setup

1. Create a bot via [@BotFather](https://t.me/BotFather) and copy the bot token.
2. Open **Settings > Channels > Telegram** in the dashboard.
3. Paste the token into the **Bot Token** field and enable the channel.

## Configuration Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `botToken` | Yes | — | Token from @BotFather |
| `allowedChatIds` | No | (any) | Restrict to specific Telegram chat IDs |
| `pollingTimeout` | No | 30 | Long-polling timeout in seconds |
| `rateLimitPerMinute` | No | 30 | Max messages per user per minute |

## Notes

- The bot registers `/start` automatically. Users can type `/start` to initiate a session.
- `allowedChatIds` is recommended for private deployments to prevent unauthorized access.
- Long-polling is fire-and-forget; the bot continues running in the background after activation.
