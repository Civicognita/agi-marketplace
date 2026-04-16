# Redis

Provides Redis in-memory data store service for Aionima projects. Runs as a shared container — one Redis instance serves all projects. Persistence is enabled by default using append-only file (AOF) mode. The eviction policy is LRU, making it suitable for caching use cases.

## Versions

| Version | Image | Status |
|---------|-------|--------|
| 7.4 | `ghcr.io/civicognita/redis:7.4` | Latest stable |
| 7.2 | `ghcr.io/civicognita/redis:7.2` | Previous stable |
| 6.2 | `ghcr.io/civicognita/redis:6.2` | LTS |

## Adding to a Project

1. Open the project in Aionima.
2. Go to the **Development** tab.
3. Under **Cache**, select a Redis version.
4. The connection details appear on the stack card once the container is running.

## Connection

All projects share the same Redis instance. Connect using:

```
redis://localhost:6379
```

Because the instance is shared, use key prefixes to namespace your project's data and avoid collisions with other projects. For example, prefix all keys with your project name: `myproject:session:abc123`.

## Persistence

The container starts Redis with `--appendonly yes`. Data survives container restarts. The AOF file is stored in a named volume (`aionima-redis-{version}-data`).

## Settings

Manage container images at **Settings > Redis**.

## Tools

- **redis-cli** — Opens an interactive Redis CLI connected to the shared instance.
