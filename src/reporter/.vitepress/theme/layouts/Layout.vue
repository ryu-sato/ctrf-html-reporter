<template>
  <ReportLayout v-if="frontmatter.layout === 'report'" />
  <DefaultTheme.Layout v-else />
</template>

<script setup>
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ReportLayout from './ReportLayout.vue'

const { frontmatter } = useData()
</script>
