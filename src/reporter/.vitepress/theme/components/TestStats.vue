<template>
  <div class="timeline-stats">
    <div class="stat-item">
      <span class="stat-label">{{ labels.total }}</span>
      <span class="stat-value">{{ stats.total }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">{{ labels.passed }}</span>
      <span class="stat-value status-passed">{{ stats.passed }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">{{ labels.failed }}</span>
      <span class="stat-value status-failed">{{ stats.failed }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">{{ labels.skipped }}</span>
      <span class="stat-value status-skipped">{{ stats.skipped }}</span>
    </div>
    <div class="stat-item" v-if="showAvgDuration">
      <span class="stat-label">{{ labels.avgDuration }}</span>
      <span class="stat-value">{{ formatDuration(stats.avgDuration) }}</span>
    </div>
    <div class="stat-item" v-if="showTotalDuration">
      <span class="stat-label">{{ labels.totalDuration }}</span>
      <span class="stat-value">{{ formatDuration(totalDuration) }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  stats: {
    type: Object,
    required: true,
    validator: (value) => {
      return typeof value.total === 'number' &&
             typeof value.passed === 'number' &&
             typeof value.failed === 'number' &&
             typeof value.skipped === 'number';
    }
  },
  totalDuration: {
    type: Number,
    default: 0
  },
  showAvgDuration: {
    type: Boolean,
    default: true
  },
  showTotalDuration: {
    type: Boolean,
    default: true
  },
  labels: {
    type: Object,
    default: () => ({
      total: 'Total Tests',
      passed: 'Passed',
      failed: 'Failed',
      skipped: 'Skipped',
      avgDuration: 'Avg Duration',
      totalDuration: 'Total Duration'
    })
  }
});

const formatDuration = (ms) => {
  if (!ms || ms < 1000) return `${ms || 0}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};
</script>

<style scoped>
.timeline-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: bold;
}

.status-passed { 
  color: #10b981; 
}

.status-failed { 
  color: #ef4444; 
}

.status-skipped { 
  color: #f59e0b; 
}
</style>
