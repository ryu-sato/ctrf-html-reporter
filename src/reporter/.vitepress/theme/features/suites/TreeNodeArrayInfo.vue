<template>
  <div v-for="(node, index) in props.nodes" :key="index" class="mb-[var(--report-spacing-2xl)]">
    <h2 :id="'test-tree-' + node.name" class="mt-0 mb-[var(--report-spacing-sm)] border-b-0">{{ node.name }}</h2>

    <div v-if="node.summary" class="p-[var(--report-spacing-sm)] bg-[var(--vp-c-bg-soft)] rounded-[var(--report-control-border-radius)] my-[var(--report-spacing-sm)]">
      <div class="flex gap-[var(--report-spacing-lg)] text-[var(--report-control-font-size)] flex-wrap">
        <Badge :type="getStatusType(node.status)">{{ node.status }}</Badge>
  
        <span class="flex items-center gap-[var(--report-spacing-xs)]">Tests: {{ node.summary.tests || node.tests?.length || 0 }}</span>
        <span class="flex items-center gap-[var(--report-spacing-xs)] text-[var(--report-status-passed)]"><PassedIcon/> {{ node.summary.passed || 0 }}</span>
        <span class="flex items-center gap-[var(--report-spacing-xs)] text-[var(--report-status-failed)]"><FailedIcon/> {{ node.summary.failed || 0 }}</span>
        <span class="flex items-center gap-[var(--report-spacing-xs)] text-[var(--report-status-skipped)]"><SkippedIcon/> {{ node.summary.skipped || 0 }}</span>
        <span class="flex items-center gap-[var(--report-spacing-xs)] text-[var(--report-status-pending)]"><PendingIcon/> {{ node.summary.pending || 0 }}</span>
        <span v-if="node.summary.flaky" class="flex items-center gap-[var(--report-spacing-xs)] text-[var(--report-status-flaky)]"><FlakyIcon/> {{ node.summary.flaky }}</span>

        <span class="flex items-center gap-[var(--report-spacing-xs)] text-[var(--vp-c-text-2)]">Duration: {{ formatDuration(node.duration) }}</span>
    </div>
    </div>

    <div v-if="node.suites && node.suites.length > 0" class="ml-4">
      <TreeNodeInfo
        v-for="(suite, suiteIndex) in node.suites" 
        :key="suiteIndex"
        :treeNode="suite"
      />
    </div>

    <div v-if="node.tests && node.tests.length > 0" class="ml-4 mt-2">
      <details open>
        <summary class="cursor-pointer text-sm select-none">
          Show {{ node.tests.length }} test(s)
        </summary>
        <ul class="mt-[var(--report-spacing-sm)] text-[var(--report-control-font-size)] list-none p-0">
          <li v-for="(test, testIndex) in node.tests" :key="testIndex" 
              class="my-[var(--report-spacing-xs)] flex items-center gap-[var(--report-spacing-sm)] cursor-pointer p-[var(--report-spacing-sm)] rounded-[var(--report-control-border-radius)] transition-[background-color] duration-[var(--report-transition-fast)] flex-wrap hover:bg-[var(--vp-c-bg-soft)]" 
              @click="handleTestClick(test)">
            <Badge :type="getStatusType(test.status)" class="text-[var(--report-badge-font-size)]">{{ test.status }}</Badge>
            <span class="flex-1 min-w-[200px]">{{ test.name }}</span>
            <span class="text-[var(--vp-c-text-3)]">({{ formatDuration(test.duration) }})</span>
            <span v-if="test.flaky" class="text-[var(--report-status-flaky)] flex items-center gap-[var(--report-spacing-xs)]"><FlakyIcon/> Flaky</span>
            <div v-if="test.tags && test.tags.length > 0" class="flex gap-[var(--report-spacing-xs)] flex-wrap w-full mt-[var(--report-spacing-xs)]">
              <span v-for="(tag, tagIndex) in test.tags" :key="tagIndex" 
                    class="inline-block py-[0.125rem] px-[var(--report-spacing-sm)] bg-[var(--vp-c-bg-mute)] border border-[var(--vp-c-divider)] rounded-[12px] text-[var(--report-badge-font-size)] text-[var(--vp-c-text-2)]">{{ tag }}</span>
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
