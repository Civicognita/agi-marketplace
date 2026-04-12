# Python Runtime

## Overview

Provides managed Python container runtimes for Aionima-hosted projects. Includes system libraries for database drivers and image processing so common packages install without extra system deps.

## Available Versions

| Version | Image | Status |
|---------|-------|--------|
| 3.13 | `ghcr.io/civicognita/python:3.13` | Latest |
| 3.12 | `ghcr.io/civicognita/python:3.12` | Stable |
| 3.11 | `ghcr.io/civicognita/python:3.11` | Previous |

## Pre-installed Tools

- `pip` — package installer, available globally
- `build-essential` — compilers for packages with C extensions
- `libpq-dev` — headers for `psycopg2` and other PostgreSQL drivers
- Image libs — `libjpeg`, `zlib`, `libpng` for `Pillow` and similar packages

## Usage

1. Open **Settings > Python** to set the default version for new projects.
2. Per-project override: open the project's hosting panel and select a version from the Runtime dropdown.
3. Port `8000` is exposed by default. Frameworks like Django and FastAPI bind here out of the box.

## Container Image

```
ghcr.io/civicognita/python:{version}
```

Based on the official Python slim image. Adds build-essential, libpq-dev, and image processing libraries so `pip install psycopg2 Pillow` succeeds without a custom Dockerfile.
