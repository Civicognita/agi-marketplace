# Adminer

Provides a lightweight database management UI accessible from the Aionima DB portal. Adminer runs as a container and is proxied through the gateway at `/db-portal`.

## Supported Databases

- PostgreSQL
- MariaDB / MySQL
- SQLite

## Accessing Adminer

Once the plugin is installed and the Adminer service is running, open the **DB Portal** from the Aionima sidebar. Adminer appears as a registered tool in the portal.

You can also navigate directly to `/adminer/` in the Aionima gateway URL.

## Connecting to a Database

When the Adminer login screen loads:

1. Select the database system (PostgreSQL, MySQL, SQLite).
2. For **Server**, use `host.containers.internal` to reach databases running in other Aionima containers.
3. Enter the username and password. Default credentials for Aionima-managed databases are shown on each project's stack card.

## Theme

Adminer uses the **Dracula** theme by default.

## Settings

Enable or disable the Adminer service at **Settings > Adminer**. The service control panel shows container status and lets you start or stop Adminer without removing it.

## Notes

- Adminer is a general-purpose tool — it connects to any reachable database, not just Aionima-managed ones.
- For production databases, avoid leaving Adminer running unless actively needed.
