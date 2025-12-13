<script setup>
import { ref, onMounted, computed } from 'vue';
import { data as report } from './report.data.js';
import { data as testTree } from './organizeTestsBySuite.data.js';
import { Chart, registerables } from 'chart.js';

// Tool
const tool = report.results.tool;

// Environment
const environment = report.results.environment;

// Tests
const tests = report.results.tests

// Summary
const summary = report.results.summary;
summary.duration ||= (summary.stop - summary.start);

// Tree Summary (from organizeTestsBySuite)
const treeSummary = testTree.summary;

const summaryStatus = summary.failed > 0 ? 'Failed' : 'Succeeded';

// Format duration with seconds unit (duration is already in seconds if calculated from start/stop)
const durationInSeconds = summary.duration;

// Prepare stats for TestStats component (from report.results.summary)
const reportStatsData = computed(() => {
  if (!summary) return null;
  
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
  
  if (summary.other !== undefined && summary.other > 0) {
    additionalMetrics.push({
      label: 'Other',
      value: summary.other,
      style: { color: '#6b7280' }
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

// Prepare stats for TestStats component (from testTree.summary)
const treeStatsData = computed(() => {
  if (!treeSummary) return null;
  
  const additionalMetrics = [];
  
  if (treeSummary.pending !== undefined) {
    additionalMetrics.push({
      label: 'Pending',
      value: treeSummary.pending,
      style: { color: '#8b5cf6' }
    });
  }
  
  if (treeSummary.flaky !== undefined && treeSummary.flaky > 0) {
    additionalMetrics.push({
      label: 'Flaky',
      value: treeSummary.flaky,
      style: { color: '#f97316' }
    });
  }
  
  if (treeSummary.other !== undefined && treeSummary.other > 0) {
    additionalMetrics.push({
      label: 'Other',
      value: treeSummary.other,
      style: { color: '#6b7280' }
    });
  }
  
  return {
    stats: {
      total: treeSummary.tests,
      passed: treeSummary.passed,
      failed: treeSummary.failed,
      skipped: treeSummary.skipped
    },
    additionalMetrics: additionalMetrics
  };
});

Chart.register(...registerables);
const chartCanvas = ref(null);

// Custom Plugin: Display Pass Rate at the Center of the Doughnut Chart
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart) => {
    if (chart.config.type === 'doughnut') {
      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      
      // Calculate the pass rate
      const total = summary.tests;
      const passedPercentage = total > 0 ? ((summary.passed / total) * 100).toFixed(1) : 0;
      
      ctx.restore();
      ctx.font = 'bold 2rem sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#10b981'; // green
      
      const text = `${passedPercentage}%`;
      const textX = width / 2;
      const textY = height / 2 - 10;
      
      ctx.fillText(text, textX, textY);
      
      // Add "Passed" label
      ctx.font = '0.9rem sans-serif';
      ctx.fillStyle = '#6b7280'; // gray
      ctx.fillText('Passed', textX, textY + 30);
      
      ctx.save();
    }
  }
};

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Skipped', 'Pending', 'Other', 'Flaky'],
        datasets: [{
          data: [
            summary.passed,
            summary.failed,
            summary.skipped,
            summary.pending,
            summary.other,
            summary.flaky
          ],
          backgroundColor: [
            '#10b981', // green - passed
            '#ef4444', // red - failed
            '#f59e0b', // amber - skipped
            '#8b5cf6', // purple - pending
            '#6b7280', // gray - other
            '#f97316'  // orange - flaky
          ],
          borderWidth: 1,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: 'Test Results Distribution'
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      },
      plugins: [centerTextPlugin]
    });
  }
});
</script>

# Overview

::: info Tool

name: {{ tool.name }}
<div v-if="tool.version">version: {{ tool.version }}</div>
<div v-if="tool.extra">extra: {{ tool.extra }}</div>

:::

::: details Environment

| Environment     |                 |
| --------------- | --------------- |
| reportName      | {{ environment.reportName }}      |
| appName         | {{ environment.appName }}         |
| appVersion      | {{ environment.appVersion }}      |
| buildId         | {{ environment.buildId }}         |
| buildName       | {{ environment.buildName }}       |
| buildNumber     | {{ environment.buildNumber }}     |
| buildUrl        | {{ environment.buildUrl }}        |
| repositoryName  | {{ environment.repositoryName }}  |
| repositoryUrl   | {{ environment.repositoryUrl }}   |
| commit          | {{ environment.commit }}          |
| branchName      | {{ environment.branchName }}      |
| osPlatform      | {{ environment.osPlatform }}      |
| osRelease       | {{ environment.osRelease }}       |
| osVersion       | {{ environment.osVersion }}       |
| testEnvironment | {{ environment.testEnvironment }} |
| healthy         | {{ environment.healthy }}         |
| extra           | {{ environment.extra }}           |

:::

## Summary

<Badge :type="summaryStatus === 'Failed' ? 'danger' : 'success'">{{ summaryStatus }}</Badge>

start: <DateTimeFormatter :timestamp="summary.start * 1000" />  
duration: {{ durationInSeconds }} sec

<div style="max-width: 500px; margin: 2rem auto;">
  <canvas ref="chartCanvas"></canvas>
</div>

### Test Results (from report.results.summary)

<TestStats 
  v-if="reportStatsData"
  :stats="reportStatsData.stats"
  :additionalMetrics="reportStatsData.additionalMetrics"
  :totalDuration="summary.duration * 1000"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>

### Organized Test Results (from testTree.summary)

<TestStats 
  v-if="treeStatsData"
  :stats="treeStatsData.stats"
  :additionalMetrics="treeStatsData.additionalMetrics"
  :totalDuration="treeSummary.duration"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>
