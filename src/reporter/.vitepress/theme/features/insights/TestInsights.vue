<template>
  <div class="test-insights">
    <!-- Pass Rate -->
    <div 
      v-if="insights.passRate !== undefined"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ labels.passRate }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="getCurrentStyle('passRate', formatPercent(insights.passRate.current), 'percent')"
          >
            {{ formatPercentString(insights.passRate.current) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.passRate.baseline !== undefined">
          <span class="metric-key">Baseline</span>
          <span class="metric-value baseline">
            {{ formatPercentString(insights.passRate.baseline) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.passRate.change !== undefined">
          <span class="metric-key">Change</span>
          <span 
            class="metric-value change" 
            :class="getChangeClass(insights.passRate.change, false)"
          >
            {{ formatPercentString(insights.passRate.change) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Fail Rate -->
    <div 
      v-if="insights.failRate !== undefined"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ labels.failRate }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="getCurrentStyle('failRate', formatPercent(insights.failRate.current), 'percent')"
          >
            {{ formatPercentString(insights.failRate.current) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.failRate.baseline !== undefined">
          <span class="metric-key">Baseline</span>
          <span class="metric-value baseline">
            {{ formatPercentString(insights.failRate.baseline) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.failRate.change !== undefined">
          <span class="metric-key">Change</span>
          <span 
            class="metric-value change" 
            :class="getChangeClass(insights.failRate.change, true)"
          >
            {{ formatPercentString(insights.failRate.change) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Flaky Rate -->
    <div 
      v-if="insights.flakyRate !== undefined"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ labels.flakyRate }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="getCurrentStyle('flakyRate', formatPercent(insights.flakyRate.current), 'percent')"
          >
            {{ formatPercentString(insights.flakyRate.current) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.flakyRate.baseline !== undefined">
          <span class="metric-key">Baseline</span>
          <span class="metric-value baseline">
            {{ formatPercentString(insights.flakyRate.baseline) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.flakyRate.change !== undefined">
          <span class="metric-key">Change</span>
          <span 
            class="metric-value change" 
            :class="getChangeClass(insights.flakyRate.change, true)"
          >
            {{ formatPercentString(insights.flakyRate.change) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Average Test Duration -->
    <div 
      v-if="insights.averageTestDuration !== undefined"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ labels.averageTestDuration }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="getCurrentStyle('averageTestDuration', insights.averageTestDuration.current, 'duration')"
          >
            {{ formatDuration(insights.averageTestDuration.current) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.averageTestDuration.baseline !== undefined">
          <span class="metric-key">Baseline</span>
          <span class="metric-value baseline">
            {{ formatDuration(insights.averageTestDuration.baseline) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.averageTestDuration.change !== undefined">
          <span class="metric-key">Change</span>
          <span 
            class="metric-value change" 
            :class="getChangeClass(insights.averageTestDuration.change, true)"
          >
            {{ formatDuration(insights.averageTestDuration.change) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Average Run Duration -->
    <div 
      v-if="insights.averageRunDuration !== undefined"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ labels.averageRunDuration }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="getCurrentStyle('averageRunDuration', insights.averageRunDuration.current, 'duration')"
          >
            {{ formatDuration(insights.averageRunDuration.current) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.averageRunDuration.baseline !== undefined">
          <span class="metric-key">Baseline</span>
          <span class="metric-value baseline">
            {{ formatDuration(insights.averageRunDuration.baseline) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.averageRunDuration.change !== undefined">
          <span class="metric-key">Change</span>
          <span 
            class="metric-value change" 
            :class="getChangeClass(insights.averageRunDuration.change, true)"
          >
            {{ formatDuration(insights.averageRunDuration.change) }}
          </span>
        </div>
      </div>
    </div>

    <!-- P95 Run Duration -->
    <div 
      v-if="insights.p95RunDuration !== undefined"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ labels.p95RunDuration }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="getCurrentStyle('p95RunDuration', insights.p95RunDuration.current, 'duration')"
          >
            {{ formatDuration(insights.p95RunDuration.current) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.p95RunDuration.baseline !== undefined">
          <span class="metric-key">Baseline</span>
          <span class="metric-value baseline">
            {{ formatDuration(insights.p95RunDuration.baseline) }}
          </span>
        </div>
        <div class="metric-row" v-if="insights.p95RunDuration.change !== undefined">
          <span class="metric-key">Change</span>
          <span 
            class="metric-value change" 
            :class="getChangeClass(insights.p95RunDuration.change, true)"
          >
            {{ formatDuration(insights.p95RunDuration.change) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Runs Analyzed -->
    <div 
      v-if="insights.runsAnalyzed !== undefined"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ labels.runsAnalyzed }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="getCurrentStyle('runsAnalyzed', insights.runsAnalyzed!, 'number')"
          >
            {{ insights.runsAnalyzed }}
          </span>
        </div>
      </div>
    </div>

    <!-- Additional custom metrics -->
    <div 
      v-for="(metric, index) in additionalMetrics" 
      :key="`additional-${index}`"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ metric.label }}</span>
      </div>
      <div class="insight-content">
        <span 
          class="metric-value current single" 
          :style="metric.style"
        >
          {{ metric.value }}{{ metric.suffix || '' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDuration, formatPercent, formatPercentString } from '../../../helpers/formatter';
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.insight-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s, transform 0.2s;
}

.insight-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.insight-header {
  margin-bottom: 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

.insight-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.insight-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-key {
  font-size: 0.813rem;
  color: var(--vp-c-text-2);
}

.metric-value {
  font-size: 1rem;
  font-weight: 500;
}

.metric-value.current {
  font-size: 1.25rem;
}

.metric-value.single {
  font-size: 1.5rem;
  text-align: center;
  width: 100%;
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

@media (max-width: 768px) {
  .test-insights {
    grid-template-columns: 1fr;
  }
}
</style>
