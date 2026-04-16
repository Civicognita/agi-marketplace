# Anthropic Provider

## Overview

Anthropic (Claude) API provider for Aionima. Registers a settings page where you configure your API key and default model. This is the default provider — it is baked in and active as soon as an API key is supplied.

## Available Models

| Model | Description |
|-------|-------------|
| claude-opus-4-6 | Most capable — complex reasoning, long context |
| claude-sonnet-4-6 | Balanced — capable and fast, recommended for most tasks |
| claude-haiku-4-5 | Fastest — lightweight tasks and high-throughput pipelines |

## Setup

1. Obtain an API key from [console.anthropic.com](https://console.anthropic.com/).
2. Open **Settings > Anthropic** in the dashboard.
3. Paste the key into the **API Key** field (stored encrypted).
4. Select a **Default Model** for new conversations.

## Configuration

| Field | Description |
|-------|-------------|
| `apiKey` | Anthropic API key (`sk-ant-...`) |
| `model` | Default model for new conversations |

## Notes

- This plugin is `bakedIn: true` — it is always installed and cannot be removed from the Plugin Marketplace, only disabled.
- Model availability is fetched live from the Anthropic API; the model selector reflects your account's entitlements.
- Worker agents use `modelTier` to select a model automatically; the default model set here applies to interactive chat sessions.
