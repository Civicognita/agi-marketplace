# Rust Runtime

## Overview

Provides managed Rust container runtimes for Aionima-hosted projects. Includes OpenSSL headers and pkg-config so crates like `reqwest` and `sqlx` build without extra system setup.

## Available Versions

| Version | Image | Status |
|---------|-------|--------|
| 1.87 | `ghcr.io/civicognita/rust:1.87` | Latest |
| 1.86 | `ghcr.io/civicognita/rust:1.86` | Previous |

## Pre-installed Tools

- `build-essential` — linker and C toolchain required by `cc` crate
- `pkg-config` — lets `cargo` locate system libraries at build time
- `libssl-dev` — OpenSSL headers for TLS-dependent crates (`reqwest`, `hyper`, `tokio-tls`)
- `git` — used by Cargo for git-sourced dependencies

## Usage

1. Open **Settings > Rust** to set the default version for new projects.
2. Per-project override: open the project's hosting panel and select a version from the Runtime dropdown.
3. Port `8080` is exposed by default. Bind your server to `0.0.0.0:8080` or adjust in the hosting panel.

## Container Image

```
ghcr.io/civicognita/rust:{version}
```

Based on the official Rust slim image. Adds build-essential, pkg-config, libssl-dev, and git so the majority of crates.io packages with system dependencies compile without a custom Dockerfile.
