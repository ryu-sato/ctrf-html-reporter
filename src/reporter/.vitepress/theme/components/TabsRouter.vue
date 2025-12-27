<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{
  tabs: Array<{
    id: string;
    label: string;
  }>;
}>();

const activeTab = ref<string>(props.tabs[0]?.id || '');

// Update active tab from hash
const updateFromHash = () => {
  const hash = window.location.hash.slice(1); // Remove '#'
  if (hash && props.tabs.some(tab => tab.id === hash)) {
    activeTab.value = hash;
  } else {
    activeTab.value = props.tabs[0]?.id || '';
  }
};

// Update hash when tab changes
const setActiveTab = (tabId: string) => {
  activeTab.value = tabId;
  window.location.hash = tabId;
};

onMounted(() => {
  updateFromHash();
  window.addEventListener('hashchange', updateFromHash);
});

onBeforeUnmount(() => {
  window.removeEventListener('hashchange', updateFromHash);
});
</script>

<template>
  <div class="tabs-router">
    <div class="tabs-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-button', { active: activeTab === tab.id }]"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <slot :name="activeTab" />
    </div>
  </div>
</template>

<style scoped>
.tabs-router {
  width: 100%;
}

.tabs-nav {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  margin-bottom: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-button {
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-button:hover {
  color: var(--vp-c-text-1);
}

.tab-button.active {
  color: var(--vp-c-brand-1);
  border-bottom-color: var(--vp-c-brand-1);
}

.tabs-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
