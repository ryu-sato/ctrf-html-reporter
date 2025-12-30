<template>
  <div class="insights-container">
    <div v-if="error" class="error-message">
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-else-if="enrichedReport?.insights">
      <div class="controls-container">
        <div class="controls-row">
          <div class="control-group">
            <label class="control-label" for="sort-by">Sort by:</label>
            <select class="control-select" id="sort-by" v-model="sortBy" @change="changeSortOrFilter">
              <option value="passRate">Pass Rate</option>
              <option value="passRateChange">Pass Rate Change</option>
              <option value="flakyRate">Flaky Rate</option>
              <option value="flakyRateChange">Flaky Rate Change</option>
              <option value="failRate">Fail Rate</option>
              <option value="failRateChange">Fail Rate Change</option>
              <option value="runs">Runs</option>
              <option value="avgDuration">Avg Duration</option>
              <option value="avgDurationChange">Avg Duration Change</option>
              <option value="p95Duration">95th Percentile</option>
              <option value="p95DurationChange">95th Percentile Change</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label" for="sort-order">Order:</label>
            <select class="control-select" id="sort-order" v-model="sortOrder" @change="changeSortOrFilter">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label" for="status-filter">Status:</label>
            <select class="control-select" id="status-filter" v-model="statusFilter" @change="changeSortOrFilter">
              <option value="all">All</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="skipped">Skipped</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="control-group">
            <label class="control-label" for="items-per-page">Items per page:</label>
            <select class="control-select" id="items-per-page" v-model="itemsPerPage" @change="changeSortOrFilter">
              <option :value="6">6</option>
              <option :value="12">12</option>
              <option :value="24">24</option>
              <option :value="48">48</option>
            </select>
          </div>
        </div>
        <div class="results-info">
          Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredAndSortedTests.length) }} of {{ filteredAndSortedTests.length }} tests
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-btn" 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <div class="pagination-pages">
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination-page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
            v-show="Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages"
          >
            {{ page }}
          </button>
        </div>
        <button 
          class="pagination-btn" 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>

      <div class="tests-grid">
        <div 
          v-for="test in paginatedTests" 
          :key="test.name" 
          class="test-card"
          @click="handleTestClick(test)"
        >
          <div class="test-card-header">
            <div class="test-card-title">{{ test.name }}</div>
            <span class="status-badge" :style="{ background: getStatusColor(test.status), color: 'white' }">
              {{ test.status }}
            </span>
          </div>
          <div class="test-card-suite">{{ test.suite }}</div>
          <div class="test-card-metrics">
            <div class="metric-item">
              <div class="metric-label pass">Pass Rate</div>
              <div class="metric-content">
                <div class="metric-value">
                  <PercentFormatter :value="test.insights?.passRate?.current" />
                  <span v-if="shouldShowChange && test.insights?.passRate?.change !== undefined"
                        class="metric-change"
                        :class="getChangeClass(test.insights.passRate.change, false)">
                    ({{ formatPercentChange(test.insights.passRate.change, 1) }})
                  </span>
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label flaky">Flaky Rate</div>
              <div class="metric-content">
                <div class="metric-value">
                  <PercentFormatter :value="test.insights?.flakyRate?.current" />
                  <span v-if="shouldShowChange && test.insights?.flakyRate?.change !== undefined"
                        class="metric-change"
                        :class="getChangeClass(test.insights.flakyRate.change, true)">
                    ({{ formatPercentChange(test.insights.flakyRate.change, 1) }})
                  </span>
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label fail">Fail Rate</div>
              <div class="metric-content">
                <div class="metric-value">
                  <PercentFormatter :value="test.insights?.failRate?.current" />
                  <span v-if="shouldShowChange && test.insights?.failRate?.change !== undefined"
                        class="metric-change"
                        :class="getChangeClass(test.insights.failRate.change, true)">
                    ({{ formatPercentChange(test.insights.failRate.change, 1) }})
                  </span>
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label duration">Avg Duration</div>
              <div class="metric-content">
                <div class="metric-value">
                  {{ test.insights?.averageTestDuration?.current }}ms
                  <span v-if="shouldShowChange && test.insights?.averageTestDuration?.change !== undefined"
                        class="metric-change"
                        :class="getChangeClass(test.insights.averageTestDuration.change, true)">
                    ({{ formatNumericChange(test.insights.averageTestDuration.change) }}ms)
                  </span>
                </div>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label duration">P95 Duration</div>
              <div class="metric-content">
                <div class="metric-value">
                  {{ test.insights?.p95TestDuration?.current }}ms
                  <span v-if="shouldShowChange && test.insights?.p95TestDuration?.change !== undefined"
                        class="metric-change"
                        :class="getChangeClass(test.insights.p95TestDuration.change, true)">
                    ({{ formatNumericChange(test.insights.p95TestDuration.change) }}ms)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination" v-if="totalPages > 1">
        <button 
          class="pagination-btn" 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <div class="pagination-pages">
          <button
            v-for="page in totalPages"
            :key="page"
            class="pagination-page"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
            v-show="Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages"
          >
            {{ page }}
          </button>
        </div>
        <button 
          class="pagination-btn" 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>
    </div>

    <div v-else>
      <p>Loading data...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject } from 'vue';
