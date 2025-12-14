<script setup>
import { ref, onMounted, computed } from 'vue';
import { data as richReportWithInsights } from './richReportWithInsights.data.js';
import { Chart, registerables } from 'chart.js';

// Summary
const summaryStatus = richReportWithInsights.results.summary.failed > 0 ? 'Failed' : 'Succeeded';

// Prepare stats for TestStats component (from report.results.summary)
const reportStatsData = computed(() => {
  const summary = richReportWithInsights.results.summary;
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

Chart.register(...registerables);
const chartCanvas = ref(null);

// Custom Plugin: Display Pass Rate at the Center of the Doughnut Chart
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart) => {
    if (chart.config.type === 'doughnut') {
      const summary = richReportWithInsights.results.summary;

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
    const summary = richReportWithInsights.results.summary;
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

<ReportInfo v-if="richReportWithInsights" :report="richReportWithInsights" />

<EnvironmentInfo v-if="richReportWithInsights.results.environment" :environment="richReportWithInsights.results.environment" />

## Summary

<Badge :type="summaryStatus === 'Failed' ? 'danger' : 'success'">{{ summaryStatus }}</Badge>

* start: <DateTimeFormatter :timestamp="richReportWithInsights.results.summary.start * 1000" />
* stop: <DateTimeFormatter :timestamp="richReportWithInsights.results.summary.stop * 1000" />

<div style="max-width: 500px; margin: 2rem auto;">
  <canvas ref="chartCanvas"></canvas>
</div>

### Test Results

<TestStats 
  v-if="reportStatsData"
  :stats="reportStatsData.stats"
  :additionalMetrics="reportStatsData.additionalMetrics"
  :totalDuration="richReportWithInsights.results.summary.duration"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>
