# Discord Channel

## Overview

Discord channel adapter for Aionima. Uses [discord.js](https://discord.js.org/) to connect a bot to Discord servers. By default the bot only responds when @mentioned or in DMs, keeping it unobtrusive in busy servers.

## Capabilities

| Feature | Supported |
|---------|-----------|
| Text messages | Yes |
| Media (images, files) | Yes |
| Threads | Yes |
| Reactions | No |
| Ephemeral messages | No |

## Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Under **Bot**, generate a token and enable the **Message Content** privileged intent.
3. Invite the bot to your server using the OAuth2 URL generator (scopes: `bot`, permissions: `Send Messages`, `Read Message History`).
4. Open **Settings > Channels > Discord** in the dashboard, paste the token, and enable the channel.

## Configuration Fields

| Field | Required | Default | Description |
|-------|----------|---------|-------------|
| `botToken` | Yes | — | Bot token from Discord Developer Portal |
| `applicationId` | No | — | Application ID (reserved for slash commands) |
| `allowedGuildIds` | No | (any) | Restrict to specific server IDs |
| `allowedChannelIds` | No | (any) | Restrict to specific channel IDs |
| `mentionOnly` | No | true | Only respond when @mentioned or in DMs |
| `rateLimitPerMinute` | No | 20 | Max messages per user per minute |

## Notes

- With `mentionOnly: true` (default) the bot ignores regular chat messages, reducing noise.
- Set `allowedGuildIds` to prevent the bot from being used in servers you did not authorize.
