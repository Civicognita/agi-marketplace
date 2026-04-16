# Ops Project Type

## Overview

Project type for operations repositories — infrastructure code, scripts, configuration management, deployment automation, and system administration work. Not hostable; ops projects run tools and scripts rather than serving HTTP traffic.

## Details

| Property | Value |
|----------|-------|
| ID | `ops` |
| Category | ops |
| Hostable | No |
| Default mode | production |

## Usage

1. Create a new project and select **Ops** as the project type.
2. Store infrastructure code, shell scripts, Ansible playbooks, Terraform configs, or CI/CD pipelines.
3. Use worker agents (especially `ops.deployer`, `ops.custodian`, `ops.syncer`) to automate routine operations.

## Notes

- This project type is intentionally minimal — it provides a category marker so the dashboard and agents can identify ops work correctly.
- Because ops projects are not hostable, no port or container configuration is required.
- Suitable for server configuration repos, backup scripts, cron job collections, and deployment toolchains.
