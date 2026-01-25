<template>
  <details class="test-card rounded-lg border bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)] overflow-hidden">
    <summary class="card-header flex items-center gap-3 p-4 cursor-pointer select-none hover:bg-[var(--vp-c-bg-alt)] transition-colors">
      <span class="expand-icon text-[var(--vp-c-text-2)]">
        <svg class="w-4 h-4 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </span>
      <StatusBadge :type="test.status">{{ test.status }}</StatusBadge>
      <span class="flex-1 font-medium text-[var(--vp-c-text-1)] truncate">{{ test.name }}</span>
      <span v-if="test.suite && test.suite.length > 0" class="text-xs text-[var(--vp-c-text-2)] truncate max-w-[200px] hidden sm:inline">
        {{ test.suite.join(' > ') }}
      </span>
      <span class="text-sm text-[var(--vp-c-text-2)] whitespace-nowrap">
        {{ formatDuration(test.duration) }}
      </span>
    </summary>
    <div class="card-body p-4 pt-0 border-t border-[var(--vp-c-divider)]">
      <TestDetail :test="test" />
    </div>
  </details>
</template>

<script setup lang="ts">
import type { Test } from 'ctrf'
import { formatDuration } from '../../../helpers/formatter'

defineProps<{
  test: Test
}>()
</script>

<style scoped>
.test-card[open] .expand-icon svg {
  transform: rotate(90deg);
}

.test-card summary::-webkit-details-marker {
  display: none;
}

.test-card summary::marker {
  display: none;
}

.test-card summary {
  list-style: none;
}

.card-body {
  margin-top: 1rem;
}
</style>
