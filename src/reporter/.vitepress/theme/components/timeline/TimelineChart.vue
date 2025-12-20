<template>
  <div>
    <div class="filter-controls">
      <div class="filter-group">
        <label class="filter-label">
          Filter by minimum duration: {{ formatDuration(minDuration) }}
        </label>
        <div class="duration-input">
          <input 
            type="range" 
            v-model.number="minDuration" 
            :min="0" 
            :max="maxDurationInTests" 
            :step="100"
          />
          <input 
            type="number" 
            v-model.number="minDuration" 
            :min="0" 
            :max="maxDurationInTests"
            :step="100"
            placeholder="ms"
          />
          <span style="font-size: 0.875rem; color: var(--vp-c-text-2);">
            Showing {{ filteredTests.length }} / {{ allTests.length }} tests
          </span>
        </div>
      </div>
    </div>

    <div class="timeline-chart" v-if="filteredTests.length > 0 && testGroups.length > 0">
      <div class="time-scale">
        <span>{{ formatTime(timeRange.min) }}</span>
        <span>Timeline</span>
        <span>{{ formatTime(timeRange.max) }}</span>
      </div>
      <div v-for="(groupItem, groupIndex) in testGroups" :key="groupItem?.suite || `group-${groupIndex}`" class="suite-group">
        <div class="suite-header">{{ groupItem?.suite || 'Unknown Suite' }}</div>
        <div v-for="(testItem, testIndex) in (groupItem?.tests || [])" :key="testItem?.id || `test-${groupIndex}-${testIndex}`" class="test-row" @click="handleTestClick(testItem)">
          <div class="test-label" :title="testItem?.name || ''">
            {{ testItem?.name || 'Unknown Test' }}
          </div>
          <div class="test-timeline">
            <div 
              class="test-bar" 
              :style="{
                ...calculateBarStyle(testItem),
                backgroundColor: getStatusColor(testItem?.status)
              }"
              :title="`${testItem?.name || 'Unknown'}\nStatus: ${testItem?.status || 'unknown'}\nDuration: ${formatDuration(testItem?.duration || 0)}\nStart: ${formatTime(testItem?.start || 0)}\nEnd: ${formatTime(testItem?.stop || 0)}`"
            >
            </div>
            <span class="test-duration-label">
              {{ formatDuration(testItem?.duration || 0) }}
            </span>
          </div>
          <div class="test-info">
            {{ formatDuration(testItem?.duration || 0) }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="no-tests">
      <p>No tests match the current filter criteria.</p>
      <p style="font-size: 0.875rem; margin-top: 0.5rem;">
        Try adjusting the minimum duration filter.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue';
import type { Report, Test } from 'ctrf';
import { formatDuration, formatDateTime } from '../../../helpers/formatter';

const props = defineProps({
  report: {
    type: Object as () => Report,
    default: null,
    validator: (value: Report) => {
      if (!value) return true; // null/undefined is acceptable (shows empty state)
      return typeof value === 'object' && value !== null;
    }
  }
});

// Inject selectTest function from ReportLayout
const selectTest = inject<((test: Test) => void) | null>('selectTest', null);

// Handle test click
const handleTestClick = (test: Test) => {
  if (selectTest) {
    selectTest(test);
  }
};

// Get all tests from all reports
const allTests = computed((): Test[] => {
  if (props.report && props.report.results && props.report.results.tests) {
    return props.report.results.tests.filter((test: Test) => {
      // Only include tests with valid start/stop timestamps
      return test.start && test.stop && test.duration;
    }).sort((a: Test, b: Test) => (a?.start || 0) - (b?.start || 0));
  }
  return [];
});

// Calculate time range
const timeRange = computed(() => {
  if (allTests.value.length === 0) {
    return { min: 0, max: 0, duration: 0 };
  }
  const starts = allTests.value.map((t: Test) => t.start).filter((s): s is number => s !== undefined);
  const stops = allTests.value.map((t: Test) => t.stop).filter((s): s is number => s !== undefined);
  if (starts.length === 0 || stops.length === 0) {
    return { min: 0, max: 0, duration: 0 };
  }
  const min = Math.min(...starts);
  const max = Math.max(...stops);
  return { min, max, duration: max - min };
});

// Filter settings
const minDuration = ref(0);
const maxDurationInTests = computed(() => {
  if (allTests.value.length === 0) return 0;
  return Math.max(...allTests.value.map((t: Test) => t.duration));
});

// Filtered tests based on duration
const filteredTests = computed(() => {
  return allTests.value.filter((test: Test) => test.duration >= minDuration.value);
});

// Group tests by suite for better visualization
const testGroups = computed(() => {
  const groups = new Map<string, Test[]>();
  
  filteredTests.value.forEach((test: Test) => {
    // Handle suite as array or string
    let suiteName = 'Uncategorized';
    if (test.suite) {
      if (Array.isArray(test.suite)) {
        suiteName = test.suite.join(' > ');
      } else if (typeof test.suite === 'string') {
        suiteName = test.suite;
      }
    }
    
    if (!groups.has(suiteName)) {
      groups.set(suiteName, []);
    }
    groups.get(suiteName)!.push(test);
  });
  
  return Array.from(groups.entries()).map(([suite, tests]) => ({
    suite,
    tests: tests.sort((a: Test, b: Test) => (a.start || 0) - (b.start || 0))
  }));
});

// Format time for display
const formatTime = (timestamp: number) => {
  return formatDateTime(timestamp, 'ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  } as Intl.DateTimeFormatOptions);
};

// Calculate position and width for gantt chart
const calculateBarStyle = (test: Test) => {
  if (!test || !test.start || !test.stop) {
    return { left: '0%', width: '0%' };
  }
  
  const range = timeRange.value;
  if (range.duration === 0) return { left: '0%', width: '100%' };
  
  const left = ((test.start - range.min) / range.duration) * 100;
  const width = ((test.stop - test.start) / range.duration) * 100;
  
  return {
    left: `${left}%`,
    width: `${Math.max(width, 0.1)}%` // Minimum width for visibility
  };
};

// Get color based on test status
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    passed: 'var(--vp-c-green-1)',
    failed: 'var(--vp-c-red-1)',
    skipped: 'var(--vp-c-yellow-1)',
    pending: 'var(--vp-c-purple-1)',
    other: 'var(--vp-c-text-2)'
  };
  return colors[status] || colors.other;
};

