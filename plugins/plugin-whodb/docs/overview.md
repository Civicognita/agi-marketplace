# WhoDB — Database Explorer

## Overview

WhoDB is a modern, lightweight database management tool accessible at `https://db.ai.on`. It replaces traditional tools like Adminer and phpMyAdmin with a fast Go+React interface.

## Supported Databases

- PostgreSQL (with pgvector, PostGIS)
- MariaDB / MySQL
- SQLite
- Redis
- MongoDB
- ElasticSearch

## Features

- **Spreadsheet editing** — view and edit data inline with real-time updates
- **Schema visualization** — interactive relationship graphs between tables
- **SQL scratchpad** — syntax-highlighted query editor with history
- **AI-powered SQL** — natural language to SQL via Claude, GPT, or Ollama
- **Data export** — CSV, Excel, JSON, or SQL dump
- **Mock data generation** — generate test data for development

## Access

Navigate to `https://db.ai.on` in your browser. WhoDB must be started from the **Services** page first.

Pre-configured connections to your running PostgreSQL, MariaDB, and Redis containers appear automatically — no manual credential entry needed.

## AI Integration

WhoDB connects to the same AI providers configured in your gateway:
- **Anthropic** — uses your `ANTHROPIC_API_KEY`
- **OpenAI** — uses your `OPENAI_API_KEY`
- **Ollama** — connects to local Ollama if running

Use the Chat feature in WhoDB to ask questions in natural language like "show me the top 10 users by order count" and get SQL generated automatically.

## Agent Integration

The Aion agent can query databases directly via the `query_database` tool. Ask things like:
- "How many users signed up this week?"
- "Show me the schema of the products table"
- "Run SELECT * FROM orders WHERE status = 'pending'"
