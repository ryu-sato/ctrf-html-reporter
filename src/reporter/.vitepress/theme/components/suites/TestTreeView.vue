<template>
  <div class="suites-view">
    <!-- Filter Component -->
    <TestFilter
      :selectedStatuses="selectedStatuses"
      :is-flaky-selected="isFlakySelected"
      :selectedTags="selectedTags"
      :availableTags="availableTags"
      @update:selectedStatuses="selectedStatuses = $event"
      @update:is-flaky-selected="isFlakySelected = $event"
      @update:selectedTags="selectedTags = $event"
    />

    <!-- No results message -->
    <div v-if="filteredNodes.length === 0" class="no-results">
      <p>No tests match the selected filters.</p>
    </div>

    <div v-for="(root, index) in filteredNodes" :key="index" class="tree-root">
      <h2 :id="'suites-' + root.name">{{ root.name }}</h2>
      
      <div class="status-line">
        <Badge :type="getStatusType(root.status)">{{ root.status }}</Badge>
        <span class="duration-text">Duration: {{ formatDuration(root.duration) }}</span>
      </div>

      <div v-if="root.summary" class="summary-box">
        <div class="summary-stats">
          <span>Tests: {{ root.summary.tests || root.tests?.length || 0 }}</span>
          <span class="passed"><CheckCircleIcon style="width: 16px; height: 16px;" /> {{ root.summary.passed || 0 }}</span>
          <span class="failed"><XCircleIcon style="width: 16px; height: 16px;" /> {{ root.summary.failed || 0 }}</span>
          <span class="skipped"><MinusCircleIcon style="width: 16px; height: 16px;" /> {{ root.summary.skipped || 0 }}</span>
          <span class="pending"><ClockIcon style="width: 16px; height: 16px;" /> {{ root.summary.pending || 0 }}</span>
          <span v-if="root.summary.flaky" class="flaky"><BoltIcon style="width: 16px; height: 16px;" /> {{ root.summary.flaky }}</span>
        </div>
      </div>

      <div v-if="root.suites && root.suites.length > 0" class="suites-container">
        <SuiteNode 
          v-for="(suite, suiteIndex) in root.suites" 
          :key="suiteIndex"
          :suite="suite"
        />
      </div>

      <div v-if="root.tests && root.tests.length > 0" class="tests-container">
        <details open>
          <summary class="tests-summary">
            Show {{ root.tests.length }} test(s)
          </summary>
          <ul class="tests-list">
            <li v-for="(test, testIndex) in root.tests" :key="testIndex" class="test-item" @click="handleTestClick(test)">
              <Badge :type="getStatusType(test.status)" class="test-badge">{{ test.status }}</Badge>
              <span class="test-name">{{ test.name }}</span>
              <span class="test-duration">({{ formatDuration(test.duration) }})</span>
              <span v-if="test.flaky" class="test-flaky"><BoltIcon style="width: 16px; height: 16px;" /> Flaky</span>
              <div v-if="test.tags && test.tags.length > 0" class="test-tags">
                <span v-for="(tag, tagIndex) in test.tags" :key="tagIndex" class="tag">{{ tag }}</span>
              </div>
            </li>
          </ul>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, computed } from 'vue';
import { CheckCircleIcon, XCircleIcon, MinusCircleIcon, ClockIcon, BoltIcon } from '@heroicons/vue/16/solid';
import { VPBadge as Badge } from 'vitepress/theme';
import SuiteNode from './SuiteNode.vue';
import TestFilter from './TestFilter.vue';
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

// Filter states
const selectedStatuses = ref<string[]>([]);
const selectedTags = ref<string[]>([]);
const isFlakySelected = ref(false);

