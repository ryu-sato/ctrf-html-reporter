<template>
  <div class="test-tree-view">
    <!-- Suites summary -->
    <div>
      <h1>Test Suites</h1>
      <p>Total Suites: {{ filteredNodes.length }}</p>
        <table>
          <thead>
            <tr>
              <th>Suite Name</th>
              <th>Status</th>
              <th>Total Suites</th>
              <th>Total Tests</th>
              <th>Passed</th>
              <th>Failed</th>
              <th>Skipped</th>
              <th>Pending</th>
              <th>Flaky</th>
              <th>Other</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody v-for="(node, index) in filteredNodes" :key="index">
            <tr>
              <td>{{ node.name }}</td>
              <td>{{ node.status }}</td>
              <td>{{ node.summary?.suites || node.suites?.length || 0 }}</td>
              <td>{{ node.summary?.tests || node.tests?.length || 0 }}</td>
              <td>{{ node.summary?.passed || 0 }}</td>
              <td>{{ node.summary?.failed || 0 }}</td>
              <td>{{ node.summary?.skipped || 0 }}</td>
              <td>{{ node.summary?.pending || 0 }}</td>
              <td>{{ node.summary?.flaky || 0 }}</td>
              <td>{{ node.summary?.other || 0 }}</td>
              <td>{{ formatDuration(node.duration) }}</td>
            </tr>
          </tbody>
        </table>
    </div>

    <SuitesDurationBarChart
      :nodes="filteredNodes"
    />

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

    <TreeNodesInfo
      v-else
      :nodes="filteredNodes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import TestFilter from './TestFilter.vue';
import type { TreeNode } from 'ctrf';
import { formatDuration } from '../../../helpers/formatter';
import SuitesDurationBarChart from '../../components/charts/SuitesDurationBarChart.vue';

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
</script>

<style scoped>
/* =========================
   Container
   ========================= */
.test-tree-view {
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
</style>
