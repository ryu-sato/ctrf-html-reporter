---
layout: report
---

<script setup>
import { data as sortedReportsByTimestamp } from './sortedReportsByTimestamp.data.js';
</script>

# Timeline

Gantt chart visualization of test execution timeline with duration filtering

<TimelineChart
  :reports="sortedReportsByTimestamp"
/>
