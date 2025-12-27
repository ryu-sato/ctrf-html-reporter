---
layout: report
---

<script setup lang="ts">
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
import { data as testTree } from './organizeTestsBySuite.data.js';
import TabsRouter from './.vitepress/theme/components/TabsRouter.vue';

// Summary
const summaryStatus = richReportWithInsights.results.summary.failed > 0 ? 'Failed' : 'Succeeded';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'suites', label: 'Suites' },
  { id: 'insights', label: 'Insights' },
  { id: 'timeline', label: 'Timeline' }
];
</script>

<TabsRouter :tabs="tabs">
  <template #overview>
    <h1>Overview</h1>
    <ReportInfo
      v-if="richReportWithInsights"
      :report="richReportWithInsights"
    />
    <EnvironmentInfo
      v-if="richReportWithInsights.results.environment"
      :environment="richReportWithInsights.results.environment"
    />
    <h2>Summary</h2>
    Status: <Badge :type="summaryStatus === 'Failed' ? 'danger' : 'success'">{{ summaryStatus }}</Badge>
    <SummaryView
      v-if="richReportWithInsights.results.summary"
      :summary="richReportWithInsights.results.summary"
      :showChart="true"
      :showTimeInfo="true"
      :showAvgDuration="false"
      :showTotalDuration="true"
    />
  </template>

  <template #suites>
    <h1>Suites</h1>
    <SummaryView
      v-if="testTree.summary"
      :summary="testTree.summary"
      :showChart="true"
      :showTimeInfo="true"
      :showAvgDuration="false"
      :showTotalDuration="true"
    />
    <TestTreeView :nodes="testTree.roots" />
  </template>

  <template #insights>
    <h1>Insights</h1>
    <TestInsights
      v-if="richReportWithInsights.insights"
      :insights="richReportWithInsights.insights"
    />
    <details>
      <summary>Extra</summary>
      <pre>{{ richReportWithInsights.insights.extra }}</pre>
    </details>
    <details>
      <summary>Summary</summary>
      <SummaryView
        v-if="richReportWithInsights.results.summary"
        :summary="richReportWithInsights.results.summary"
        :showChart="true"
        :showTimeInfo="true"
        :showAvgDuration="false"
        :showTotalDuration="true"
      />
    </details>
    <h2>Tests</h2>
    <InsightsView
      :report="richReportWithInsights"
      :error="richReportWithInsights?.error"
    />
  </template>

  <template #timeline>
    <h1>Timeline</h1>
    <p>Gantt chart visualization of test execution timeline with duration filtering</p>
    <details>
      <summary>Summary</summary>
      <SummaryView
        :summary="richReportWithInsights.results?.summary"
      />
    </details>
    <TimelineChart
      :report="richReportWithInsights"
    />
  </template>
</TabsRouter>
