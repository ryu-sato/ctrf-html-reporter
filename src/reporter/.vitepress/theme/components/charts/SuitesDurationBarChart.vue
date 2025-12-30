<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { Chart, registerables, type ChartConfiguration, type ChartConfigurationCustomTypesPerDataset, type DefaultDataPoint } from 'chart.js';
import type { TreeNode } from 'ctrf';
import { Stats } from 'fast-stats';
import { useData } from 'vitepress';

const props = defineProps({
  nodes: {
    type: Array as () => TreeNode[],
    required: true,
    validator: (value: any) => {
      return Array.isArray(value);
    }
  },
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
let chart: Chart | null = null;

const SuitesDurationBarChart = (nodes: TreeNode[]): ChartConfiguration<'bar', DefaultDataPoint<'bar'>, string> | ChartConfigurationCustomTypesPerDataset<'bar', DefaultDataPoint<'bar'>, string> => {

  const sortedNodes = nodes.sort((a, b) => b.duration - a.duration);
  const statsDurations = new Stats().push(sortedNodes.map(node => node.duration));
  const p75Duration = statsDurations.percentile(75);
  const p50Duration = statsDurations.percentile(50);

  return {
    type: 'bar',
    data: {
      labels: sortedNodes.map(node => node.name),
      datasets: [{
        label: 'Duration',
        data: sortedNodes.map(node => node.duration),
        backgroundColor: function(context) {
          const value = context.parsed.x;
          if (value && value > p75Duration) return getCssColor('--vp-c-danger-1'); // danger for slow
          if (value && value > p50Duration) return getCssColor('--vp-c-warning-1'); // warning for medium
          return getCssColor('--vp-c-success-1'); // success for fast
        }
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Test Suite Duration (sorted by slowest)'
        },
        subtitle: {
          display: true,
          text: `75th Percentile: ${p75Duration.toFixed(2)} ms, 50th Percentile: ${p50Duration.toFixed(2)} ms`
        },
    },
      scales: {
        x: {
          title: { display: true, text: 'Milli Seconds' }
        }
      },
      normalized: true,
    },
  };
};

const updateChart = (nodes: TreeNode[]) => {
  const ctx = chartCanvas.value?.getContext('2d');
  if (!ctx) return;

  const chartData = SuitesDurationBarChart(nodes);
  if (!chart) {
    chart = new Chart(ctx, chartData);
    return;
  }
  else {
    chart.destroy();
    chart = new Chart(ctx, chartData);
  }
};

// update chart when props.nodes change
watch(() => props.nodes, (newNodes: TreeNode[]) => {
  updateChart(newNodes);
}, { immediate: true });

// Watch for dark mode changes and recreate chart
watch(isDark, async () => {
  await nextTick();
  setTimeout(() => {
    updateChart(props.nodes);
  }, 0);
});

onMounted(() => {
  updateChart(props.nodes);
});
</script>
