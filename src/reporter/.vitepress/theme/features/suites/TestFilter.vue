<template>
  <div class="test-filter">
    <div class="filter-section">
      <h4>Filter by Status</h4>
      <div class="filter-checkboxes">
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="passed" 
            :checked="selectedStatuses.includes('passed')"
            @change="toggleStatus('passed')"
          />
          <span class="status-label passed"><PassedIcon/>Passed</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="failed" 
            :checked="selectedStatuses.includes('failed')"
            @change="toggleStatus('failed')"
          />
          <span class="status-label failed"><FailedIcon/>Failed</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="skipped" 
            :checked="selectedStatuses.includes('skipped')"
            @change="toggleStatus('skipped')"
          />
          <span class="status-label skipped"><SkippedIcon/>Skipped</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="pending" 
            :checked="selectedStatuses.includes('pending')"
            @change="toggleStatus('pending')"
          />
          <span class="status-label pending"><PendingIcon/>Pending</span>
        </label>
      </div>
    </div>

    <div class="filter-section">
      <h4>Filter by Flaky</h4>
      <label class="filter-checkbox">
        <input 
          type="checkbox" 
          value="flaky" 
          :checked="isFlakySelected"
          @change="toggleFlakySelected"
        />
        <span class="status-label flaky"><FlakyIcon/>Flaky</span>
      </label>
    </div>

    <div v-if="availableTags.length > 0" class="filter-section">
      <h4>Filter by Tags</h4>
      <div class="filter-tags">
        <label 
          v-for="tag in availableTags" 
          :key="tag" 
          class="filter-tag"
        >
          <input 
            type="checkbox" 
            :value="tag"
            :checked="selectedTags.includes(tag)"
            @change="toggleTag(tag)"
          />
          <span class="tag-label">{{ tag }}</span>
        </label>
      </div>
    </div>

    <div v-if="selectedStatuses.length > 0 || isFlakySelected || selectedTags.length > 0" class="filter-actions">
      <button @click="clearFilters" class="clear-button">Clear All Filters</button>
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

<style scoped>
@import "tailwindcss" reference;

.test-filter {
  @apply p-4 rounded-lg mb-6;
  background-color: var(--vp-c-bg-soft);
}

.filter-section {
  @apply mb-6 last:mb-0;
}

.filter-section h4 {
  @apply m-0 mb-3 text-sm font-semibold uppercase tracking-wide;
  color: var(--vp-c-text-1);
}

.filter-checkboxes {
  @apply flex gap-2;
}

.filter-checkbox {
  @apply flex items-center cursor-pointer select-none;
}

.filter-checkbox input[type="checkbox"] {
  @apply mr-2 cursor-pointer;
}

.status-label {
  @apply flex items-center gap-1 text-sm;
}

.status-label.passed {
  color: var(--report-status-passed);
}

.status-label.failed {
  color: var(--report-status-failed);
}

.status-label.skipped {
  color: var(--report-status-skipped);
}

.status-label.pending {
  color: var(--report-status-pending);
}

.filter-tags {
  @apply flex flex-wrap gap-2;
}

.filter-tag {
  @apply inline-flex items-center px-3 py-1 rounded-full border text-xs cursor-pointer select-none transition-all;
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
}

.filter-tag:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
}

.filter-tag input[type="checkbox"] {
  @apply mr-2 cursor-pointer;
}

.filter-tag input[type="checkbox"]:checked + .tag-label {
  @apply font-semibold;
  color: var(--vp-c-brand-1);
}

.tag-label {
  @apply transition-all;
  color: var(--vp-c-text-2);
}

.filter-actions {
  @apply mt-4 pt-4 border-t;
  border-color: var(--vp-c-divider);
}

.clear-button {
  @apply px-4 py-2 rounded border text-sm cursor-pointer transition-all;
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.clear-button:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.clear-button:active {
  @apply translate-y-px;
}

.clear-button:focus-visible {
  @apply outline-2 outline-offset-2;
  outline-color: var(--vp-c-brand-1);
}

.filter-checkbox input[type="checkbox"]:focus-visible,
.filter-tag input[type="checkbox"]:focus-visible {
  @apply outline-2 outline-offset-2;
  outline-color: var(--vp-c-brand-1);
}
</style>
