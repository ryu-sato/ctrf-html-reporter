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
</script>

<template>
  <DefaultLayout v-if="frontmatter.layout !== 'report'" />
  <div
    v-if="frontmatter.layout === 'report'"
    class="Layout"
    :class="frontmatter.pageClass"
  >
    <slot name="layout-top" />
    <VPSkipLink />
    <VPBackdrop class="backdrop" :show="isSidebarOpen" @click="closeSidebar" />
    <VPNav>
      <template #nav-bar-title-before><slot name="nav-bar-title-before" /></template>
      <template #nav-bar-title-after><slot name="nav-bar-title-after" /></template>
      <template #nav-bar-content-before><slot name="nav-bar-content-before" /></template>
      <template #nav-bar-content-after><slot name="nav-bar-content-after" /></template>
      <template #nav-screen-content-before><slot name="nav-screen-content-before" /></template>
      <template #nav-screen-content-after><slot name="nav-screen-content-after" /></template>
    </VPNav>
    <VPLocalNav :open="isSidebarOpen" @open-menu="openSidebar" />

    <VPSidebar :open="isSidebarOpen">
      <template #sidebar-nav-before><slot name="sidebar-nav-before" /></template>
      <template #sidebar-nav-after><slot name="sidebar-nav-after" /></template>
    </VPSidebar>

    <VPContent>
      <template #page-top><slot name="page-top" /></template>
      <template #page-bottom><slot name="page-bottom" /></template>

      <template #not-found><slot name="not-found" /></template>
      <template #home-hero-before><slot name="home-hero-before" /></template>
      <template #home-hero-info-before><slot name="home-hero-info-before" /></template>
      <template #home-hero-info><slot name="home-hero-info" /></template>
      <template #home-hero-info-after><slot name="home-hero-info-after" /></template>
      <template #home-hero-actions-after><slot name="home-hero-actions-after" /></template>
      <template #home-hero-image><slot name="home-hero-image" /></template>
      <template #home-hero-after><slot name="home-hero-after" /></template>
      <template #home-features-before><slot name="home-features-before" /></template>
      <template #home-features-after><slot name="home-features-after" /></template>

      <template #report-footer-before><slot name="report-footer-before" /></template>
      <template #report-before><slot name="report-before" /></template>
      <template #report-after><slot name="report-after" /></template>
      <template #report-top><slot name="report-top" /></template>
      <template #report-bottom><slot name="report-bottom" /></template>
    </VPContent>

    <VPFooter />
    <slot name="layout-bottom" />
  </div>
  <Content v-else />
</template>

<style scoped>
.Layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>