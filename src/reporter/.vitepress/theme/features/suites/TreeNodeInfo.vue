<template>
  <div class="mb-6 pl-6 border-l-2 border-[var(--vp-c-divider)]">
    <h3 class="mt-0 mb-2 text-lg border-b-0">{{ treeNode.name }}</h3>
    
    <div v-if="treeNode.summary" class="text-sm text-[var(--vp-c-text-2)] my-2 flex items-center gap-2 flex-wrap">
      <StatusBadge :type="treeNode.status">{{ treeNode.status }}</StatusBadge>

      Tests: {{ treeNode.summary.tests || treeNode.tests?.length || 0 }} |
      <span class="inline-flex items-center gap-1 text-[var(--report-status-passed)]"><PassedIcon/> {{ treeNode.summary.passed || 0 }}</span> |
      <span class="inline-flex items-center gap-1 text-[var(--report-status-failed)]"><FailedIcon/> {{ treeNode.summary.failed || 0 }}</span> |
      <span class="inline-flex items-center gap-1 text-[var(--report-status-skipped)]"><SkippedIcon/> {{ treeNode.summary.skipped || 0 }}</span> |
      <span class="inline-flex items-center gap-1 text-[var(--report-status-pending)]"><PendingIcon/> {{ treeNode.summary.pending || 0 }}</span>
      <span v-if="treeNode.summary.flaky" class="inline-flex items-center gap-1 text-[var(--report-status-flaky)]"> | <FlakyIcon/> {{ treeNode.summary.flaky }}</span>

      <span class="text-[var(--vp-c-text-2)]">({{ formatDuration(treeNode.duration) }})</span>
    </div>

    <!-- Nested suites -->
    <div v-if="treeNode.suites && treeNode.suites.length > 0" class="ml-0">
      <TreeNodeInfo
        v-for="(childSuite, index) in treeNode.suites" 
        :key="index"
        :treeNode="childSuite"
      />
    </div>

    <!-- Tests in this suite -->
    <div v-if="treeNode.tests && treeNode.tests.length > 0" class="mt-2">
      <details open>
        <summary class="cursor-pointer text-sm select-none text-[var(--vp-c-text-2)]">
          Show {{ treeNode.tests.length }} test(s)
        </summary>
        <ul class="mt-2 text-sm list-none pl-0">
          <li v-for="(test, testIndex) in treeNode.tests" :key="testIndex" class="my-1 flex items-center gap-3 cursor-pointer p-2 rounded-md transition-colors duration-150 hover:bg-[var(--vp-c-bg-soft)] flex-wrap" @click="handleTestClick(test)">
            <StatusBadge :type="test.status" class="text-xs">{{ test.status }}</StatusBadge>
            <span class="flex-1 min-w-[200px]">{{ test.name }}</span>
            <span class="text-[var(--vp-c-text-3)]">({{ formatDuration(test.duration) }})</span>
            <span v-if="test.flaky" class="text-[var(--report-status-flaky)] inline-flex items-center gap-1"><FlakyIcon/> Flaky</span>
            <div v-if="test.tags && test.tags.length > 0" class="flex gap-1 flex-wrap w-full mt-1">
              <span v-for="(tag, tagIndex) in test.tags" :key="tagIndex" class="inline-block px-2 py-1 rounded-xl text-xs leading-none border">{{ tag }}</span>
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

defineProps({
  treeNode: {
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
</script>
