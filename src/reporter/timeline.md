<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { data as sortedReportsByTimestamp } from './sortedReportsByTimestamp.data.js';

// Get all tests from all reports
const allTests = computed(() => {
  const tests = [];
  const reports = Array.isArray(sortedReportsByTimestamp) ? sortedReportsByTimestamp : [sortedReportsByTimestamp];
  
  reports.forEach(report => {
    if (report && report.results && report.results.tests) {
      report.results.tests.forEach(test => {
        // Only include tests with valid start/stop timestamps
        if (test.start && test.stop && test.duration) {
          tests.push({
            ...test,
            reportId: report.reportId,
            toolName: report.results.tool?.name || 'Unknown'
          });
        }
      });
    }
  });
  return tests.sort((a, b) => a.start - b.start);
});

// Calculate time range
const timeRange = computed(() => {
  if (allTests.value.length === 0) {
    return { min: 0, max: 0, duration: 0 };
  }
  const starts = allTests.value.map(t => t.start);
  const stops = allTests.value.map(t => t.stop);
  const min = Math.min(...starts);
  const max = Math.max(...stops);
  return { min, max, duration: max - min };
});

// Filter settings
const minDuration = ref(0);
const maxDurationInTests = computed(() => {
  if (allTests.value.length === 0) return 0;
  return Math.max(...allTests.value.map(t => t.duration));
});

// Filtered tests based on duration
const filteredTests = computed(() => {
  return allTests.value.filter(test => test.duration >= minDuration.value);
});

// Group tests by suite for better visualization
const testGroups = computed(() => {
  const groups = new Map();
  
  filteredTests.value.forEach(test => {
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
    groups.get(suiteName).push(test);
  });
  
  return Array.from(groups.entries()).map(([suite, tests]) => ({
    suite,
    tests: tests.sort((a, b) => a.start - b.start)
  }));
});

// Format time for display
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3
  });
};

// Format duration
const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
};

// Calculate position and width for gantt chart
const calculateBarStyle = (test) => {
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
const getStatusColor = (status) => {
  const colors = {
    passed: '#10b981',
    failed: '#ef4444',
    skipped: '#f59e0b',
    pending: '#8b5cf6',
    other: '#6b7280'
  };
  return colors[status] || colors.other;
};

// Statistics
const stats = computed(() => ({
  total: filteredTests.value.length,
  passed: filteredTests.value.filter(t => t.status === 'passed').length,
  failed: filteredTests.value.filter(t => t.status === 'failed').length,
  skipped: filteredTests.value.filter(t => t.status === 'skipped').length,
  avgDuration: filteredTests.value.length > 0 
    ? filteredTests.value.reduce((sum, t) => sum + t.duration, 0) / filteredTests.value.length 
    : 0
}));

// Debug: Log data to console
onMounted(() => {
  console.log('sortedReportsByTimestamp:', sortedReportsByTimestamp);
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
.timeline-header {
  margin-bottom: 2rem;
}

.filter-controls {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f9fafb;
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
  border: 1px solid #d1d5db;
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
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 1rem;
}

.suite-group {
  margin-bottom: 2rem;
}

.suite-header {
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.5rem 0;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 0.5rem;
}

.test-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  min-height: 32px;
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
  background: #f3f4f6;
  border-radius: 0.25rem;
}

.test-bar {
  position: absolute;
  height: 100%;
  border-radius: 0.25rem;
  transition: opacity 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: white;
  font-weight: 500;
  overflow: hidden;
}

.test-bar:hover {
  opacity: 0.8;
}

.test-bar-label {
  padding: 0 0.25rem;
  white-space: nowrap;
}

.test-info {
  width: 120px;
  padding-left: 1rem;
  font-size: 0.75rem;
  color: #6b7280;
  text-align: right;
  flex-shrink: 0;
}

.no-tests {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}
</style>

# Timeline

Gantt chart visualization of test execution timeline with duration filtering

<TestStats 
  :stats="stats" 
  :totalDuration="timeRange.duration"
/>

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
      <span style="font-size: 0.875rem; color: #6b7280;">
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
    <div v-for="(testItem, testIndex) in (groupItem?.tests || [])" :key="testItem?.id || `test-${groupIndex}-${testIndex}`" class="test-row">
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
          <span class="test-bar-label" v-if="testItem?.duration > 1000">
            {{ formatDuration(testItem?.duration || 0) }}
          </span>
        </div>
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
