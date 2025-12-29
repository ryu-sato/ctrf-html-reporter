<template>
  <div class="test-insights">
    <!-- Runs Analyzed - Standalone metric -->
    <div v-if="insights.runsAnalyzed !== undefined" class="runs-analyzed-card">
      <span class="runs-label">{{ labels.runsAnalyzed }}</span>
      <span
        class="runs-value"
        :style="getCurrentStyle('runsAnalyzed', insights.runsAnalyzed!, 'number')"
      >
        {{ insights.runsAnalyzed }}
      </span>
    </div>

    <!-- Additional custom metrics as cards -->
    <div
      v-for="(metric, index) in additionalMetrics"
      :key="`additional-${index}`"
      class="runs-analyzed-card"
    >
      <span class="runs-label">{{ metric.label }}</span>
      <span class="runs-value" :style="metric.style">
        {{ metric.value }}{{ metric.suffix || '' }}
      </span>
    </div>

    <!-- Two-column table layout -->
    <div class="tables-grid">
      <!-- Rate Metrics Table -->
      <div class="table-container" v-if="hasRateMetrics">
        <table class="insights-table">
          <thead>
            <tr>
              <th>Rate Metric</th>
              <th>Current</th>
              <th v-if="hasChange">Change</th>
              <th v-if="hasBaseline">Baseline</th>
            </tr>
          </thead>
          <tbody>
            <!-- Pass Rate -->
            <tr v-if="insights.passRate !== undefined">
              <td class="metric-label">{{ labels.passRate }}</td>
              <td
                class="metric-value current"
                :style="getCurrentStyle('passRate', formatPercent(insights.passRate.current), 'percent')"
              >
                {{ formatPercentString(insights.passRate.current) }}
              </td>
              <td v-if="hasChange" class="metric-value change" :class="insights.passRate.change !== undefined ? getChangeClass(insights.passRate.change, false) : ''">
                {{ insights.passRate.change !== undefined ? formatPercentChange(insights.passRate.change, 1) : '-' }}
              </td>
              <td v-if="hasBaseline" class="metric-value baseline">
                {{ insights.passRate.baseline !== undefined ? formatPercentString(insights.passRate.baseline) : '-' }}
              </td>
            </tr>

            <!-- Fail Rate -->
            <tr v-if="insights.failRate !== undefined">
              <td class="metric-label">{{ labels.failRate }}</td>
              <td
                class="metric-value current"
                :style="getCurrentStyle('failRate', formatPercent(insights.failRate.current), 'percent')"
              >
                {{ formatPercentString(insights.failRate.current) }}
              </td>
              <td v-if="hasChange" class="metric-value change" :class="insights.failRate.change !== undefined ? getChangeClass(insights.failRate.change, true) : ''">
                {{ insights.failRate.change !== undefined ? formatPercentChange(insights.failRate.change, 1) : '-' }}
              </td>
              <td v-if="hasBaseline" class="metric-value baseline">
                {{ insights.failRate.baseline !== undefined ? formatPercentString(insights.failRate.baseline) : '-' }}
              </td>
            </tr>

            <!-- Flaky Rate -->
            <tr v-if="insights.flakyRate !== undefined">
              <td class="metric-label">{{ labels.flakyRate }}</td>
              <td
                class="metric-value current"
                :style="getCurrentStyle('flakyRate', formatPercent(insights.flakyRate.current), 'percent')"
              >
                {{ formatPercentString(insights.flakyRate.current) }}
              </td>
              <td v-if="hasChange" class="metric-value change" :class="insights.flakyRate.change !== undefined ? getChangeClass(insights.flakyRate.change, true) : ''">
                {{ insights.flakyRate.change !== undefined ? formatPercentChange(insights.flakyRate.change, 1) : '-' }}
              </td>
              <td v-if="hasBaseline" class="metric-value baseline">
                {{ insights.flakyRate.baseline !== undefined ? formatPercentString(insights.flakyRate.baseline) : '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Duration Metrics Table -->
      <div class="table-container" v-if="hasDurationMetrics">
        <table class="insights-table">
          <thead>
            <tr>
              <th>Duration Metric</th>
              <th>Current</th>
              <th v-if="hasChange">Change</th>
              <th v-if="hasBaseline">Baseline</th>
            </tr>
          </thead>
          <tbody>
            <!-- Average Test Duration -->
            <tr v-if="insights.averageTestDuration !== undefined">
              <td class="metric-label">{{ labels.averageTestDuration }}</td>
              <td
                class="metric-value current"
                :style="getCurrentStyle('averageTestDuration', insights.averageTestDuration.current, 'duration')"
              >
                {{ formatDuration(insights.averageTestDuration.current) }}
              </td>
              <td v-if="hasChange" class="metric-value change" :class="insights.averageTestDuration.change !== undefined ? getChangeClass(insights.averageTestDuration.change, true) : ''">
                {{ insights.averageTestDuration.change !== undefined ? formatDurationChange(insights.averageTestDuration.change) : '-' }}
              </td>
              <td v-if="hasBaseline" class="metric-value baseline">
                {{ insights.averageTestDuration.baseline !== undefined ? formatDuration(insights.averageTestDuration.baseline) : '-' }}
              </td>
            </tr>

            <!-- Average Run Duration -->
            <tr v-if="insights.averageRunDuration !== undefined">
              <td class="metric-label">{{ labels.averageRunDuration }}</td>
              <td
                class="metric-value current"
                :style="getCurrentStyle('averageRunDuration', insights.averageRunDuration.current, 'duration')"
              >
                {{ formatDuration(insights.averageRunDuration.current) }}
              </td>
              <td v-if="hasChange" class="metric-value change" :class="insights.averageRunDuration.change !== undefined ? getChangeClass(insights.averageRunDuration.change, true) : ''">
                {{ insights.averageRunDuration.change !== undefined ? formatDurationChange(insights.averageRunDuration.change) : '-' }}
              </td>
              <td v-if="hasBaseline" class="metric-value baseline">
                {{ insights.averageRunDuration.baseline !== undefined ? formatDuration(insights.averageRunDuration.baseline) : '-' }}
              </td>
            </tr>

            <!-- P95 Run Duration -->
            <tr v-if="insights.p95RunDuration !== undefined">
              <td class="metric-label">{{ labels.p95RunDuration }}</td>
              <td
                class="metric-value current"
                :style="getCurrentStyle('p95RunDuration', insights.p95RunDuration.current, 'duration')"
              >
                {{ formatDuration(insights.p95RunDuration.current) }}
              </td>
              <td v-if="hasChange" class="metric-value change" :class="insights.p95RunDuration.change !== undefined ? getChangeClass(insights.p95RunDuration.change, true) : ''">
                {{ insights.p95RunDuration.change !== undefined ? formatDurationChange(insights.p95RunDuration.change) : '-' }}
              </td>
              <td v-if="hasBaseline" class="metric-value baseline">
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
      if (value >= 95) return { color: 'var(--vp-c-green-1)', fontWeight: 'bold' };
      if (value >= 80) return { color: 'var(--vp-c-yellow-1)', fontWeight: 'bold' };
      return { color: 'var(--vp-c-red-1)', fontWeight: 'bold' };
    } else if (key === 'failRate' || key === 'flakyRate') {
      if (value <= 5) return { color: 'var(--vp-c-green-1)', fontWeight: 'bold' };
      if (value <= 10) return { color: 'var(--vp-c-yellow-1)', fontWeight: 'bold' };
      return { color: 'var(--vp-c-red-1)', fontWeight: 'bold' };
    }
  }
  return { fontWeight: 'bold' };
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

