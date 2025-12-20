<script setup lang="ts">
import { computed } from 'vue';
import { formatPercent } from '../../helpers/formatter.js';

const props = defineProps({
  value: {
    type: [Number],
    required: false,
    default: undefined
  },
  digitsToFixed: {
    type: Number,
    default: 1
  },
  unit: {
    type: Boolean,
    default: true,
  }
});

const formattedPercent = computed(() => {
  if (props.value === undefined || props.value === null) {
    return '-';
  }
  return String(formatPercent(props.value, props.digitsToFixed)) + (props.unit ? '%' : '');
});
</script>

<template>
  <span>{{ formattedPercent }}</span>
</template>
