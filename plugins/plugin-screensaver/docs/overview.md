# Screensaver

## Overview

Dashboard screensaver with drifting panels, system stats, and sparkle effects. Integrates with `xss-lock` to activate automatically after a configurable idle period on X11 displays. Three built-in visual designs are available, and a custom Electron app path can be substituted.

## Designs

| Design | Description |
|--------|-------------|
| `hud-bar` | Horizontal stats bar with ring charts (default) |
| `orbital` | Logo centered with orbiting stat satellites |
| `matrix` | Digital rain with monospace stats overlay |

## Setup

1. Install this plugin from the Plugin Marketplace.
2. Open **Settings > Screensaver**.
3. Enable the screensaver, set the idle timeout, and choose a design.
4. The plugin auto-starts `xss-lock` on activation.

## Configuration

| Field | Default | Description |
|-------|---------|-------------|
| `enabled` | true | Register with xss-lock on startup |
| `idleSeconds` | 180 | Seconds of inactivity before activation |
| `speed` | normal | Drift speed: `slow`, `normal`, `fast` |
| `design` | hud-bar | Visual design |
| `customPath` | — | Path to a custom Electron screensaver app |

## Actions

- **Preview Screensaver** — launch immediately for testing (bypasses idle timer)
- **Restart xss-lock** — stop and restart the idle detection daemon

## Requirements

- `xss-lock` must be installed: `sudo apt install xss-lock`
- `xset` is used to set the idle timeout; install via `sudo apt install x11-xserver-utils`
- An active X11 display is required; Wayland sessions are not supported

## Notes

- The plugin auto-detects the active `DISPLAY` from running graphical sessions (gnome-shell, plasmashell, xfce4-session).
- Config changes (idle timeout, design, speed) automatically restart xss-lock to apply.
- `xss-lock` is stopped cleanly on gateway shutdown.
