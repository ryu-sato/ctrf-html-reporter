<template>
  <div class="test-tree-view">
    <div v-for="(root, index) in nodes" :key="index" class="tree-root">
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
        <details>
          <summary class="tests-summary">
            Show {{ root.tests.length }} test(s)
          </summary>
          <ul class="tests-list">
            <li v-for="(test, testIndex) in root.tests" :key="testIndex" class="test-item">
              <Badge :type="getStatusType(test.status)" class="test-badge">{{ test.status }}</Badge>
              <span class="test-name">{{ test.name }}</span>
              <span class="test-duration">({{ test.duration }}ms)</span>
              <span v-if="test.flaky" class="test-flaky">⚡ Flaky</span>
            </li>
          </ul>
        </details>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';
import SuiteNode from './SuiteNode.vue';

const props = defineProps({
  nodes: {
    type: Array,
    required: true,
    validator: (value) => {
      return Array.isArray(value);
    }
  }
});

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
}

.test-badge {
  font-size: 0.75rem;
}

.test-name {
  flex: 1;
}

.test-duration {
  color: var(--vp-c-text-3);
}

.test-flaky {
  color: #f97316;
}
</style>
