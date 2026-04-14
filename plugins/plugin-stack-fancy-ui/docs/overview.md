# Fancy UI Stack — Overview

A curated bundle of four `@particle-academy/*` packages for building React app UIs on Tailwind v4.

| Package | Purpose |
|---------|---------|
| `@particle-academy/react-fancy` | Components, hooks, and the `<Icon>` / `Action` / `Modal` / `Toast` primitives |
| `@particle-academy/fancy-code` | Embedded `CodeEditor` with custom tokenizer (no Monaco / CodeMirror) |
| `@particle-academy/fancy-sheets` | Full `Spreadsheet` with 80+ formulas, multi-sheet workbooks, CSV import/export |
| `@particle-academy/react-echarts` | Apache ECharts wrapper with 20 typed chart sub-components + 3D + graphic API |

## Docs audited against

These guides were verified against the published npm versions listed below. If `npm view <pkg> version` returns higher numbers, the packages' own `docs/` folders are the source of truth — re-audit these guides when that happens.

| Package | Verified version |
|---------|------------------|
| `@particle-academy/react-fancy` | `2.2.1` |
| `@particle-academy/fancy-code` | `0.4.3` |
| `@particle-academy/fancy-sheets` | `0.4.6` |
| `@particle-academy/react-echarts` | `1.1.1` |

## Install

```bash
npm install @particle-academy/react-fancy @particle-academy/fancy-code @particle-academy/fancy-sheets @particle-academy/react-echarts echarts
```

`echarts` is a peer dependency of `react-echarts` (>=5.5). Add `echarts-gl` if you plan to use 3D charts.

`react >= 18` and `tailwindcss >= 4` are peer dependencies of `react-fancy`. `fancy-code` and `fancy-sheets` both peer-depend on `@particle-academy/react-fancy >= 1.5`.

## Tailwind v4 setup

Tailwind v4 uses a CSS-first config. In your main stylesheet:

```css
@import "tailwindcss";

@import "@particle-academy/react-fancy/styles.css";
@import "@particle-academy/fancy-code/styles.css";
@import "@particle-academy/fancy-sheets/styles.css";

@source "../node_modules/@particle-academy/react-fancy/dist/**/*.js";
@source "../node_modules/@particle-academy/fancy-code/dist/**/*.js";
@source "../node_modules/@particle-academy/fancy-sheets/dist/**/*.js";
```

The `@source` directives tell Tailwind to scan the installed package JS for class names so unused utilities don't get purged.

## App-entry setup

Two things should run once at app startup — typically at the top of `main.tsx` or in a `setup.ts` module imported from it.

### Register icons (tree-shakeable)

`react-fancy`'s `<Icon name="...">` resolves names from a registered icon set. Register the icons you use:

```tsx
import { registerIcons } from "@particle-academy/react-fancy";
import { Home, Settings, Mail, Search, Plus, Trash2 } from "lucide-react";

registerIcons({ Home, Settings, Mail, Search, Plus, Trash2 });
```

The default set is `"lucide"` and resolves kebab-case names (e.g. `name="trash-2"` → the `Trash2` component). Only icons you import end up in the bundle.

### Register ECharts

Call `registerAll()` for development or selectively register for production:

```tsx
import { registerAll } from "@particle-academy/react-echarts";
registerAll();
```

For tree-shaken production builds, use `registerCharts` / `registerComponents` — see [react-echarts.md](./react-echarts.md).

## Dark mode

`react-fancy` uses Tailwind's `dark:` class strategy. The library's `Portal` component auto-propagates the `dark` class (or `data-theme="dark"` on `<html>`) into portaled content (modals, dropdowns, tooltips, toasts).

`fancy-code` and `react-echarts` auto-detect `prefers-color-scheme: dark` when `theme` is omitted. Pass an explicit `theme` prop to opt out.

## The stack at a glance

- **Do use:** `Action`, `Modal`, `Icon` (+ `registerIcons`), `CodeEditor`, `Spreadsheet`, `EChart` and the `EChart.<Type>` sub-components.
- **Don't use:** `Button`, `Dialog`, `FancyCode`, `FancySheets`, `PageScroll` — none of these exist. Don't pull in Material UI, Chakra, Ant Design, shadcn/ui, Chart.js, or Recharts alongside this stack.

## Per-package reference

- [react-fancy.md](./react-fancy.md) — Action, Modal, Icon, Sidebar, MobileMenu, MultiSwitch, Badge, Card, Input, Toast, `cn()`
- [fancy-code.md](./fancy-code.md) — `CodeEditor` + `Toolbar` / `Panel` / `StatusBar`, `useCodeEditor`, languages, themes
- [fancy-sheets.md](./fancy-sheets.md) — `Spreadsheet` + `Toolbar` / `Grid` / `SheetTabs`, `useSpreadsheet`, formulas, CSV helpers
- [react-echarts.md](./react-echarts.md) — `EChart` base + 20 typed series sub-components, theme presets, `EChart3D`, `EChartGraphic`
