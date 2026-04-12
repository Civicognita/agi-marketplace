# Screenplay

Directory structure and workflow tooling for writing screenplays and scripts. Provides a scaffolded project layout with a `_wip` / `_proofed` two-stage workflow, scene files, character profiles, and act structure support.

## What It Provides

- Scaffolded directory structure created on first use
- Two-stage workflow: write in `_wip/scenes/`, promote finished scenes to `_proofed/`
- Word count and scene list tools
- Standard screenplay scene format in Markdown

## Directory Layout

```
_wip/scenes/           Active writing
_proofed/scenes/       Approved scenes
character_profiles/    One .md file per character
worldbuilding/         Settings and location details
_notes/                Research, planning, author bio
_pub/                  Final output (Fountain, PDF)
```

## Workflow

1. Write in `_wip/scenes/`. Name files with act and scene numbers: `act1-scene01.md`, `act2-scene05.md`.
2. When a scene is ready, use **Move to Proofed** to copy it to `_proofed/scenes/`.

## Scene File Format

Use Markdown headings to mark scene locations and times, then write action lines and dialogue below:

```
# INT. LOCATION - TIME

Action description.

CHARACTER
(parenthetical)
Dialogue line.
```

## Act Structure

Organise scenes using the filename prefix. Three-act structure example:
- `act1-scene01.md` through `act1-scene08.md`
- `act2-scene01.md` through `act2-scene16.md`
- `act3-scene01.md` through `act3-scene08.md`

## Available Tools

| Tool | What It Does |
|------|-------------|
| Word Count | Total word count across all WIP scenes |
| Scene List | List each scene with its word count |
| Move to Proofed | Copy all WIP scenes to `_proofed/` |
