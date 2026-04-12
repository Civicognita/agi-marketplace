# Governance Workers

## Overview

Governance domain workers for compliance auditing and archival. Provides two workers — an auditor that verifies governance structures and a follow-on archivist that records findings. This plugin is baked in and cannot be disabled.

## Workers

| Worker ID | Name | Role |
|-----------|------|------|
| `gov.auditor` | Auditor | Compliance and verification — audits COA chains, verifies seals, checks policy compliance, validates governance structures |
| `gov.archivist` | Archivist | Archival and record-keeping — stores audit findings, maintains compliance records, creates audit trails |

## Enforced Chain

```
gov.auditor → gov.archivist (automatic)
```

When `gov.auditor` completes, the system automatically spawns `gov.archivist` to record and preserve the audit findings.

## Audit Severity Levels

| Level | Meaning |
|-------|---------|
| `critical` | Security violation or broken accountability chain |
| `high` | Policy violation — must remediate |
| `medium` | Compliance gap — should address |
| `low` | Best practice deviation |
| `info` | Observation only |

## Dispatch Keywords

`audit`, `compliance`, `COA`, `seal`, `verify`, `governance`, `policy check`, `accountability`, `archive`, `record`

## Permissions

`filesystem.read` (auditor), `filesystem.read`, `filesystem.write` (archivist)

## Notes

- `gov.auditor` is read-only — it never modifies files, only reads and reports.
- All findings must reference evidence; the auditor does not issue conclusions without traceability.
