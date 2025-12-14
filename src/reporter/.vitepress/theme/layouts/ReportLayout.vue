<template>
  <div class="Layout">
    <slot name="layout-top" />
    
    <!-- Navigation Bar -->
    <VPNav v-if="showNavbar" />
    
    <!-- Background -->
    <VPLocalNav v-if="showNavbar" :open="sidebarOpen" @open-menu="toggleSidebar" />
    
    <VPSidebar :open="sidebarOpen" @close="closeSidebar">
      <template #sidebar-nav-before>
        <slot name="sidebar-nav-before" />
      </template>
      <template #sidebar-nav-after>
        <slot name="sidebar-nav-after" />
      </template>
    </VPSidebar>
    
    <VPBackdrop class="backdrop" :show="sidebarOpen" @click="closeSidebar" />
    
    <div class="report-container" :class="{ 'no-navbar': !showNavbar }">
      <div class="container">
        <!-- Main Content Area -->
        <div class="report-main-area">
          <!-- Content Area -->
          <div class="report-content" :style="{ width: contentWidth + '%' }">
            <div class="content">
              <div class="content-container">
                <slot name="doc-before" />
                <main class="main">
                  <Content class="vp-doc" />
                </main>
                <slot name="doc-after" />
              </div>
            </div>
          </div>
          
          <!-- Resize Handle -->
          <div 
            class="report-resizer"
            @mousedown="startResize"
            @touchstart="startResize"
          >
            <div class="resizer-handle"></div>
          </div>
          
          <!-- Test Detail Area -->
          <div class="report-detail" :style="{ width: detailWidth + '%' }">
            <div class="detail-container">
              <div v-if="!selectedTest" class="detail-empty">
                <p>Select a test to view details</p>
              </div>
              <div v-else class="detail-content">
                <TestDetail :test="selectedTest" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <slot name="layout-bottom" />
  </div>
</template>

<script setup>
import { ref, computed, provide, onUnmounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPLocalNav from 'vitepress/dist/client/theme-default/components/VPLocalNav.vue'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import { registerWatchers } from 'vitepress/dist/client/theme-default/composables/layout.js'
import TestDetail from '../components/TestDetail.vue'

const { frontmatter } = useData()
const route = useRoute()

// Navbar visibility control
const showNavbar = computed(() => frontmatter.value.navbar !== false)

// Sidebar visibility control (always visible on desktop, toggleable on mobile)
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

// Register VitePress layout watchers
registerWatchers({ closeSidebar })

// Close sidebar on route change
watch(() => route.path, closeSidebar)

// Selected test item
const selectedTest = ref(null)

// Layout width percentages (default: content 60%, detail 40%)
const contentWidth = ref(60)
const detailWidth = computed(() => 100 - contentWidth.value)

// Resize handling
const isResizing = ref(false)
const startX = ref(0)
const startContentWidth = ref(0)

const startResize = (event) => {
  isResizing.value = true
  startX.value = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX
  startContentWidth.value = contentWidth.value
  
  document.addEventListener('mousemove', handleResize)
  document.addEventListener('mouseup', stopResize)
  document.addEventListener('touchmove', handleResize)
  document.addEventListener('touchend', stopResize)
  
  // Prevent text selection
  document.body.style.userSelect = 'none'
  event.preventDefault()
}

const handleResize = (event) => {
  if (!isResizing.value) return
  
  const currentX = event.type.includes('mouse') ? event.clientX : event.touches[0].clientX
  const container = document.querySelector('.report-main-area')
  if (!container) return
  
  const containerWidth = container.offsetWidth
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

// Provide test selection globally
const selectTest = (test) => {
  selectedTest.value = test
}

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
  min-height: 100vh;
}

.report-container {
  margin: 0 auto;
  width: 100%;
  padding-top: var(--vp-nav-height);
}

.report-container.no-navbar {
  padding-top: 0;
}

.container {
  margin: 0 auto;
  width: 100%;
  max-width: 100%;
}

.report-main-area {
  display: flex;
  width: 100%;
  height: calc(100vh - var(--vp-nav-height));
  overflow: hidden;
  position: relative;
}

.report-container.no-navbar .report-main-area {
  height: 100vh;
}

@media (min-width: 960px) {
  .report-main-area {
    padding-left: var(--vp-sidebar-width);
  }
  
  /* Always show sidebar */
  :deep(.VPSidebar) {
    transform: translateX(0) !important;
    opacity: 1 !important;
  }
}

@media (min-width: 1440px) {
  .report-main-area {
    padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width));
  }
}

.report-content {
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.1s ease;
  position: relative;
}

.content {
  padding: 0 32px 96px;
  width: 100%;
}

@media (min-width: 768px) {
  .content {
    padding: 0 48px 96px;
  }
}

@media (min-width: 960px) {
  .content {
    padding: 0 64px 96px;
  }
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
  transition: width 0.1s ease;
}

.detail-container {
  max-width: 100%;
}

.detail-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--vp-c-text-2);
}

.detail-empty p {
  font-size: 14px;
}

.detail-content {
  width: 100%;
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

/* Sidebar style adjustments */
:deep(.VPSidebar) {
  z-index: var(--vp-z-index-sidebar);
}

@media (min-width: 960px) {
  :deep(.VPSidebar) {
    opacity: 1;
    visibility: visible;
  }
}
</style>
