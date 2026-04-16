# Go Runtime

## Overview

Provides managed Go container runtimes for Aionima-hosted projects. Includes CGO dependencies and CA certificates so projects with C bindings and HTTPS outbound calls work without extra configuration.

## Available Versions

| Version | Image | Status |
|---------|-------|--------|
| 1.24 | `ghcr.io/civicognita/go:1.24` | Latest |
| 1.23 | `ghcr.io/civicognita/go:1.23` | Stable |
| 1.22 | `ghcr.io/civicognita/go:1.22` | Previous |

## Pre-installed Tools

- `git` — required by `go get` for VCS-based module fetching
- `gcc`, `musl-dev` — CGO toolchain for packages that link C libraries
- `ca-certificates` — trusted root certs for TLS outbound connections

## Usage

1. Open **Settings > Go** to set the default version for new projects.
2. Per-project override: open the project's hosting panel and select a version from the Runtime dropdown.
3. Port `8080` is exposed by default. Set `PORT=8080` or configure your app to match.

## Container Image

```
ghcr.io/civicognita/go:{version}
```

Based on the official Go Alpine image. Adds git, gcc, musl-dev, and ca-certificates so CGO-enabled projects and modules fetched from private VCS hosts build correctly.
