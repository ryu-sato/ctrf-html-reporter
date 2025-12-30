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
        <DoughnutChart :summary="summary" :chartTitle="chartTitle" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DateTimeFormatter from '../../components/DateTimeFormatter.vue';
import DoughnutChart from '../../components/charts/DoughnutChart.vue';
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
</script>

