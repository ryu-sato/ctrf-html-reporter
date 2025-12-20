<template>
  <div class="summary-view">
    <!-- Test Stats -->
    <div class="timeline-stats">
      <div class="stat-item">
        <span class="stat-label">Total Tests</span>
        <span class="stat-value">{{ summary.tests }}</span>
      </div>
      <div class="stat-item" v-if="summary.passed !== undefined">
        <span class="stat-label">Passed</span>
        <span class="stat-value status-passed">{{ summary.passed }}</span>
      </div>
      <div class="stat-item" v-if="summary.failed !== undefined">
        <span class="stat-label">Failed</span>
        <span class="stat-value status-failed">{{ summary.failed }}</span>
      </div>
      <div class="stat-item" v-if="summary.skipped !== undefined">
        <span class="stat-label">Skipped</span>
        <span class="stat-value status-skipped">{{ summary.skipped }}</span>
      </div>
      <div class="stat-item" v-if="summary.pending !== undefined">
        <span class="stat-label">Pending</span>
        <span class="stat-value" style="color: var(--vp-c-purple-1)">{{ summary.pending }}</span>
      </div>
      <div class="stat-item" v-if="summary.flaky !== undefined && summary.flaky > 0">
        <span class="stat-label">Flaky</span>
        <span class="stat-value" style="color: var(--vp-c-orange-1)">{{ summary.flaky }}</span>
      </div>
      <div class="stat-item" v-if="summary.other !== undefined && summary.other > 0">
        <span class="stat-label">Other</span>
        <span class="stat-value" style="color: var(--vp-c-text-2)">{{ summary.other }}</span>
      </div>
      <div class="stat-item" v-if="summary.suites !== undefined">
        <span class="stat-label">Suites</span>
        <span class="stat-value">{{ summary.suites }}</span>
      </div>
      <div class="stat-item" v-if="showTotalDuration">
        <span class="stat-label">Total Duration</span>
        <span class="stat-value">{{ formatDuration(summary.duration) }}</span>
      </div>
    </div>

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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import { formatDuration } from '../../../helpers/formatter';
import type { Summary } from 'ctrf';

const props = defineProps({
  summary: {
    type: Object as () => Summary,
    required: true,
    validator: (value: any) => {
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

// Get CSS variable color
const getCssColor = (varName: string) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '';
};

Chart.register(...registerables);
const chartCanvas = ref<HTMLCanvasElement | null>(null);

// Custom Plugin: Display Pass Rate at the Center of the Doughnut Chart
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart: any) => {
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
      ctx.fillStyle = getCssColor('--vp-c-green-1') || '#10b981';
      
      const text = `${passedPercentage}%`;
      const textX = width / 2;
      const textY = height / 2 - 10;
      
      ctx.fillText(text, textX, textY);
      
      // Add "Passed" label
      ctx.font = '0.9rem sans-serif';
      ctx.fillStyle = getCssColor('--vp-c-text-2') || '#6b7280';
      ctx.fillText('Passed', textX, textY + 30);
      
      ctx.save();
    }
  }
};

onMounted(() => {
  if (props.showChart && chartCanvas.value) {
    const s = props.summary;
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;
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
            getCssColor('--vp-c-green-1') || '#10b981',
            getCssColor('--vp-c-red-1') || '#ef4444',
            getCssColor('--vp-c-yellow-1') || '#f59e0b',
            getCssColor('--vp-c-purple-1') || '#8b5cf6',
            getCssColor('--vp-c-text-2') || '#6b7280',
            getCssColor('--vp-c-orange-1') || '#f97316'
          ],
          borderWidth: 1,
          borderColor: getCssColor('--vp-c-bg') || '#fff'
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
/* =========================
   Container
   ========================= */
.summary-view {
  margin: var(--report-spacing-lg) 0;
}

/* =========================
   Statistics
   ========================= */
.timeline-stats {
  display: flex;
  gap: var(--report-spacing-2xl);
  margin-bottom: var(--report-spacing-xl);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: var(--report-spacing-xs);
}

.stat-label {
  font-size: var(--report-control-font-size);
  color: var(--vp-c-text-2);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.status-passed { 
  color: var(--report-status-passed);
}

.status-failed { 
  color: var(--report-status-failed);
}

.status-skipped { 
  color: var(--report-status-skipped);
}

/* =========================
   Time Information
   ========================= */
.time-info {
  margin-top: var(--report-spacing-xl);
  padding: var(--report-spacing-lg);
  background-color: var(--vp-c-bg-soft);
  border-radius: var(--report-card-border-radius);
  border-left: 4px solid var(--vp-c-brand);
}

.time-info-item {
  display: flex;
  align-items: center;
  gap: var(--report-spacing-sm);
  margin: var(--report-spacing-sm) 0;
}

.time-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 60px;
}
</style>
