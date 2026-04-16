# @particle-academy/fancy-code

Lightweight embedded code editor with a custom tokenizer (no Monaco, CodeMirror, or Shiki dependency). Verified against **v0.4.3**.

Peer-depends on `@particle-academy/react-fancy >= 1.5`.

## Setup

```css
@import "tailwindcss";
@import "@particle-academy/fancy-code/styles.css";
@source "../node_modules/@particle-academy/fancy-code/dist/**/*.js";
```

## The component is `CodeEditor` (not `FancyCode`)

```tsx
import { CodeEditor } from "@particle-academy/fancy-code";

<CodeEditor
  defaultValue={`function greet(name) {\n  return "Hello, " + name;\n}`}
  language="javascript"
>
  <CodeEditor.Toolbar />
  <CodeEditor.Panel />
  <CodeEditor.StatusBar />
</CodeEditor>
```

All three sub-components are optional — omit any to render a minimal editor. `Panel` is the editable surface; `Toolbar` and `StatusBar` are decorative chrome.

## Props

| Prop | Type | Default |
|------|------|---------|
| `value` | `string` | — |
| `defaultValue` | `string` | `""` |
| `onChange` | `(value: string) => void` | — |
| `language` | `string` | `"javascript"` |
| `onLanguageChange` | `(lang: string) => void` | — |
| `theme` | `string` | `"auto"` |
| `readOnly` | `boolean` | `false` |
| `lineNumbers` | `boolean` | `true` |
| `wordWrap` | `boolean` | `false` |
| `tabSize` | `number` | `2` |
| `placeholder` | `string` | — |
| `minHeight` | `number` (px) | — |
| `maxHeight` | `number` (px, scrolls beyond) | — |
| `className` | `string` | — |

Note: the prop is `readOnly` (camelCase) — not `readonly`.

## Sub-components

- **`CodeEditor.Toolbar`** — default content is a language selector + word-wrap toggle + copy button. Pass `children` to replace the defaults entirely.
- **`CodeEditor.Toolbar.Separator`** — vertical divider between toolbar groups.
- **`CodeEditor.Panel`** — the editable surface. Takes `className` only.
- **`CodeEditor.StatusBar`** — default content is line/col cursor position, selection count, language name, tab size. Pass `children` to replace the defaults.

## Common patterns

### Controlled

```tsx
const [code, setCode] = useState("");

<CodeEditor value={code} onChange={setCode} language="typescript">
  <CodeEditor.Panel />
</CodeEditor>
```

### Read-only display

```tsx
<CodeEditor defaultValue={someSnippet} language="php" readOnly>
  <CodeEditor.Toolbar />
  <CodeEditor.Panel />
</CodeEditor>
```

### Height-constrained

```tsx
<CodeEditor defaultValue={longFile} minHeight={200} maxHeight={500}>
  <CodeEditor.Toolbar />
  <CodeEditor.Panel />
</CodeEditor>
```

### Custom toolbar buttons

```tsx
import { CodeEditor, useCodeEditor } from "@particle-academy/fancy-code";
import { Action } from "@particle-academy/react-fancy";

function TrimButton() {
  const { getValue, setValue } = useCodeEditor();
  return <Action size="sm" onClick={() => setValue(getValue().trim())}>Trim</Action>;
}

<CodeEditor defaultValue="  hello  ">
  <CodeEditor.Toolbar>
    <TrimButton />
    <CodeEditor.Toolbar.Separator />
    {/* Providing children replaces the default toolbar content */}
  </CodeEditor.Toolbar>
  <CodeEditor.Panel />
</CodeEditor>
```

## useCodeEditor hook

Available to any descendant of `<CodeEditor>`. Returns:

| Property | Description |
|----------|-------------|
| `getValue()` | Current document text |
| `getSelection()` | Currently selected text |
| `setValue(v)` | Replace the entire document |
| `replaceSelection(text)` | Replace the current selection |
| `focus()` | Focus the editor |
| `language` / `setLanguage(lang)` | Current language + setter |
| `theme` | Current theme name |
| `readOnly` / `lineNumbers` / `wordWrap` / `tabSize` | Current settings |
| `toggleWordWrap()` / `toggleLineNumbers()` | Settings togglers |
| `copyToClipboard()` | Copy the full document (Promise) |
| `cursorPosition` | `{ line, col }` |
| `selectionLength` | 0 if no selection |
| `placeholder` | Current placeholder |

## Built-in languages

| Language | `language` value | Aliases |
|----------|------------------|---------|
| JavaScript | `"javascript"` | `"js"`, `"jsx"` |
| TypeScript | `"typescript"` | `"ts"`, `"tsx"` |
| HTML | `"html"` | `"htm"` |
| PHP | `"php"` | — |
| Python | `"python"` | `"py"` |
| Go | `"go"` | `"golang"` |

JSON, Markdown, CSS, and similar are **not** built-in. Register them yourself:

```tsx
import { registerLanguage } from "@particle-academy/fancy-code";

registerLanguage({
  name: "sql",
  aliases: ["mysql", "postgres"],
  tokenize: (line) => [
    { type: "keyword", value: "SELECT" },
    { type: "plain", value: " * FROM users" },
  ],
});
```

`type` can be any theme token key: `keyword`, `string`, `number`, `comment`, `operator`, `punctuation`, `function`, `type`, `tag`, `attribute`, `plain`. Call `registerLanguage` once at app entry.

## Built-in themes

| Theme | Description |
|-------|-------------|
| `"light"` | White background, blue/purple/green tokens |
| `"dark"` | Zinc-900 background, pastel tokens |
| `"auto"` | Follows `prefers-color-scheme`, toggles between `"light"` and `"dark"` |

Register a custom theme once at app entry:

```tsx
import { registerTheme } from "@particle-academy/fancy-code";

registerTheme({
  name: "solarized",
  background: "#fdf6e3",
  foreground: "#586e75",
  gutter: "#eee8d5",
  activeLine: "rgba(147, 161, 161, 0.1)",
  selection: "rgba(181, 137, 0, 0.2)",
  tokens: {
    keyword: "#859900",
    string: "#2aa198",
    number: "#d33682",
    comment: "#93a1a1",
    function: "#268bd2",
    type: "#b58900",
  },
});

<CodeEditor theme="solarized">
  <CodeEditor.Panel />
</CodeEditor>
```

## IDE layout (pair with TreeNav)

```tsx
import { TreeNav } from "@particle-academy/react-fancy";
import { CodeEditor } from "@particle-academy/fancy-code";

<div className="flex" style={{ height: 600 }}>
  <div className="w-56 shrink-0 overflow-y-auto border-r p-2">
    <TreeNav nodes={fileTree} selectedId={activeFile} onSelect={openFile} />
  </div>
  <div className="flex-1">
    <CodeEditor value={code} onChange={setCode} language={lang}>
      <CodeEditor.Toolbar />
      <CodeEditor.Panel />
      <CodeEditor.StatusBar />
    </CodeEditor>
  </div>
</div>
```

## Data attributes

Target internal parts for CSS without reaching into class names:

| Attribute | Element |
|-----------|---------|
| `data-fancy-code-editor` | Root |
| `data-fancy-code-toolbar` | Toolbar |
| `data-fancy-code-toolbar-separator` | Toolbar separator |
| `data-fancy-code-panel` | Editable surface |
| `data-fancy-code-statusbar` | Status bar |
