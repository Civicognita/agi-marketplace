# Monorepo Project Type

## Overview

Project type for monorepos — single repositories that contain multiple packages, apps, or services. Not hostable as a single unit; individual packages within the monorepo are hosted separately via their own project types or stack plugins.

## Details

| Property | Value |
|----------|-------|
| ID | `monorepo` |
| Category | monorepo |
| Hostable | No |
| Default mode | development |

## Usage

1. Create a new project and select **Monorepo** as the project type.
2. Structure packages in the standard monorepo layout (e.g. `packages/`, `apps/`).
3. Use the package manager workspace features (pnpm workspaces, npm workspaces, Turborepo, Nx) as normal.

## Notes

- This project type is used for the Aionima AGI repo itself, as well as any user monorepos.
- Hosting is not supported at the monorepo level. To host an individual app or package, expose it as a separate project.
- Worker agents can operate across a monorepo normally — scope files to the relevant package when dispatching.
