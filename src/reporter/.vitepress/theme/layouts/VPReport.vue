<template>
  <div class="Layout">
    <slot name="report-top" />

    <div class="report-container">
      <div class="container">
        <!-- Main Content Area -->
        <div class="report-main-area">
          <!-- Content Area -->
          <div class="report-content" :style="{ width: isDetailCollapsed ? '100%' : contentWidth + '%' }">
            <div class="content-container">
              <slot name="report-before" />
              <main class="main">
                <Content />
              </main>
              <slot name="report-after" />
            </div>
          </div>

          <!-- Resize Handle -->
          <div
            v-if="!isDetailCollapsed"
            class="report-resizer"
            @mousedown="startResize"
            @touchstart="startResize"
          >
            <div class="resizer-handle"></div>
          </div>

          <!-- Test Detail Area -->
          <div
            class="report-detail"
            :class="{ 'is-collapsed': isDetailCollapsed }"
            :style="{ width: isDetailCollapsed ? 'auto' : detailWidth + '%' }"
          >
            <div class="detail-container">
              <div v-if="!selectedTest" class="detail-empty">
                <DocumentTextIcon style="width: 16px; height: 16px;" aria-label="Test detail panel - Select a test to view details" />
                <p>Select a test to view details</p>
              </div>
              <div v-else class="detail-content">
                <button
                  class="close-button"
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
  const container = document.querySelector('.report-main-area')
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

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
}

.report-container {
  margin: 0 auto;
  width: 100%;
}

.container {
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
}

.report-main-area {
  display: flex;
  width: 100%;
  height: calc(100vh - var(--vp-nav-height) - 0);
  overflow: hidden;
  position: relative;
}


.report-content {
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.1s ease;
  position: relative;
  padding: 48px 48px 0;
  height: 100%;
}

.content-container {
  margin: 0 auto;
  max-width: 100%;
}

.main {
  margin: 0 auto;
  width: 100%;
}

.vp-doc {
  max-width: 100%;
}

.report-resizer {
  width: 8px;
  background: var(--vp-c-divider);
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-resizer:hover {
  background: var(--vp-c-brand-1);
}

.report-resizer:active {
  background: var(--vp-c-brand-2);
}

.resizer-handle {
  width: 2px;
  height: 48px;
  background: var(--vp-c-bg-alt);
  border-radius: 2px;
}

.report-detail {
  overflow-y: auto;
  overflow-x: hidden;
  padding: 32px 24px;
  background: var(--vp-c-bg-soft);
  transition: all 0.3s ease;
  min-width: 0;
}

.report-detail.is-collapsed {
  width: 48px !important;
  min-width: 48px;
  padding: 32px 8px;
  overflow: hidden;
}

.detail-container {
  max-width: 100%;
}

.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--vp-c-text-2);
  gap: 8px;
}

.empty-icon {
  font-size: 32px;
  opacity: 0.5;
}

.detail-empty p {
  font-size: 14px;
  text-align: center;
  white-space: nowrap;
}

.is-collapsed .detail-empty {
  padding: 0;
}

.is-collapsed .detail-empty p {
  display: none;
}

.is-collapsed .empty-icon {
  writing-mode: vertical-rl;
  font-size: 24px;
}

.detail-content {
  width: 100%;
  animation: fadeIn 0.2s ease-in;
  position: relative;
}

.close-button {
  position: sticky;
  top: 0;
  right: 0;
  z-index: 10;
  float: right;
  width: 32px;
  height: 32px;
  border: none;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
  margin-bottom: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.close-button:hover {
  background: var(--vp-c-red-soft);
  color: var(--vp-c-red-1);
  transform: scale(1.05);
}

.close-button:active {
  transform: scale(0.95);
}

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

/* Scrollbar styles */
.report-content::-webkit-scrollbar,
.report-detail::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.report-content::-webkit-scrollbar-track,
.report-detail::-webkit-scrollbar-track {
  background: var(--vp-c-bg);
}

.report-content::-webkit-scrollbar-thumb,
.report-detail::-webkit-scrollbar-thumb {
  background: var(--vp-c-divider);
  border-radius: 4px;
}

.report-content::-webkit-scrollbar-thumb:hover,
.report-detail::-webkit-scrollbar-thumb:hover {
  background: var(--vp-c-text-3);
}

/* Responsive styles */
@media (max-width: 960px) {
  .report-main-area {
    flex-direction: column;
  }
  
  .report-content,
  .report-detail {
    width: 100% !important;
  }
  
  .report-resizer {
    display: none;
  }
}

</style>
