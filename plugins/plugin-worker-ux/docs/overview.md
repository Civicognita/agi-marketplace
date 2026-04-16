# UX Workers

## Overview

UX domain workers for interface design tasks. Provides two workers — one for web UI design and one for command-line interface design. This plugin is baked in and cannot be disabled.

## Workers

| Worker ID | Name | Role |
|-----------|------|------|
| `ux.designer.web` | Web Designer | Designs web interfaces — component layouts, user flows, visual hierarchy, accessibility considerations |
| `ux.designer.cli` | CLI Designer | Designs command-line interfaces — command structures, flags, help text, output formatting |

## Dispatch Keywords

`design`, `UI`, `UX`, `layout`, `component`, `interface`, `user flow`, `accessibility`, `CLI`, `command`, `flags`, `help text`

## Permissions

`filesystem.read`, `filesystem.write`

## Notes

- `ux.designer.web` produces design specs, wireframe descriptions, and component structure recommendations — it does not write implementation code. Pair with `code.hacker` to turn specs into code.
- `ux.designer.cli` designs command syntax and help documentation, following the conventions of the project's existing CLI (Commander.js, yargs, cobra, etc.).
- Both workers analyze existing patterns in the codebase before producing output.
