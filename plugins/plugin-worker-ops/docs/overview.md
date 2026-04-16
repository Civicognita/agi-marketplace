# Operations Workers

## Overview

Operations domain workers for deployment, maintenance, synchronization, and reporting tasks. Provides four workers covering the full ops lifecycle. This plugin is baked in and cannot be disabled.

## Workers

| Worker ID | Name | Role |
|-----------|------|------|
| `ops.deployer` | Deployer | Executes deployments — git pulls, build steps, service restarts, health checks |
| `ops.custodian` | Custodian | Maintenance work — log rotation, cleanup, dependency updates, disk space management |
| `ops.syncer` | Syncer | Synchronization tasks — keeps environments, repos, or data sources in alignment |
| `ops.reporter` | Reporter | Generates operational reports — status summaries, metrics, diff reports |

## Dispatch Keywords

`deploy`, `deployment`, `restart`, `rollback`, `cleanup`, `maintenance`, `sync`, `synchronize`, `update dependencies`, `report`, `status`, `health check`

## Permissions

`filesystem.read`, `filesystem.write`, `shell.exec`

## Notes

- `ops.deployer` respects the project's deploy conventions — it reads existing deploy scripts and follows them rather than inventing new procedures.
- `ops.custodian` does not delete files without listing them in its handoff output first, making cleanup auditable.
- `ops.reporter` produces structured output suitable for feeding into `comm.writer.tech` for formal reporting.
