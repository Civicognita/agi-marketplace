# Communication Workers

## Overview

Communication domain workers for writing and editing tasks. Provides three workers covering technical documentation, policy writing, and editorial review. This plugin is baked in and cannot be disabled.

## Workers

| Worker ID | Name | Role |
|-----------|------|------|
| `comm.writer.tech` | Technical Writer | Writes API docs, README files, JSDoc, code comments, and technical guides |
| `comm.writer.policy` | Policy Writer | Writes governance policies, compliance documents, terms, and procedures |
| `comm.editor` | Editor | Reviews and edits documents produced by writer workers — checks clarity, accuracy, and style |

## Enforced Chain

```
comm.writer.tech → comm.editor (automatic)
comm.writer.policy → comm.editor (automatic)
```

When any writer worker completes, the system automatically spawns `comm.editor` to review the output.

## Dispatch Keywords

`documentation`, `docs`, `README`, `API docs`, `JSDoc`, `technical writing`, `guide`, `how-to`, `policy`, `governance`, `compliance`, `terms`, `procedure`

## Permissions

`filesystem.read`, `filesystem.write`

## Notes

- Writer workers do not modify implementation code — they write documentation only.
- `comm.editor` checks the writer's output for clarity, accuracy, consistency, and style before the chain completes.
- Technical vs. policy writer selection is automatic based on dispatch keywords.
