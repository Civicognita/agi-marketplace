# OpenClaw Bridge

## Overview

Connects OpenClaw agents to the Aionima AGI dashboard. Exposes a **Comms** dashboard page showing agent status, shared chat logs, and accomplishments. Also provides a REST API that OpenClaw uses to push status updates, agent lists, and log entries into Aionima.

## Dashboard

The **Comms > OpenClaw** page provides:

- **Connection Status** — whether the bridge is active and when it last synced
- **Agent Table** — list of registered OpenClaw agents with their current status
- **Chat Logs** — live log stream of messages exchanged between Aionima and OpenClaw
- **Accomplishments** — shared log of completed tasks from OpenClaw agents

## Setup

1. Install this plugin from the Plugin Marketplace.
2. Open **Settings > OpenClaw**.
3. Enable the bridge and enter the OpenClaw endpoint (e.g. `https://papa.ai.on`).
4. Optionally set an **API Key** to secure the push endpoints.
5. Configure the OpenClaw instance to push updates to Aionima's `/plugins/openclaw/` routes.

## Configuration

| Field | Description |
|-------|-------------|
| `enabled` | Toggle the bridge on or off |
| `baseUrl` | OpenClaw instance endpoint |
| `apiKey` | Optional shared secret for authenticating push requests |
| `allowInsecureTls` | Allow self-signed certificates (for local setups) |

## Notes

- All push endpoints (`/agents`, `/accomplishments`, `/communications/logs`, `/status`) are restricted to private network addresses (10.x, 192.168.x, 172.16-31.x, loopback).
- If an API key is configured, all push requests must include it as a `Bearer` token or `X-OpenClaw-Key` header.
