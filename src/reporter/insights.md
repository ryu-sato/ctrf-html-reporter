---
layout: report
---

<script setup lang="ts">
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
</script>

# Insights

<TestInsights 
  v-if="richReportWithInsights.insights"
  :insights="richReportWithInsights.insights"
/>

:::details Extra
<pre>{{ richReportWithInsights.insights.extra }}</pre>
:::

:::details Summary
<SummaryView 
  v-if="richReportWithInsights.results.summary"
  :summary="richReportWithInsights.results.summary"
  :showChart="true"
  :showTimeInfo="true"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>
:::

## Tests

<InsightsView 
  :report="richReportWithInsights" 
  :error="richReportWithInsights?.error"
/>