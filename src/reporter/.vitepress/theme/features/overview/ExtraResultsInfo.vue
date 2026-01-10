<template>
  <div v-if="props.extra">
    <!-- Primary Metrics Cards -->
    <div class="relative overflow-hidden rounded-xl border transition-all border-b-4 border-[var(--vp-c-tip-soft)]">
      <div class="grid grid-cols-1 gap-1 p-2">
        <!-- Extra Card -->
        <div v-if="extraInfo" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg">
                <InformationCircleIcon class="w-5 h-5"/>
              </div>
              <div class="text-xs uppercase tracking-wider text-[var(--vp-c-text-3)]">Extra</div>
            </div>
            <div class="text-sm truncate text-[var(--vp-c-text-1)]">
              <div class="relative overflow-hidden rounded-xl border transition-all border-b-4 border-[var(--vp-c-tip-soft)]">
                <div v-for="(value, key) in props.extra" :key="key" class="grid grid-cols-1 gap-1 p-2">
                  <div class="relative overflow-hidden rounded-xl transition-all duration-200">
                    <div class="py-1 px-3">
                      <div class="flex items-center">
                        <div class="text-xs uppercase tracking-wider text-[var(--vp-c-text-3)]">{{ key }}</div>
                      </div>
                      <pre class="text-wrap">{{ value }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]">
    <DocumentTextIcon class="w-12 h-12" />
    <p class="text-sm font-medium text-[var(--vp-c-text-3)]">No extra data available</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DocumentTextIcon, InformationCircleIcon } from '@heroicons/vue/16/solid';
import type { Results } from 'ctrf';

const props = defineProps({
  extra: {
    type: Object as () => Results['extra'],
    required: false,
    default: null,
  },
});

// Compute tool information string
const extraInfo = computed(() => {
  if (!props.extra) return null;

  return props.extra || null;
});

</script>
