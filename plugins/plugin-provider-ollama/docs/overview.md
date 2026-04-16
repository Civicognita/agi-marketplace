# Ollama Provider

## Overview

Local model provider for Aionima via [Ollama](https://ollama.com/). No API key required — models run on your server. The plugin connects to the Ollama HTTP API and lists available models dynamically from whatever is pulled locally.

## Setup

1. Install Ollama on the server: `curl -fsSL https://ollama.com/install.sh | sh`
2. Pull one or more models: `ollama pull llama3.2`, `ollama pull mistral`, etc.
3. Open **Settings > Ollama** in the dashboard.
4. Confirm the **Base URL** (default: `http://localhost:11434`).
5. Select a **Default Model** from the models available on your Ollama instance.

## Configuration

| Field | Description |
|-------|-------------|
| `baseUrl` | Ollama API endpoint (default: `http://localhost:11434`) |
| `model` | Default model for new conversations |

## Notes

- No API key or external account is needed — all inference runs locally.
- If Ollama is running on a remote host, set `baseUrl` to that host's address and ensure port 11434 is accessible.
- The model selector is populated by querying `GET /api/tags` on the configured Ollama endpoint.
- Model performance depends on your server's hardware; GPU acceleration is automatic when available.
