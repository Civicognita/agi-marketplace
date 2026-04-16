# MySQL / MariaDB

Provides MariaDB database service for Aionima projects. Runs as a shared container — one MariaDB instance serves all projects that add it as a stack, with each project getting its own isolated database and credentials.

## Versions

| Version | Image | Status |
|---------|-------|--------|
| 11.4 | `ghcr.io/civicognita/mariadb:11.4` | Latest LTS |
| 10.11 | `ghcr.io/civicognita/mariadb:10.11` | Previous LTS |
| 10.6 | `ghcr.io/civicognita/mariadb:10.6` | Maintenance LTS |

## Adding to a Project

1. Open the project in Aionima.
2. Go to the **Development** tab.
3. Under **Database**, select a MariaDB version.
4. The connection URL appears on the stack card once the container is running.

## Connection

Each project receives a dedicated database and user. The connection URL follows this format:

```
mysql://{user}:{password}@localhost:3306/{database}
```

The exact URL is shown on the stack card. Use it directly in your `.env` file or application config.

## Settings

Manage container images and default credentials at **Settings > MySQL / MariaDB**. The default root password, database name, and port can be changed here. Changes apply to new instances only.

## Tools

- **mysql** — Opens an interactive MariaDB shell for the project's database.
