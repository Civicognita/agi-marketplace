# PostgreSQL

Provides PostgreSQL database service for Aionima projects. Runs as a shared container — one PostgreSQL instance serves all projects that add it as a stack, with each project getting its own isolated database and credentials.

## Versions

| Version | Image | Status |
|---------|-------|--------|
| 17 | `ghcr.io/civicognita/postgres:17` | Latest stable |
| 16 | `ghcr.io/civicognita/postgres:16` | Previous stable |
| 15 | `ghcr.io/civicognita/postgres:15` | Maintenance |

## Pre-installed Extensions

All images include: `pgvector`, `PostGIS`, `pg_trgm`, `uuid-ossp`, `hstore`.

## Adding to a Project

1. Open the project in Aionima.
2. Go to the **Development** tab.
3. Under **Database**, select a PostgreSQL version.
4. The connection URL appears on the stack card once the container is running.

## Connection

Each project receives a dedicated database and user. The connection URL follows this format:

```
postgresql://{user}:{password}@localhost:5432/{database}
```

The exact URL is shown on the stack card. Use it directly in your `.env` file or application config.

## Settings

Manage container images and default credentials at **Settings > PostgreSQL**. The default root password, database name, and port can be changed here. Changes apply to new instances only.

## Tools

- **psql** — Opens an interactive PostgreSQL shell for the project's database.
