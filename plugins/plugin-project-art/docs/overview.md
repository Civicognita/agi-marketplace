# Art Project Type

## Overview

Project type for art and media collections — illustrations, photography, video, and mixed-media assets. Marked as hostable; when hosted it is served by the **Gallery** MApp, which provides a responsive grid with a lightbox viewer.

## Details

| Property | Value |
|----------|-------|
| ID | `art` |
| Category | media |
| Hostable | Yes |
| Default mode | production |
| Viewer MApp | plugin-reader-media |

## Built-in Tools

| Tool | Description |
|------|-------------|
| Asset Gallery | Browse project assets in the dashboard |
| Export | Export assets for production delivery |

## Usage

1. Create a new project and select **Art Project** as the project type.
2. Add image and video files to the project directory.
3. Open the **Hosting** panel to enable the Gallery MApp and get a shareable `<hostname>.ai.on` URL.

## Notes

- The Gallery MApp must be installed from the Plugin Marketplace to enable hosted viewing.
- Supported file types: `.jpg`, `.png`, `.gif`, `.mp4`, `.webm` (and any other files nginx can serve).
- The gallery is read-only at serve time — the source files remain in your project directory.