// Debug: Log data to console
onMounted(() => {
  console.log('report:', props.report);
  console.log('allTests:', allTests.value);
  console.log('testGroups:', testGroups.value);
  console.log('testGroups length:', testGroups.value.length);
  if (testGroups.value.length > 0) {
    console.log('First group:', testGroups.value[0]);
    console.log('First group suite:', testGroups.value[0]?.suite);
    console.log('First group tests:', testGroups.value[0]?.tests);
  }
});
</script>

<style scoped>
.filter-controls {
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--vp-c-bg-soft);
  border-radius: 0.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-label {
  font-weight: 500;
  font-size: 0.875rem;
}

.duration-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.duration-input input[type="range"] {
  flex: 1;
  min-width: 200px;
}

.duration-input input[type="number"] {
  width: 100px;
  padding: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.25rem;
}

.timeline-chart {
  margin-bottom: 2rem;
}

.time-scale {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1rem;
}

.suite-group {
  margin-bottom: 2rem;
}

.suite-header {
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 0.5rem;
}

.test-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  min-height: 32px;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.test-row:hover {
  background-color: var(--vp-c-bg-soft);
}

.test-label {
  width: 300px;
  font-size: 0.875rem;
  padding-right: 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex-shrink: 0;
}

.test-timeline {
  flex: 1;
  position: relative;
  height: 24px;
  background: var(--vp-c-bg-mute);
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
}

.test-bar {
  position: absolute;
  height: 100%;
  border-radius: 0.25rem;
  transition: opacity 0.2s;
  cursor: pointer;
  overflow: hidden;
}

.test-bar:hover {
  opacity: 0.8;
}

.test-duration-label {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 0.5rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-1);
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.test-info {
  width: 120px;
  padding-left: 1rem;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  text-align: right;
  flex-shrink: 0;
}

.no-tests {
  text-align: center;
  padding: 3rem;
  color: var(--vp-c-text-2);
}
</style>
