# Gallery (Media MApp)

## Overview

Gallery MApp for **Art** projects. Presents images and videos in a responsive grid with a lightbox viewer on a `*.ai.on` subdomain. An nginx Alpine container mounts the project directory read-only and serves media files directly.

## Details

| Property | Value |
|----------|-------|
| MApp ID | `gallery` |
| Category | gallery |
| Container | `nginx:alpine` |
| Internal port | 80 |
| Compatible project types | `art`, category `media` |

## How It Works

1. Install this plugin from the Plugin Marketplace.
2. Open an **Art Project** and go to the **Hosting** panel.
3. Enable hosting — the Gallery MApp starts an nginx container that mounts the project directory.
4. The gallery is accessible at `https://<hostname>.ai.on` with responsive grid and lightbox.

## Supported Media Types

- Images: `.jpg`, `.png`, `.gif`, `.webp`, `.svg`
- Video: `.mp4`, `.webm`
- Any other file nginx can serve statically

## Built-in Tools

| Tool | Description |
|------|-------------|
| Asset Count | Counts all image and video files in the project |

## Agent Prompts

- **Art Assistant** — context-aware AI assistance for organizing and managing media assets.

## Notes

- Media files are mounted read-only; the MApp cannot modify source assets.
- The dashboard panel includes a live status display and an iframe preview of the gallery.
