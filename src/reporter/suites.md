---
layout: report
---

<script setup lang="ts">
import { data as testTree } from './organizeTestsBySuite.data.js';
</script>

# Suites

<SummaryView 
  v-if="testTree.summary"
  :summary="testTree.summary"
  :showChart="true"
  :showTimeInfo="true"
  :showAvgDuration="false"
  :showTotalDuration="true"
/>

<TestTreeView :nodes="testTree.roots" />
