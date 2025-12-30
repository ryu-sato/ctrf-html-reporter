<!-- ref https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/Layout.vue -->
<script setup lang="ts">
import DefaultLayout from 'vitepress/dist/client/theme-default/Layout.vue'
import { computed, provide, useSlots } from 'vue'
import VPBackdrop from 'vitepress/dist/client/theme-default/components/VPBackdrop.vue'
import VPContent from './VPContent.vue'
import VPFooter from 'vitepress/dist/client/theme-default/components/VPFooter.vue'
import VPLocalNav from 'vitepress/dist/client/theme-default/components/VPLocalNav.vue'
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPSidebar from 'vitepress/dist/client/theme-default/components/VPSidebar.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'
import { useData } from 'vitepress'
import { layoutInfoInjectionKey, registerWatchers } from 'vitepress/dist/client/theme-default/composables/layout.js'
import { useSidebarControl } from 'vitepress/dist/client/theme-default/composables/sidebar.js'
import { data as report } from '../../../richReportWithInsights.data.js'

const {
  isOpen: isSidebarOpen,
  open: openSidebar,
  close: closeSidebar
} = useSidebarControl()

registerWatchers({ closeSidebar })

const { frontmatter } = useData()

const slots = useSlots()
const heroImageSlotExists = computed(() => !!slots['home-hero-image'])

provide(layoutInfoInjectionKey, { heroImageSlotExists })
provide('report', report)
</script>

<template>
  <div
    v-if="frontmatter.layout === 'report'"
    class="Layout"
    :class="frontmatter.pageClass"
  >
    <!--
      available slots:
      - layout-top
      - layout-bottom
    -->
    <VPSkipLink />
    <VPBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" />
    <VPNav>
      <!--
        available slots:
        - nav-bar-title-before
        - nav-bar-title-after
        - nav-bar-content-before
        - nav-bar-content-after
        - nav-screen-content-before
        - nav-screen-content-after
       -->
    </VPNav>
    <VPLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

    <VPSidebar :open="isSidebarOpen">
      <!--
        available slots:
        - sidebar-nav-before
        - sidebar-nav-after
       -->
      <template #sidebar-nav-after>
        <div class="w-full mt-4 mb-4 border-t border-vp-c-tip-soft" />

        <h2 class="text-xl" style="color: var(--vp-c-text-3);">Report Information</h2>
        <ReportInfo />

        <div class="w-full mt-4 mb-4 border-t border-vp-c-tip-soft" />

        <h2 class="text-xl" style="color: var(--vp-c-text-3);">Environment Details</h2>
        <EnvironmentInfo />
      </template>
    </VPSidebar>

    <VPContent>
      <!--
        available slots:
        - page-top
        - page-bottom
        - not-found
        - home-hero-before
        - home-hero-info-before
        - home-hero-info
        - home-hero-info-after
        - home-hero-actions-after
        - home-hero-image
        - home-hero-after
        - home-features-before
        - home-features-after
        - report-footer-before
        - report-before
        - report-after
        - report-top
        - report-bottom
       -->
    </VPContent>

    <VPFooter />
  </div>
  <DefaultLayout v-else />
</template>

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>