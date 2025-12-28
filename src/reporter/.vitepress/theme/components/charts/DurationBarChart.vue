<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import type { TreeNode } from 'ctrf';
import { Stats } from 'fast-stats';

const props = defineProps({
  nodes: {
    type: Array as () => TreeNode[],
    required: true,
    validator: (value: any) => {
      return Array.isArray(value);
    }
  },
});

const sortedNodes = computed(() => {
  return [...props.nodes].sort((a, b) => b.duration - a.duration);
});
const statsDurations = new Stats().push(sortedNodes.value.map(node => node.duration));
const p75Duration = statsDurations.percentile(75);
const p50Duration = statsDurations.percentile(50);

// Get CSS variable color
const getCssColor = (varName: string) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '';
};

Chart.register(...registerables);
const chartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  const ctx = chartCanvas.value?.getContext('2d');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedNodes.value.map(node => node.name),
      datasets: [{
        label: 'Duration',
        data: sortedNodes.value.map(node => node.duration),
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
      normalized: true
    },
  });
});
</script>
