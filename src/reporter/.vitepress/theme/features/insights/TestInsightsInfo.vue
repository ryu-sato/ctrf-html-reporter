<template>
  <div class="mb-6">
    <!-- Runs Analyzed - Standalone metric -->
    <div v-if="insights.runsAnalyzed !== undefined" class="flex justify-between items-center bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded-lg p-4 px-5 mb-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
      <span class="text-sm font-semibold text-[var(--vp-c-text-2)] uppercase tracking-wider">{{ labels.runsAnalyzed }}</span>
      <span
        class="text-2xl font-bold text-[var(--vp-c-text-1)]"
        :style="getCurrentStyle('runsAnalyzed', insights.runsAnalyzed!, 'number')"
      >
        {{ insights.runsAnalyzed }}
      </span>
    </div>

    <!-- Additional custom metrics as cards -->
    <div
      v-for="(metric, index) in additionalMetrics"
      :key="`additional-${index}`"
      class="flex justify-between items-center bg-[var(--vp-c-bg-soft)] border border-[var(--vp-c-divider)] rounded-lg p-4 px-5 mb-4 transition-shadow hover:shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
    >
      <span class="text-sm font-semibold text-[var(--vp-c-text-2)] uppercase tracking-wider">{{ metric.label }}</span>
      <span class="text-2xl font-bold text-[var(--vp-c-text-1)]" :style="metric.style">
        {{ metric.value }}{{ metric.suffix || '' }}
      </span>
    </div>

    <!-- Two-column table layout -->
    <div class="grid grid-cols-1 2xl:grid-cols-2 gap-2">
      <!-- Rate Metrics Table -->
      <div class="overflow-x-auto min-w-0" v-if="hasRateMetrics">
        <table class="w-full border-collapse text-sm">
          <thead class="border-b-2 border-[var(--vp-c-divider)]">
            <tr>
              <th class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Rate Metric</th>
              <th class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Current</th>
              <th v-if="hasChange" class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Change</th>
              <th v-if="hasBaseline" class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Baseline</th>
            </tr>
          </thead>
          <tbody>
            <!-- Pass Rate -->
            <tr v-if="insights.passRate !== undefined" class="border-b border-[var(--vp-c-divider-light)] transition-colors last:border-b-0 hover:bg-[var(--vp-c-bg-soft)]">
              <td class="py-3 px-2 text-[var(--vp-c-text-1)] font-semibold text-[var(--vp-c-text-2)] whitespace-nowrap">{{ labels.passRate }}</td>
              <td
                class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-lg font-semibold"
                :style="getCurrentStyle('passRate', formatPercent(insights.passRate.current), 'percent')"
              >
                {{ formatPercentString(insights.passRate.current) }}
              </td>
              <td v-if="hasChange" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap font-semibold" :class="insights.passRate.change !== undefined ? (insights.passRate.change === 0 ? 'text-[var(--vp-c-text-2)]' : insights.passRate.change > 0 ? 'text-[var(--vp-c-green-1)]' : 'text-[var(--vp-c-red-1)]') : ''">
                {{ insights.passRate.change !== undefined ? formatPercentChange(insights.passRate.change, 1) : '-' }}
              </td>
              <td v-if="hasBaseline" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-[var(--vp-c-text-2)]">
                {{ insights.passRate.baseline !== undefined ? formatPercentString(insights.passRate.baseline) : '-' }}
              </td>
            </tr>

            <!-- Fail Rate -->
            <tr v-if="insights.failRate !== undefined" class="border-b border-[var(--vp-c-divider-light)] transition-colors last:border-b-0 hover:bg-[var(--vp-c-bg-soft)]">
              <td class="py-3 px-2 text-[var(--vp-c-text-1)] font-semibold text-[var(--vp-c-text-2)] whitespace-nowrap">{{ labels.failRate }}</td>
              <td
                class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-lg font-semibold"
                :style="getCurrentStyle('failRate', formatPercent(insights.failRate.current), 'percent')"
              >
                {{ formatPercentString(insights.failRate.current) }}
              </td>
              <td v-if="hasChange" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap font-semibold" :class="insights.failRate.change !== undefined ? (insights.failRate.change === 0 ? 'text-[var(--vp-c-text-2)]' : insights.failRate.change > 0 ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-green-1)]') : ''">
                {{ insights.failRate.change !== undefined ? formatPercentChange(insights.failRate.change, 1) : '-' }}
              </td>
              <td v-if="hasBaseline" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-[var(--vp-c-text-2)]">
                {{ insights.failRate.baseline !== undefined ? formatPercentString(insights.failRate.baseline) : '-' }}
              </td>
            </tr>

            <!-- Flaky Rate -->
            <tr v-if="insights.flakyRate !== undefined" class="border-b border-[var(--vp-c-divider-light)] transition-colors last:border-b-0 hover:bg-[var(--vp-c-bg-soft)]">
              <td class="py-3 px-2 text-[var(--vp-c-text-1)] font-semibold text-[var(--vp-c-text-2)] whitespace-nowrap">{{ labels.flakyRate }}</td>
              <td
                class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-lg font-semibold"
                :style="getCurrentStyle('flakyRate', formatPercent(insights.flakyRate.current), 'percent')"
              >
                {{ formatPercentString(insights.flakyRate.current) }}
              </td>
              <td v-if="hasChange" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap font-semibold" :class="insights.flakyRate.change !== undefined ? (insights.flakyRate.change === 0 ? 'text-[var(--vp-c-text-2)]' : insights.flakyRate.change > 0 ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-green-1)]') : ''">
                {{ insights.flakyRate.change !== undefined ? formatPercentChange(insights.flakyRate.change, 1) : '-' }}
              </td>
              <td v-if="hasBaseline" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-[var(--vp-c-text-2)]">
                {{ insights.flakyRate.baseline !== undefined ? formatPercentString(insights.flakyRate.baseline) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Duration Metrics Table -->
      <div class="overflow-x-auto min-w-0" v-if="hasDurationMetrics">
        <table class="w-full border-collapse text-sm">
          <thead class="border-b-2 border-[var(--vp-c-divider)]">
            <tr>
              <th class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Duration Metric</th>
              <th class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Current</th>
              <th v-if="hasChange" class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Change</th>
              <th v-if="hasBaseline" class="py-3 px-2 text-left font-semibold text-[var(--vp-c-text-2)] uppercase text-xs tracking-wider whitespace-nowrap">Baseline</th>
            </tr>
          </thead>
          <tbody>
            <!-- Average Test Duration -->
            <tr v-if="insights.averageTestDuration !== undefined" class="border-b border-[var(--vp-c-divider-light)] transition-colors last:border-b-0 hover:bg-[var(--vp-c-bg-soft)]">
              <td class="py-3 px-2 text-[var(--vp-c-text-1)] font-semibold text-[var(--vp-c-text-2)] whitespace-nowrap">{{ labels.averageTestDuration }}</td>
              <td
                class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-lg font-semibold"
                :style="getCurrentStyle('averageTestDuration', insights.averageTestDuration.current, 'duration')"
              >
                {{ formatDuration(insights.averageTestDuration.current) }}
              </td>
              <td v-if="hasChange" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap font-semibold" :class="insights.averageTestDuration.change !== undefined ? (insights.averageTestDuration.change === 0 ? 'text-[var(--vp-c-text-2)]' : insights.averageTestDuration.change > 0 ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-green-1)]') : ''">
                {{ insights.averageTestDuration.change !== undefined ? formatDurationChange(insights.averageTestDuration.change) : '-' }}
              </td>
              <td v-if="hasBaseline" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-[var(--vp-c-text-2)]">
                {{ insights.averageTestDuration.baseline !== undefined ? formatDuration(insights.averageTestDuration.baseline) : '-' }}
              </td>
            </tr>

            <!-- Average Run Duration -->
            <tr v-if="insights.averageRunDuration !== undefined" class="border-b border-[var(--vp-c-divider-light)] transition-colors last:border-b-0 hover:bg-[var(--vp-c-bg-soft)]">
              <td class="py-3 px-2 text-[var(--vp-c-text-1)] font-semibold text-[var(--vp-c-text-2)] whitespace-nowrap">{{ labels.averageRunDuration }}</td>
              <td
                class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-lg font-semibold"
                :style="getCurrentStyle('averageRunDuration', insights.averageRunDuration.current, 'duration')"
              >
                {{ formatDuration(insights.averageRunDuration.current) }}
              </td>
              <td v-if="hasChange" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap font-semibold" :class="insights.averageRunDuration.change !== undefined ? (insights.averageRunDuration.change === 0 ? 'text-[var(--vp-c-text-2)]' : insights.averageRunDuration.change > 0 ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-green-1)]') : ''">
                {{ insights.averageRunDuration.change !== undefined ? formatDurationChange(insights.averageRunDuration.change) : '-' }}
              </td>
              <td v-if="hasBaseline" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-[var(--vp-c-text-2)]">
                {{ insights.averageRunDuration.baseline !== undefined ? formatDuration(insights.averageRunDuration.baseline) : '-' }}
              </td>
            </tr>

            <!-- P95 Run Duration -->
            <tr v-if="insights.p95RunDuration !== undefined" class="border-b border-[var(--vp-c-divider-light)] transition-colors last:border-b-0 hover:bg-[var(--vp-c-bg-soft)]">
              <td class="py-3 px-2 text-[var(--vp-c-text-1)] font-semibold text-[var(--vp-c-text-2)] whitespace-nowrap">{{ labels.p95RunDuration }}</td>
              <td
                class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-lg font-semibold"
                :style="getCurrentStyle('p95RunDuration', insights.p95RunDuration.current, 'duration')"
              >
                {{ formatDuration(insights.p95RunDuration.current) }}
              </td>
              <td v-if="hasChange" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap font-semibold" :class="insights.p95RunDuration.change !== undefined ? (insights.p95RunDuration.change === 0 ? 'text-[var(--vp-c-text-2)]' : insights.p95RunDuration.change > 0 ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-green-1)]') : ''">
                {{ insights.p95RunDuration.change !== undefined ? formatDurationChange(insights.p95RunDuration.change) : '-' }}
              </td>
              <td v-if="hasBaseline" class="py-3 px-2 text-[var(--vp-c-text-1)] font-medium text-right whitespace-nowrap text-[var(--vp-c-text-2)]">
                {{ insights.p95RunDuration.baseline !== undefined ? formatDuration(insights.p95RunDuration.baseline) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatDuration, formatPercent, formatPercentString, formatPercentChange, formatDurationChange } from '../../../helpers/formatter';
import type { RootInsights } from 'ctrf';

interface AdditionalMetric {
  label: string;
  value: string | number;
  suffix?: string;
  style?: Record<string, string>;
}

const props = defineProps({
  insights: {
    type: Object as () => RootInsights,
    required: true,
    validator: (value: unknown) => {
      return typeof value === 'object';
    }
  },
  labels: {
    type: Object as () => Record<string, string>,
    default: () => ({
      passRate: 'Pass Rate',
      failRate: 'Fail Rate',
      flakyRate: 'Flaky Rate',
      averageTestDuration: 'Avg Test Duration',
      averageRunDuration: 'Avg Run Duration',
      p95RunDuration: 'P95 Run Duration',
      runsAnalyzed: 'Runs Analyzed'
    })
  },
  additionalMetrics: {
    type: Array as () => AdditionalMetric[],
    default: () => [],
    validator: (value: unknown) => {
      if (!Array.isArray(value)) return false;
      return value.every((metric: any) =>
        metric.label &&
        metric.value !== undefined
      );
    }
  }
});

// Only show baseline/change columns if runsAnalyzed > 1
// When runsAnalyzed = 1, CTRF sets baseline=0 and change=0 as default initialization values
// Only when runsAnalyzed > 1 do we have actual baseline comparison data
const hasBaseline = computed(() => {
  return (props.insights.runsAnalyzed ?? 0) > 1;
});

// Change column should only be shown if baseline exists
const hasChange = computed(() => {
  return hasBaseline.value;
});

const hasRateMetrics = computed(() => {
  return !!(
    props.insights.passRate !== undefined ||
    props.insights.failRate !== undefined ||
    props.insights.flakyRate !== undefined
  );
});

const hasDurationMetrics = computed(() => {
  return !!(
    props.insights.averageTestDuration !== undefined ||
    props.insights.averageRunDuration !== undefined ||
    props.insights.p95RunDuration !== undefined
  );
});

const getCurrentStyle = (key: string, value: number, type: string): Record<string, string> => {
  if (type === 'percent') {
    if (key === 'passRate') {
      if (value >= 95) return { color: 'var(--vp-c-green-1) !important', fontWeight: 'bold !important' };
      if (value >= 80) return { color: 'var(--vp-c-yellow-1) !important', fontWeight: 'bold !important' };
      return { color: 'var(--vp-c-red-1) !important', fontWeight: 'bold !important' };
    } else if (key === 'failRate' || key === 'flakyRate') {
      if (value <= 5) return { color: 'var(--vp-c-green-1) !important', fontWeight: 'bold !important' };
      if (value <= 10) return { color: 'var(--vp-c-yellow-1) !important', fontWeight: 'bold !important' };
      return { color: 'var(--vp-c-red-1) !important', fontWeight: 'bold !important' };
    }
  }
  return { fontWeight: 'bold !important' };
};

const getChangeClass = (change: number, invert: boolean): string => {
  if (change === 0) return 'neutral';
  
  // If invert is true, positive change is bad
  if (invert) {
    return change > 0 ? 'negative' : 'positive';
  } else {
    return change > 0 ? 'positive' : 'negative';
  }
};
</script>
