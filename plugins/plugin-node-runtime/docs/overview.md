# Node.js Runtime

## Overview

Provides managed Node.js container runtimes for Aionima-hosted projects. Installs a custom GHCR image with build tooling pre-baked so projects start without an extra setup layer.

## Available Versions

| Version | Image | Status |
|---------|-------|--------|
| 24 | `ghcr.io/civicognita/node:24` | Latest |
| 22 | `ghcr.io/civicognita/node:22` | LTS |
| 20 | `ghcr.io/civicognita/node:20` | Maintenance |

## Pre-installed Tools

- `python3`, `make`, `g++` — native addon build toolchain
- `git` — source operations inside the container
- `corepack` — enables `pnpm` and `yarn` without a separate install step

## Usage

1. Open **Settings > Node.js** to set the default version for new projects.
2. Per-project override: open the project's hosting panel and select a version from the Runtime dropdown.
3. Port `3000` is exposed by default. Map it in the hosting panel if your app listens elsewhere.

## Container Image

```
ghcr.io/civicognita/node:{version}
```

Based on the official Node.js Debian slim image. Adds build-essential, python3, git, and corepack so native modules (bcrypt, sharp, canvas) compile without extra Dockerfiles.
