# OpenAI Provider

## Overview

OpenAI (GPT) API provider for Aionima. Registers a settings page for your API key, an optional custom base URL, and a default model. The base URL field makes this provider compatible with Azure OpenAI and other OpenAI-compatible APIs.

## Available Models

| Model | Description |
|-------|-------------|
| gpt-4o | Flagship multimodal model |
| gpt-4o-mini | Fast and cost-efficient |
| o3 | Advanced reasoning model |

## Setup

1. Obtain an API key from [platform.openai.com](https://platform.openai.com/).
2. Open **Settings > OpenAI** in the dashboard.
3. Paste the key into the **API Key** field.
4. Optionally set a **Base URL** if using Azure OpenAI or a compatible proxy.
5. Select a **Default Model** for new conversations.

## Configuration

| Field | Description |
|-------|-------------|
| `apiKey` | OpenAI API key (`sk-...`) |
| `baseUrl` | Custom API endpoint — leave empty for `https://api.openai.com/v1` |
| `model` | Default model for new conversations |

## Notes

- Leave `baseUrl` empty to use the standard OpenAI endpoint.
- When using Azure OpenAI, set `baseUrl` to your Azure endpoint and use your Azure API key.
- Model availability is fetched live; the selector reflects models accessible to your API key.
