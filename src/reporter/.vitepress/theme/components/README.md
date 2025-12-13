# TestStats Component

A reusable test statistics display component for VitePress.

## Usage

The `<TestStats>` component can be used in any `.md` file.

### Basic Example

```vue
<script setup>
import { computed } from 'vue';

const stats = computed(() => ({
  total: 100,
  passed: 85,
  failed: 10,
  skipped: 5,
  avgDuration: 1500
}));

const totalDuration = 150000;
</script>

<TestStats 
  :stats="stats" 
  :totalDuration="totalDuration"
/>
```

## Props

### stats (Required)

An object containing test statistics.

```typescript
{
  total: number;      // Total number of tests
  passed: number;     // Number of passed tests
  failed: number;     // Number of failed tests
  skipped: number;    // Number of skipped tests
  avgDuration: number; // Average duration in milliseconds
}
```

### totalDuration (Optional)

Total execution time in milliseconds. Default: `0`

### showAvgDuration (Optional)

Whether to display average duration. Default: `true`

### showTotalDuration (Optional)

Whether to display total duration. Default: `true`

### labels (Optional)

Custom labels. Default:

```javascript
{
  total: 'Total Tests',
  passed: 'Passed',
  failed: 'Failed',
  skipped: 'Skipped',
  avgDuration: 'Avg Duration',
  totalDuration: 'Total Duration'
}
```

### additionalMetrics (Optional)

An array of custom metrics to display alongside the standard metrics. Each metric should have:

```typescript
{
  label: string;        // Label to display
  value: any;          // Value to display
  suffix?: string;     // Optional suffix (e.g., '%', 'ms')
  style?: object;      // Optional inline styles
}
```

Example:

```javascript
[
  {
    label: 'Custom Metric',
    value: 95.5,
    suffix: '%',
    style: { color: '#10b981' }
  }
]
```

## Customization Examples

### Custom Labels

```vue
<TestStats 
  :stats="stats" 
  :totalDuration="totalDuration"
  :labels="{
    total: 'Total Test Count',
    passed: 'Success',
    failed: 'Failure',
    skipped: 'Skip',
    avgDuration: 'Average Execution Time',
    totalDuration: 'Total Execution Time'
  }"
/>
```

### Display Only Specific Statistics

```vue
<TestStats 
  :stats="stats" 
  :showAvgDuration="false"
  :showTotalDuration="false"
/>
```

### Using Additional Custom Metrics

```vue
<script setup>
const stats = { total: 100 };
const customMetrics = [
  {
    label: 'Pass Rate',
    value: 95.5,
    suffix: '%',
    style: { color: '#10b981' }
  },
  {
    label: 'Coverage',
    value: 87.2,
    suffix: '%',
    style: { color: '#f59e0b' }
  }
];
</script>

<TestStats 
  :stats="stats"
  :additionalMetrics="customMetrics"
  :showAvgDuration="false"
  :showTotalDuration="false"
/>
```

## Styling

The component uses scoped CSS, so it doesn't affect global styles.
Status colors are defined as follows:

- Passed: `#10b981` (green)
- Failed: `#ef4444` (red)
- Skipped: `#f59e0b` (orange)

## Implementation Files

- Component: `.vitepress/theme/components/TestStats.vue`
- Theme registration: `.vitepress/theme/index.js`
