<template>
  <div>
    <div class="mb-8 p-4 rounded-lg bg-[var(--vp-c-bg-soft)]">
      <div class="flex flex-col gap-2">
        <label class="font-medium text-sm">
          Filter by minimum duration: {{ formatDuration(minDuration) }}
        </label>
        <div class="flex items-center gap-4">
          <input 
            type="range" 
            v-model.number="minDuration" 
            :min="0" 
            :max="maxDurationInTests" 
            :step="100"
            class="flex-1 min-w-[200px]"
          />
          <input 
            type="number" 
            v-model.number="minDuration" 
            :min="0" 
            :max="maxDurationInTests"
            :step="100"
            placeholder="ms"
            class="w-[100px] px-2 py-2 border rounded bg-[var(--vp-c-bg)] text-[var(--vp-c-text-1)] border-[var(--vp-c-divider)]"
          />
          <span class="text-sm text-[var(--vp-c-text-2)]">
            Showing {{ filteredTests.length }} / {{ allTests.length }} tests
          </span>
        </div>
      </div>
    </div>

    <div class="mb-8" v-if="filteredTests.length > 0 && testGroups.length > 0">
      <div class="flex justify-between items-center py-2 text-xs border-b mb-4 text-[var(--vp-c-text-2)] border-[var(--vp-c-divider)]">
        <span>{{ formatDateTime(timeRange.min, 'ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }) }}</span>
        <span>Timeline</span>
        <span>{{ formatDateTime(timeRange.max, 'ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }) }}</span>
      </div>
      <div v-for="(groupItem, groupIndex) in testGroups" :key="groupItem?.suite || `group-${groupIndex}`" class="mb-8">
        <div class="font-semibold text-base py-2 border-b mb-2 break-words text-[var(--vp-c-text-1)] border-[var(--vp-c-divider)]">{{ groupItem?.suite || 'Unknown Suite' }}</div>
        <div v-for="(testItem, testIndex) in (groupItem?.tests || [])" :key="testItem?.id || `test-${groupIndex}-${testIndex}`" class="flex items-center mb-2 min-h-[32px] cursor-pointer px-1 rounded transition-colors hover:bg-[var(--vp-c-bg-soft)]" @click="handleTestClick(testItem)">
          <div class="w-[300px] text-sm pr-4 overflow-hidden text-ellipsis whitespace-nowrap flex-shrink-0" :title="testItem?.name || ''">
            {{ testItem?.name || 'Unknown Test' }}
          </div>
          <div class="flex-1 relative h-6 rounded bg-[var(--vp-c-bg-mute)] flex items-center">
            <div 
              class="absolute h-full rounded transition-opacity cursor-pointer overflow-hidden hover:opacity-80" 
              :style="{
                ...calculateBarStyle(testItem),
                backgroundColor: getStatusColor(testItem?.status)
              }"
              :title="`${testItem?.name || 'Unknown'}\nStatus: ${testItem?.status || 'unknown'}\nDuration: ${formatDuration(testItem?.duration)}\nStart: ${formatDateTime(testItem?.start || 0, 'ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}\nEnd: ${formatDateTime(testItem?.stop || 0, 'ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 })}`"
            >
            </div>
            <span class="absolute left-0 right-0 flex items-center h-full px-2 text-xs font-medium whitespace-nowrap pointer-events-none z-[1] text-[var(--vp-c-text-1)]">
              {{ formatDuration(testItem?.duration) }}
            </span>
          </div>
          <div class="w-[120px] pl-4 text-xs text-right flex-shrink-0 text-[var(--vp-c-text-2)]">
            {{ formatDuration(testItem?.duration) }}
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-12 text-[var(--vp-c-text-2)]">
      <p>No tests match the current filter criteria.</p>
      <p class="text-sm mt-2">
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
</script>
