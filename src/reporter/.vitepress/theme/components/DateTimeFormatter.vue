<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  timestamp: {
    type: [String, Number, Date],
    required: true
  },
  locale: {
    type: String,
    default: 'en-US'
  },
  options: {
    type: Object,
    default: () => ({})
  }
});

const formattedDate = computed(() => {
  try {
    return new Date(props.timestamp).toLocaleString(props.locale, props.options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return String(props.timestamp);
  }
});
</script>

<template>
  <span>{{ formattedDate }}</span>
</template>
