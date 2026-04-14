# @particle-academy/fancy-sheets

**This is a full spreadsheet, not a data grid.** It has a formula engine (80+ functions), multi-sheet workbooks, cross-sheet references, cell formatting, clipboard, CSV import/export, and undo/redo. Verified against **v0.4.6**.

Peer-depends on `@particle-academy/react-fancy >= 1.5`.

## Setup

```css
@import "tailwindcss";
@import "@particle-academy/fancy-sheets/styles.css";
@source "../node_modules/@particle-academy/fancy-sheets/dist/**/*.js";
```

## The component is `Spreadsheet` (not `FancySheets`)

The component fills its container, so **wrap it in a sized element** — a height is required for the grid to scroll.

```tsx
import { Spreadsheet } from "@particle-academy/fancy-sheets";

function App() {
  return (
    <div style={{ height: 600 }}>
      <Spreadsheet>
        <Spreadsheet.Toolbar />
        <Spreadsheet.Grid />
        <Spreadsheet.SheetTabs />
      </Spreadsheet>
    </div>
  );
}
```

## Props (root)

| Prop | Type | Default |
|------|------|---------|
| `data` | `WorkbookData` | — |
| `defaultData` | `WorkbookData` | empty workbook |
| `onChange` | `(data: WorkbookData) => void` | — |
| `columnCount` | `number` | `26` |
| `rowCount` | `number` | `100` |
| `defaultColumnWidth` | `number` (px) | `100` |
| `rowHeight` | `number` (px) | `28` |
| `readOnly` | `boolean` | `false` |
| `className` | `string` | — |

There is no `columns` prop and no `onCellChange` callback. The whole workbook flows through `onChange`.

## Sub-components

- **`Spreadsheet.Toolbar`** — default toolbar with format buttons (bold, italic, align), undo/redo, and freeze controls. Pass `children` to replace.
- **`Spreadsheet.Grid`** — the main editable cell grid. Handles navigation, selection, editing, keyboard shortcuts, and clipboard.
- **`Spreadsheet.SheetTabs`** — bottom tab bar for multi-sheet workbooks (add / rename / delete / switch).

## Data model

### WorkbookData

```ts
interface WorkbookData {
  sheets: SheetData[];
  activeSheetId: string;
}
```

### SheetData

```ts
interface SheetData {
  id: string;
  name: string;
  cells: Record<CellAddress, CellData>;   // sparse — only non-empty cells
  columnWidths: Record<number, number>;   // sparse overrides
  mergedRegions: MergedRegion[];
  columnFilters: Record<number, string>;
  sortColumn?: number;
  sortDirection?: "asc" | "desc";
  frozenRows: number;
  frozenCols: number;
}
```

### CellData

```ts
type CellAddress = string;   // "A1", "AA99", ...
type CellValue = string | number | boolean | null;

interface CellData {
  value: CellValue;           // raw entered value
  formula?: string;           // original formula text e.g. "=SUM(A1:A10)"
  computedValue?: CellValue;  // evaluated result
  format?: CellFormat;
}
```

### CellFormat

```ts
interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  textAlign?: "left" | "center" | "right";
  displayFormat?: "auto" | "date" | "datetime" | "number" | "percent";
  decimals?: number;
}
```

## Helpers

```ts
import { createEmptyWorkbook, createEmptySheet } from "@particle-academy/fancy-sheets";

const workbook = createEmptyWorkbook();
const newSheet = createEmptySheet("sheet-2", "Summary");
```

## Controlled usage

```tsx
import { Spreadsheet, createEmptyWorkbook } from "@particle-academy/fancy-sheets";
import type { WorkbookData } from "@particle-academy/fancy-sheets";

const [data, setData] = useState<WorkbookData>(createEmptyWorkbook());

<div style={{ height: 600 }}>
  <Spreadsheet data={data} onChange={setData}>
    <Spreadsheet.Toolbar />
    <Spreadsheet.Grid />
    <Spreadsheet.SheetTabs />
  </Spreadsheet>
</div>
```

## Read-only display

```tsx
<div style={{ height: 400 }}>
  <Spreadsheet defaultData={reportData} readOnly>
    <Spreadsheet.Grid />
  </Spreadsheet>
</div>
```

## useSpreadsheet hook

Available to any descendant of `<Spreadsheet>`. Key properties:

| Property | Description |
|----------|-------------|
| `workbook` | Current `WorkbookData` |
| `activeSheet` | Currently displayed `SheetData` |
| `selection` | `{ activeCell, ranges }` |
| `setCellValue(addr, val)` | Update a single cell |
| `setCellFormat(addrs[], fmt)` | Apply formatting to a list of cells |
| `navigate(dir, extend?)` | Move active cell (arrow-key equivalent) |
| `startEdit(val?)` / `confirmEdit()` / `cancelEdit()` | Edit lifecycle |
| `addSheet()` / `renameSheet()` / `deleteSheet()` / `setActiveSheet()` | Sheet management |
| `setFrozenRows(n)` / `setFrozenCols(n)` | Freeze controls |
| `undo()` / `redo()` | History (50-step stack) |
| `canUndo` / `canRedo` | Booleans |

```tsx
import { useSpreadsheet, workbookToCSV } from "@particle-academy/fancy-sheets";
import { Action } from "@particle-academy/react-fancy";

function ExportCsvButton() {
  const { workbook } = useSpreadsheet();
  return (
    <Action icon="download" onClick={() => download(workbookToCSV(workbook), "export.csv")}>
      Export CSV
    </Action>
  );
}
```

