# @particle-academy/react-fancy

React UI component library (React port of the fancy-flux Blade/Livewire library). Ships 60+ components plus hooks. Verified against **v2.2.1**.

This guide covers the subset most often used when building Aionima plugins. The full per-component reference lives inside the installed package at `node_modules/@particle-academy/react-fancy/docs/`.

## Setup

See [overview.md](./overview.md) for the full stack setup. The minimum is:

```css
@import "tailwindcss";
@import "@particle-academy/react-fancy/styles.css";
@source "../node_modules/@particle-academy/react-fancy/dist/**/*.js";
```

And at app entry, register the icons you use:

```tsx
import { registerIcons } from "@particle-academy/react-fancy";
import { Home, Settings, Search, Trash2 } from "lucide-react";

registerIcons({ Home, Settings, Search, Trash2 });
```

Icons are referenced by kebab-case name from then on: `<Icon name="trash-2" />`.

---

## Action (the button component)

`Action` replaces the conventional `Button`. It supports icons, emojis, avatars, badges, loading states, and color variants.

```tsx
import { Action } from "@particle-academy/react-fancy";

<Action>Click me</Action>
<Action icon="pencil" color="blue" size="lg">Edit</Action>
<Action variant="circle" icon="plus" color="emerald" />
<Action variant="ghost" color="red" icon="trash-2">Delete</Action>
<Action loading badge="3" badgeTrailing>Messages</Action>
<Action href="/docs" iconTrailing="arrow-right">Read docs</Action>
```

| Prop | Type | Default |
|------|------|---------|
| `variant` | `"default" \| "circle" \| "ghost"` | `"default"` |
| `color` | `"blue" \| "emerald" \| "amber" \| "red" \| "violet" \| "indigo" \| "sky" \| "rose" \| "orange" \| "zinc"` | — |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` | `"md"` |
| `icon` / `iconTrailing` | `string` (icon slug) | — |
| `iconPlace` | `"left" \| "right" \| "top" \| "bottom"` (+ compound like `"top left"`) | `"left"` |
| `emoji` / `emojiTrailing` | `string` (emoji slug) | — |
| `avatar` / `avatarTrailing` | `string` (image URL) | — |
| `badge` / `badgeTrailing` | `string` | — |
| `active` / `checked` / `warn` / `alert` | `boolean` | — |
| `loading` | `boolean` | `false` |
| `disabled` | `boolean` | — |
| `href` | `string` (renders as `<a>`) | — |

Also accepts all native `<button>` attributes except `color`.

---

## Icon

```tsx
import { Icon } from "@particle-academy/react-fancy";

<Icon name="home" size="sm" />
<Icon name="arrow-right" size="md" />
<Icon name="star" size="xl" />
```

| Prop | Type | Default |
|------|------|---------|
| `name` | `string` (kebab-case of the registered icon) | — |
| `size` | `"xs" \| "sm" \| "md" \| "lg" \| "xl"` (12 / 16 / 20 / 24 / 32 px) | `"md"` |
| `iconSet` | `string` (registered set name) | configured default |

To use a custom icon set alongside Lucide, register it at app entry:

```tsx
import { registerIconSet } from "@particle-academy/react-fancy";

registerIconSet("custom", {
  resolve: (name) => MyIconMap[name] ?? null,
});

// later:
<Icon name="logo" iconSet="custom" size="lg" />
```

---

## Modal (the dialog component)

`Modal` is the overlay dialog. Use it instead of building your own — it handles portal rendering, backdrop, focus trap, scroll lock, and escape-to-close.

```tsx
import { Modal, Action } from "@particle-academy/react-fancy";

const [open, setOpen] = useState(false);

<Action onClick={() => setOpen(true)}>Open</Action>

<Modal open={open} onClose={() => setOpen(false)} size="md">
  <Modal.Header>Confirm Action</Modal.Header>
  <Modal.Body>
    <p>Are you sure you want to proceed?</p>
  </Modal.Body>
  <Modal.Footer>
    <Action variant="ghost" onClick={() => setOpen(false)}>Cancel</Action>
    <Action color="red" onClick={handleConfirm}>Delete</Action>
  </Modal.Footer>
</Modal>
```

| Prop | Type | Default |
|------|------|---------|
| `open` | `boolean` | — |
| `onClose` | `() => void` | — |
| `size` | `"sm" \| "md" \| "lg" \| "xl" \| "full"` | `"md"` |

`Modal.Header`, `Modal.Body`, `Modal.Footer` each take `children` + `className`.

---

## Sidebar

Collapsible sidebar with icon-only / three-letter collapsed modes, groups, and nested submenus.

```tsx
import { Sidebar, Icon } from "@particle-academy/react-fancy";

