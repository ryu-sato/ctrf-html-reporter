<template>
  <div class="max-w-7xl mx-auto">
    <div v-if="error" class="p-4 rounded-lg border bg-[var(--vp-c-danger-soft)] border-[var(--vp-c-danger-1)] text-[var(--vp-c-danger-1)]">
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-else-if="enrichedReport?.insights">
      <div class="mb-8 p-6 rounded-lg border bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]">
        <div class="flex flex-wrap gap-6 mb-4 max-md:flex-col">
          <div class="flex flex-col gap-2 min-w-[150px] max-md:min-w-0">
            <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="sort-by">Sort by:</label>
            <select class="px-3 py-2 rounded border text-sm cursor-pointer transition-all bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] hover:border-[var(--vp-c-brand-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)] focus:shadow-[var(--report-control-focus-shadow)]" id="sort-by" v-model="sortBy" @change="changeSortOrFilter">
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
          <div class="flex flex-col gap-2 min-w-[150px] max-md:min-w-0">
            <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="sort-order">Order:</label>
            <select class="px-3 py-2 rounded border text-sm cursor-pointer transition-all bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] hover:border-[var(--vp-c-brand-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)] focus:shadow-[var(--report-control-focus-shadow)]" id="sort-order" v-model="sortOrder" @change="changeSortOrFilter">
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
          <div class="flex flex-col gap-2 min-w-[150px] max-md:min-w-0">
            <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="status-filter">Status:</label>
            <select class="px-3 py-2 rounded border text-sm cursor-pointer transition-all bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] hover:border-[var(--vp-c-brand-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)] focus:shadow-[var(--report-control-focus-shadow)]" id="status-filter" v-model="statusFilter" @change="changeSortOrFilter">
              <option value="all">All</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="skipped">Skipped</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div class="flex flex-col gap-2 min-w-[150px] max-md:min-w-0">
            <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="items-per-page">Items per page:</label>
            <select class="px-3 py-2 rounded border text-sm cursor-pointer transition-all bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] hover:border-[var(--vp-c-brand-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)] focus:shadow-[var(--report-control-focus-shadow)]" id="items-per-page" v-model="itemsPerPage" @change="changeSortOrFilter">
              <option :value="6">6</option>
              <option :value="12">12</option>
              <option :value="24">24</option>
              <option :value="48">48</option>
            </select>
          </div>
        </div>
        <div class="text-sm pt-2 border-t text-[var(--vp-c-text-2)] border-[var(--vp-c-divider)]">
          Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredAndSortedTests.length) }} of {{ filteredAndSortedTests.length }} tests
        </div>
      </div>

      <div class="flex items-center justify-center gap-4 mt-8 p-6 rounded-lg border bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]" v-if="totalPages > 1">
        <button 
          class="px-4 py-2 rounded text-sm font-semibold text-white border-0 cursor-pointer transition-all bg-[var(--report-btn-bg)] hover:bg-[var(--report-btn-hover-bg)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <div class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="px-3 py-2 rounded border text-sm cursor-pointer transition-all min-w-[40px] bg-[var(--vp-c-bg)] text-[var(--vp-c-text-1)] border-[var(--vp-c-divider)] hover:border-[var(--vp-c-brand-1)] hover:text-[var(--vp-c-brand-1)]"
            :class="{ 'text-white bg-[var(--vp-c-brand-1)] border-[var(--vp-c-brand-1)]': page === currentPage }"
            @click="goToPage(page)"
            v-show="Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages"
          >
            {{ page }}
          </button>
        </div>
        <button 
          class="px-4 py-2 rounded text-sm font-semibold text-white border-0 cursor-pointer transition-all bg-[var(--report-btn-bg)] hover:bg-[var(--report-btn-hover-bg)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
          @click="goToPage(currentPage + 1)" 
          :disabled="currentPage === totalPages"
        >
          Next
        </button>
      </div>

      <div class="grid gap-6 mt-6 grid-cols-[repeat(auto-fill,minmax(var(--report-grid-min-width),1fr))] max-md:grid-cols-1 max-md:gap-4">
        <div 
          v-for="test in paginatedTests" 
          :key="test.name" 
          class="p-5 rounded-lg border cursor-pointer transition-all bg-[var(--report-card-bg)] border-[var(--report-card-border)] hover:border-[var(--report-card-hover-border)] hover:shadow-[var(--report-card-hover-shadow)] hover:transform-[var(--report-card-hover-transform)]"
          @click="handleTestClick(test)"
        >
          <div class="flex justify-between items-start mb-3 gap-4">
            <div class="font-semibold text-base leading-normal flex-1 break-words">{{ test.name }}</div>
            <StatusBadge :type="test.status">{{ test.status }}</StatusBadge>
          </div>
          <div class="text-xs mb-4 pb-3 border-b break-all text-[var(--vp-c-text-2)] border-[var(--vp-c-divider)]">{{ test.suite }}</div>
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2.5 rounded-md transition-colors hover:bg-[var(--vp-c-bg-soft)]">
              <div class="flex-shrink-0 text-xs font-semibold uppercase tracking-wide px-2 min-w-[90px] text-[var(--vp-c-text-2)]">Pass Rate</div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm leading-normal">
                  <PercentFormatter :value="test.insights?.passRate?.current" />
                  <span v-if="shouldShowChange && test.insights?.passRate?.change !== undefined"
                        class="inline text-xs font-semibold ml-1"
                        :class="getChangeClass(test.insights.passRate.change, false) === 'positive' ? 'text-[var(--vp-c-green-1)]' : getChangeClass(test.insights.passRate.change, false) === 'negative' ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-text-2)]'">
                    ({{ formatPercentChange(test.insights.passRate.change, 1) }})
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2.5 rounded-md transition-colors hover:bg-[var(--vp-c-bg-soft)]">
              <div class="flex-shrink-0 text-xs font-semibold uppercase tracking-wide px-2 min-w-[90px] text-[var(--vp-c-text-2)]">Flaky Rate</div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm leading-normal">
                  <PercentFormatter :value="test.insights?.flakyRate?.current" />
                  <span v-if="shouldShowChange && test.insights?.flakyRate?.change !== undefined"
                        class="inline text-xs font-semibold ml-1"
                        :class="getChangeClass(test.insights.flakyRate.change, true) === 'positive' ? 'text-[var(--vp-c-green-1)]' : getChangeClass(test.insights.flakyRate.change, true) === 'negative' ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-text-2)]'">
                    ({{ formatPercentChange(test.insights.flakyRate.change, 1) }})
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2.5 rounded-md transition-colors hover:bg-[var(--vp-c-bg-soft)]">
              <div class="flex-shrink-0 text-xs font-semibold uppercase tracking-wide px-2 min-w-[90px] text-[var(--vp-c-text-2)]">Fail Rate</div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm leading-normal">
                  <PercentFormatter :value="test.insights?.failRate?.current" />
                  <span v-if="shouldShowChange && test.insights?.failRate?.change !== undefined"
                        class="inline text-xs font-semibold ml-1"
                        :class="getChangeClass(test.insights.failRate.change, true) === 'positive' ? 'text-[var(--vp-c-green-1)]' : getChangeClass(test.insights.failRate.change, true) === 'negative' ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-text-2)]'">
                    ({{ formatPercentChange(test.insights.failRate.change, 1) }})
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2.5 rounded-md transition-colors hover:bg-[var(--vp-c-bg-soft)]">
              <div class="flex-shrink-0 text-xs font-semibold uppercase tracking-wide px-2 min-w-[90px] text-[var(--vp-c-text-2)]">Avg Duration</div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm leading-normal">
                  {{ test.insights?.averageTestDuration?.current }}ms
                  <span v-if="shouldShowChange && test.insights?.averageTestDuration?.change !== undefined"
                        class="inline text-xs font-semibold ml-1"
                        :class="getChangeClass(test.insights.averageTestDuration.change, true) === 'positive' ? 'text-[var(--vp-c-green-1)]' : getChangeClass(test.insights.averageTestDuration.change, true) === 'negative' ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-text-2)]'">
                    ({{ formatNumericChange(test.insights.averageTestDuration.change) }}ms)
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-2.5 rounded-md transition-colors hover:bg-[var(--vp-c-bg-soft)]">
              <div class="flex-shrink-0 text-xs font-semibold uppercase tracking-wide px-2 min-w-[90px] text-[var(--vp-c-text-2)]">P95 Duration</div>
              <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm leading-normal">
                  {{ test.insights?.p95TestDuration?.current }}ms
                  <span v-if="shouldShowChange && test.insights?.p95TestDuration?.change !== undefined"
                        class="inline text-xs font-semibold ml-1"
                        :class="getChangeClass(test.insights.p95TestDuration.change, true) === 'positive' ? 'text-[var(--vp-c-green-1)]' : getChangeClass(test.insights.p95TestDuration.change, true) === 'negative' ? 'text-[var(--vp-c-red-1)]' : 'text-[var(--vp-c-text-2)]'">
                    ({{ formatNumericChange(test.insights.p95TestDuration.change) }}ms)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-center gap-4 mt-8 p-6 rounded-lg border bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]" v-if="totalPages > 1">
        <button 
          class="px-4 py-2 rounded text-sm font-semibold text-white border-0 cursor-pointer transition-all bg-[var(--report-btn-bg)] hover:bg-[var(--report-btn-hover-bg)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
          @click="goToPage(currentPage - 1)" 
          :disabled="currentPage === 1"
        >
          Previous
        </button>
        <div class="flex gap-2">
          <button
            v-for="page in totalPages"
            :key="page"
            class="px-3 py-2 rounded border text-sm cursor-pointer transition-all min-w-[40px] bg-[var(--vp-c-bg)] text-[var(--vp-c-text-1)] border-[var(--vp-c-divider)] hover:border-[var(--vp-c-brand-1)] hover:text-[var(--vp-c-brand-1)]"
            :class="{ 'text-white bg-[var(--vp-c-brand-1)] border-[var(--vp-c-brand-1)]': page === currentPage }"
            @click="goToPage(page)"
            v-show="Math.abs(page - currentPage) < 3 || page === 1 || page === totalPages"
          >
            {{ page }}
          </button>
        </div>
        <button 
          class="px-4 py-2 rounded text-sm font-semibold text-white border-0 cursor-pointer transition-all bg-[var(--report-btn-bg)] hover:bg-[var(--report-btn-hover-bg)] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" 
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
