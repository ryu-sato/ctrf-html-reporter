<template>
  <div class="test-insights">
    <div 
      v-for="(metric, key) in metricsToDisplay" 
      :key="key"
      class="insight-card"
    >
      <div class="insight-header">
        <span class="insight-label">{{ metric.label }}</span>
      </div>
      <div class="insight-content">
        <div class="metric-row">
          <span class="metric-key">Current</span>
          <span 
            class="metric-value current" 
            :style="metric.currentStyle"
          >
            {{ formatValue(metric.current, metric.type) }}
          </span>
        </div>
        <div class="metric-row" v-if="metric.baseline !== undefined">
          <span class="metric-key">Baseline</span>
          <span class="metric-value baseline">
            {{ formatValue(metric.baseline, metric.type) }}
          </span>
        </div>
        <div class="metric-row" v-if="metric.change !== undefined">
          <span class="metric-key">Change</span>
          <span 
            class="metric-value change" 
            :class="getChangeClass(metric.change, metric.invertChange)"
          >
            {{ formatChangeLocal(metric.change, metric.type) }}
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
import { computed } from 'vue';
import { formatDuration, formatChange } from '../../../helpers/formatter';
import type { RootInsights } from 'ctrf';

interface MetricValue {
  current: number;
  baseline?: number;
  change?: number;
}

interface AdditionalMetric {
  label: string;
  value: string | number;
  suffix?: string;
  style?: Record<string, string>;
}

interface DisplayMetric {
  label: string;
  current: number;
  baseline?: number;
  change?: number;
  type: 'percent' | 'duration' | 'number';
  invertChange: boolean;
  currentStyle: Record<string, string>;
}

const props = defineProps({
  insights: {
    type: Object as () => RootInsights,
    required: true,
    validator: (value: unknown) => {
      return typeof value === 'object';
    }
  },
  showMetrics: {
    type: Array as () => string[],
    default: () => ['passRate', 'failRate', 'flakyRate', 'averageTestDuration', 'averageRunDuration', 'p95RunDuration', 'p95TestDuration']
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
      p95TestDuration: 'P95 Test Duration',
      runsAnalyzed: 'Runs Analyzed',
      executedInRuns: 'Executed in Runs'
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

const metricsToDisplay = computed(() => {
  const metrics: Record<string, DisplayMetric> = {};
  
  props.showMetrics.forEach(key => {
    const value = (props.insights as Record<string, any>)[key];
    
    if (value !== undefined) {
      // Handle both object format (with current/baseline/change) and simple number
      if (typeof value === 'object' && value !== null) {
        const metricType = getMetricType(key);
        const invertChange = isInvertedMetric(key);
        
        metrics[key] = {
          label: props.labels[key] || key,
          current: value.current,
          baseline: value.baseline,
          change: value.change,
          type: metricType,
          invertChange: invertChange,
          currentStyle: getCurrentStyle(key, value.current, metricType)
        };
      } else {
        // Simple number value
        metrics[key] = {
          label: props.labels[key] || key,
          current: value,
          type: getMetricType(key),
          invertChange: isInvertedMetric(key),
          currentStyle: getCurrentStyle(key, value, getMetricType(key))
        };
      }
    }
  });
  
  return metrics;
});

const getMetricType = (key: string): 'percent' | 'duration' | 'number' => {
  if (key.includes('Rate')) return 'percent';
  if (key.includes('Duration')) return 'duration';
  return 'number';
};

const isInvertedMetric = (key: string): boolean => {
  // For these metrics, positive change is bad (should be red)
  return key === 'failRate' || key === 'flakyRate' || key.includes('Duration');
};

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

const formatValue = (value: number | undefined | null, type: string): string => {
  if (value === undefined || value === null) return '-';
  
  switch (type) {
    case 'percent':
      return `${value.toFixed(1)}%`;
    case 'duration':
      return formatDuration(value);
    default:
      return value.toString();
  }
};

const formatChangeLocal = (change: number | undefined | null, type: string): string => {
  if (change === undefined || change === null) return '-';
  
  const prefix = change > 0 ? '+' : '';
  
  switch (type) {
    case 'percent':
      return `${prefix}${change.toFixed(1)}%`;
    case 'duration':
      return `${prefix}${formatDuration(Math.abs(change))}`;
    default:
      return `${prefix}${change}`;
  }
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
