# @particle-academy/react-echarts

React wrapper around [Apache ECharts](https://echarts.apache.org/). Exposes a base `<EChart>` component plus 20 typed series sub-components with a simplified prop API. Verified against **v1.1.1**.

Peer-depends on `echarts >= 5.5`. Install `echarts-gl` separately if you use `<EChart3D>`.

## Setup

```bash
npm install @particle-academy/react-echarts echarts
# optional, for 3D charts
npm install echarts-gl
```

At app entry, register the chart types and components you'll use. The convenient option is `registerAll()`:

```tsx
import { registerAll } from "@particle-academy/react-echarts";
registerAll();
```

For production builds, register selectively for smaller bundles — see **Tree-shaken registration** below.

## Base `<EChart>` component

Accepts a raw ECharts `option` object. This gives you full control.

```tsx
import { EChart } from "@particle-academy/react-echarts";

<EChart
  option={{
    xAxis: { type: "category", data: ["Mon", "Tue", "Wed", "Thu", "Fri"] },
    yAxis: { type: "value" },
    series: [{ type: "bar", data: [120, 200, 150, 80, 70] }],
  }}
  style={{ height: 400 }}
/>
```

### Base props

| Prop | Type | Default |
|------|------|---------|
| `option` | `EChartsOption` | — |
| `theme` | `string \| object` | auto (detects dark mode) |
| `renderer` | `"canvas" \| "svg"` | `"canvas"` |
| `notMerge` | `boolean` | `false` |
| `lazyUpdate` | `boolean` | `false` |
| `showLoading` | `boolean` | `false` |
| `loadingOption` | `object` | — |
| `onEvents` | `Record<string, (params) => void>` | — |
| `autoResize` | `boolean` | `true` |
| `style` | `CSSProperties` | `{ width: "100%", height: 400 }` |
| `className` | `string` | — |

Also accepts any `HTMLDivElement` attribute.

## Typed series sub-components

Each sub-component takes a simplified `data` prop and sets sensible axis / tooltip / legend defaults. For anything more advanced, drop back to the base `<EChart option={...}>`.

### Shared props (all sub-components)

| Prop | Type | Default |
|------|------|---------|
| `data` | `any[] \| { categories?, series[] }` | — |
| `title` | `string` | — |
| `xAxis` | `EChartsOption["xAxis"]` | `{ type: "category" }` (axis charts) |
| `yAxis` | `EChartsOption["yAxis"]` | `{ type: "value" }` (axis charts) |
| `tooltip` | `boolean \| object` | `true` = `{ trigger: "axis" }` |
| `legend` | `boolean \| object` | `false` |
| `grid` | `EChartsOption["grid"]` | — |
| `seriesOptions` | `Record<string, any>` | `{}` |
| `option` | `Partial<EChartsOption>` | `{}` (merged last, overrides everything) |

Plus all base props (`theme`, `renderer`, `autoResize`, etc.) and HTML div attributes.

### Data formats

**Single series** — pass an array directly:

```tsx
<EChart.Line data={[150, 230, 224, 218, 135]} />
```

**Multi-series** — pass an object with `categories` + `series`:

```tsx
<EChart.Bar
  data={{
    categories: ["Q1", "Q2", "Q3", "Q4"],
    series: [
      { name: "2024", data: [120, 200, 150, 80] },
      { name: "2025", data: [180, 230, 190, 140] },
    ],
  }}
  legend
/>
```

### Axis-based charts

These auto-configure `xAxis` / `yAxis`.

| Component | Series | Typical data |
|-----------|--------|-------------|
| `EChart.Line` | `line` | `number[]` or `[x, y][]` |
| `EChart.Bar` | `bar` | `number[]` or `[x, y][]` |
| `EChart.Scatter` | `scatter` | `[x, y][]` |
| `EChart.Candlestick` | `candlestick` | `[open, close, low, high][]` |
| `EChart.Boxplot` | `boxplot` | `[min, Q1, median, Q3, max][]` |
| `EChart.Heatmap` | `heatmap` | `[x, y, value][]` |
| `EChart.EffectScatter` | `effectScatter` | `[x, y][]` |
| `EChart.PictorialBar` | `pictorialBar` | `number[]` |

### Non-axis charts

| Component | Series | Typical data |
|-----------|--------|-------------|
| `EChart.Pie` | `pie` | `{ name, value }[]` |
| `EChart.Radar` | `radar` | `{ name, value[] }[]` (requires `radar` in `option`) |
| `EChart.Gauge` | `gauge` | `{ value, name? }[]` |
| `EChart.Funnel` | `funnel` | `{ name, value }[]` |
| `EChart.Treemap` | `treemap` | `{ name, value, children? }[]` |
| `EChart.Sunburst` | `sunburst` | `{ name, value?, children? }[]` |
| `EChart.Sankey` | `sankey` | `nodes` + `links` via `seriesOptions` |
| `EChart.Graph` | `graph` | `nodes` + `links` via `seriesOptions` |
| `EChart.Parallel` | `parallel` | `number[][]` (requires `parallelAxis` in `option`) |
| `EChart.ThemeRiver` | `themeRiver` | `[date, value, name][]` |
| `EChart.Map` | `map` | `{ name, value }[]` (requires map registration + `seriesOptions.map`) |
| `EChart.Custom` | `custom` | any (requires `seriesOptions.renderItem`) |

## Examples

### Line

```tsx
<EChart.Line
  title="Monthly Sales"
  data={[820, 932, 901, 934, 1290, 1330, 1320]}
  seriesOptions={{ smooth: true, areaStyle: {} }}
/>
```

### Pie (donut)

```tsx
<EChart.Pie
  title="Browser Share"
  data={[
    { name: "Chrome", value: 65 },
    { name: "Firefox", value: 15 },
    { name: "Safari", value: 12 },
    { name: "Edge", value: 8 },
  ]}
  seriesOptions={{ radius: ["40%", "70%"] }}
  legend
/>
```

### Multi-series bar

```tsx
<EChart.Bar
  title="Revenue by Quarter"
  data={{
    categories: ["Q1", "Q2", "Q3", "Q4"],
    series: [
      { name: "Product A", data: [120, 200, 150, 80] },
      { name: "Product B", data: [60, 140, 190, 220] },
    ],
  }}
  legend
/>
```

### Scatter with click events

```tsx
<EChart.Scatter
  data={[[10, 20], [30, 40], [50, 60], [70, 80]]}
  seriesOptions={{ symbolSize: 12 }}
  onEvents={{
    click: (params) => console.log("Clicked:", params.data),
  }}
/>
```

### Candlestick (financial)

```tsx
<EChart.Candlestick
  data={[
    [20, 34, 10, 38],  // [open, close, low, high]
    [40, 35, 30, 50],
    [31, 38, 33, 44],
  ]}
/>
```

### Gauge

```tsx
<EChart.Gauge
  data={[{ value: 72, name: "Completion" }]}
  seriesOptions={{ detail: { formatter: "{value}%" } }}
/>
```

### Full control via base component

```tsx
<EChart
  option={{
    radar: {
      indicator: [
        { name: "Sales", max: 100 },
        { name: "Admin", max: 100 },
        { name: "Tech", max: 100 },
      ],
    },
    series: [{ type: "radar", data: [{ value: [80, 60, 90], name: "Team A" }] }],
  }}
  theme="dark-preset"
/>
```

## 3D charts

Separate component that lazy-loads `echarts-gl`. Shows a loading placeholder until the 3D engine is ready.

```tsx
import { EChart3D } from "@particle-academy/react-echarts";

<EChart3D
  option={{
    globe: {
      baseColor: "#1a3b5c",
      shading: "color",
      atmosphere: { show: true },
      viewControl: { autoRotate: true },
    },
  }}
  style={{ height: 500 }}
/>
```

Supported 3D charts: `Bar3D`, `Scatter3D`, `Line3D`, `Surface`, `Globe`.

## Graphic layer

For custom drawing via the ECharts graphic API (shapes, text, images, groups, keyframe animation):

```tsx
import { EChartGraphic } from "@particle-academy/react-echarts";

<EChartGraphic
  elements={[
    { type: "circle", shape: { cx: 100, cy: 100, r: 50 }, style: { fill: "#5470c6" } },
    { type: "text", style: { text: "Hello", x: 100, y: 100, fill: "#fff" } },
  ]}
/>
```

## Themes

Three built-in theme presets — **no Catppuccin theme**.

```tsx
import { registerBuiltinThemes } from "@particle-academy/react-echarts";
registerBuiltinThemes();  // registers "dark-preset", "vintage", "pastel"

<EChart option={opt} theme="dark-preset" />
<EChart option={opt} theme="vintage" />
<EChart option={opt} theme="pastel" />
```

### Auto dark mode

When `theme` is omitted, the component detects `prefers-color-scheme: dark` and applies ECharts' built-in `dark` theme with a transparent background so the chart blends with the page. Toggling the OS preference re-renders the chart reactively.

```tsx
<EChart option={opt} />                       {/* auto */}
<EChart option={opt} theme="dark-preset" />   {/* forced */}
```

### Custom themes

```tsx
import { registerTheme } from "@particle-academy/react-echarts";

registerTheme("corporate", {
  color: ["#003f5c", "#58508d", "#bc5090", "#ff6361", "#ffa600"],
  backgroundColor: "#ffffff",
  textStyle: { color: "#333" },
  title: { textStyle: { color: "#003f5c" } },
});

<EChart option={opt} theme="corporate" />
```

You can also pass a theme object inline without registering:

```tsx
<EChart option={opt} theme={{ color: ["#e63946", "#457b9d", "#1d3557"] }} />
```

## Tree-shaken registration

For production, register only the charts and components you actually use:

```tsx
// chart-setup.ts
import { use } from "echarts/core";
import {
  registerCharts,
  registerComponents,
  LineChart, BarChart, PieChart,
  GridComponent, TooltipComponent, TitleComponent, LegendComponent,
  CanvasRenderer,
} from "@particle-academy/react-echarts";

registerCharts(LineChart, BarChart, PieChart);
registerComponents(GridComponent, TooltipComponent, TitleComponent, LegendComponent);
use([CanvasRenderer]);
```

```tsx
// main.tsx
import "./chart-setup";
```

**Available chart exports:** `LineChart`, `BarChart`, `PieChart`, `ScatterChart`, `RadarChart`, `HeatmapChart`, `GaugeChart`, `FunnelChart`, `TreemapChart`, `SunburstChart`, `SankeyChart`, `GraphChart`, `CandlestickChart`, `BoxplotChart`, `ParallelChart`, `ThemeRiverChart`, `MapChart`, `CustomChart`, `EffectScatterChart`, `PictorialBarChart`.

**Available component exports:** `GridComponent`, `TooltipComponent`, `TitleComponent`, `LegendComponent`, `DataZoomComponent`, `ToolboxComponent`, `VisualMapComponent`, `GeoComponent`, `CalendarComponent`, `GraphicComponent`, `PolarComponent`, `DatasetComponent`.

**Renderers:** `CanvasRenderer` (default, faster), `SVGRenderer` (crisper for small charts, CSS styleable).

## useECharts hook

For custom integrations where you want to manage the container yourself:

```tsx
import { useECharts } from "@particle-academy/react-echarts";

function CustomChart() {
  const { chartRef, instance } = useECharts({
    option: { /* ... */ },
    autoResize: true,
  });

  return <div ref={chartRef} style={{ width: "100%", height: 400 }} />;
}
```

## TypeScript

Re-exported types:

- `EChartsOption` — the full option type from `echarts`
- `EChartsInstance` — chart instance type from `echarts`
- `EChartBaseProps`, `EChartComponentProps`, `SeriesComponentProps`, `ChartDivProps`
- `SetOptionOpts`