<Sidebar defaultCollapsed={false} collapseMode="icons">
  <Sidebar.Item href="/" icon={<Icon name="home" size="sm" />} active>
    Dashboard
  </Sidebar.Item>
  <Sidebar.Group label="Projects">
    <Sidebar.Item href="/alpha">Alpha</Sidebar.Item>
    <Sidebar.Item href="/beta">Beta</Sidebar.Item>
  </Sidebar.Group>
  <Sidebar.Submenu label="Reports" icon={<Icon name="bar-chart-3" size="sm" />} defaultOpen>
    <Sidebar.Item>Monthly</Sidebar.Item>
    <Sidebar.Item>Yearly</Sidebar.Item>
  </Sidebar.Submenu>
  <Sidebar.Toggle />
</Sidebar>
```

**Sidebar:** `collapsed?`, `defaultCollapsed?`, `onCollapsedChange?`, `collapseMode?: "icons" | "letters"`, `className?`.

**Sidebar.Item:** `href?`, `icon?`, `active?`, `disabled?`, `badge?`, `onClick?`, `className?`.

**Sidebar.Group:** `label?`, `className?`.

**Sidebar.Submenu:** `label` (required), `icon?`, `defaultOpen?`, `className?`.

**Sidebar.Toggle:** `className?`.

Access collapsed state from any child:

```tsx
import { useSidebar } from "@particle-academy/react-fancy";
const { collapsed, setCollapsed } = useSidebar();
```

---

## MobileMenu

Two variants in one namespace: `Flyout` (slide-out panel) and `BottomBar` (fixed tab bar).

```tsx
import { MobileMenu, Icon } from "@particle-academy/react-fancy";

const [open, setOpen] = useState(false);

<MobileMenu.Flyout open={open} onClose={() => setOpen(false)} side="left" title="Menu">
  <MobileMenu.Item href="/" icon={<Icon name="home" />} active>Home</MobileMenu.Item>
  <MobileMenu.Item href="/about" icon={<Icon name="info" />}>About</MobileMenu.Item>
</MobileMenu.Flyout>

<MobileMenu.BottomBar>
  <MobileMenu.Item href="/" icon={<Icon name="home" />} active>Home</MobileMenu.Item>
  <MobileMenu.Item href="/search" icon={<Icon name="search" />}>Search</MobileMenu.Item>
  <MobileMenu.Item href="/profile" icon={<Icon name="user" />}>Profile</MobileMenu.Item>
</MobileMenu.BottomBar>
```

**MobileMenu.Flyout:** `open`, `onClose`, `side?: "left" | "right"`, `title?`, `className?`.

**MobileMenu.Item:** `href?`, `icon?`, `active?`, `disabled?`, `badge?`, `onClick?`, `className?`.

---

## MultiSwitch

Segmented control. `list` accepts plain strings or objects.

```tsx
import { MultiSwitch } from "@particle-academy/react-fancy";

// Strings
<MultiSwitch list={["Daily", "Weekly", "Monthly"]} defaultValue="Weekly" />

// Controlled with object options
const [interval, setInterval] = useState("monthly");

<MultiSwitch
  label="Billing interval"
  list={[
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ]}
  value={interval}
  onValueChange={setInterval}
/>

// Linear cycling (click any button advances to next)
<MultiSwitch linear list={["Off", "Low", "Medium", "High"]} defaultValue="Off" />
```

Key props: `list` (required), `value?`, `defaultValue?`, `onValueChange?`, `linear?`, `label?`, `description?`, `error?`, `size?`, `dirty?`, `disabled?`, `name?`.

---

## Badge

```tsx
import { Badge } from "@particle-academy/react-fancy";

<Badge>Default</Badge>
<Badge color="green" dot>Active</Badge>
<Badge color="red" variant="solid" size="sm">3 errors</Badge>
<Badge color="violet" variant="outline">Beta</Badge>
```

| Prop | Values | Default |
|------|--------|---------|
| `color` | `"zinc" \| "red" \| "blue" \| "green" \| "amber" \| "violet" \| "rose"` | `"zinc"` |
| `variant` | `"solid" \| "outline" \| "soft"` | `"soft"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `dot` | `boolean` | `false` |

Also extends all native `<span>` attributes.

---

## Card

```tsx
import { Card, Action } from "@particle-academy/react-fancy";

<Card variant="elevated" padding="lg">
  <Card.Header>
    <h3 className="font-semibold">Settings</h3>
  </Card.Header>
  <Card.Body>
    <p>Configure your preferences below.</p>
  </Card.Body>
  <Card.Footer>
    <Action>Save</Action>
  </Card.Footer>
</Card>
```

