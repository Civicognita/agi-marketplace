# Aionima Official Marketplace

Official plugin catalog for the [Aionima](https://github.com/Civicognita/agi) autonomous AI gateway.

## Structure

```
aionima-marketplace/
├── marketplace.json              # Catalog listing all plugins
├── plugins/
│   ├── plugin-stacks/            # Framework stacks (TALL, Next.js, Hono)
│   ├── plugin-node-runtime/      # Node.js runtime versions
│   ├── plugin-php-runtime/       # PHP runtime versions
│   ├── plugin-postgres/          # PostgreSQL service
│   ├── plugin-mysql/             # MariaDB service
│   ├── plugin-redis/             # Redis service
│   ├── plugin-adminer/           # Adminer DB portal
│   ├── plugin-rustdesk/          # RustDesk remote desktop
│   ├── plugin-screensaver/       # Screensaver
│   ├── plugin-xrdp/              # xrdp remote desktop
│   ├── plugin-openclaw/          # OpenClaw agent bridge
│   ├── plugin-project-node/      # Project type: Node.js
│   ├── plugin-project-nextjs/    # Project type: Next.js
│   ├── plugin-project-nuxt/      # Project type: Nuxt
│   ├── plugin-project-react-vite/# Project type: React+Vite
│   ├── plugin-project-php/       # Project type: PHP
│   ├── plugin-project-laravel/   # Project type: Laravel
│   ├── plugin-project-static/    # Project type: Static
│   ├── plugin-project-writing/   # Project type: Writing
│   ├── plugin-project-art/       # Project type: Art
│   └── plugin-project-production/# Project type: Production
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

## How It Works

Aionima gateways discover plugins from this repo at boot time. The marketplace directory is configured in `aionima.json`:

```json
{
  "marketplace": {
    "dir": "/opt/aionima-marketplace"
  }
}
```

The gateway's `discoverMarketplacePlugins()` scans `{dir}/plugins/plugin-*` for plugin manifests.

## Plugin Format

Each plugin is a directory containing:
- `package.json` with an `aionima` manifest field
- `src/index.ts` entry point exporting `activate(api)` and optionally `deactivate()`

```json
{
  "name": "@aionima/plugin-example",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "exports": { ".": "./src/index.ts" },
  "aionima": {
    "id": "example-plugin",
    "name": "Example Plugin",
    "description": "What this plugin does",
    "category": "tool",
    "permissions": [],
    "entry": "./src/index.ts",
    "aionimaVersion": ">=0.1.0"
  }
}
```

## Deployment

This repo is pulled alongside AGI, PRIME, and BOTS during deployment:
- Production: `/opt/aionima-marketplace`
- Dev mode: `/opt/aionima-marketplace_dev`

## Adding a Plugin

1. Create a directory under `plugins/plugin-{name}/`
2. Add `package.json` with the `aionima` manifest field
3. Add `src/index.ts` with the plugin entry point
4. Add an entry to `marketplace.json`
5. Submit a PR
