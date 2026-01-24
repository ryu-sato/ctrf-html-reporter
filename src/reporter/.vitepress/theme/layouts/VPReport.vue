<template>
  <div class="vp-report-root">
    <slot name="report-top" />

    <!-- Main Content Area -->
    <div class="vp-report-container flex w-full overflow-hidden relative" :style="{ height: 'calc(100vh - var(--vp-nav-height))' }">
      <!-- Content Area (Left) -->
      <div class="vp-report-left overflow-y-auto overflow-x-hidden transition-[width] duration-100 ease-in-out relative pt-12 px-12" :style="{ width: isDetailCollapsed ? '100%' : contentWidth + '%' }">
        <div class="mx-auto max-w-full">
          <slot name="report-before" />
          <main class="mx-auto w-full">
            <Content />
          </main>
          <slot name="report-after" />
        </div>
      </div>

      <!-- Resize Handle -->
      <div
        v-if="!isDetailCollapsed"
        class="w-2 bg-[var(--vp-c-divider)] cursor-col-resize relative flex-shrink-0 transition-colors duration-200 flex items-center justify-center hover:bg-[var(--vp-c-brand-1)] active:bg-[var(--vp-c-brand-2)]"
        @mousedown="startResize"
        @touchstart="startResize"
      >
        <div class="w-0.5 h-12 bg-[var(--vp-c-bg-alt)] rounded"></div>
      </div>

      <!-- Test Detail Area (Right) -->
      <div
        class="vp-report-right overflow-y-auto overflow-x-hidden py-8 px-6 bg-[var(--vp-c-bg-soft)] transition-all duration-300 ease-in-out min-w-0"
        :class="{ 'w-12 min-w-[48px] px-2 overflow-hidden': isDetailCollapsed }"
        :style="{ width: isDetailCollapsed ? 'auto' : detailWidth + '%' }"
      >
        <div class="max-w-full h-full">
          <div v-if="!selectedTest" class="flex flex-col items-center justify-center h-full text-[var(--vp-c-text-2)] gap-2">
            <DocumentTextIcon :class="isDetailCollapsed ? '[writing-mode:vertical-rl] text-2xl' : 'text-[32px] opacity-50'" style="width: 16px; height: 16px;" aria-label="Test detail panel - Select a test to view details" />
            <p v-if="!isDetailCollapsed" class="text-sm text-center whitespace-nowrap">Select a test to view details</p>
          </div>
          <div v-else class="w-full animate-[fadeIn_0.2s_ease-in] relative">
            <button
              class="sticky top-0 right-0 z-10 float-right w-8 h-8 border-0 bg-[var(--vp-c-bg)] text-[var(--vp-c-text-2)] rounded-md cursor-pointer flex items-center justify-center text-lg transition-all duration-200 mb-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)] hover:bg-[var(--vp-c-red-soft)] hover:text-[var(--vp-c-red-1)] hover:scale-105 active:scale-95"
              @click="closeDetail"
              title="Close detail panel"
            >
              <XMarkIcon style="width: 16px; height: 16px;" aria-label="Close detail panel" />
            </button>
            <TestDetail :test="selectedTest" />
          </div>
        </div>
      </div>
    </div>

    <slot name="report-bottom" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, onUnmounted, watch } from 'vue'
import { DocumentTextIcon, XMarkIcon } from '@heroicons/vue/16/solid'
import TestDetail from './TestDetail.vue'

// Selected test item
const selectedTest = ref(null)

// Detail panel collapse state
const isDetailCollapsed = ref(true)

// Layout width percentages (default: content 60%, detail 40%)
const contentWidth = ref(60)
const detailWidth = computed(() => 100 - contentWidth.value)

// Resize handling
const isResizing = ref(false)
const startX = ref(0)
const startContentWidth = ref(0)

const startResize = (event: MouseEvent | TouchEvent) => {
  isResizing.value = true
  startX.value = event.type.includes('mouse') ? (event as MouseEvent).clientX : (event as TouchEvent).touches[0].clientX
  startContentWidth.value = contentWidth.value

  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize)
  document.addEventListener('touchend', stopResize)

  // Prevent text selection
  document.body.style.userSelect = 'none'
  event.preventDefault()
}

const handleResize = (event: MouseEvent | TouchEvent) => {
  if (!isResizing.value) return

  const currentX = event.type.includes('mouse') ? (event as MouseEvent).clientX : (event as TouchEvent).touches[0].clientX
  const container = document.querySelector('.vp-report-container')
  if (!container) return

  const containerWidth = (container as HTMLElement).offsetWidth
  const deltaX = currentX - startX.value
  const deltaPercent = (deltaX / containerWidth) * 100

  let newContentWidth = startContentWidth.value + deltaPercent

  // Limit width to 30%~70%
  newContentWidth = Math.max(30, Math.min(70, newContentWidth))

  contentWidth.value = newContentWidth
}

const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
  document.body.style.userSelect = ''
}

// Close detail panel
const closeDetail = () => {
  selectedTest.value = null
  isDetailCollapsed.value = true
}

// Provide test selection globally
const selectTest = (test: any) => {
  selectedTest.value = test
}

// Watch for test selection and expand panel
watch(selectedTest, (newTest) => {
  if (newTest) {
    isDetailCollapsed.value = false
  } else {
    isDetailCollapsed.value = true
  }
})

provide('selectTest', selectTest)
provide('selectedTest', selectedTest)

// Cleanup
onUnmounted(() => {
  document.removeEventListener('mousemove', handleResize)
  document.removeEventListener('mouseup', stopResize)
  document.removeEventListener('touchmove', handleResize)
  document.removeEventListener('touchend', stopResize)
})
</script>

<style>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Left and Right panels - independent scrolling */
.vp-report-left,
.vp-report-right {
  height: 100%;
}

/* Scrollbar styles for content and detail areas */
.vp-report-left::-webkit-scrollbar,
.vp-report-right::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.vp-report-left::-webkit-scrollbar-track,
.vp-report-right::-webkit-scrollbar-track {
  background: var(--vp-c-bg);
}

.vp-report-left::-webkit-scrollbar-thumb,
.vp-report-right::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

.vp-report-left::-webkit-scrollbar-thumb:hover,
.vp-report-right::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

/* Responsive styles */
@media (max-width: 960px) {
  .vp-report-container {
    flex-direction: column;
    height: auto !important;
    max-height: none !important;
  }

  .vp-report-left,
  .vp-report-right {
    width: 100% !important;
    height: auto !important;
    max-height: 50vh;
  }

  .cursor-col-resize {
    display: none;
  }
}
</style>
