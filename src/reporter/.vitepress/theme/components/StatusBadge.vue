<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'tip' | 'pending' | 'skipped' | 'failed' | 'passed'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'tip'
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-block px-2 py-1 rounded-xl text-xs leading-none border'

  const typeClasses = {
    pending: 'border-[var(--vp-c-divider)] text-[var(--vp-c-text-2)] bg-[var(--vp-c-default-soft)]',
    tip: 'border-[var(--vp-c-brand-1)] text-[var(--vp-c-brand-1)] bg-[var(--vp-c-brand-soft)]',
    skipped: 'border-[var(--vp-c-warning-1)] text-[var(--vp-c-warning-1)] bg-[var(--vp-c-warning-soft)]',
    failed: 'border-[var(--vp-c-danger-1)] text-[var(--vp-c-danger-1)] bg-[var(--vp-c-danger-soft)]',
    passed: 'border-transparent text-[var(--vp-c-text-1)] bg-[var(--vp-c-green-soft)]'
  }

  return `${baseClasses} ${typeClasses[props.type]}`
})
</script>
