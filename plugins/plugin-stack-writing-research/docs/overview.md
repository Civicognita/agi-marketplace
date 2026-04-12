# Research Paper

Directory structure and workflow tooling for academic papers, theses, and research documents. Scaffolds the standard academic section structure and provides a `_wip` / `_proofed` two-stage workflow.

## What It Provides

- Scaffolded directory structure with pre-created section files
- Standard academic sections: Abstract, Introduction, Methodology, Results, Discussion, Conclusion, References
- Two-stage workflow: draft in `_wip/sections/`, promote finished sections to `_proofed/`
- Word count and section list tools
- Citation checker that flags `[TODO]`, `[REF]`, and `[citation needed]` markers
- Paper compiler (concatenates proofed sections into `_pub/paper.md`)

## Directory Layout

```
_wip/sections/         Draft sections (pre-scaffolded)
_proofed/sections/     Approved sections
mindmaps/              Concept maps as JSON files
_notes/research/       Source materials, PDFs, reference notes
_pub/                  Final output (PDF, LaTeX, paper.md)
```

## Pre-scaffolded Sections

On project creation, the following draft files are created:

```
01-abstract.md
02-introduction.md
03-methodology.md
04-results.md
05-discussion.md
06-conclusion.md
07-references.md
```

Add sub-sections by inserting files with letter suffixes: `03a-methodology-design.md`, `03b-methodology-data.md`.

## Workflow

1. Edit sections in `_wip/sections/`.
2. Use **Citation Check** to find unresolved `[TODO]` or `[REF]` markers.
3. When a section is ready, use **Move to Proofed**.
4. Use **Compile Paper** to merge all proofed sections into `_pub/paper.md`.

## Available Tools

| Tool | What It Does |
|------|-------------|
| Word Count | Total word count across all WIP sections |
| Section List | List each section with its word count |
| Citation Check | Find unresolved citation markers |
| Move to Proofed | Copy all WIP sections to `_proofed/` |
| Compile Paper | Merge proofed sections into `_pub/paper.md` |
