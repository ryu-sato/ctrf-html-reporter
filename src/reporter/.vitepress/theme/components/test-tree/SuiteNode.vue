<template>
  <div class="suite-node">
    <h3>{{ suite.name }}</h3>
    
    <div class="suite-header">
      <Badge :type="getStatusType(suite.status)">{{ suite.status }}</Badge>
      <span class="suite-duration">{{ formatDuration(suite.duration) }}</span>
    </div>

    <div v-if="suite.summary" class="suite-summary">
      Tests: {{ suite.summary.tests || suite.tests?.length || 0 }} |
      <span class="passed"><CheckCircleIcon style="width: 24px; height: 24px;" /> {{ suite.summary.passed || 0 }}</span> |
      <span class="failed"><XCircleIcon style="width: 24px; height: 24px;" /> {{ suite.summary.failed || 0 }}</span> |
      <span class="skipped"><MinusCircleIcon style="width: 24px; height: 24px;" /> {{ suite.summary.skipped || 0 }}</span> |
      <span class="pending"><ClockIcon style="width: 24px; height: 24px;" /> {{ suite.summary.pending || 0 }}</span>
      <span v-if="suite.summary.flaky" class="flaky"> | <BoltIcon style="width: 24px; height: 24px;" /> {{ suite.summary.flaky }}</span>
    </div>

    <!-- Nested suites -->
    <div v-if="suite.suites && suite.suites.length > 0" class="nested-suites">
      <SuiteNode 
        v-for="(childSuite, index) in suite.suites" 
        :key="index"
        :suite="childSuite"
      />
    </div>

    <!-- Tests in this suite -->
    <div v-if="suite.tests && suite.tests.length > 0" class="suite-tests">
      <details open>
        <summary class="tests-summary">
          Show {{ suite.tests.length }} test(s)
        </summary>
        <ul class="tests-list">
          <li v-for="(test, testIndex) in suite.tests" :key="testIndex" class="test-item" @click="handleTestClick(test)">
            <Badge :type="getStatusType(test.status)" class="test-badge">{{ test.status }}</Badge>
            <span class="test-name">{{ test.name }}</span>
            <span class="test-duration">({{ formatDuration(test.duration) }})</span>
            <span v-if="test.flaky" class="test-flaky"><BoltIcon style="width: 24px; height: 24px;" /> Flaky</span>
            <div v-if="test.tags && test.tags.length > 0" class="test-tags">
              <span v-for="(tag, tagIndex) in test.tags" :key="tagIndex" class="tag">{{ tag }}</span>
            </div>
          </li>
        </ul>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon, ClockIcon, BoltIcon } from '@heroicons/vue/24/outline';

import { VPBadge as Badge } from 'vitepress/theme';
import type { TreeNode } from 'ctrf';
import { formatDuration } from '../../../helpers/formatter';

const props = defineProps({
  suite: {
    type: Object as () => TreeNode,
    required: true
  }
});

// Inject selectTest function from ReportLayout
const selectTest = inject<((test: any) => void) | null>('selectTest', null);

// Handle test click
const handleTestClick = (test: any) => {
  if (selectTest) {
    selectTest(test);
  }
};

// Function to get status badge type
const getStatusType = (status: string) => {
  switch(status) {
    case 'passed': return 'success';
    case 'failed': return 'danger';
    case 'skipped': return 'warning';
    case 'pending': return 'info';
    default: return 'tip';
  }
};
</script>

<style scoped>
/* =========================
   Suite Node Container
   ========================= */
.suite-node {
  margin-bottom: var(--report-spacing-lg);
  padding-left: var(--report-spacing-lg);
  border-left: 2px solid var(--vp-c-divider);
}

.suite-node h3 {
  margin-top: 0;
  margin-bottom: var(--report-spacing-sm);
  font-size: 1.1rem;
  border-bottom: none;
}

/* =========================
   Header
   ========================= */
.suite-header {
  display: flex;
  align-items: center;
  gap: var(--report-spacing-sm);
  margin-bottom: var(--report-spacing-sm);
}

.suite-duration {
  color: var(--vp-c-text-2);
  font-size: var(--report-control-font-size);
}

/* =========================
   Summary
   ========================= */
.suite-summary {
  font-size: var(--report-control-font-size);
  color: var(--vp-c-text-2);
  margin: var(--report-spacing-sm) 0;
  display: flex;
  align-items: center;
  gap: var(--report-spacing-xs);
  flex-wrap: wrap;
}

.suite-summary span {
  display: inline-flex;
  align-items: center;
  gap: var(--report-spacing-xs);
}

.suite-summary .passed {
  color: var(--report-status-passed);
}

.suite-summary .failed {
  color: var(--report-status-failed);
}

.suite-summary .skipped {
  color: var(--report-status-skipped);
}

.suite-summary .pending {
  color: var(--report-status-pending);
}

.suite-summary .flaky {
  color: var(--report-status-flaky);
}

/* =========================
   Nested Suites
   ========================= */
.nested-suites {
  margin-left: 0;
}

/* =========================
   Tests in Suite
   ========================= */
.suite-tests {
  margin-top: var(--report-spacing-sm);
}

.tests-summary {
  cursor: pointer;
  font-size: var(--report-control-font-size);
  color: var(--vp-c-text-2);
  user-select: none;
}

/* =========================
   Test List
   ========================= */
.tests-list {
  margin-top: var(--report-spacing-sm);
  font-size: var(--report-control-font-size);
  list-style: none;
  padding-left: 0;
}

.test-item {
  margin: var(--report-spacing-xs) 0;
  display: flex;
  align-items: center;
  gap: var(--report-spacing-sm);
  cursor: pointer;
  padding: var(--report-spacing-sm);
  border-radius: var(--report-control-border-radius);
  transition: background-color var(--report-transition-fast);
  flex-wrap: wrap;
}

.test-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.test-badge {
  font-size: var(--report-badge-font-size);
}

.test-name {
  flex: 1;
  min-width: 200px;
}

.test-duration {
  color: var(--vp-c-text-3);
}

.test-flaky {
  color: var(--report-status-flaky);
  display: inline-flex;
  align-items: center;
  gap: var(--report-spacing-xs);
}

/* =========================
   Tags
   ========================= */
.test-tags {
  display: flex;
  gap: var(--report-spacing-xs);
  flex-wrap: wrap;
  width: 100%;
  margin-top: var(--report-spacing-xs);
}

.tag {
  display: inline-block;
  padding: 0.125rem var(--report-spacing-sm);
  background-color: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: var(--report-badge-font-size);
  color: var(--vp-c-text-2);
}
</style>
