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
              <option value="flakyRate">Flaky Rate</option>
              <option value="failRate">Fail Rate</option>
              <option value="runs">Runs</option>
              <option value="avgDuration">Avg Duration</option>
              <option value="p95Duration">95th Percentile</option>
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
                  <span v-if="test.insights?.passRate?.change !== undefined"
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
                  <span v-if="test.insights?.flakyRate?.change !== undefined"
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
                  <span v-if="test.insights?.failRate?.change !== undefined"
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
                  <span v-if="test.insights?.averageTestDuration?.change !== undefined"
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
                  <span v-if="test.insights?.p95TestDuration?.change !== undefined"
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
      case 'flakyRate':
        aValue = a.insights?.flakyRate?.current || 0;
        bValue = b.insights?.flakyRate?.current || 0;
        break;
      case 'failRate':
        aValue = a.insights?.failRate?.current || 0;
        bValue = b.insights?.failRate?.current || 0;
        break;
      case 'runs':
        aValue = a.insights?.executedInRuns || 0;
        bValue = b.insights?.executedInRuns || 0;
        break;
      case 'avgDuration':
        aValue = a.insights?.averageTestDuration?.current || 0;
        bValue = b.insights?.averageTestDuration?.current || 0;
        break;
      case 'p95Duration':
        aValue = a.insights?.p95TestDuration?.current || 0;
        bValue = b.insights?.p95TestDuration?.current || 0;
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
/* =========================
   Container
   ========================= */
.insights-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* =========================
   Error Message
   ========================= */
.error-message {
  padding: var(--report-spacing-lg);
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-1);
  border-radius: var(--report-card-border-radius);
  color: var(--vp-c-danger-1);
}

/* =========================
   Filter Controls
   ========================= */
.controls-container {
  margin-bottom: var(--report-spacing-2xl);
  padding: var(--report-spacing-xl);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--report-card-border-radius);
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--report-spacing-xl);
  margin-bottom: var(--report-spacing-lg);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--report-spacing-sm);
  min-width: 150px;
}

.control-label {
  font-size: var(--report-control-font-size);
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.control-select {
  /* Use global utility class variables */
  padding: var(--report-control-padding);
  background: var(--report-control-bg);
  border: 1px solid var(--report-control-border);
  border-radius: var(--report-control-border-radius);
  color: var(--vp-c-text-1);
  font-size: var(--report-control-font-size);
  cursor: pointer;
  transition: border-color var(--report-transition-fast), 
              box-shadow var(--report-transition-fast);
}

.control-select:hover {
  border-color: var(--vp-c-brand-1);
}

.control-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: var(--report-control-focus-shadow);
}

.results-info {
  font-size: var(--report-control-font-size);
  color: var(--vp-c-text-2);
  padding-top: var(--report-spacing-sm);
  border-top: 1px solid var(--vp-c-divider);
}

/* =========================
   Test Cards Grid
   ========================= */
.tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--report-grid-min-width), 1fr));
  gap: var(--report-grid-gap);
  margin-top: var(--report-spacing-xl);
}

@media (max-width: 768px) {
  .tests-grid {
    grid-template-columns: 1fr;
    gap: var(--report-grid-gap-mobile);
  }
}

/* =========================
   Test Card
   ========================= */
.test-card {
  background: var(--report-card-bg);
  border: 1px solid var(--report-card-border);
  border-radius: var(--report-card-border-radius);
  padding: var(--report-card-padding);
  cursor: pointer;
  transition: transform var(--report-transition-fast), 
              box-shadow var(--report-transition-fast), 
              border-color var(--report-transition-fast);
}

.test-card:hover {
  border-color: var(--report-card-hover-border);
  box-shadow: var(--report-card-hover-shadow);
  transform: var(--report-card-hover-transform);
}

.test-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--report-spacing-md);
  gap: var(--report-spacing-lg);
}

.test-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

.test-card-suite {
  font-size: var(--report-badge-font-size);
  color: var(--vp-c-text-2);
  margin-bottom: var(--report-spacing-lg);
  padding-bottom: var(--report-spacing-md);
  border-bottom: 1px solid var(--vp-c-divider);
  word-break: break-all;
}

.test-card-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.375rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.metric-item:hover {
  background: var(--vp-c-bg-soft);
}

.metric-label {
  flex-shrink: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.25rem 0.5rem;
  min-width: 90px;
  color: var(--vp-c-text-2);
}

.metric-content {
  flex: 1;
  min-width: 0;
}

.metric-value {
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.4;
}

.metric-change {
  display: inline;
  font-size: 0.75rem;
  font-weight: 600;
  margin-left: 0.25rem;
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

/* =========================
   Badges (Static layout only - colors via inline styles)
   ========================= */
.status-badge {
  display: inline-block;
  padding: var(--report-badge-padding);
  border-radius: var(--report-badge-border-radius);
  font-size: var(--report-badge-font-size);
  font-weight: var(--report-badge-font-weight);
  text-transform: uppercase;
}

.rate-badge {
  display: inline-block;
  padding: var(--report-badge-padding);
  border-radius: var(--report-badge-border-radius);
  font-weight: var(--report-badge-font-weight);
  color: white;
}

/* =========================
   Pagination
   ========================= */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--report-pagination-gap);
  margin-top: var(--report-spacing-2xl);
  padding: var(--report-pagination-padding);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--report-card-border-radius);
}

.pagination-btn {
  padding: var(--report-btn-padding);
  background: var(--report-btn-bg);
  color: white;
  border: none;
  border-radius: var(--report-btn-border-radius);
  font-size: var(--report-btn-font-size);
  font-weight: var(--report-btn-font-weight);
  cursor: pointer;
  transition: background var(--report-transition-fast), 
              transform var(--report-transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  background: var(--report-btn-hover-bg);
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: var(--report-btn-disabled-opacity);
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: var(--report-spacing-sm);
}

.pagination-page {
  padding: var(--report-spacing-sm) var(--report-spacing-md);
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--report-control-border-radius);
  font-size: var(--report-control-font-size);
  cursor: pointer;
  transition: border-color var(--report-transition-fast), 
              color var(--report-transition-fast), 
              background var(--report-transition-fast);
  min-width: 40px;
}

.pagination-page:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.pagination-page.active {
  background: var(--vp-c-brand-1);
  color: white;
  border-color: var(--vp-c-brand-1);
}

/* =========================
   Responsive
   ========================= */
@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
  }
  
  .control-group {
    min-width: auto;
  }
}
</style>
