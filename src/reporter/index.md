<script setup>
import { data as richReportWithInsights } from './richReportWithInsights.data.js';

// Summary
const summaryStatus = richReportWithInsights.results.summary.failed > 0 ? 'Failed' : 'Succeeded';
</script>

# Overview

<ReportInfo
  v-if="richReportWithInsights"
  :report="richReportWithInsights"
/>

<EnvironmentInfo
  v-if="richReportWithInsights.results.environment"
  :environment="richReportWithInsights.results.environment"
/>

## Summary

Status: <Badge :type="summaryStatus === 'Failed' ? 'danger' : 'success'">{{ summaryStatus }}</Badge>

<SummaryView 
  v-if="richReportWithInsights.results.summary"
  :summary="richReportWithInsights.results.summary"
  :showChart="true"
  :showTimeInfo="true"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>
