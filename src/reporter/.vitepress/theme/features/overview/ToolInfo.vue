<template>
  <div v-if="props.tool">
    <!-- Primary Metrics Cards -->
    <div class="relative overflow-hidden rounded-xl border transition-all border-b-4 border-[var(--vp-c-tip-soft)]">
      <div class="grid grid-cols-1 gap-1 p-2">
        <!-- Tool Card -->
        <div v-if="toolInfo" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="absolute top-0 right-0 opacity-[0.03]"></div>
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg">
                <WrenchScrewdriverIcon class="w-5 h-5"/>
              </div>
              <div class="text-xs uppercase tracking-wider text-[var(--vp-c-text-3)]">Testing Tool</div>
            </div>
            <div class="text-sm truncate text-[var(--vp-c-text-1)]">{{ toolInfo }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]">
    <DocumentTextIcon class="w-12 h-12" />
    <p class="text-sm font-medium text-[var(--vp-c-text-3)]">No tool data available</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DocumentTextIcon, WrenchScrewdriverIcon } from '@heroicons/vue/16/solid';
import type { Tool } from 'ctrf';

const props = defineProps({
  tool: {
    type: Object as () => Tool,
    required: false,
    default: null,
  },
});

// Compute tool information string
const toolInfo = computed(() => {
  if (!props.tool) return null;

  const tool = props.tool;
  const name = tool.name;
  const version = tool.version ? ` v${tool.version}` : '';

  return name + version || null;
});

</script>