import type { Report } from 'ctrf';
import PercentFormatter from '../../components/PercentFormatter.vue';
import { formatPercentChange, formatNumericChange } from '../../../helpers/formatter';

interface Props {
  report: Report;
  error?: string;
}

const props = defineProps<Props>();

// Get test selection function from ReportLayout
const selectTest = inject('selectTest');

// Handle test row click
const handleTestClick = (test: any) => {
  if (selectTest) {
    (selectTest as Function)(test);
  }
};

// Sorting and filtering state
const sortBy = ref('passRate');
const sortOrder = ref<'asc' | 'desc'>('desc');
const statusFilter = ref<'all' | 'passed' | 'failed' | 'skipped' | 'pending'>('all');
const currentPage = ref(1);
const itemsPerPage = ref(12);

// Enrich report with insights
const enrichedReport = computed(() => {
  if (!props.report) return null;
  try {
    return props.report;
  } catch (error) {
    console.error('Failed to enrich report:', error);
    return null;
  }
});

// Only show change values if runsAnalyzed > 1
// When runsAnalyzed = 1, CTRF sets baseline=0 and change=0 as default initialization values
const shouldShowChange = computed(() => {
  return (enrichedReport.value?.insights?.runsAnalyzed ?? 0) > 1;
});

// Get status color
const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    passed: 'var(--vp-c-green-1)',
    failed: 'var(--vp-c-red-1)',
    skipped: 'var(--vp-c-yellow-1)',
    pending: 'var(--vp-c-text-2)'
  };
  return colors[status] || 'var(--vp-c-text-2)';
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

// Filter and sort tests
const filteredAndSortedTests = computed(() => {
  if (!enrichedReport.value?.results?.tests) return [];
  
  let tests = [...enrichedReport.value.results.tests];
  
  // Apply status filter
  if (statusFilter.value !== 'all') {
    tests = tests.filter(test => test.status === statusFilter.value);
  }
  
  // Apply sorting
  tests.sort((a, b) => {
    let aValue: number, bValue: number;

    switch (sortBy.value) {
      case 'passRate':
        aValue = a.insights?.passRate?.current || 0;
        bValue = b.insights?.passRate?.current || 0;
        break;
      case 'passRateChange':
        aValue = a.insights?.passRate?.change ?? 0;
        bValue = b.insights?.passRate?.change ?? 0;
        break;
      case 'flakyRate':
        aValue = a.insights?.flakyRate?.current || 0;
        bValue = b.insights?.flakyRate?.current || 0;
        break;
      case 'flakyRateChange':
        aValue = a.insights?.flakyRate?.change ?? 0;
        bValue = b.insights?.flakyRate?.change ?? 0;
        break;
      case 'failRate':
        aValue = a.insights?.failRate?.current || 0;
        bValue = b.insights?.failRate?.current || 0;
        break;
      case 'failRateChange':
        aValue = a.insights?.failRate?.change ?? 0;
        bValue = b.insights?.failRate?.change ?? 0;
        break;
      case 'runs':
        aValue = a.insights?.executedInRuns || 0;
        bValue = b.insights?.executedInRuns || 0;
        break;
      case 'avgDuration':
        aValue = a.insights?.averageTestDuration?.current || 0;
        bValue = b.insights?.averageTestDuration?.current || 0;
        break;
      case 'avgDurationChange':
        aValue = a.insights?.averageTestDuration?.change ?? 0;
        bValue = b.insights?.averageTestDuration?.change ?? 0;
        break;
      case 'p95Duration':
        aValue = a.insights?.p95TestDuration?.current || 0;
        bValue = b.insights?.p95TestDuration?.current || 0;
        break;
      case 'p95DurationChange':
        aValue = a.insights?.p95TestDuration?.change ?? 0;
        bValue = b.insights?.p95TestDuration?.change ?? 0;
        break;
      default:
        return 0;
    }

    if (sortOrder.value === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });
  
  return tests;
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedTests.value.length / itemsPerPage.value);
});

