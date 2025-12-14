# TestInsights Component

### 1. Basic Usageaining

The `TestInsights` component is a Vue component for visually displaying test insights dEach metric is dispEach metric is displayed as a card containing:
- **Current**: Current value
- **Baseline**: Baseline value
- **Change**: Change amount (color-coded to show improvement/decline)

### 2. Automatic Coloring

- **Pass Rate**: Green for ≥95%, yellow for ≥80%, red for <80%
- **Fail Rate / Flaky Rate**: Green for ≤5%, yellow for ≤10%, red for >10%
- **Change**: 
  - Pass Rate: Green for positive, red for negative
  - Fail Rate / Flaky Rate / Duration: Red for positive, green for negative (green indicates improvement)

### 3. Responsive Design

Uses a grid layout that automatically adjusts based on screen size.

## Examples

### 1. Basic Usageaining

- **Current**: Current value
- **Baseline**: Baseline value
- **Change**: Change amount (color-coded to show improvement/decline)

### 2. Automatic Coloring

- **Pass Rate**: Green for ≥95%, yellow for ≥80%, red for <80%
- **Fail Rate / Flaky Rate**: Green for ≤5%, yellow for ≤10%, red for >10%
- **Change**: 
  - Pass Rate: Green for positive, red for negative
  - Fail Rate / Flaky Rate / Duration: Red for positive, green for negative (green indicates improvement)

### 3. Responsive Design

Uses a grid layout that automatically adjusts based on screen size.

## Examples

### Basic Usagerent, baseline, and change values for each metric in a similar style to `TestStats`.

## Usage

```vue
<script setup>
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
</script>

<TestInsights 
  v-if="richReportWithInsights.insights"
  :insights="richReportWithInsights.insights"
/>
```

## Props

### insights (Required)

- **Type:** `Object`
- **Required:** `true`
- **Description:** The insights object containing test metrics

Expected structure:
```typescript
{
  passRate?: {
    current: number;
    baseline: number;
    change: number;
  };
  failRate?: {
    current: number;
    baseline: number;
    change: number;
  };
  flakyRate?: {
    current: number;
    baseline: number;
    change: number;
  };
  averageTestDuration?: {
    current: number;
    baseline: number;
    change: number;
  };
  averageRunDuration?: {
    current: number;
    baseline: number;
    change: number;
  };
  p95RunDuration?: {
    current: number;
    baseline: number;
    change: number;
  };
  p95TestDuration?: {
    current: number;
    baseline: number;
    change: number;
  };
  runsAnalyzed?: number;
  executedInRuns?: number;
}
```

### showMetrics

- **Type:** `Array<string>`
- **Default:** `['passRate', 'failRate', 'flakyRate', 'averageTestDuration', 'averageRunDuration', 'p95RunDuration', 'p95TestDuration']`
- **Description:** List of metrics to display

### labels

- **Type:** `Object`
- **Default:** 
```javascript
{
  passRate: 'Pass Rate',
  failRate: 'Fail Rate',
  flakyRate: 'Flaky Rate',
  averageTestDuration: 'Avg Test Duration',
  averageRunDuration: 'Avg Run Duration',
  p95RunDuration: 'P95 Run Duration',
  p95TestDuration: 'P95 Test Duration',
  runsAnalyzed: 'Runs Analyzed',
  executedInRuns: 'Executed in Runs'
}
```
- **Description:** Custom labels for metrics

### additionalMetrics

- **Type:** `Array`
- **Default:** `[]`
- **Description:** Additional custom metrics to display

Each metric should have the following format:
```javascript
{
  label: string;    // Display label
  value: any;       // Value
  suffix?: string;  // Optional suffix (e.g., '%', 'ms')
  style?: Object;   // Optional styles
}
```

## Features

### 1. Metrics Cards

Each metric is displayed as a card containing the following information:
- **Current Value**: The current value
- **Baseline**: The baseline value
- **Change Amount**: The amount of change (increase or decrease indicated by color)

### 2. Automatic Coloring

- **Pass Rate**: Green for 95%+, Yellow for 80%+, Red for below
- **Fail Rate / Flaky Rate**: Green for ≤5%, Yellow for ≤10%, Red for above
- **Change Amount**:
  - Pass Rate: Positive values green, negative values red
  - Fail Rate / Flaky Rate / Duration: Positive values red, negative values green (improvement shown in green)

### 3. Responsive Design

Uses a grid layout that automatically adjusts based on screen size.

## Usage Examples

### Basic Usage

```vue
<script setup>
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
</script>

<TestInsights 
  v-if="richReportWithInsights.insights"
  :insights="richReportWithInsights.insights"
/>
```

### Customize Displayed Metrics

```vue
<TestInsights 
  :insights="richReportWithInsights.insights"
  :showMetrics="['passRate', 'failRate', 'averageTestDuration']"
/>
```

### Using Custom Labels

```vue
<TestInsights 
  :insights="richReportWithInsights.insights"
  :labels="{
    passRate: 'Pass Rate',
    failRate: 'Failure Rate',
    flakyRate: 'Flakiness Rate',
    averageTestDuration: 'Average Test Time'
  }"
/>
```

### Display Additional Metrics

```vue
<TestInsights 
  :insights="richReportWithInsights.insights"
  :additionalMetrics="[
    {
      label: 'Total Runs',
      value: 100,
      style: { color: 'var(--vp-c-brand)' }
    },
    {
      label: 'Success Rate',
      value: 95.5,
      suffix: '%',
      style: { color: 'var(--vp-c-green-1)' }
    }
  ]"
/>
```

## Style Customization

The component uses VitePress CSS variables:

- `--vp-c-bg-soft`: Card background color
- `--vp-c-divider`: Border color
- `--vp-c-text-1`: Primary text color
- `--vp-c-text-2`: Secondary text color
- `--vp-c-green-1`: Color for positive values
- `--vp-c-red-1`: Color for negative values
- `--vp-c-yellow-1`: Color for warnings

## Demo

<script setup>
import { data as richReportWithInsights } from '../../../richReportWithInsights.data.js';
</script>

### Default Display

<TestInsights 
  v-if="richReportWithInsights.insights"
  :insights="richReportWithInsights.insights"
/>

### Display Specific Metrics Only

<TestInsights 
  v-if="richReportWithInsights.insights"
  :insights="richReportWithInsights.insights"
  :showMetrics="['passRate', 'failRate', 'flakyRate']"
/>

### With Additional Metrics

<TestInsights 
  v-if="richReportWithInsights.insights"
  :insights="richReportWithInsights.insights"
  :showMetrics="['passRate', 'failRate']"
  :additionalMetrics="[
    {
      label: 'Runs Analyzed',
      value: richReportWithInsights.insights.runsAnalyzed || 0
    }
  ]"
/>
