---
layout: report
---

<script setup>
import { ref, computed, inject } from 'vue';
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
import { formatPercent, formatDuration } from './.vitepress/helpers/formatter.js';

// Get test selection function from ReportLayout
const selectTest = inject('selectTest');

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

.tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.test-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.test-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.test-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.test-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

.test-card-suite {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.test-card-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-weight: 600;
  font-size: 0.9rem;
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

<div class="section">

## Tests

<div class="tests-grid">
  <div 
    v-for="test in richReportWithInsights.results.tests" 
    :key="test.name" 
    class="test-card"
    @click="handleTestClick(test)"
  >
    <div class="test-card-header">
      <div class="test-card-title">{{ test.name }}</div>
      <span class="status-badge" :style="{ background: getStatusColor(test.status), color: 'white' }">
        {{ test.status }}
      </span>
    </div>
    <div class="test-card-suite">{{ test.suite }}</div>
    <div class="test-card-metrics">
      <div class="metric-item">
        <div class="metric-label">Pass Rate</div>
        <div class="metric-value">
          <span class="rate-badge" :style="{ background: getPassRateColor(formatPercent(test.insights?.passRate?.current)) }">
            <PercentFormatter :value="test.insights?.passRate?.current" />
          </span>
        </div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Flaky Rate</div>
        <div class="metric-value">
          <span class="rate-badge" :style="{ background: formatPercent(test.insights?.flakyRate?.current) > 5 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' }">
            <PercentFormatter :value="test.insights?.flakyRate?.current" />
          </span>
        </div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Fail Rate</div>
        <div class="metric-value">
          <span class="rate-badge" :style="{ background: formatPercent(test.insights?.failRate?.current) > 10 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' }">
            <PercentFormatter :value="test.insights?.failRate?.current" />
          </span>
        </div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Runs</div>
        <div class="metric-value">{{ test.insights?.executedInRuns }}</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">Avg Duration</div>
        <div class="metric-value">{{ test.insights?.averageTestDuration?.current }}ms</div>
      </div>
      <div class="metric-item">
        <div class="metric-label">95th Percentile</div>
        <div class="metric-value">{{ test.insights?.p95TestDuration?.current }}ms</div>
      </div>
    </div>
  </div>
</div>

</div>

</div>

<div v-else>
  <p>Loading data...</p>
</div>

</div>

