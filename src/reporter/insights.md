<script setup>
import { ref, computed } from 'vue';
import { data as richReportWithInsights } from './richReportWithInsights.data.js';

// Compute aggregated insights
const aggregatedInsights = computed(() => {
  if (!richReportWithInsights?.results?.tests) return null;
  
  const tests = richReportWithInsights.results.tests;
  const totalTests = tests.length;
  
  // Calculate average metrics
  let totalPassRate = 0;
  let totalFlakyRate = 0;
  let totalFailRate = 0;
  let totalAvgDuration = 0;
  let totalP95Duration = 0;
  let testsWithInsights = 0;
  
  tests.forEach(test => {
    if (test.insights) {
      testsWithInsights++;
      totalPassRate += test.insights.passRate?.current || 0;
      totalFlakyRate += test.insights.flakyRate?.current || 0;
      totalFailRate += test.insights.failRate?.current || 0;
      totalAvgDuration += test.insights.averageTestDuration?.current || 0;
      totalP95Duration += test.insights.p95TestDuration?.current || 0;
    }
  });
  
  return {
    avgPassRate: testsWithInsights > 0 ? (totalPassRate / testsWithInsights * 100).toFixed(2) : 0,
    avgFlakyRate: testsWithInsights > 0 ? (totalFlakyRate / testsWithInsights * 100).toFixed(2) : 0,
    avgFailRate: testsWithInsights > 0 ? (totalFailRate / testsWithInsights * 100).toFixed(2) : 0,
    avgDuration: testsWithInsights > 0 ? (totalAvgDuration / testsWithInsights).toFixed(0) : 0,
    avgP95Duration: testsWithInsights > 0 ? (totalP95Duration / testsWithInsights).toFixed(0) : 0,
    totalTests,
    testsWithInsights
  };
});

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
      suite: test.suite?.join(' > ') || 'N/A'
    }))
    .sort((a, b) => parseFloat(b.flakyRate) - parseFloat(a.flakyRate))
    .slice(0, 10);
});

// Get status color
const getStatusColor = (status) => {
  const colors = {
    passed: '#10b981',
    failed: '#ef4444',
    skipped: '#f59e0b',
    pending: '#6b7280'
  };
  return colors[status] || '#6b7280';
};

const getPassRateColor = (rate) => {
  const r = parseFloat(rate);
  if (r >= 95) return '#10b981';
  if (r >= 80) return '#f59e0b';
  return '#ef4444';
};
</script>

<style scoped>
.insights-container {
  max-width: 1200px;
  margin: 0 auto;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}

.metric-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.metric-label {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.tests-table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  font-size: 0.875rem;
}

.tests-table th,
.tests-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tests-table th {
  background: var(--vp-c-bg-soft);
  font-weight: 600;
  position: sticky;
  top: 0;
}

.tests-table tr:hover {
  background: var(--vp-c-bg-soft);
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

.section {
  margin: 3rem 0;
}

.error-message {
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #991b1b;
}
</style>

# Test Insights

<div class="insights-container">

<div v-if="richReportWithInsights?.error" class="error-message">
  <strong>Error:</strong> {{ richReportWithInsights.error }}
</div>

<div v-else-if="aggregatedInsights">

## Overview Metrics

<div class="metrics-grid">
  <div class="metric-card">
    <div class="metric-label">Total Tests</div>
    <div class="metric-value">{{ aggregatedInsights.totalTests }}</div>
  </div>
  
  <div class="metric-card">
    <div class="metric-label">Tests with Insights</div>
    <div class="metric-value">{{ aggregatedInsights.testsWithInsights }}</div>
  </div>
  
  <div class="metric-card">
    <div class="metric-label">Average Pass Rate</div>
    <div class="metric-value" :style="{ color: getPassRateColor(aggregatedInsights.avgPassRate) }">
      {{ aggregatedInsights.avgPassRate }}%
    </div>
  </div>
  
  <div class="metric-card">
    <div class="metric-label">Average Flaky Rate</div>
    <div class="metric-value" :style="{ color: aggregatedInsights.avgFlakyRate > 5 ? '#ef4444' : '#10b981' }">
      {{ aggregatedInsights.avgFlakyRate }}%
    </div>
  </div>
  
  <div class="metric-card">
    <div class="metric-label">Average Fail Rate</div>
    <div class="metric-value" :style="{ color: aggregatedInsights.avgFailRate > 10 ? '#ef4444' : '#10b981' }">
      {{ aggregatedInsights.avgFailRate }}%
    </div>
  </div>
  
  <div class="metric-card">
    <div class="metric-label">Average Duration</div>
    <div class="metric-value">{{ aggregatedInsights.avgDuration }}ms</div>
  </div>
</div>

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
    <tr v-for="test in notableTests" :key="test.name">
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
        <span class="rate-badge" :style="{ background: parseFloat(test.flakyRate) > 5 ? '#ef4444' : '#10b981' }">
          {{ test.flakyRate }}%
        </span>
      </td>
      <td>
        <span class="rate-badge" :style="{ background: parseFloat(test.failRate) > 10 ? '#ef4444' : '#10b981' }">
          {{ test.failRate }}%
        </span>
      </td>
      <td>{{ test.avgDuration }}ms</td>
      <td>{{ test.executedInRuns }}</td>
    </tr>
  </tbody>
</table>

</div>

<div class="section" v-if="richReportWithInsights?.results?.summary">

## Report Information

- **Report ID**: {{ richReportWithInsights.reportId }}
- **Generated By**: {{ richReportWithInsights.generatedBy }}
- **Timestamp**: {{ new Date(richReportWithInsights.timestamp).toLocaleString('en-US') }}
- **Tool**: {{ richReportWithInsights.results.tool.name }} v{{ richReportWithInsights.results.tool.version }}
- **Duration**: {{ richReportWithInsights.results.summary.duration }}ms

### Summary

- **Total Tests**: {{ richReportWithInsights.results.summary.tests }}
- **Passed**: {{ richReportWithInsights.results.summary.passed }}
- **Failed**: {{ richReportWithInsights.results.summary.failed }}
- **Skipped**: {{ richReportWithInsights.results.summary.skipped }}
- **Pending**: {{ richReportWithInsights.results.summary.pending }}
- **Flaky**: {{ richReportWithInsights.results.summary.flaky }}
- **Suites**: {{ richReportWithInsights.results.summary.suites }}

</div>

</div>

<div v-else>
  <p>Loading data...</p>
</div>

</div>

