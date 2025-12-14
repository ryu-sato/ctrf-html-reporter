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
          <span class="status-label passed">✓ Passed</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="failed" 
            :checked="selectedStatuses.includes('failed')"
            @change="toggleStatus('failed')"
          />
          <span class="status-label failed">✗ Failed</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="skipped" 
            :checked="selectedStatuses.includes('skipped')"
            @change="toggleStatus('skipped')"
          />
          <span class="status-label skipped">⊘ Skipped</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="pending" 
            :checked="selectedStatuses.includes('pending')"
            @change="toggleStatus('pending')"
          />
          <span class="status-label pending">⋯ Pending</span>
        </label>
      </div>
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

    <div v-if="selectedStatuses.length > 0 || selectedTags.length > 0" class="filter-actions">
      <button @click="clearFilters" class="clear-button">Clear All Filters</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  selectedStatuses: {
    type: Array,
    default: () => []
  },
  selectedTags: {
    type: Array,
    default: () => []
  },
  availableTags: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['update:selectedStatuses', 'update:selectedTags', 'clear']);

const toggleStatus = (status) => {
  const newStatuses = [...props.selectedStatuses];
  const index = newStatuses.indexOf(status);
  
  if (index > -1) {
    newStatuses.splice(index, 1);
  } else {
    newStatuses.push(status);
  }
  
  emit('update:selectedStatuses', newStatuses);
};

const toggleTag = (tag) => {
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
  emit('clear');
};
</script>

<style scoped>
.test-filter {
  padding: 1rem;
  background-color: var(--vp-c-bg-soft);
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.filter-section {
  margin-bottom: 1.5rem;
}

.filter-section:last-of-type {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filter-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.filter-checkbox input[type="checkbox"] {
  margin-right: 0.5rem;
  cursor: pointer;
}

.status-label {
  font-size: 0.875rem;
}

.status-label.passed {
  color: var(--vp-c-green-1);
}

.status-label.failed {
  color: var(--vp-c-red-1);
}

.status-label.skipped {
  color: var(--vp-c-yellow-1);
}

.status-label.pending {
  color: var(--vp-c-purple-1);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  font-size: 0.75rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.filter-tag:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
}

.filter-tag input[type="checkbox"] {
  margin-right: 0.5rem;
  cursor: pointer;
}

.filter-tag input[type="checkbox"]:checked + .tag-label {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.tag-label {
  color: var(--vp-c-text-2);
  transition: all 0.2s;
}

.filter-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--vp-c-divider);
}

.clear-button {
  padding: 0.5rem 1rem;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.clear-button:active {
  transform: translateY(1px);
}
</style>
