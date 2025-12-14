# SummaryView Component

`SummaryView` is a VitePress shared component that displays a comprehensive test summary view including statistics, chart, and time information.

## Usage

```vue
<SummaryView 
  :summary="summaryData"
  :showChart="true"
  :showTimeInfo="true"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>
```

## Props

### summary (Required)

- **Type:** `Object`
- **Required:** `true`
- **Description:** The summary object containing test results data

Expected structure:
```typescript
{
  tests: number;      // Total number of tests
  passed: number;     // Number of passed tests
  failed: number;     // Number of failed tests
  skipped: number;    // Number of skipped tests
  pending?: number;   // Number of pending tests
  other?: number;     // Number of other tests
  flaky?: number;     // Number of flaky tests
  suites?: number;    // Number of test suites
  start?: number;     // Start timestamp (Unix timestamp in seconds)
  stop?: number;      // Stop timestamp (Unix timestamp in seconds)
  duration?: number;  // Total duration in milliseconds
}
```

### showChart

- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Whether to display the doughnut chart visualization

### showTimeInfo

- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Whether to display start and stop time information

### showAvgDuration

- **Type:** `Boolean`
- **Default:** `false`
- **Description:** Whether to show average duration in the stats

### showTotalDuration

- **Type:** `Boolean`
- **Default:** `true`
- **Description:** Whether to show total duration in the stats

### chartContainerStyle

- **Type:** `Object`
- **Default:** `{ maxWidth: '300px', margin: '2rem auto' }`
- **Description:** Custom styles for the chart container

### chartTitle

- **Type:** `String`
- **Default:** `'Test Results Distribution'`
- **Description:** Title displayed above the chart

## Features

### 1. Test Statistics

Displays comprehensive test statistics including:
- Total number of tests
- Passed tests (green)
- Failed tests (red)
- Skipped tests (amber)
- Pending tests (purple)
- Flaky tests (orange)
- Other tests (gray)
- Number of test suites
- Total duration

### 2. Doughnut Chart

Interactive doughnut chart with:
- Color-coded segments for each test status
- Pass rate percentage displayed in the center
- Tooltips showing count and percentage for each segment
- Legend at the bottom

### 3. Time Information

Displays formatted start and stop timestamps using the `DateTimeFormatter` component.

## Example

```vue
<script setup>
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
</script>

<SummaryView 
  v-if="richReportWithInsights.results.summary"
  :summary="richReportWithInsights.results.summary"
  :showChart="true"
  :showTimeInfo="true"
  :chartTitle="Custom Test Results"
/>
```

## Dependencies

This component depends on:
- `TestStats.vue` - For displaying test statistics
- `DateTimeFormatter.vue` - For formatting timestamps
- `chart.js` - For rendering the doughnut chart

## Customization

You can customize the appearance by:
1. Passing custom `chartContainerStyle` to adjust chart dimensions
2. Setting `chartTitle` to change the chart title
3. Toggling visibility of sections using boolean props
4. Styling via CSS custom properties in your theme

## Notes

- The component automatically filters out zero or undefined values from the chart
- Pass rate is calculated as `(passed / total) * 100`
- Timestamps are expected in Unix format (seconds) and will be multiplied by 1000 for JavaScript Date objects
- The component is responsive and maintains aspect ratio on different screen sizes
