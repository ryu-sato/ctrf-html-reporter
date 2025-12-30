<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type?: 'info' | 'tip' | 'warning' | 'danger' | 'success'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'tip'
})

const badgeClasses = computed(() => {
  const baseClasses = 'inline-block px-2 py-1 rounded-xl text-xs leading-none border'

  const typeClasses = {
    info: 'border-[var(--vp-c-divider)] text-[var(--vp-c-text-2)] bg-[var(--vp-c-default-soft)]',
    tip: 'border-[var(--vp-c-brand-1)] text-[var(--vp-c-brand-1)] bg-[var(--vp-c-brand-soft)]',
    warning: 'border-[var(--vp-c-warning-1)] text-[var(--vp-c-warning-1)] bg-[var(--vp-c-warning-soft)]',
    danger: 'border-[var(--vp-c-danger-1)] text-[var(--vp-c-danger-1)] bg-[var(--vp-c-danger-soft)]',
    success: 'border-transparent text-[var(--vp-c-text-1)] bg-[var(--vp-c-green-soft)]'
  }

  return `${baseClasses} ${typeClasses[props.type]}`
})
</script>
