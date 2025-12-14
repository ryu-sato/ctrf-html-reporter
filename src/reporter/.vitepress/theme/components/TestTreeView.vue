<template>
  <div class="test-tree-view">
    <!-- Filter Component -->
    <TestFilter
      :selectedStatuses="selectedStatuses"
      :selectedTags="selectedTags"
      :availableTags="availableTags"
      @update:selectedStatuses="selectedStatuses = $event"
      @update:selectedTags="selectedTags = $event"
    />

    <!-- No results message -->
    <div v-if="filteredNodes.length === 0" class="no-results">
      <p>No tests match the selected filters.</p>
    </div>

    <div v-for="(root, index) in filteredNodes" :key="index" class="tree-root">
      <h2 :id="'test-tree-' + root.name">{{ root.name }}</h2>
      
      <div class="status-line">
        <Badge :type="getStatusType(root.status)">{{ root.status }}</Badge>
        <span class="duration-text">Duration: {{ root.duration }}ms</span>
      </div>

      <div v-if="root.summary" class="summary-box">
        <div class="summary-stats">
          <span>Tests: {{ root.summary.tests || root.tests?.length || 0 }}</span>
          <span class="passed">✓ {{ root.summary.passed || 0 }}</span>
          <span class="failed">✗ {{ root.summary.failed || 0 }}</span>
          <span class="skipped">⊘ {{ root.summary.skipped || 0 }}</span>
          <span class="pending">⋯ {{ root.summary.pending || 0 }}</span>
          <span v-if="root.summary.flaky" class="flaky">⚡ {{ root.summary.flaky }}</span>
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
              <span class="test-duration">({{ test.duration }}ms)</span>
              <span v-if="test.flaky" class="test-flaky">⚡ Flaky</span>
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

<script setup>
import { inject, onMounted, ref, computed } from 'vue';
import SuiteNode from './SuiteNode.vue';
import TestFilter from './TestFilter.vue';

const props = defineProps({
  nodes: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value);
    }
  }
});

// Filter states
const selectedStatuses = ref([]);
const selectedTags = ref([]);

// Get all available tags from tests
const availableTags = computed(() => {
  const tags = new Set();
  
  const extractTags = (node) => {
    // Extract tags from tests at this level
    if (node.tests && Array.isArray(node.tests)) {
      node.tests.forEach(test => {
        if (test.tags && Array.isArray(test.tags)) {
          test.tags.forEach(tag => tags.add(tag));
        }
      });
    }
    
    // Recursively extract tags from suites
    if (node.suites && Array.isArray(node.suites)) {
      node.suites.forEach(suite => extractTags(suite));
    }
  };
  
  props.nodes.forEach(node => extractTags(node));
  
  return Array.from(tags).sort();
});

// Filter tests based on selected statuses and tags
const filterTests = (tests) => {
  if (!tests || !Array.isArray(tests)) return tests;
  
  return tests.filter(test => {
    // Filter by status
    const statusMatch = selectedStatuses.value.length === 0 || 
                       selectedStatuses.value.includes(test.status);
    
    // Filter by tags
    const tagsMatch = selectedTags.value.length === 0 ||
                     (test.tags && Array.isArray(test.tags) && 
                      selectedTags.value.some(tag => test.tags.includes(tag)));
    
    return statusMatch && tagsMatch;
  });
};

// Filter suites recursively
const filterSuite = (suite) => {
  const filteredSuite = { ...suite };
  
  // Filter tests in this suite
  if (filteredSuite.tests) {
    filteredSuite.tests = filterTests(filteredSuite.tests);
  }
  
  // Filter nested suites
  if (filteredSuite.suites && Array.isArray(filteredSuite.suites)) {
    filteredSuite.suites = filteredSuite.suites
      .map(s => filterSuite(s))
      .filter(s => {
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
  if (selectedStatuses.value.length === 0 && selectedTags.value.length === 0) {
    return props.nodes;
  }
  
  return props.nodes.map(node => {
    const filteredNode = { ...node };
    
    // Filter tests at root level
    if (filteredNode.tests) {
      filteredNode.tests = filterTests(filteredNode.tests);
    }
    
    // Filter suites
    if (filteredNode.suites && Array.isArray(filteredNode.suites)) {
      filteredNode.suites = filteredNode.suites
        .map(s => filterSuite(s))
        .filter(s => {
          const hasTests = s.tests && s.tests.length > 0;
          const hasSubSuites = s.suites && s.suites.length > 0;
          return hasTests || hasSubSuites;
        });
    }
    
    return filteredNode;
  }).filter(node => {
    // Keep node if it has tests or non-empty suites
    const hasTests = node.tests && node.tests.length > 0;
    const hasSuites = node.suites && node.suites.length > 0;
    return hasTests || hasSuites;
  });
});

onMounted(() => {
  // Debug: Check if test data has tags
  if (props.nodes && props.nodes.length > 0) {
    const firstNode = props.nodes[0];
    console.log('TestTreeView - First node:', firstNode.name);
    
    if (firstNode.suites && firstNode.suites.length > 0) {
      const firstSuite = firstNode.suites[0];
      if (firstSuite.tests && firstSuite.tests.length > 0) {
        console.log('TestTreeView - First test in suite has tags:', firstSuite.tests[0].tags);
      }
    }
    
    if (firstNode.tests && firstNode.tests.length > 0) {
      console.log('TestTreeView - First test in root has tags:', firstNode.tests[0].tags);
    }
  }
});

// Inject selectTest function from ReportLayout
const selectTest = inject('selectTest', null);

// Handle test click
const handleTestClick = (test) => {
  if (selectTest) {
    selectTest(test);
  }
};

// Function to get status badge type
const getStatusType = (status) => {
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
.test-tree-view {
  margin: 1rem 0;
}

.no-results {
  padding: 2rem;
  text-align: center;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin: 1rem 0;
}

.no-results p {
  color: var(--vp-c-text-2);
  font-size: 1rem;
  margin: 0;
}

.tree-root {
  margin-bottom: 2rem;
}

.tree-root h2 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  border-bottom: none;
}

.status-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.duration-text {
  color: var(--vp-c-text-2);
}

.summary-box {
  padding: 0.5rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 4px;
  margin: 0.5rem 0;
}

.summary-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  flex-wrap: wrap;
}

.summary-stats .passed {
  color: #10b981;
}

.summary-stats .failed {
  color: #ef4444;
}

.summary-stats .skipped {
  color: #f59e0b;
}

.summary-stats .pending {
  color: #8b5cf6;
}

.summary-stats .flaky {
  color: #f97316;
}

.suites-container {
  margin-left: 1rem;
}

.tests-container {
  margin-left: 1rem;
  margin-top: 0.5rem;
}

.tests-summary {
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  user-select: none;
}

.tests-list {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  list-style: none;
  padding-left: 0;
}

.test-item {
  margin: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
  flex-wrap: wrap;
}

.test-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.test-badge {
  font-size: 0.75rem;
}

.test-name {
  flex: 1;
  min-width: 200px;
}

.test-duration {
  color: var(--vp-c-text-3);
}

.test-flaky {
  color: #f97316;
}

.test-tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  width: 100%;
  margin-top: 0.25rem;
}

.tag {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  background-color: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}
</style>
