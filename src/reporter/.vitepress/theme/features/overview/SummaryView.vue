<template>
  <div>
    <!-- Test Stats Cards Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      <!-- Total Tests Card -->
      <div class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-default-soft));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-default-soft);">
              <svg class="w-5 h-5" style="color: var(--vp-c-text-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Total</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--vp-c-text-1);">{{ summary.tests }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--vp-c-divider);"></div>
      </div>

      <!-- Passed Tests Card -->
      <div v-if="summary.passed !== undefined" class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-green-dimm));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-green-dimm);">
              <svg class="w-5 h-5" style="color: var(--report-status-passed);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="px-2 py-1 rounded-md text-xs font-bold" style="background: var(--vp-c-green-dimm); color: var(--report-status-passed);">
              {{ summary.tests > 0 ? Math.round((summary.passed / summary.tests) * 100) : 0 }}%
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Passed</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--report-status-passed);">{{ summary.passed }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--report-status-passed);"></div>
      </div>

      <!-- Failed Tests Card -->
      <div v-if="summary.failed !== undefined" class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-red-dimm));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-red-dimm);">
              <svg class="w-5 h-5" style="color: var(--report-status-failed);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div v-if="summary.failed > 0" class="px-2 py-1 rounded-md text-xs font-bold" style="background: var(--vp-c-red-dimm); color: var(--report-status-failed);">
              {{ summary.tests > 0 ? Math.round((summary.failed / summary.tests) * 100) : 0 }}%
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Failed</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--report-status-failed);">{{ summary.failed }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--report-status-failed);"></div>
      </div>

      <!-- Skipped Tests Card -->
      <div v-if="summary.skipped !== undefined" class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-yellow-dimm));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-yellow-dimm);">
              <svg class="w-5 h-5" style="color: var(--report-status-skipped);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div v-if="summary.skipped > 0" class="px-2 py-1 rounded-md text-xs font-bold" style="background: var(--vp-c-yellow-dimm); color: var(--report-status-skipped);">
              {{ summary.tests > 0 ? Math.round((summary.skipped / summary.tests) * 100) : 0 }}%
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Skipped</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--report-status-skipped);">{{ summary.skipped }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--report-status-skipped);"></div>
      </div>

      <!-- Pending Tests Card -->
      <div v-if="summary.pending !== undefined" class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-purple-dimm));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-purple-dimm);">
              <svg class="w-5 h-5" style="color: var(--vp-c-purple-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Pending</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--vp-c-purple-1);">{{ summary.pending }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--vp-c-purple-1);"></div>
      </div>

      <!-- Flaky Tests Card -->
      <div v-if="summary.flaky !== undefined && summary.flaky > 0" class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-orange-dimm));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-orange-dimm);">
              <svg class="w-5 h-5" style="color: var(--vp-c-orange-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Flaky</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--vp-c-orange-1);">{{ summary.flaky }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--vp-c-orange-1);"></div>
      </div>

      <!-- Other Tests Card -->
      <div v-if="summary.other !== undefined && summary.other > 0" class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-default-soft));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-default-soft);">
              <svg class="w-5 h-5" style="color: var(--vp-c-text-2);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Other</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--vp-c-text-2);">{{ summary.other }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--vp-c-text-2);"></div>
      </div>

      <!-- Suites Card -->
      <div v-if="summary.suites !== undefined" class="relative overflow-hidden rounded-xl border transition-all duration-200 hover:shadow-lg group" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" style="background: linear-gradient(135deg, transparent, var(--vp-c-indigo-dimm));"></div>
        <div class="relative p-4">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center justify-center w-9 h-9 rounded-lg" style="background: var(--vp-c-indigo-dimm);">
              <svg class="w-5 h-5" style="color: var(--vp-c-indigo-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
            </div>
          </div>
          <div class="">
            <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Suites</p>
            <p class="text-3xl font-bold tabular-nums" style="color: var(--vp-c-indigo-1);">{{ summary.suites }}</p>
          </div>
        </div>
        <div class="h-1 w-full" style="background: var(--vp-c-indigo-1);"></div>
      </div>
    </div>

    <!-- Chart and Timeline Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chart -->
      <div v-if="showChart" class="lg:col-span-1">
        <div class="rounded-xl border overflow-hidden" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
          <div class="px-5 py-4 border-b" style="border-color: var(--vp-c-divider);">
            <h4 class="text-sm font-bold tracking-tight" style="color: var(--vp-c-text-1);">{{ chartTitle }}</h4>
          </div>
          <div class="p-6">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
      </div>

      <!-- Time Info -->
      <div v-if="showTimeInfo && summary.start && summary.stop" :class="showChart ? 'lg:col-span-2' : 'lg:col-span-3'">
        <div class="rounded-xl border overflow-hidden h-full" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
          <div class="px-5 py-4 border-b" style="border-color: var(--vp-c-divider);">
            <h4 class="text-sm font-bold tracking-tight" style="color: var(--vp-c-text-1);">Execution Timeline</h4>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Start Time -->
              <div class="relative">
                <div class="flex items-start gap-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl" style="background: linear-gradient(135deg, var(--vp-c-green-dimm), var(--vp-c-green-soft));">
                    <svg class="w-6 h-6" style="color: var(--vp-c-green-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="flex-1 ">
                    <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Start Time</p>
                    <DateTimeFormatter :timestamp="summary.start * 1000" class="text-base font-semibold block" style="color: var(--vp-c-text-1);" />
                  </div>
                </div>
              </div>

              <!-- Stop Time -->
              <div class="relative">
                <div class="flex items-start gap-4">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl" style="background: linear-gradient(135deg, var(--vp-c-red-dimm), var(--vp-c-red-soft));">
                    <svg class="w-6 h-6" style="color: var(--vp-c-red-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path>
                    </svg>
                  </div>
                  <div class="flex-1 ">
                    <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Stop Time</p>
                    <DateTimeFormatter :timestamp="summary.stop * 1000" class="text-base font-semibold block" style="color: var(--vp-c-text-1);" />
                  </div>
                </div>
              </div>

              <!-- Duration Display (if not shown in cards above) -->
              <div v-if="!showTotalDuration && summary.duration" class="sm:col-span-2">
                <div class="flex items-start gap-4 p-4 rounded-lg" style="background: var(--vp-c-default-soft);">
                  <div class="flex items-center justify-center w-12 h-12 rounded-xl" style="background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-brand-softer));">
                    <svg class="w-6 h-6" style="color: var(--vp-c-brand-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="flex-1 ">
                    <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">Total Duration</p>
                    <p class="text-2xl font-bold tabular-nums" style="color: var(--vp-c-brand-1);">{{ formatDuration(summary.duration) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import DateTimeFormatter from '../../components/DateTimeFormatter.vue';
import { formatDuration } from '../../../helpers/formatter';
import type { Summary } from 'ctrf';

const props = defineProps({
  summary: {
    type: Object as () => Summary,
    required: true,
    validator: (value: any) => {
      return value.tests !== undefined;
    }
  },
  showChart: {
    type: Boolean,
    default: true
  },
  showTimeInfo: {
    type: Boolean,
    default: true
  },
  showTotalDuration: {
    type: Boolean,
    default: true
  },
  chartContainerStyle: {
    type: Object,
    default: () => ({ maxWidth: '300px', margin: '2rem auto' })
  },
  chartTitle: {
    type: String,
    default: 'Test Results Distribution'
  }
});

// Get CSS variable color
const getCssColor = (varName: string) => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return '';
};

Chart.register(...registerables);
const chartCanvas = ref<HTMLCanvasElement | null>(null);

// Custom Plugin: Display Pass Rate at the Center of the Doughnut Chart
const centerTextPlugin = {
  id: 'centerText',
  beforeDraw: (chart: any) => {
    if (chart.config.type === 'doughnut') {
      const s = props.summary;

      const ctx = chart.ctx;
      const width = chart.width;
      const height = chart.height;
      
      // Calculate the pass rate
      const total = s.tests;
      const passedPercentage = total > 0 ? ((s.passed / total) * 100).toFixed(1) : 0;
      
      ctx.restore();
      ctx.font = 'bold 2rem sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillStyle = getCssColor('--vp-c-green-1') || '#10b981';
      
      const text = `${passedPercentage}%`;
      const textX = width / 2;
      const textY = height / 2 - 10;
      
      ctx.fillText(text, textX, textY);
      
      // Add "Passed" label
      ctx.font = '0.9rem sans-serif';
      ctx.fillStyle = getCssColor('--vp-c-text-2') || '#6b7280';
      ctx.fillText('Passed', textX, textY + 30);
      
      ctx.save();
    }
  }
};

onMounted(() => {
  if (props.showChart && chartCanvas.value) {
    const s = props.summary;
    const ctx = chartCanvas.value.getContext('2d');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Passed', 'Failed', 'Skipped', 'Pending', 'Other', 'Flaky'],
        datasets: [{
          data: [
            s.passed || 0,
            s.failed || 0,
            s.skipped || 0,
            s.pending || 0,
            s.other || 0,
            s.flaky || 0
          ],
          backgroundColor: [
            getCssColor('--vp-c-green-1') || '#10b981',
            getCssColor('--vp-c-red-1') || '#ef4444',
            getCssColor('--vp-c-yellow-1') || '#f59e0b',
            getCssColor('--vp-c-purple-1') || '#8b5cf6',
            getCssColor('--vp-c-text-2') || '#6b7280',
            getCssColor('--vp-c-orange-1') || '#f97316'
          ],
          borderWidth: 1,
          borderColor: getCssColor('--vp-c-bg') || '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          title: {
            display: true,
            text: props.chartTitle
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      },
      plugins: [centerTextPlugin]
    });
  }
});
</script>

