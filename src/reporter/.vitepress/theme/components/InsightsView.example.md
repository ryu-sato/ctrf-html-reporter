# InsightsView Component

The `InsightsView` component displays comprehensive test insights with filtering, sorting, and pagination capabilities.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `report` | `Report` | Yes | CTRF Report object containing test results |
| `error` | `string` | No | Error message to display if report loading failed |

## Features

- **Test Insights Display**: Shows aggregated metrics like pass rate, flaky rate, fail rate, etc.
- **Filtering**: Filter tests by status (all, passed, failed, skipped, pending)
- **Sorting**: Sort tests by various metrics (pass rate, flaky rate, fail rate, runs, avg duration, 95th percentile)
- **Pagination**: Navigate through large test result sets
- **Responsive Grid**: Displays test cards in a responsive grid layout
- **Interactive**: Click on test cards to view detailed information

## Usage

### Basic Usage

```vue
<script setup>
import { data as report } from './report.data.js';
import InsightsView from './.vitepress/theme/components/InsightsView.vue';
</script>

<InsightsView :report="report" />
```

### With Error Handling

```vue
<script setup>
import { data as report } from './report.data.js';
import InsightsView from './.vitepress/theme/components/InsightsView.vue';
</script>

<InsightsView 
  :report="report" 
  :error="report?.error"
/>
```

### In a Markdown File

```markdown
---
layout: report
---

<script setup>
import { data as report } from './report.data.js';
import InsightsView from './.vitepress/theme/components/InsightsView.vue';
</script>

# Test Insights

<InsightsView :report="report" />
```

## Report Data Format

The component expects a CTRF (Common Test Report Format) `Report` object. The report will be automatically enriched with insights using the `enrichReportWithInsights` function from the `ctrf` package.

Example report structure:

```typescript
interface Report {
  reportFormat: 'CTRF';
  specVersion: string;
  reportId?: string;
  timestamp?: string;
  generatedBy?: string;
  results: {
    summary: {
      tests: number;
      passed: number;
      failed: number;
      skipped: number;
      pending: number;
      // ... other summary fields
    };
    tests: Array<{
      name: string;
      status: 'passed' | 'failed' | 'skipped' | 'pending';
      suite: string;
      duration?: number;
      // ... other test fields
    }>;
  };
}
```

## Styling

The component uses CSS custom properties (variables) for theming. It inherits VitePress theme colors:

- `--vp-c-brand-1`: Primary brand color
- `--vp-c-green-1`: Success/pass color
- `--vp-c-red-1`: Error/fail color
- `--vp-c-yellow-1`: Warning/skip color
- `--vp-c-bg-soft`: Soft background color
- `--vp-c-divider`: Border color

## Dependencies

- `vue`: For component reactivity
- `ctrf`: For report enrichment with insights
- `TestInsights.vue`: Display aggregated test insights
- `SummaryView.vue`: Display test summary
- `PercentFormatter.vue`: Format percentage values

## Notes

- The component automatically enriches the report with insights on load
- Test selection is handled via the `selectTest` function injected from `ReportLayout`
- Pagination resets to page 1 when filters or sorting options change
- The component is fully responsive and works on mobile devices
