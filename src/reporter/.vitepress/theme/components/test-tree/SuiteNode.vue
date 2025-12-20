<template>
  <div class="suite-node">
    <h3>{{ suite.name }}</h3>
    
    <div class="suite-header">
      <Badge :type="getStatusType(suite.status)">{{ suite.status }}</Badge>
      <span class="suite-duration">{{ suite.duration }}ms</span>
    </div>

    <div v-if="suite.summary" class="suite-summary">
      Tests: {{ suite.summary.tests || suite.tests?.length || 0 }} |
      <span class="passed"><CheckCircle :size="14" :stroke-width="2" /> {{ suite.summary.passed || 0 }}</span> |
      <span class="failed"><XCircle :size="14" :stroke-width="2" /> {{ suite.summary.failed || 0 }}</span> |
      <span class="skipped"><MinusCircle :size="14" :stroke-width="2" /> {{ suite.summary.skipped || 0 }}</span> |
      <span class="pending"><Clock :size="14" :stroke-width="2" /> {{ suite.summary.pending || 0 }}</span>
      <span v-if="suite.summary.flaky" class="flaky"> | <Zap :size="14" :stroke-width="2" /> {{ suite.summary.flaky }}</span>
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
            <span class="test-duration">({{ test.duration }}ms)</span>
            <span v-if="test.flaky" class="test-flaky"><Zap :size="14" :stroke-width="2" /> Flaky</span>
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
import { CheckCircle, XCircle, MinusCircle, Clock, Zap } from 'lucide-vue-next';
import { VPBadge as Badge } from 'vitepress/theme';

const props = defineProps({
  suite: {
    type: Object,
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
.suite-node {
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 2px solid var(--vp-c-divider);
}

.suite-node h3 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  border-bottom: none;
}

.suite-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.suite-duration {
  color: var(--vp-c-text-2);
  font-size: 0.875rem;
}

.suite-summary {
  font-size: 0.875rem;
  color: var(--vp-c-text-2);
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.suite-summary span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.suite-summary .passed {
  color: var(--vp-c-green-1);
}

.suite-summary .failed {
  color: var(--vp-c-red-1);
}

.suite-summary .skipped {
  color: var(--vp-c-yellow-1);
}

.suite-summary .pending {
  color: var(--vp-c-purple-1);
}

.suite-summary .flaky {
  color: var(--vp-c-orange-1);
}

.nested-suites {
  margin-left: 0;
}

.suite-tests {
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
  color: var(--vp-c-orange-1);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
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