**Card:** `variant?: "outlined" | "elevated" | "flat"` (default `"outlined"`), `padding?: "none" | "sm" | "md" | "lg"` (default `"md"`).

**Card.Header / Card.Body / Card.Footer** — accept any `<div>` attributes.

---

## Input

Text input with built-in label, error, description, leading/trailing content, and affixes.

```tsx
import { Input, Icon } from "@particle-academy/react-fancy";

<Input
  label="Email"
  type="email"
  placeholder="you@example.com"
  leading={<Icon name="mail" size="sm" />}
/>

<Input prefix="https://" suffix=".com" placeholder="yoursite" />

// Controlled with onValueChange shortcut (skips e.target.value)
const [email, setEmail] = useState("");
<Input
  label="Email"
  type="email"
  value={email}
  onValueChange={setEmail}
  error={email ? undefined : "Required"}
/>
```

Relevant props: `type?`, `size?`, `label?`, `description?`, `error?`, `required?`, `dirty?`, `disabled?`, `leading?`, `trailing?`, `prefix?`, `suffix?`, `prefixPosition?: "inside" | "outside"`, `suffixPosition?: "inside" | "outside"`, `onValueChange?: (value: string) => void`, plus all native `<input>` attributes except `size`, `type`, `prefix`.

---

## Toast

```tsx
import { Toast, useToast, Action } from "@particle-academy/react-fancy";

// 1. Wrap your app once
function App() {
  return (
    <Toast.Provider position="bottom-right" maxToasts={5}>
      <YourApp />
    </Toast.Provider>
  );
}

// 2. Show toasts from anywhere
function SaveButton() {
  const { toast } = useToast();
  return (
    <Action
      onClick={() =>
        toast({
          title: "Saved",
          description: "Your changes have been saved.",
          variant: "success",
          duration: 4000,
        })
      }
    >
      Save
    </Action>
  );
}
```

**Toast.Provider** props: `position?: "top-right" | "top-left" | "bottom-right" | "bottom-left"` (default `"bottom-right"`), `maxToasts?: number` (default `5`).

**useToast()** returns `{ toasts, toast, dismiss }` where `toast({ title, description?, variant?, duration? })` returns the new toast's id and `dismiss(id)` removes it.

**Variants:** `"default" | "success" | "error" | "warning" | "info"`.

---

## cn() utility

Class-name merger: `clsx` + `tailwind-merge`.

```tsx
import { cn } from "@particle-academy/react-fancy";

cn("px-4 py-2", isActive && "bg-blue-500", className);
// → "px-4 py-2 bg-blue-500 ..."

cn("px-4 text-sm", "px-6");
// → "px-6 text-sm"   (tailwind-merge resolves the px conflict)
```

---

## What else is in the box

Only a slice of the library is deep-documented above. Everything else is documented inside the installed package (`node_modules/@particle-academy/react-fancy/docs/`). Quick tour of what's available by category:

- **Inputs:** `Field`, `Textarea`, `Select`, `Checkbox`/`CheckboxGroup`, `RadioGroup`, `Switch`, `Slider`, `DatePicker`, `TimePicker`, `Calendar`, `Autocomplete`, `Pillbox`, `OtpInput`, `FileUpload`, `ColorPicker`.
- **Display:** `Heading`, `Text`, `Separator`, `Avatar`, `Skeleton`, `Progress`, `Brand`, `Profile`, `Callout`, `Timeline`.
- **Overlays:** `Tooltip`, `Popover`, `Dropdown`, `ContextMenu`, `Command` (Cmd+K palette).
- **Navigation:** `Tabs`, `Accordion`, `Breadcrumbs`, `Navbar`, `Pagination`, `TreeNav`, `Menu`.
- **Rich content:** `Composer`, `Chart` (SVG Bar/Line/Area/Pie/Donut/Sparkline), `Editor`, `Kanban`, `Canvas`, `Diagram`, `ContentRenderer`, `Table`, `Carousel`, `Emoji`, `EmojiSelect`.
- **Hooks:** `useControllableState`, `useFloatingPosition`, `useOutsideClick`, `useEscapeKey`, `useFocusTrap`, `useAnimation`, `useId`, `usePanZoom`.

## Customization

Every component renders a `data-react-fancy-*` attribute on its root (e.g. `data-react-fancy-modal`, `data-react-fancy-action`). Target those for external CSS or query selectors.

## Dark mode

Works via Tailwind's `dark:` class strategy. The library's `Portal` auto-detects the `dark` class (or `data-theme="dark"`) on `<html>` and propagates it into portaled content (modals, dropdowns, tooltips, toasts).