## Formulas

Enter a formula by starting a cell with `=`:

```
=A1+B1                    addition
=SUM(A1:A10)              range aggregate
=IF(A1>100, "hi", "lo")   conditional
=Sheet2!B3                cross-sheet reference
=A1 & " " & B1            string concatenation
```

**Operators:** `+ - * / ^` arithmetic, `= <> < <= > >=` comparison, `&` concatenation, `%` percentage, `()` grouping.

**Errors:** `#ERROR!` (syntax), `#VALUE!` (wrong type), `#DIV/0!`, `#NAME?` (unknown function), `#CIRC!` (circular reference).

**Built-in functions (80+):**

| Category | Examples |
|----------|----------|
| Math (25) | `SUM`, `AVERAGE`, `MEDIAN`, `MIN`, `MAX`, `COUNT`, `ROUND`, `ABS`, `SQRT`, `POWER`, `MOD`, `FLOOR`, `CEILING`, `RAND`, `RANDBETWEEN`, `PI`, `EXP`, `LN`, `LOG`, `LOG10`, `FACT`, `INT`, `TRUNC`, `SIGN`, `PRODUCT` |
| Text (19) | `UPPER`, `LOWER`, `PROPER`, `LEN`, `TRIM`, `LEFT`, `RIGHT`, `MID`, `FIND`, `SEARCH`, `SUBSTITUTE`, `REPLACE`, `CONCAT`, `REPT`, `EXACT`, `VALUE`, `TEXT`, `CHAR`, `CODE` |
| Logic (8) | `IF`, `AND`, `OR`, `NOT`, `IFERROR`, `IFBLANK`, `SWITCH`, `CHOOSE` |
| Conditional aggregates (8) | `SUMIF`, `SUMIFS`, `COUNTIF`, `COUNTIFS`, `AVERAGEIF`, `AVERAGEIFS`, `MINIFS`, `MAXIFS` |
| Lookup (8) | `VLOOKUP`, `HLOOKUP`, `INDEX`, `MATCH`, `ROWS`, `COLUMNS`, `ROW`, `COLUMN` |
| Date/Time (12) | `TODAY`, `NOW`, `DATE`, `YEAR`, `MONTH`, `DAY`, `HOUR`, `MINUTE`, `SECOND`, `WEEKDAY`, `DATEDIF`, `EDATE` |
| Info (6) | `ISBLANK`, `ISNUMBER`, `ISTEXT`, `ISLOGICAL`, `ISERROR`, `TYPE` |

Criteria accept comparison strings: `">100"`, `"<=50"`, `"<>"`, `"=apple"`.

### Custom formula functions

```tsx
import { registerFunction } from "@particle-academy/fancy-sheets";

registerFunction("GREET", (name: string) => `Hello, ${name}`);

// In a cell: =GREET("world")  →  "Hello, world"
```

The evaluator tracks dependencies between cells and re-evaluates in topological order. Circular references are detected and reported as `#CIRC!`.

## CSV import / export

```tsx
import {
  parseCSV,
  stringifyCSV,
  csvToWorkbook,
  workbookToCSV,
} from "@particle-academy/fancy-sheets";

// High-level: CSV file → workbook / workbook → CSV
const text = await file.text();
const workbook = csvToWorkbook(text, file.name.replace(/\.csv$/i, ""));

const csv = workbookToCSV(workbook);

// Low-level: raw 2D arrays
const rows = parseCSV("name,age\nAlice,30\nBob,25");
// [["name", "age"], ["Alice", "30"], ["Bob", "25"]]

const back = stringifyCSV(rows);
```

Quoted fields, escaped quotes (`""`), and newlines inside quoted values are preserved through round-trips. `workbookToCSV` writes all sheets separated by `# <sheet name>` header lines.

Clipboard paste into the grid already uses TSV (tab-separated) — paste from Excel or Google Sheets and it lands in the cells correctly. Use the CSV helpers for file-based import/export only.

## Keyboard shortcuts

| Keys | Action |
|------|--------|
| Arrow keys | Move active cell |
| Shift + arrows | Extend selection |
| Ctrl/Cmd + arrows | Jump to edge |
| Enter / F2 | Start editing |
| Esc | Cancel edit |
| Tab / Shift + Tab | Move right / left |
| Ctrl/Cmd + C / X / V | Copy / Cut / Paste |
| Ctrl/Cmd + Z / Y | Undo / Redo |
| Ctrl/Cmd + B / I | Bold / Italic |

## Data attributes

| Attribute | Element |
|-----------|---------|
| `data-fancy-sheets` | Root container |
| `data-fancy-sheets-toolbar` | Toolbar |
| `data-fancy-sheets-formula-bar` | Formula bar |
| `data-fancy-sheets-grid` | Grid container |
| `data-fancy-sheets-column-headers` | Column header row |
| `data-fancy-sheets-row-header` | Row header cell |
| `data-fancy-sheets-cell` | Individual cell |
| `data-fancy-sheets-cell-editor` | Active edit input |
| `data-fancy-sheets-selection` | Selection overlay |
| `data-fancy-sheets-resize-handle` | Column resize handle |
| `data-fancy-sheets-tabs` | Sheet tabs |
