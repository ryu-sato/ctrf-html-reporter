<script setup>
import { computed } from 'vue';
import { formatPercent } from '../../helpers/formatter.js';

const props = defineProps({
  value: {
    type: [Number],
    required: true
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
  return String(formatPercent(props.value, props.digitsToFixed)) + (props.unit ? '%' : '');
});
</script>

<template>
  <span>{{ formattedPercent }}</span>
</template>
