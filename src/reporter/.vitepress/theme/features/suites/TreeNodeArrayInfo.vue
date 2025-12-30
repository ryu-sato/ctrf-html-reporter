<template>
  <div v-for="(node, index) in props.nodes" :key="index" class="tree-root">
    <h2 :id="'test-tree-' + node.name">{{ node.name }}</h2>

    <div v-if="node.summary" class="summary-box">
      <div class="summary-stats">
        <Badge :type="getStatusType(node.status)">{{ node.status }}</Badge>
  
        <span>Tests: {{ node.summary.tests || node.tests?.length || 0 }}</span>
        <span class="passed"><PassedIcon/> {{ node.summary.passed || 0 }}</span>
        <span class="failed"><FailedIcon/> {{ node.summary.failed || 0 }}</span>
        <span class="skipped"><SkippedIcon/> {{ node.summary.skipped || 0 }}</span>
        <span class="pending"><PendingIcon/> {{ node.summary.pending || 0 }}</span>
        <span v-if="node.summary.flaky" class="flaky"><FlakyIcon/> {{ node.summary.flaky }}</span>

        <span class="duration-text">Duration: {{ formatDuration(node.duration) }}</span>
    </div>
    </div>

    <div v-if="node.suites && node.suites.length > 0" class="suites-container">
      <TreeNodeInfo
        v-for="(suite, suiteIndex) in node.suites" 
        :key="suiteIndex"
        :treeNode="suite"
      />
    </div>

    <div v-if="node.tests && node.tests.length > 0" class="tests-container">
      <details open>
        <summary class="tests-summary">
          Show {{ node.tests.length }} test(s)
        </summary>
        <ul class="tests-list">
          <li v-for="(test, testIndex) in node.tests" :key="testIndex" class="test-item" @click="handleTestClick(test)">
            <Badge :type="getStatusType(test.status)" class="test-badge">{{ test.status }}</Badge>
            <span class="test-name">{{ test.name }}</span>
            <span class="test-duration">({{ formatDuration(test.duration) }})</span>
            <span v-if="test.flaky" class="test-flaky"><FlakyIcon/> Flaky</span>
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
import type { TreeNode } from 'ctrf';
import { formatDuration } from '../../../helpers/formatter';

const props = defineProps({
  nodes: {
    type: Array as () => TreeNode[],
    required: true,
    validator: (value) => {
      return Array.isArray(value);
    }
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
   Tree Root
   ========================= */
.tree-root {
  margin-bottom: var(--report-spacing-2xl);
}

.tree-root h2 {
  margin-top: 0;
  margin-bottom: var(--report-spacing-sm);
  border-bottom: none;
}

/* =========================
   Status Display
   ========================= */
.duration-text {
  color: var(--vp-c-text-2);
}

/* =========================
   Summary Box
   ========================= */
.summary-box {
  padding: var(--report-spacing-sm);
  background-color: var(--vp-c-bg-soft);
  border-radius: var(--report-control-border-radius);
  margin: var(--report-spacing-sm) 0;
}

.summary-stats {
  display: flex;
  gap: var(--report-spacing-lg);
  font-size: var(--report-control-font-size);
  flex-wrap: wrap;
}

.summary-stats span {
  display: flex;
  align-items: center;
  gap: var(--report-spacing-xs);
}

.summary-stats .passed {
  color: var(--report-status-passed);
}

.summary-stats .failed {
  color: var(--report-status-failed);
}

.summary-stats .skipped {
  color: var(--report-status-skipped);
}

.summary-stats .pending {
  color: var(--report-status-pending);
}

.summary-stats .flaky {
  color: var(--report-status-flaky);
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
  display: flex;
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