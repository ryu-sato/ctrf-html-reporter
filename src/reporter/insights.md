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

// Prepare stats for TestStats component
const testStatsData = computed(() => {
  if (!aggregatedInsights.value) return null;
  
  return {
    stats: {
      total: aggregatedInsights.value.totalTests
    },
    additionalMetrics: [
      {
        label: 'Tests with Insights',
        value: aggregatedInsights.value.testsWithInsights
      },
      {
        label: 'Average Pass Rate',
        value: aggregatedInsights.value.avgPassRate,
        suffix: '%',
        style: { color: getPassRateColor(aggregatedInsights.value.avgPassRate) }
      },
      {
        label: 'Average Flaky Rate',
        value: aggregatedInsights.value.avgFlakyRate,
        suffix: '%',
        style: { color: aggregatedInsights.value.avgFlakyRate > 5 ? '#ef4444' : '#10b981' }
      },
      {
        label: 'Average Fail Rate',
        value: aggregatedInsights.value.avgFailRate,
        suffix: '%',
        style: { color: aggregatedInsights.value.avgFailRate > 10 ? '#ef4444' : '#10b981' }
      },
      {
        label: 'Average Duration',
        value: aggregatedInsights.value.avgDuration,
        suffix: 'ms'
      }
    ]
  };
});

// Prepare summary stats for TestStats component
const summaryStatsData = computed(() => {
  if (!richReportWithInsights?.results?.summary) return null;
  
  const summary = richReportWithInsights.results.summary;
  const additionalMetrics = [];
  
  if (summary.pending !== undefined) {
    additionalMetrics.push({
      label: 'Pending',
      value: summary.pending,
      style: { color: '#8b5cf6' }
    });
  }
  
  if (summary.flaky !== undefined && summary.flaky > 0) {
    additionalMetrics.push({
      label: 'Flaky',
      value: summary.flaky,
      style: { color: '#f97316' }
    });
  }
  
  if (summary.suites !== undefined) {
    additionalMetrics.push({
      label: 'Suites',
      value: summary.suites
    });
  }
  
  return {
    stats: {
      total: summary.tests,
      passed: summary.passed,
      failed: summary.failed,
      skipped: summary.skipped
    },
    additionalMetrics: additionalMetrics
  };
});
</script>

<style scoped>
.insights-container {
  max-width: 1200px;
  margin: 0 auto;
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

# Insights

<div class="insights-container">

<div v-if="richReportWithInsights?.error" class="error-message">
  <strong>Error:</strong> {{ richReportWithInsights.error }}
</div>

<div v-else-if="aggregatedInsights">

<TestStats 
  v-if="testStatsData"
  :stats="testStatsData.stats"
  :additionalMetrics="testStatsData.additionalMetrics"
  :showAvgDuration="false"
  :showTotalDuration="false"
/>

<TestStats 
  v-if="summaryStatsData"
  :stats="summaryStatsData.stats"
  :additionalMetrics="summaryStatsData.additionalMetrics"
  :showAvgDuration="false"
  :showTotalDuration="false"
/>

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

</div>

</div>

<div v-else>
  <p>Loading data...</p>
</div>

</div>

