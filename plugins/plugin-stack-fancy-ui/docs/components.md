# Fancy UI Component Reference

## @particle-academy/react-fancy

### Sidebar

```tsx
import { Sidebar } from '@particle-academy/react-fancy';

<Sidebar defaultCollapsed={false} collapseMode="icons">
  <Sidebar.Group label="Section Name">
    <Sidebar.Item
      active={isActive}
      icon={<IconComponent className="w-4 h-4" />}
      onClick={() => navigate('/path')}
    >
      Label
    </Sidebar.Item>
  </Sidebar.Group>
  <div className="mt-auto border-t border-border">
    <Sidebar.Toggle />
  </div>
</Sidebar>
```

### MobileMenu

```tsx
import { MobileMenu } from '@particle-academy/react-fancy';

<MobileMenu.Flyout open={isOpen} onClose={close} side="left" title="Menu">
  <MobileMenu.Item
    active={isActive}
    icon={<Icon className="w-4 h-4" />}
    onClick={handleClick}
  >
    Label
  </MobileMenu.Item>
</MobileMenu.Flyout>
```

### MultiSwitch

```tsx
import { MultiSwitch } from '@particle-academy/react-fancy';

<MultiSwitch
  value={selected}
  onValueChange={setSelected}
  list={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
  ]}
/>
```

### Common UI Components

```tsx
import { Button, Badge, Card, Input } from '@particle-academy/react-fancy';
// Or from project's ui/ directory if using local wrappers

<Button variant="default" size="sm" onClick={fn}>Click</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Subtle</Button>

<Badge variant="default">Status</Badge>
<Badge variant="outline" className="text-[10px]">Tag</Badge>

<Card className="p-4 space-y-3">Content</Card>

<Input value={val} onChange={e => setVal(e.target.value)} placeholder="Search..." />
```

### Dialog

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@particle-academy/react-fancy';

<Dialog open={isOpen} onOpenChange={setOpen}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    <p>Body content</p>
    <DialogFooter>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## @particle-academy/fancy-code

```tsx
import { FancyCode } from '@particle-academy/fancy-code';

<FancyCode
  value={sourceCode}
  onChange={setSourceCode}
  language="javascript"  // python, json, markdown, html, css, etc.
  readonly={false}
  // theme auto-follows system dark/light mode
/>
```

---

## @particle-academy/fancy-sheets

```tsx
import { FancySheets } from '@particle-academy/fancy-sheets';

<FancySheets
  data={[
    { date: '2024-01-01', open: 100.5, high: 102.3, low: 99.8, close: 101.2, volume: 1500000 },
    { date: '2024-01-02', open: 101.2, high: 103.1, low: 100.9, close: 102.8, volume: 1800000 },
  ]}
  columns={[
    { key: 'date', header: 'Date' },
    { key: 'open', header: 'Open', type: 'number', format: '0.00' },
    { key: 'high', header: 'High', type: 'number', format: '0.00' },
    { key: 'low', header: 'Low', type: 'number', format: '0.00' },
    { key: 'close', header: 'Close', type: 'number', format: '0.00' },
    { key: 'volume', header: 'Volume', type: 'number', format: '0,0' },
  ]}
  readonly={false}
  onCellChange={(rowIndex, colKey, newValue) => {
    // handle cell edit
  }}
/>
```

---

## @particle-academy/react-echarts

```tsx
import { EChart } from '@particle-academy/react-echarts';

// Line chart
<EChart
  style={{ height: 400 }}
  option={{
    xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May'] },
    yAxis: { type: 'value' },
    series: [
      { name: 'Revenue', type: 'line', data: [150, 230, 224, 218, 335] },
      { name: 'Cost', type: 'line', data: [80, 120, 110, 95, 140] },
    ],
    tooltip: { trigger: 'axis' },
    legend: {},
  }}
/>

// Candlestick chart (financial)
<EChart
  style={{ height: 500 }}
  option={{
    xAxis: { type: 'category', data: dates },
    yAxis: { type: 'value', scale: true },
    series: [{
      type: 'candlestick',
      data: ohlcData,  // [[open, close, low, high], ...]
      itemStyle: {
        color: '#26a69a',      // bullish (close > open)
        color0: '#ef5350',     // bearish (close < open)
        borderColor: '#26a69a',
        borderColor0: '#ef5350',
      },
    }],
    tooltip: { trigger: 'axis' },
    dataZoom: [{ type: 'inside' }, { type: 'slider' }],
  }}
/>

// Bar chart
<EChart
  style={{ height: 300 }}
  option={{
    xAxis: { type: 'category', data: labels },
    yAxis: { type: 'value' },
    series: [{ type: 'bar', data: values }],
  }}
/>

// Pie chart
<EChart
  style={{ height: 300 }}
  option={{
    series: [{
      type: 'pie',
      data: [
        { name: 'Category A', value: 40 },
        { name: 'Category B', value: 30 },
        { name: 'Category C', value: 20 },
      ],
    }],
  }}
/>
```