// Get all available tags from tests
const availableTags = computed(() => {
  const tags = new Set<string>();
  
  const extractTags = (node: any) => {
    // Extract tags from tests at this level
    if (node.tests && Array.isArray(node.tests)) {
      node.tests.forEach((test: any) => {
        if (test.tags && Array.isArray(test.tags)) {
          test.tags.forEach((tag: string) => tags.add(tag));
        }
      });
    }
    
    // Recursively extract tags from suites
    if (node.suites && Array.isArray(node.suites)) {
      node.suites.forEach((suite: any) => extractTags(suite));
    }
  };
  
  props.nodes.forEach((node: any) => extractTags(node));
  
  return Array.from(tags).sort();
});

// Filter tests based on selected statuses and tags
const filterTests = (tests: any) => {
  if (!tests || !Array.isArray(tests)) return tests;
  
  return tests.filter((test: any) => {
    // Filter by status
    const statusMatch = selectedStatuses.value.length === 0 || 
                        selectedStatuses.value.includes(test.status);

    // Filter by flaky status
    const flakyMatch = !isFlakySelected.value || test.flaky === true;

    // Filter by tags
    const tagsMatch = selectedTags.value.length === 0 ||
                     (test.tags && Array.isArray(test.tags) && 
                      selectedTags.value.some(tag => test.tags.includes(tag)));

    return statusMatch && flakyMatch && tagsMatch;
  });
};

// Filter suites recursively
const filterSuite = (suite: any): any => {
  const filteredSuite = { ...suite };
  
  // Filter tests in this suite
  if (filteredSuite.tests) {
    filteredSuite.tests = filterTests(filteredSuite.tests);
  }
  
  // Filter nested suites
  if (filteredSuite.suites && Array.isArray(filteredSuite.suites)) {
    filteredSuite.suites = filteredSuite.suites
      .map((s: any) => filterSuite(s))
      .filter((s: any) => {
        // Keep suite if it has tests or non-empty nested suites
        const hasTests = s.tests && s.tests.length > 0;
        const hasSubSuites = s.suites && s.suites.length > 0;
        return hasTests || hasSubSuites;
      });
  }
  
  return filteredSuite;
};

// Compute filtered nodes
const filteredNodes = computed(() => {
  // If no filters are applied, return all nodes
  if (selectedStatuses.value.length === 0 && isFlakySelected.value === false && selectedTags.value.length === 0) {
    return props.nodes;
  }
  
  return props.nodes.map((node) => {
    const filteredNode = { ...node };
    
    // Filter tests at root level
    if (filteredNode.tests) {
      filteredNode.tests = filterTests(filteredNode.tests);
    }
    
    // Filter suites
    if (filteredNode.suites && Array.isArray(filteredNode.suites)) {
      filteredNode.suites = filteredNode.suites
        .map((s: any) => filterSuite(s))
        .filter((s: any) => {
          const hasTests = s.tests && s.tests.length > 0;
          const hasSubSuites = s.suites && s.suites.length > 0;
          return hasTests || hasSubSuites;
        });
    }
    
    return filteredNode;
  }).filter((node) => {
    // Keep node if it has tests or non-empty suites
    const hasTests = node.tests && node.tests.length > 0;
    const hasSuites = node.suites && node.suites.length > 0;
    return hasTests || hasSuites;
  });
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
   Container
   ========================= */
.suites-view {
  margin: var(--report-spacing-lg) 0;
}

/* =========================
   No Filter Results
   ========================= */
.no-results {
  padding: var(--report-spacing-2xl);
  text-align: center;
  background-color: var(--vp-c-bg-soft);
  border-radius: var(--report-card-border-radius);
  margin: var(--report-spacing-lg) 0;
}

.no-results p {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  margin: 0;
}

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
.status-line {
  display: flex;
  align-items: center;
  gap: var(--report-spacing-sm);
  margin-bottom: var(--report-spacing-sm);
}

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
   Suites and Tests Container
   ========================= */
.suites-container {
  margin-left: var(--report-spacing-lg);
}

.tests-container {
  margin-left: var(--report-spacing-lg);
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
