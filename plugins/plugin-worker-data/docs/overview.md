# Data Workers

## Overview

Data domain workers for schema design and database migration tasks. Provides two workers — a modeler that designs schemas and a migrator that generates migration scripts. This plugin is baked in and cannot be disabled.

## Workers

| Worker ID | Name | Role |
|-----------|------|------|
| `data.modeler` | Data Modeler | Schema design and entity relationship modeling — creates data models, JSON schemas, and ERDs. Always followed by `k.linguist` |
| `data.migrator` | Data Migrator | Migration script generation — writes safe, reversible database migrations based on schema diffs |

## Enforced Chain

```
data.modeler → k.linguist (automatic)
```

When `data.modeler` completes, the system automatically spawns `k.linguist` to update the project glossary with new entity and field terminology defined in the schema.

## Dispatch Keywords

`schema`, `data model`, `entity`, `relationship`, `ERD`, `database design`, `migration`, `JSON schema`, `SQL`, `data structure`, `migrate`

## Permissions

`filesystem.read`, `filesystem.write`

## Notes

- `data.modeler` follows existing schema conventions in the project (naming style, file location, versioning pattern) before creating new schemas.
- `data.migrator` generates migrations with both `up` and `down` paths by default, keeping rollbacks possible.
- The modeler's handoff includes a `terms_for_glossary` list explicitly for `k.linguist` to consume.