<style scoped>
.test-insights {
  margin-bottom: 1.5rem;
}

/* Runs Analyzed Card */
.runs-analyzed-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
}

.runs-analyzed-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.runs-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.runs-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

/* Tables Grid Layout */
.tables-grid {
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 0.5rem;
}

.table-container {
  overflow-x: auto;
  min-width: 0;
}

.insights-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.insights-table thead {
  border-bottom: 2px solid var(--vp-c-divider);
}

.insights-table th {
  padding: 0.75rem 0.5rem;
  text-align: left;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  white-space: nowrap;
}

.insights-table tbody tr {
  border-bottom: 1px solid var(--vp-c-divider-light);
  transition: background-color 0.2s;
}

.insights-table tbody tr:last-child {
  border-bottom: none;
}

.insights-table tbody tr:hover {
  background: var(--vp-c-bg-soft);
}

.insights-table td {
  padding: 0.75rem 0.5rem;
  color: var(--vp-c-text-1);
}

.metric-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.metric-value {
  font-weight: 500;
  text-align: right;
  white-space: nowrap;
}

.metric-value.current {
  font-size: 1.1rem;
  font-weight: 600;
}

.metric-value.baseline {
  color: var(--vp-c-text-2);
}

.metric-value.change {
  font-weight: 600;
}

.metric-value.change.positive {
  color: var(--vp-c-green-1);
}

.metric-value.change.negative {
  color: var(--vp-c-red-1);
}

.metric-value.change.neutral {
  color: var(--vp-c-text-2);
}

/* Tablet: Stack tables vertically */
@media (max-width: 1024px) {
  .tables-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile: Optimize table display */
@media (max-width: 768px) {
  .runs-analyzed-card {
    padding: 0.875rem 1rem;
  }

  .runs-label {
    font-size: 0.813rem;
  }

  .runs-value {
    font-size: 1.25rem;
  }

  .insights-table {
    font-size: 0.813rem;
  }

  .insights-table th,
  .insights-table td {
    padding: 0.625rem 0.375rem;
  }

  .insights-table th:first-child,
  .insights-table td:first-child {
    position: sticky;
    left: 0;
    background: var(--vp-c-bg);
    z-index: 1;
  }

  .insights-table thead th:first-child {
    background: var(--vp-c-bg);
    z-index: 2;
  }

  .insights-table tbody tr:hover td:first-child {
    background: var(--vp-c-bg-soft);
  }

  .metric-value.current {
    font-size: 1rem;
  }
}

/* Small mobile: Further optimize */
@media (max-width: 480px) {
  .runs-analyzed-card {
    padding: 0.75rem 0.875rem;
  }

  .runs-label {
    font-size: 0.75rem;
  }

  .runs-value {
    font-size: 1.125rem;
  }

  .insights-table {
    font-size: 0.75rem;
  }

  .insights-table th,
  .insights-table td {
    padding: 0.5rem 0.375rem;
  }

  .metric-label {
    max-width: 100px;
    white-space: normal;
    line-height: 1.3;
  }
}
</style>
