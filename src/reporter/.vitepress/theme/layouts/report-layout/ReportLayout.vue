<script setup>
  import { useData } from 'vitepress'
  const { page, frontmatter } = useData()
  import NotFound from './NotFound.vue'
  import Home from './Home.vue'
  import Page from './Page.vue'
</script>

<template>
  <NotFound v-if="page.isNotFound" />
  <Home v-if="frontmatter.layout === 'home'" />
  <Page v-else />
</template>
