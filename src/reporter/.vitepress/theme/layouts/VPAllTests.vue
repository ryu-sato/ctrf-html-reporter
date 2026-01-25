<script setup lang="ts">
import VPNav from 'vitepress/dist/client/theme-default/components/VPNav.vue'
import VPSkipLink from 'vitepress/dist/client/theme-default/components/VPSkipLink.vue'
import VPFooter from 'vitepress/dist/client/theme-default/components/VPFooter.vue'
import AllTestsView from '../features/all-tests/AllTestsView.vue'
</script>

<template>
  <div class="VPAllTests">
    <VPSkipLink />
    <VPNav />

    <main class="main-content">
      <AllTestsView />
    </main>

    <VPFooter />
  </div>
</template>

<style scoped>
.VPAllTests {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: var(--vp-nav-height);
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .main-content {
    padding-left: 2rem;
    padding-right: 2rem;
  }
}
</style>
