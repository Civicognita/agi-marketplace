# Reader (Literature MApp)

## Overview

E-reader MApp for **Writing** projects. Serves project content as a book-style reading experience on a `*.ai.on` subdomain. An nginx Alpine container mounts the project directory read-only and presents Markdown files in a clean, paginated layout.

## Details

| Property | Value |
|----------|-------|
| MApp ID | `reader` |
| Category | reader |
| Container | `nginx:alpine` |
| Internal port | 80 |
| Compatible project types | `writing`, category `literature` |

## How It Works

1. Install this plugin from the Plugin Marketplace.
2. Open a **Writing Project** and go to the **Hosting** panel.
3. Enable hosting — the Reader MApp starts an nginx container that mounts the project directory.
4. The project is accessible at `https://<hostname>.ai.on` with book-style navigation.

## Built-in Tools

| Tool | Description |
|------|-------------|
| Word Count | Counts words across all `.md` and `.txt` files in the project |

## Agent Prompts

- **Writing Assistant** — context-aware AI assistance for writing and editing prose within the reader context.

## Notes

- Project files are mounted read-only into the container; the MApp cannot modify source content.
- The dashboard panel includes a live status display and an iframe preview of the reader.
