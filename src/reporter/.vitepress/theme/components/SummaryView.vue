<template>
  <div class="summary-view">
    <!-- Test Stats -->
    <TestStats 
      v-if="statsData"
      :stats="statsData.stats"
      :additionalMetrics="statsData.additionalMetrics"
      :totalDuration="summary.duration"
      :showAvgDuration="showAvgDuration"
      :showTotalDuration="showTotalDuration"
    />

    <!-- Chart -->
    <div v-if="showChart" :style="chartContainerStyle">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <!-- Time Info -->
    <div v-if="showTimeInfo && summary.start && summary.stop" class="time-info">
      <div class="time-info-item">
        <span class="time-label">Start:</span>
        <DateTimeFormatter :timestamp="summary.start * 1000" />
      </div>
      <div class="time-info-item">
        <span class="time-label">Stop:</span>
        <DateTimeFormatter :timestamp="summary.stop * 1000" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';

const props = defineProps({
  summary: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.tests !== undefined;
    }
  },
  showChart: {
    type: Boolean,
    default: true
  },
  showTimeInfo: {
    type: Boolean,
    default: true
  },
  showAvgDuration: {
    type: Boolean,
    default: false
  },
  showTotalDuration: {
    type: Boolean,
    default: true
  },
  chartContainerStyle: {
    type: Object,
    default: () => ({ maxWidth: '300px', margin: '2rem auto' })
  },
  chartTitle: {
    type: String,
    default: 'Test Results Distribution'
  }
});

// Prepare stats for TestStats component
const statsData = computed(() => {
  const s = props.summary;
  if (!s) return null;
  
  const additionalMetrics = [];
  
  if (s.pending !== undefined) {
    additionalMetrics.push({
      label: 'Pending',
      value: s.pending,
      style: { color: '#8b5cf6' }
    });
  }
  
  if (s.flaky !== undefined && s.flaky > 0) {
    additionalMetrics.push({
      label: 'Flaky',
      value: s.flaky,
      style: { color: '#f97316' }
    });
  }
  
  if (s.other !== undefined && s.other > 0) {
    additionalMetrics.push({
      label: 'Other',
      value: s.other,
      style: { color: '#6b7280' }
    });
  }
  
  if (s.suites !== undefined) {
    additionalMetrics.push({
      label: 'Suites',
      value: s.suites
    });
  }
  
  return {
    stats: {
      total: s.tests,
      passed: s.passed,
      failed: s.failed,
      skipped: s.skipped
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
      const s = props.summary;

      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      
      // Calculate the pass rate
      const total = s.tests;
      const passedPercentage = total > 0 ? ((s.passed / total) * 100).toFixed(1) : 0;
      
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
  if (props.showChart && chartCanvas.value) {
    const s = props.summary;
    const ctx = chartCanvas.value.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Skipped', 'Pending', 'Other', 'Flaky'],
        datasets: [{
          data: [
            s.passed || 0,
            s.failed || 0,
            s.skipped || 0,
            s.pending || 0,
            s.other || 0,
            s.flaky || 0
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
            text: props.chartTitle
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

<style scoped>
.summary-view {
  margin: 1rem 0;
}

.time-info {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  border-left: 4px solid var(--vp-c-brand);
}

.time-info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.time-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 60px;
}
</style>
