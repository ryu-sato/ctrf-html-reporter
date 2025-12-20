---
layout: report
---

<script setup lang="ts">
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
</script>

# Timeline

Gantt chart visualization of test execution timeline with duration filtering

:::details Summary

<SummaryView 
  :summary="richReportWithInsights.results?.summary"
/>

:::

<TimelineChart
  :report="richReportWithInsights"
/>
