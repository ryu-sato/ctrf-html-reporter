<template>
  <div ref="containerRef" class="chart-container">
    <canvas ref="chartCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';
import type { Summary } from 'ctrf';
import { useData } from 'vitepress';

const props = defineProps({
  summary: {
    type: Object as () => Summary,
    required: true,
    validator: (value: any) => {
      return value.tests !== undefined;
    }
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

// Get VitePress dark mode state
const { isDark } = useData();

Chart.register(...registerables);
const chartCanvas = ref<HTMLCanvasElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
let chartInstance: Chart | null = null;
let resizeObserver: ResizeObserver | null = null;

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

const createChart = () => {
  if (!chartCanvas.value) return;

  const s = props.summary;
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Calculate totals
  const totalTests = s.tests || 0;
  const flakyCount = s.flaky || 0;
  const nonFlakyCount = totalTests - flakyCount;

  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        'Passed', 'Failed', 'Skipped', 'Pending', 'Other',
        'Flaky', 'Non-Flaky'
      ],
      datasets: [
        // Inner ring: Test status
        {
          label: 'Test Status',
          data: [
            s.passed || 0,
            s.failed || 0,
            s.skipped || 0,
            s.pending || 0,
            s.other || 0
          ],
          backgroundColor: [
            getCssColor('--vp-c-green-1') || '#10b981',
            getCssColor('--vp-c-red-1') || '#ef4444',
            getCssColor('--vp-c-yellow-1') || '#f59e0b',
            getCssColor('--vp-c-purple-1') || '#8b5cf6',
            getCssColor('--vp-c-text-2') || '#6b7280'
          ],
          borderWidth: 1,
          borderColor: getCssColor('--vp-c-bg') || '#fff'
        },
        // Outer ring: Flaky status
        {
          label: 'Flaky Status',
          data: [
            flakyCount,
            nonFlakyCount
          ],
          backgroundColor: [
            getCssColor('--vp-c-orange-1') || '#f97316',
            getCssColor('--vp-c-bg-soft') || '#f3f4f6'
          ],
          borderWidth: 1,
          borderColor: getCssColor('--vp-c-bg') || '#fff'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            generateLabels: function(chart) {
              const datasets = chart.data.datasets;
              const labels: any[] = [];

              // Inner ring labels
              if (datasets[0]) {
                datasets[0].data.forEach((value, index) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  if (numValue > 0) {
                    labels.push({
                      text: chart.data.labels![index],
                      fillStyle: (datasets[0].backgroundColor as string[])[index],
                      hidden: false,
                      index: index,
                      datasetIndex: 0
                    });
                  }
                });
              }

              // Flaky label from outer ring
              if (datasets[1] && datasets[1].data[0]) {
                const flakyValue = datasets[1].data[0];
                const numFlakyValue = typeof flakyValue === 'number' ? flakyValue : 0;
                if (numFlakyValue > 0) {
                  labels.push({
                    text: chart.data.labels![5], // 'Flaky'
                    fillStyle: (datasets[1].backgroundColor as string[])[0],
                    hidden: false,
                    index: 0,
                    datasetIndex: 1
                  });
                }
              }

              return labels;
            }
          }
        },
        title: {
          display: true,
          text: props.chartTitle
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const datasetIndex = context.datasetIndex;
              const dataIndex = context.dataIndex;

              if (datasetIndex === 0) {
                // Inner ring: Show test status
                const label = ['Passed', 'Failed', 'Skipped', 'Pending', 'Other'][dataIndex];
                const value = context.parsed || 0;
                const total = totalTests;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              } else {
                // Outer ring: Show flaky status
                const label = dataIndex === 0 ? 'Flaky' : 'Non-Flaky';
                const value = context.parsed || 0;
                const total = totalTests;
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    },
    plugins: [centerTextPlugin]
  });
};

onMounted(() => {
  createChart();

  // Setup ResizeObserver to detect width/height changes
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (chartInstance) {
        chartInstance.resize();
      }
    });
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  // Cleanup
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
});

// Watch for summary changes and recreate chart
watch(() => props.summary, () => {
  createChart();
}, { deep: true });

// Watch for dark mode changes and recreate chart
watch(isDark, async () => {
  await nextTick();
  setTimeout(() => {
    createChart();
  }, 0);
});
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
}
</style>
