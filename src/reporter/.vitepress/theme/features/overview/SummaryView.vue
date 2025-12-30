<template>
  <div>
    <!-- Time Info -->
    <div v-if="showTimeInfo && summary.start && summary.stop">
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Duration Display (if not shown in cards above) -->
          <div v-if="true || !showTotalDuration && summary.duration" class="relative col-span-1 sm:col-span-2 lg:col-span-1">
            <div class="flex gap-4">
              <div class="flex-1">
                <p class="text-xs font-semibold uppercase tracking-wider text-[var(--vp-c-text-3)]">Total Duration</p>
                <p class="text-2xl font-bold tabular-nums text-[var(--vp-c-brand-1)]">{{ formatDuration(summary.duration) }}</p>
              </div>
            </div>
          </div>

          <!-- Start Time -->
          <div class="relative">
            <div class="flex gap-4">
              <div class="flex-1">
                <p class="text-xs font-semibold uppercase tracking-wider text-[var(--vp-c-text-3)]">Start Time</p>
                <DateTimeFormatter :timestamp="summary.start * 1000" class="text-base font-semibold block text-[var(--vp-c-text-1)]" />
              </div>
            </div>
          </div>

          <!-- Stop Time -->
          <div class="relative">
            <div class="flex gap-4">
              <div class="flex-1">
                <p class="text-xs font-semibold uppercase tracking-wider text-[var(--vp-c-text-3)]">Stop Time</p>
                <DateTimeFormatter :timestamp="summary.stop * 1000" class="text-base font-semibold block text-[var(--vp-c-text-1)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="relative overflow-hidden rounded-xl border transition-all border-b-4 border-[var(--vp-c-tip-soft)] p-3 mb-6">
      <div class="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- First Table: 4 columns on sm+, single row on mobile -->
        <div class="table w-full" role="table" aria-label="Test status summary">
          <div class="hidden sm:table-footer-group" role="rowgroup">
            <div class="table-row border-[var(--vp-c-divider)]" role="row">
              <div class="table-cell uppercase border-t border-[var(--vp-c-divider)] text-right px-2" role="columnheader">Passed</div>
              <div class="table-cell uppercase border-t border-[var(--vp-c-divider)] text-right px-2" role="columnheader">Failed</div>
              <div class="table-cell uppercase border-t border-[var(--vp-c-divider)] text-right px-2" role="columnheader">Pending</div>
              <div class="table-cell uppercase border-t border-[var(--vp-c-divider)] text-right px-2" role="columnheader">Skipped</div>
            </div>
          </div>
          <div class="table-row-group" role="rowgroup">
            <div class="table-row" role="row">
              <div class="table-cell text-right px-2 py-1" role="cell">
                <div class="flex items-center justify-end gap-1">
                  <span class="sm:hidden flex items-center" aria-hidden="true" title="Passed"><PassedIcon class="text-[var(--report-status-passed)]" /></span>
                  <span class="sm:text-3xl sm:font-bold sm:font-mono" aria-label="Passed tests">{{ summary.passed !== undefined ? summary.passed : 'N/A' }}</span>
                </div>
              </div>
              <div class="table-cell text-right px-2 py-1" role="cell">
                <div class="flex items-center justify-end gap-1">
                  <span class="sm:hidden flex items-center" aria-hidden="true" title="Failed"><FailedIcon class="text-[var(--report-status-failed)]" /></span>
                  <span class="sm:text-3xl sm:font-bold sm:font-mono" aria-label="Failed tests">{{ summary.failed !== undefined ? summary.failed : 'N/A' }}</span>
                </div>
              </div>
              <div class="table-cell text-right px-2 py-1" role="cell">
                <div class="flex items-center justify-end gap-1">
                  <span class="sm:hidden flex items-center" aria-hidden="true" title="Pending"><PendingIcon class="text-[var(--report-status-pending)]" /></span>
                  <span class="sm:text-3xl sm:font-bold sm:font-mono" aria-label="Pending tests">{{ summary.pending !== undefined ? summary.pending : 'N/A' }}</span>
                </div>
              </div>
              <div class="table-cell text-right px-2 py-1" role="cell">
                <div class="flex items-center justify-end gap-1">
                  <span class="sm:hidden flex items-center" aria-hidden="true" title="Skipped"><SkippedIcon class="text-[var(--report-status-skipped)]" /></span>
                  <span class="sm:text-3xl sm:font-bold sm:font-mono" aria-label="Skipped tests">{{ summary.skipped !== undefined ? summary.skipped : 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Second Table: 3 columns on sm+, single row on mobile -->
        <div class="table w-full" role="table" aria-label="Test metrics summary">
          <div class="hidden sm:table-footer-group" role="rowgroup">
            <div class="table-row border-b border-[var(--vp-c-divider)]" role="row">
              <div class="table-cell uppercase border-t border-[var(--vp-c-divider)] text-right px-2" role="columnheader">Total</div>
              <div class="table-cell uppercase border-t border-[var(--vp-c-divider)] text-right px-2" role="columnheader">Flaky</div>
              <div class="table-cell uppercase border-t border-[var(--vp-c-divider)] text-right px-2" role="columnheader">Suites</div>
            </div>
          </div>
          <div class="table-row-group" role="rowgroup">
            <div class="table-row" role="row">
              <div class="table-cell text-right px-2 py-1" role="cell">
                <div class="flex items-center justify-end gap-1">
                  <span class="sm:hidden flex items-center" aria-hidden="true" title="Total"><CalculatorIcon class="w-5 h-5]" /></span>
                  <span class="sm:text-3xl sm:font-bold sm:font-mono" aria-label="Total tests">{{ summary.tests }}</span>
                </div>
              </div>
              <div class="table-cell text-right px-2 py-1" role="cell">
                <div class="flex items-center justify-end gap-1">
                  <span class="sm:hidden flex items-center" aria-hidden="true" title="Flaky"><FlakyIcon class="text-[var(--report-status-flaky)]" /></span>
                  <span class="sm:text-3xl sm:font-bold sm:font-mono" aria-label="Flaky tests">{{ summary.flaky !== undefined ? summary.flaky : 'N/A' }}</span>
                </div>
              </div>
              <div class="table-cell text-right px-2 py-1" role="cell">
                <div class="flex items-center justify-end gap-1">
                  <span class="sm:hidden flex items-center" aria-hidden="true" title="Suites"><RectangleGroupIcon class="w-5 h-5]" /></span>
                  <span class="sm:text-3xl sm:font-bold sm:font-mono" aria-label="Test suites">{{ summary.suites !== undefined ? summary.suites : 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Chart and Timeline Section -->
    <div class="max-w-xs">
      <!-- Chart -->
      <div v-if="showChart" class="lg:col-span-3">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Chart, registerables } from 'chart.js';
import DateTimeFormatter from '../../components/DateTimeFormatter.vue';
import { formatDuration } from '../../../helpers/formatter';
import { RectangleGroupIcon, CalculatorIcon } from '@heroicons/vue/16/solid';
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

