<template>
  <div class="p-4 rounded-lg mb-6 bg-[var(--vp-c-bg-soft)]">
    <div class="mb-6 last:mb-0">
      <h4 class="m-0 mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--vp-c-text-1)]">Filter by Status</h4>
      <div class="flex gap-2">
        <label class="flex items-center cursor-pointer select-none">
          <input 
            type="checkbox" 
            value="passed" 
            :checked="selectedStatuses.includes('passed')"
            @change="toggleStatus('passed')"
            class="mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vp-c-brand-1)]"
          />
          <span class="flex items-center gap-1 text-sm text-[var(--report-status-passed)]"><PassedIcon/>Passed</span>
        </label>
        <label class="flex items-center cursor-pointer select-none">
          <input 
            type="checkbox" 
            value="failed" 
            :checked="selectedStatuses.includes('failed')"
            @change="toggleStatus('failed')"
            class="mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vp-c-brand-1)]"
          />
          <span class="flex items-center gap-1 text-sm text-[var(--report-status-failed)]"><FailedIcon/>Failed</span>
        </label>
        <label class="flex items-center cursor-pointer select-none">
          <input 
            type="checkbox" 
            value="skipped" 
            :checked="selectedStatuses.includes('skipped')"
            @change="toggleStatus('skipped')"
            class="mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vp-c-brand-1)]"
          />
          <span class="flex items-center gap-1 text-sm text-[var(--report-status-skipped)]"><SkippedIcon/>Skipped</span>
        </label>
        <label class="flex items-center cursor-pointer select-none">
          <input 
            type="checkbox" 
            value="pending" 
            :checked="selectedStatuses.includes('pending')"
            @change="toggleStatus('pending')"
            class="mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vp-c-brand-1)]"
          />
          <span class="flex items-center gap-1 text-sm text-[var(--report-status-pending)]"><PendingIcon/>Pending</span>
        </label>
      </div>
    </div>

    <div class="mb-6 last:mb-0">
      <h4 class="m-0 mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--vp-c-text-1)]">Filter by Flaky</h4>
      <label class="flex items-center cursor-pointer select-none">
        <input 
          type="checkbox" 
          value="flaky" 
          :checked="isFlakySelected"
          @change="toggleFlakySelected"
          class="mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vp-c-brand-1)]"
        />
        <span class="flex items-center gap-1 text-sm"><FlakyIcon/>Flaky</span>
      </label>
    </div>

    <div v-if="availableTags.length > 0" class="mb-6 last:mb-0">
      <h4 class="m-0 mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--vp-c-text-1)]">Filter by Tags</h4>
      <div class="flex flex-wrap gap-2">
        <label 
          v-for="tag in availableTags" 
          :key="tag" 
          class="inline-flex items-center px-3 py-1 rounded-full border text-xs cursor-pointer select-none transition-all bg-[var(--vp-c-bg)] border-[var(--vp-c-divider)] hover:border-[var(--vp-c-brand-1)]"
          :class="{ 'bg-[var(--vp-c-bg-mute)]': selectedTags.includes(tag) }"
        >
          <input 
            type="checkbox" 
            :value="tag"
            :checked="selectedTags.includes(tag)"
            @change="toggleTag(tag)"
            class="mr-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--vp-c-brand-1)]"
          />
          <span 
            class="transition-all text-[var(--vp-c-text-2)]"
            :class="selectedTags.includes(tag) ? 'font-semibold text-[var(--vp-c-brand-1)]' : ''"
          >{{ tag }}</span>
        </label>
      </div>
    </div>

    <div v-if="selectedStatuses.length > 0 || isFlakySelected || selectedTags.length > 0" class="mt-4 pt-4 border-t border-[var(--vp-c-divider)]">
      <button 
        @click="clearFilters" 
        class="px-4 py-2 rounded border text-sm cursor-pointer transition-all active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 bg-[var(--vp-c-bg)] border-[var(--vp-c-divider)] text-[var(--vp-c-text-1)] focus-visible:outline-[var(--vp-c-brand-1)] hover:bg-[var(--vp-c-bg-mute)] hover:border-[var(--vp-c-brand-1)] hover:text-[var(--vp-c-brand-1)]"
      >Clear All Filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  selectedStatuses: {
    type: Array as () => string[],
    default: () => []
  },
  isFlakySelected: {
    type: Boolean,
    default: false
  },
  selectedTags: {
    type: Array as () => string[],
    default: () => []
  },
  availableTags: {
    type: Array as () => string[],
    default: () => []
  }
});

const emit = defineEmits(['update:selectedStatuses', 'update:isFlakySelected', 'update:selectedTags', 'clear']);

const toggleStatus = (status: string) => {
  const newStatuses = [...props.selectedStatuses];
  const index = newStatuses.indexOf(status);
  
  if (index > -1) {
    newStatuses.splice(index, 1);
  } else {
    newStatuses.push(status);
  }
  
  emit('update:selectedStatuses', newStatuses);
};

const toggleFlakySelected = () => {
  const newIsFlakySelected = !props.isFlakySelected;

  emit('update:isFlakySelected', newIsFlakySelected);
};

const toggleTag = (tag: string) => {
  const newTags = [...props.selectedTags];
  const index = newTags.indexOf(tag);
  
  if (index > -1) {
    newTags.splice(index, 1);
  } else {
    newTags.push(tag);
  }
  
  emit('update:selectedTags', newTags);
};

const clearFilters = () => {
  emit('update:selectedStatuses', []);
  emit('update:selectedTags', []);
  emit('update:isFlakySelected', false);
  emit('clear');
};
</script>
