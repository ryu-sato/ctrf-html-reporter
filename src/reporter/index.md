---
layout: report
---

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
import { data as testTree } from './organizeTestsBySuite.data.js';

// Summary
const summaryStatus = richReportWithInsights.results.summary.failed > 0 ? 'failed' : 'succeeded';

// Hash routing
const defaultPage = 'overview';
const activePage = ref<string>(defaultPage);

const updateFromHash = () => {
  const hash = window.location.hash.slice(1);
  activePage.value = hash || defaultPage;
};

onMounted(() => {
  updateFromHash();
  window.addEventListener('hashchange', updateFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateFromHash);
});
</script>

<div class="hash-router">
  <div v-show="activePage === 'overview'" class="hash-content">
    <!-- Page Header -->
    <div class="flex items-center justify-between pb-6">
      <h1 class="text-3xl font-bold tracking-tight mb-2">Overview</h1>
      <div>
        <StatusBadge :type="summaryStatus">{{ summaryStatus }}</StatusBadge>
      </div>
    </div>
    <!-- Test Summary Section -->
    <SummaryView
      v-if="richReportWithInsights.results.summary"
      :summary="richReportWithInsights.results.summary"
      :showChart="true"
      :showTimeInfo="true"
      :showAvgDuration="false"
      :showTotalDuration="true"
    />
    <!-- Report Info and Environment Info -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
      <ReportInfo :report="richReportWithInsights" />
      <EnvironmentInfo :environment="richReportWithInsights.results.environment" />
    </div>
  </div>

  <div v-show="activePage === 'suites'" class="hash-content">
    <h1 class="text-3xl font-bold tracking-tight mb-2">Suites</h1>
    <SummaryView
      v-if="testTree.summary"
      :summary="testTree.summary"
      :showChart="true"
      :showTimeInfo="true"
      :showAvgDuration="false"
      :showTotalDuration="true"
    />
    <TestTreeView :nodes="testTree.roots" />
  </div>

  <div v-show="activePage === 'insights'" class="hash-content">
    <h1 class="text-3xl font-bold tracking-tight mb-2">Insights</h1>
    <TestInsightsInfo
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
    <h2 class="text-xl font-bold tracking-tight mb-2">Tests</h2>
    <InsightsView
      :report="richReportWithInsights"
      :error="richReportWithInsights?.error"
    />
  </div>

  <div v-show="activePage === 'timeline'" class="hash-content">
    <h1 class="text-3xl font-bold tracking-tight mb-2">Timeline</h1>
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
  </div>
</div>
