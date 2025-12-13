<script setup>
import { ref, onMounted, computed } from 'vue';
import { data as testTree } from './organizeTestsBySuite.data.js';

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

// Function to render a suite with its children recursively
const renderSuite = (suite, level = 0) => {
  return suite;
};

// Prepare stats for TestStats component
const testStatsData = computed(() => {
  if (!testTree.summary) return null;
  
  const additionalMetrics = [];
  
  if (testTree.summary.pending !== undefined) {
    additionalMetrics.push({
      label: 'Pending',
      value: testTree.summary.pending,
      style: { color: '#8b5cf6' }
    });
  }
  
  if (testTree.summary.flaky !== undefined && testTree.summary.flaky > 0) {
    additionalMetrics.push({
      label: 'Flaky',
      value: testTree.summary.flaky,
      style: { color: '#f97316' }
    });
  }
  
  return {
    stats: {
      total: testTree.summary.tests,
      passed: testTree.summary.passed,
      failed: testTree.summary.failed,
      skipped: testTree.summary.skipped
    },
    additionalMetrics: additionalMetrics
  };
});
</script>

# Suites

<TestStats 
  v-if="testStatsData"
  :stats="testStatsData.stats"
  :additionalMetrics="testStatsData.additionalMetrics"
  :totalDuration="testTree.summary.duration"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>

<div v-for="(root, index) in testTree.roots" :key="index" style="margin-bottom: 2rem;">
  
## {{ root.name }}

<Badge :type="getStatusType(root.status)">{{ root.status }}</Badge>
<span style="margin-left: 0.5rem; color: var(--vp-c-text-2);">Duration: {{ root.duration }}ms</span>

<div style="padding: 0.5rem; background-color: var(--vp-c-bg-soft); border-radius: 4px; margin: 0.5rem 0;">
  <div style="display: flex; gap: 1rem; font-size: 0.875rem;">
    <span>Tests: {{ root.summary?.tests || root.tests?.length || 0 }}</span>
    <span style="color: #10b981;">✓ {{ root.summary?.passed || 0 }}</span>
    <span style="color: #ef4444;">✗ {{ root.summary?.failed || 0 }}</span>
    <span style="color: #f59e0b;">⊘ {{ root.summary?.skipped || 0 }}</span>
    <span style="color: #8b5cf6;">⋯ {{ root.summary?.pending || 0 }}</span>
    <span style="color: #f97316;" v-if="root.summary?.flaky">⚡ {{ root.summary.flaky }}</span>
  </div>
</div>

<div v-if="root.suites && root.suites.length > 0" style="margin-left: 1rem;">
  <div v-for="(suite, suiteIndex) in root.suites" :key="suiteIndex" style="margin-bottom: 1rem; padding-left: 1rem; border-left: 2px solid var(--vp-c-divider);">
    
### {{ suite.name }}

<Badge :type="getStatusType(suite.status)">{{ suite.status }}</Badge>
<span style="margin-left: 0.5rem; color: var(--vp-c-text-2); font-size: 0.875rem;">{{ suite.duration }}ms</span>

<div style="font-size: 0.875rem; color: var(--vp-c-text-2); margin: 0.5rem 0;">
  Tests: {{ suite.summary?.tests || suite.tests?.length || 0 }} |
  <span style="color: #10b981;">Passed: {{ suite.summary?.passed || 0 }}</span> |
  <span style="color: #ef4444;">Failed: {{ suite.summary?.failed || 0 }}</span> |
  <span style="color: #f59e0b;">Skipped: {{ suite.summary?.skipped || 0 }}</span> |
  <span style="color: #8b5cf6;">Pending: {{ suite.summary?.pending || 0 }}</span>
  <span style="color: #f97316;" v-if="suite.summary?.flaky"> | Flaky: {{ suite.summary.flaky }}</span>
</div>

<div v-if="suite.tests && suite.tests.length > 0" style="margin-top: 0.5rem;">
  <details>
    <summary style="cursor: pointer; font-size: 0.875rem; color: var(--vp-c-text-2);">
      Show {{ suite.tests.length }} test(s)
    </summary>
    <ul style="margin-top: 0.5rem; font-size: 0.875rem;">
      <li v-for="(test, testIndex) in suite.tests" :key="testIndex" style="margin: 0.25rem 0;">
        <Badge :type="getStatusType(test.status)" style="font-size: 0.75rem;">{{ test.status }}</Badge>
        <span style="margin-left: 0.5rem;">{{ test.name }}</span>
        <span style="color: var(--vp-c-text-3); margin-left: 0.5rem;">({{ test.duration }}ms)</span>
        <span v-if="test.flaky" style="color: #f97316; margin-left: 0.5rem;">⚡ Flaky</span>
      </li>
    </ul>
  </details>
</div>

  </div>
</div>

<div v-if="root.tests && root.tests.length > 0" style="margin-left: 1rem; margin-top: 0.5rem;">
  <details>
    <summary style="cursor: pointer; font-size: 0.875rem; color: var(--vp-c-text-2);">
      Show {{ root.tests.length }} test(s)
    </summary>
    <ul style="margin-top: 0.5rem; font-size: 0.875rem;">
      <li v-for="(test, testIndex) in root.tests" :key="testIndex" style="margin: 0.25rem 0;">
        <Badge :type="getStatusType(test.status)" style="font-size: 0.75rem;">{{ test.status }}</Badge>
        <span style="margin-left: 0.5rem;">{{ test.name }}</span>
        <span style="color: var(--vp-c-text-3); margin-left: 0.5rem;">({{ test.duration }}ms)</span>
        <span v-if="test.flaky" style="color: #f97316; margin-left: 0.5rem;">⚡ Flaky</span>
      </li>
    </ul>
  </details>
</div>

</div>
