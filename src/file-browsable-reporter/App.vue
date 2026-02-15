<template>
  <div class="standalone-app">
    <AllTestsViewStandalone />
  </div>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue'
import { getCurrentInstance } from 'vue'
import AllTestsViewStandalone from './AllTestsViewStandalone.vue'

import StatusBadge from '../reporter/.vitepress/theme/components/StatusBadge.vue'
import DateTimeFormatter from '../reporter/.vitepress/theme/components/DateTimeFormatter.vue'
import PercentFormatter from '../reporter/.vitepress/theme/components/PercentFormatter.vue'
import PassedIcon from '../reporter/.vitepress/theme/components/status-icons/PassedIcon.vue'
import FailedIcon from '../reporter/.vitepress/theme/components/status-icons/FailedIcon.vue'
import SkippedIcon from '../reporter/.vitepress/theme/components/status-icons/SkippedIcon.vue'
import PendingIcon from '../reporter/.vitepress/theme/components/status-icons/PendingIcon.vue'
import FlakyIcon from '../reporter/.vitepress/theme/components/status-icons/FlakyIcon.vue'
import SummaryView from '../reporter/.vitepress/theme/features/overview/SummaryView.vue'
import TestDetail from '../reporter/.vitepress/theme/layouts/TestDetail.vue'

const instance = getCurrentInstance()
if (instance) {
  const app = instance.appContext.app
  app.component('StatusBadge', StatusBadge)
  app.component('DateTimeFormatter', DateTimeFormatter)
  app.component('PercentFormatter', PercentFormatter)
  app.component('PassedIcon', PassedIcon)
  app.component('FailedIcon', FailedIcon)
  app.component('SkippedIcon', SkippedIcon)
  app.component('PendingIcon', PendingIcon)
  app.component('FlakyIcon', FlakyIcon)
  app.component('SummaryView', SummaryView)
  app.component('TestDetail', TestDetail)
}
</script>

<style>
.standalone-app {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

@media (min-width: 960px) {
  .standalone-app {
    padding: 2rem;
  }
}
</style>
