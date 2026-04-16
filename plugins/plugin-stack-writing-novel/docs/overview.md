# Novel

Directory structure and workflow tooling for writing a novel. Provides a scaffolded project layout with a `_wip` / `_proofed` two-stage workflow, character profiles, worldbuilding files, and mindmaps.

## What It Provides

- Scaffolded directory structure created on first use
- Two-stage workflow: write in `_wip/`, promote finished chapters to `_proofed/`
- Word count and chapter list tools
- Manuscript compiler (concatenates proofed chapters into `_pub/manuscript.md`)
- The Reader MApp serves content from `_proofed/`

## Directory Layout

```
_wip/chapters/         Active writing
_proofed/chapters/     Approved chapters
character_profiles/    One .md file per character
worldbuilding/         Settings, magic systems, geography
mindmaps/              JSON mindmap files
_notes/                Research materials, author bio
_pub/                  Compiled output (EPUB, PDF, manuscript)
```

## Workflow

1. Write in `_wip/chapters/`. Name files with a numeric prefix: `01-the-beginning.md`, `02-the-journey.md`.
2. When a chapter is ready, use **Move to Proofed** to copy it to `_proofed/chapters/`.
3. Use **Compile Manuscript** to merge all proofed chapters into `_pub/manuscript.md`.

## Character Profiles

Create one `.md` file per character in `character_profiles/`. Use snake_case naming: `frodo_baggins.md`. Include Role, Age, Description, Background, Personality, and Arc sections.

## Available Tools

| Tool | What It Does |
|------|-------------|
| Word Count | Total word count across all WIP chapters |
| Chapter List | List each chapter with its word count |
| Move to Proofed | Copy all WIP chapters to `_proofed/` |
| Compile Manuscript | Merge proofed chapters into `_pub/manuscript.md` |
