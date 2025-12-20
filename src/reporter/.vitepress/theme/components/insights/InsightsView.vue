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
              <div class="metric-label">Pass Rate</div>
              <div class="metric-value">
                <span class="rate-badge" :style="{ background: getPassRateColor(formatPercent(test.insights?.passRate?.current)) }">
                  <PercentFormatter :value="test.insights?.passRate?.current" />
                </span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Flaky Rate</div>
              <div class="metric-value">
                <span class="rate-badge" :style="{ background: formatPercent(test.insights?.flakyRate?.current) > 5 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' }">
                  <PercentFormatter :value="test.insights?.flakyRate?.current" />
                </span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Fail Rate</div>
              <div class="metric-value">
                <span class="rate-badge" :style="{ background: formatPercent(test.insights?.failRate?.current) > 10 ? 'var(--vp-c-red-1)' : 'var(--vp-c-green-1)' }">
                  <PercentFormatter :value="test.insights?.failRate?.current" />
                </span>
              </div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Runs</div>
              <div class="metric-value">{{ test.insights?.executedInRuns }}</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">Avg Duration</div>
              <div class="metric-value">{{ test.insights?.averageTestDuration?.current }}ms</div>
            </div>
            <div class="metric-item">
              <div class="metric-label">95th Percentile</div>
              <div class="metric-value">{{ test.insights?.p95TestDuration?.current }}ms</div>
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
import { ref, computed, inject, watch } from 'vue';
import type { Report } from 'ctrf';
import PercentFormatter from '../PercentFormatter.vue';
import { formatPercent, formatDuration } from '../../../helpers/formatter';

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

const getPassRateColor = (rate: number): string => {
  if (rate >= 95) return 'var(--vp-c-green-1)';
  if (rate >= 80) return 'var(--vp-c-yellow-1)';
  return 'var(--vp-c-red-1)';
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
  padding: 1rem;
  background: var(--vp-c-danger-soft);
  border: 1px solid var(--vp-c-danger-1);
  border-radius: 8px;
  color: var(--vp-c-danger-1);
}

/* =========================
   Filter Controls
   ========================= */
.controls-container {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.controls-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 150px;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.control-select {
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  color: var(--vp-c-text-1);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.control-select:hover {
  border-color: var(--vp-c-brand-1);
}

.control-select:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.results-info {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  padding-top: 0.5rem;
  border-top: 1px solid var(--vp-c-divider);
}

/* =========================
   Test Cards Grid
   ========================= */
.tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .tests-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

/* =========================
   Test Card
   ========================= */
.test-card {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.test-card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Card Header */
.test-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.test-card-title {
  font-weight: 600;
  font-size: 0.95rem;
  line-height: 1.4;
  flex: 1;
  word-break: break-word;
}

/* Suite Info */
.test-card-suite {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--vp-c-divider);
}

/* Metrics */
.test-card-metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.7rem;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-weight: 600;
  font-size: 0.9rem;
}

/* =========================
   Badges (Static styles for inline styles only)
   ========================= */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.rate-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  color: white;
}

/* =========================
   Pagination
   ========================= */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.pagination-btn {
  padding: 0.5rem 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.5rem;
}

.pagination-page {
  padding: 0.5rem 0.75rem;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s, color 0.2s, background 0.2s;
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
