---
layout: report
---

<script setup>
import { ref, computed, inject } from 'vue';
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
import { formatPercent, formatDuration } from './.vitepress/helpers/formatter.js';

// Get test selection function from ReportLayout
const selectTest = inject('selectTest');

// Get tests with most interesting insights
const notableTests = computed(() => {
  if (!richReportWithInsights?.results?.tests) return [];
  
  return richReportWithInsights.results.tests
    .filter(test => test.insights)
    .map(test => ({
      name: test.name,
      status: test.status,
      duration: test.duration,
      flaky: test.flaky,
      passRate: (test.insights.passRate?.current * 100).toFixed(1),
      flakyRate: (test.insights.flakyRate?.current * 100).toFixed(1),
      failRate: (test.insights.failRate?.current * 100).toFixed(1),
      avgDuration: test.insights.averageTestDuration?.current,
      executedInRuns: test.insights.executedInRuns,
      suite: test.suite?.join(' > ') || 'N/A',
      originalTest: test  // Keep reference to original test object
    }))
    .sort((a, b) => parseFloat(b.flakyRate) - parseFloat(a.flakyRate))
    .slice(0, 10);
});

// Handle test row click
const handleTestClick = (test) => {
  if (selectTest && test.originalTest) {
    selectTest(test.originalTest);
  }
};

// Get status color
const getStatusColor = (status) => {
  const colors = {
    passed: 'var(--vp-c-green-1)',
    failed: 'var(--vp-c-red-1)',
    skipped: 'var(--vp-c-yellow-1)',
    pending: 'var(--vp-c-text-2)'
  };
  return colors[status] || 'var(--vp-c-text-2)';
};

const getPassRateColor = (rate) => {
  const r = parseFloat(rate);
  if (r >= 95) return 'var(--vp-c-green-1)';
  if (r >= 80) return 'var(--vp-c-yellow-1)';
  return 'var(--vp-c-red-1)';
};

// Prepare stats for TestStats component
const testStatsData = computed(() => {
  const insight = richReportWithInsights.insights;
  if (!insight) return null;
  
  return {
    stats: {
      total: richReportWithInsights.results.summary.tests,
    },
    additionalMetrics: [
      {
        label: 'Average Run Duration',
        value: formatDuration(insight.averageRunDuration.current),
      },
      {
        label: 'Average Test Duration',
        value: formatDuration(insight.averageTestDuration.current),
      },
      {
        label: '95 Percentile Run Duration',
        value: insight.p95RunDuration.current,
        suffix: 'ms',
      },
      {
        label: 'Fail Rate',
        value: formatPercent(insight.failRate.current, 1),
        suffix: '%',
        style: { color: formatPercent(insight.failRate.current, 1) > 10 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' },
      },
      {
        label: 'Flaky Rate',
        value: formatPercent(insight.flakyRate.current),
        suffix: '%',
        style: { color: formatPercent(insight.flakyRate.current) > 10 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' },
      },
      {
        label: 'Pass Rate',
        value: formatPercent(insight.passRate.current),
        suffix: '%',
        style: { color: getPassRateColor(formatPercent(insight.passRate.current)) },
      },
    ]
  };
});
</script>

<style scoped>
.insights-container {
  max-width: 1200px;
  margin: 0 auto;
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.rate-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  color: white;
}

.test-name {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.suite-path {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.tests-table {
  width: 100%;
  border-collapse: collapse;
}

.tests-table tbody tr {
  cursor: pointer;
  transition: background-color 0.2s;
}

.tests-table tbody tr:hover {
  background-color: var(--vp-c-bg-soft);
}

.section {
  margin: 3rem 0;
}

.error-message {
  padding: 1rem;
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-1);
  border-radius: 8px;
  color: var(--vp-c-danger-1);
}
</style>

# Insights

<div class="insights-container">

<div v-if="richReportWithInsights?.error" class="error-message">
  <strong>Error:</strong> {{ richReportWithInsights.error }}
</div>

<div v-else-if="richReportWithInsights.insights">

<TestStats 
  v-if="testStatsData"
  :stats="testStatsData.stats"
  :additionalMetrics="testStatsData.additionalMetrics"
  :showAvgDuration="false"
  :showTotalDuration="false"
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

<div class="section">

## Notable Tests (Sorted by Flaky Rate)

<table class="tests-table">
  <thead>
    <tr>
      <th>Test Name</th>
      <th>Suite</th>
      <th>Status</th>
      <th>Pass Rate</th>
      <th>Flaky Rate</th>
      <th>Fail Rate</th>
      <th>Avg Duration</th>
      <th>Runs</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="test in notableTests" :key="test.name" @click="handleTestClick(test)">
      <td>
        <div class="test-name" :title="test.name">{{ test.name }}</div>
      </td>
      <td>
        <div class="suite-path">{{ test.suite }}</div>
      </td>
      <td>
        <span class="status-badge" :style="{ background: getStatusColor(test.status), color: 'white' }">
          {{ test.status }}
        </span>
      </td>
      <td>
        <span class="rate-badge" :style="{ background: getPassRateColor(test.passRate) }">
          {{ test.passRate }}%
        </span>
      </td>
      <td>
        <span class="rate-badge" :style="{ background: parseFloat(test.flakyRate) > 5 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' }">
          {{ test.flakyRate }}%
        </span>
      </td>
      <td>
        <span class="rate-badge" :style="{ background: parseFloat(test.failRate) > 10 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' }">
          {{ test.failRate }}%
        </span>
      </td>
      <td>{{ test.avgDuration }}ms</td>
      <td>{{ test.executedInRuns }}</td>
    </tr>
  </tbody>
</table>

</div>

</div>

<div v-else>
  <p>Loading data...</p>
</div>

</div>

