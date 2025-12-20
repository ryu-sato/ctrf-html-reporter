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
          <span class="status-label passed"><CheckCircle :size="16" :stroke-width="2" />Passed</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="failed" 
            :checked="selectedStatuses.includes('failed')"
            @change="toggleStatus('failed')"
          />
          <span class="status-label failed"><XCircle :size="16" :stroke-width="2" />Failed</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="skipped" 
            :checked="selectedStatuses.includes('skipped')"
            @change="toggleStatus('skipped')"
          />
          <span class="status-label skipped"><MinusCircle :size="16" :stroke-width="2" />Skipped</span>
        </label>
        <label class="filter-checkbox">
          <input 
            type="checkbox" 
            value="pending" 
            :checked="selectedStatuses.includes('pending')"
            @change="toggleStatus('pending')"
          />
          <span class="status-label pending"><Clock :size="16" :stroke-width="2" />Pending</span>
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

<script setup lang="ts">
import { CheckCircle, XCircle, MinusCircle, Clock, Zap } from 'lucide-vue-next';

const props = defineProps({
  selectedStatuses: {
    type: Array as () => string[],
    default: () => []
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

const emit = defineEmits(['update:selectedStatuses', 'update:selectedTags', 'clear']);

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
  emit('clear');
};
</script>

<style scoped>
/* =========================
   Filter Container
   ========================= */
.test-filter {
  padding: var(--report-spacing-lg);
  background-color: var(--vp-c-bg-soft);
  border-radius: var(--report-card-border-radius);
  margin-bottom: var(--report-spacing-xl);
}

/* =========================
   Filter Section
   ========================= */
.filter-section {
  margin-bottom: var(--report-spacing-xl);
}

.filter-section:last-of-type {
  margin-bottom: 0;
}

.filter-section h4 {
  margin: 0 0 var(--report-spacing-md) 0;
  font-size: var(--report-control-font-size);
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* =========================
   Status Filter
   ========================= */
.filter-checkboxes {
  display: flex;
  flex-direction: column;
  gap: var(--report-spacing-sm);
}

.filter-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.filter-checkbox input[type="checkbox"] {
  margin-right: var(--report-spacing-sm);
  cursor: pointer;
}

.status-label {
  display: flex;
  align-items: center;
  gap: var(--report-spacing-xs);
  font-size: var(--report-control-font-size);
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

/* =========================
   Tag Filter
   ========================= */
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--report-spacing-sm);
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  padding: var(--report-spacing-xs) var(--report-spacing-md);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  font-size: var(--report-badge-font-size);
  cursor: pointer;
  user-select: none;
  transition: background-color var(--report-transition-fast), 
              border-color var(--report-transition-fast);
}

.filter-tag:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
}

.filter-tag input[type="checkbox"] {
  margin-right: var(--report-spacing-sm);
  cursor: pointer;
}

.filter-tag input[type="checkbox"]:checked + .tag-label {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.tag-label {
  color: var(--vp-c-text-2);
  transition: color var(--report-transition-fast), 
              font-weight var(--report-transition-fast);
}

/* =========================
   Action Buttons
   ========================= */
.filter-actions {
  margin-top: var(--report-spacing-lg);
  padding-top: var(--report-spacing-lg);
  border-top: 1px solid var(--vp-c-divider);
}

.clear-button {
  padding: var(--report-btn-padding);
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: var(--report-btn-border-radius);
  font-size: var(--report-btn-font-size);
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: background-color var(--report-transition-fast), 
              border-color var(--report-transition-fast), 
              color var(--report-transition-fast), 
              transform 0.1s;
}

.clear-button:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.clear-button:active {
  transform: translateY(1px);
}

/* Accessibility: Focus Visualization */
.clear-button:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}

.filter-checkbox input[type="checkbox"]:focus-visible,
.filter-tag input[type="checkbox"]:focus-visible {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
</style>
