<template>
  <!-- Show reports.extra.ai if exists -->
  <div v-if="aiExtraResultsExists">
    <!-- AI Information Card -->
    <div class="relative overflow-hidden rounded-xl border transition-all border-b-4 border-[var(--vp-c-tip-soft)]">
      <div class="grid grid-cols-1 gap-1 p-2">
        <!-- AI Card -->
        <div v-if="aiExtraResultsExists" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg">
                <CpuChipIcon class="w-5 h-5" />
              </div>
              <div class="text-xs uppercase tracking-wider text-[var(--vp-c-text-3)]">AI Insights</div>
            </div>
            <div class="text-sm mt-2">
              <pre class="whitespace-pre-wrap">{{ props.report.results.extra.ai }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]">
    <DocumentTextIcon class="w-12 h-12" />
    <p class="text-sm font-medium text-[var(--vp-c-text-3)]">
      No extra data available.
      see <a href="https://www.npmjs.com/package/ai-ctrf" target="_blank" rel="noopener noreferrer">https://www.npmjs.com/package/ai-ctrf</a>
    </p>
  </div>

  <h2 class="text-xl font-bold tracking-tight mt-6 mb-4">Failed Tests with AI Insights</h2>
  <div
    v-if="failedTestsWithAIInsights"
    class="grid gap-6 mt-6 grid-cols-[repeat(auto-fill,minmax(var(--report-grid-min-width),1fr))] max-md:grid-cols-1 max-md:gap-4 mb-[var(--report-spacing-2xl)]"
  >
    <div
      v-for="test in failedTestsWithAIInsights" 
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
          <div class="flex items-center">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg">
              <CpuChipIcon class="w-5 h-5" />
            </div>
            <div class="text-xs uppercase tracking-wider text-[var(--vp-c-text-3)]">AI Insights</div>
          </div>
        </div>
        <pre class="whitespace-pre-wrap">{{ test.ai }}</pre>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]">
    <DocumentTextIcon class="w-12 h-12" />
    <p class="text-sm font-medium text-[var(--vp-c-text-3)]">
      No failed tests with AI insights available
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { CpuChipIcon, DocumentTextIcon } from '@heroicons/vue/16/solid';
import type { Report } from 'ctrf';

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

// Get test selection function from ReportLayout
const selectTest = inject('selectTest');

// Handle test row click
const handleTestClick = (test: any) => {
  if (selectTest) {
    (selectTest as Function)(test);
  }
};

const aiExtraResultsExists = computed(() => {
  return props?.report?.results?.extra?.ai;
});

const failedTestsWithAIInsights = computed(() => {
  if (!props?.report?.results?.tests) return null;

  const failedTests = props.report.results.tests.filter((test) => {
    return (test.status === 'failed' && test?.ai);
  });

  return failedTests;
});

</script>
