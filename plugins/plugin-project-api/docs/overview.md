# API Service Project Type

## Overview

Project type for backend API services and microservices. Marked as hostable — projects of this type can be deployed and exposed on a `*.ai.on` subdomain.

## Details

| Property | Value |
|----------|-------|
| ID | `api-service` |
| Category | app |
| Hostable | Yes |
| Default mode | development |

## Usage

1. Create a new project and select **API Service** as the project type.
2. Build your API using any language or framework — pair with the matching runtime plugin (Node.js, Python, Go, Rust).
3. Open the **Hosting** panel, set the internal port, and deploy.

## Hosting

- Traffic on `<hostname>.ai.on` is proxied to the configured internal port.
- Suitable for REST, GraphQL, tRPC, or gRPC services.
- For services that are only consumed internally (not exposed publicly), leave hosting disabled.

## Notes

- Use this type for standalone API backends. For full-stack apps that serve both an API and a frontend, use the **Web App** project type.
- Stack plugins (Hono, FastAPI, Flask, Go App, Rust App) use this project type as their base.