const paginatedTests = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredAndSortedTests.value.slice(start, end);
});

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// Reset to page 1 when filter or sort changes
const changeSortOrFilter = () => {
  currentPage.value = 1;
};
</script>

<style scoped>
@import "tailwindcss" reference;

.insights-container {
  @apply max-w-7xl mx-auto;
}

.error-message {
  @apply p-4 rounded-lg border;
  background: var(--vp-c-danger-soft);
  border-color: var(--vp-c-danger-1);
  color: var(--vp-c-danger-1);
}

.controls-container {
  @apply mb-8 p-6 rounded-lg border;
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.controls-row {
  @apply flex flex-wrap gap-6 mb-4;
}

.control-group {
  @apply flex flex-col gap-2 min-w-[150px];
}

.control-label {
  @apply text-sm font-semibold;
  color: var(--vp-c-text-1);
}

.control-select {
  @apply px-3 py-2 rounded border text-sm cursor-pointer transition-all;
  background: var(--report-control-bg);
  border-color: var(--report-control-border);
  color: var(--vp-c-text-1);
}

.control-select:hover {
  border-color: var(--vp-c-brand-1);
}

.control-select:focus {
  @apply outline-none;
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--report-control-focus-shadow);
}

.results-info {
  @apply text-sm pt-2 border-t;
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-divider);
}

.tests-grid {
  @apply grid gap-6 mt-6;
  grid-template-columns: repeat(auto-fill, minmax(var(--report-grid-min-width), 1fr));
}

@media (max-width: 768px) {
  .tests-grid {
    @apply grid-cols-1 gap-4;
  }
}

.test-card {
  @apply p-5 rounded-lg border cursor-pointer transition-all;
  background: var(--report-card-bg);
  border-color: var(--report-card-border);
}

.test-card:hover {
  border-color: var(--report-card-hover-border);
  box-shadow: var(--report-card-hover-shadow);
  transform: var(--report-card-hover-transform);
}

.test-card-header {
  @apply flex justify-between items-start mb-3 gap-4;
}

.test-card-title {
  @apply font-semibold text-base leading-normal flex-1 break-words;
}

.test-card-suite {
  @apply text-xs mb-4 pb-3 border-b break-all;
  color: var(--vp-c-text-2);
  border-color: var(--vp-c-divider);
}

.test-card-metrics {
  @apply flex flex-col gap-2;
}

.metric-item {
  @apply flex items-center gap-2.5 p-1.5 rounded-md transition-colors;
}

.metric-item:hover {
  background: var(--vp-c-bg-soft);
}

.metric-label {
  @apply flex-shrink-0 text-xs font-semibold uppercase tracking-wide px-2 py-1 min-w-[90px];
  color: var(--vp-c-text-2);
}

.metric-content {
  @apply flex-1 min-w-0;
}

.metric-value {
  @apply font-semibold text-sm leading-normal;
}

.metric-change {
  @apply inline text-xs font-semibold ml-1;
}

.metric-change.positive {
  color: var(--vp-c-green-1);
}

.metric-change.negative {
  color: var(--vp-c-red-1);
}

.metric-change.neutral {
  color: var(--vp-c-text-2);
}

.status-badge {
  @apply inline-block px-2 py-1 rounded text-xs font-semibold uppercase;
}

.rate-badge {
  @apply inline-block px-2 py-1 rounded font-semibold text-white;
}

.pagination {
  @apply flex items-center justify-center gap-4 mt-8 p-6 rounded-lg border;
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
}

.pagination-btn {
  @apply px-4 py-2 rounded text-sm font-semibold text-white border-0 cursor-pointer transition-all;
  background: var(--report-btn-bg);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--report-btn-hover-bg);
  @apply -translate-y-0.5;
}

.pagination-btn:disabled {
  @apply opacity-50 cursor-not-allowed;
}

.pagination-pages {
  @apply flex gap-2;
}

.pagination-page {
  @apply px-3 py-2 rounded border text-sm cursor-pointer transition-all min-w-[40px];
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}

.pagination-page:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pagination-page.active {
  @apply text-white;
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

@media (max-width: 768px) {
  .controls-row {
    @apply flex-col;
  }

  .control-group {
    @apply min-w-0;
  }
}
</style>
