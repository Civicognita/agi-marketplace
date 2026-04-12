# Web App Project Type

## Overview

Project type for full-stack and frontend web applications. Marked as hostable — projects of this type can be deployed via the Aionima hosting panel and served on a `*.ai.on` subdomain.

## Details

| Property | Value |
|----------|-------|
| ID | `web-app` |
| Category | web |
| Hostable | Yes |
| Default mode | development |

## Usage

1. Create a new project in the dashboard.
2. Select **Web App** as the project type.
3. Develop locally; when ready, open the project's **Hosting** panel to configure a port and deploy.

## Hosting

- Set the **internal port** your app listens on in the hosting panel.
- Aionima routes traffic from `<hostname>.ai.on` to that port via reverse proxy.
- Supported stacks include any Node.js, Python, Go, PHP, or Rust app — pair with the matching runtime plugin.

## Notes

- This project type is used by many stacks (Next.js, Remix, Nuxt, Hono, etc.). The stack plugin adds language-specific tooling on top.
- For apps that produce only static output, use the **Static Site** project type instead.
