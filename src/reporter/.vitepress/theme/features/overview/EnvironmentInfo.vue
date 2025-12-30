<template>
  <div v-if="hasEnvironmentData">
    <div class="relative overflow-hidden rounded-xl border transition-all border-b-4 border-vp-c-tip-soft">
      <div class="grid grid-cols-1 gap-1 p-2">
        <!-- Environment Information -->
        <div v-if="environment.reportName" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="absolute top-0 right-0 opacity-[0.03]"></div>
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg">
                <svg class="w-5 h-5" style="color: var(--vp-c-brand-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="text-xs uppercase tracking-wider" style="color: var(--vp-c-text-3);">Report</div>
            </div>
            <div class="text-sm tabular-nums">{{ environment.reportName }}</div>
          </div>
        </div>

        <!-- Application & Test Environment -->
        <div v-if="environment.appName || environment.appVersion || environment.testEnvironment" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="absolute top-0 right-0 opacity-[0.03]"></div>
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg mr-1">
                <svg class="w-5 h-5" style="color: var(--vp-c-indigo-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="text-xs uppercase tracking-wider" style="color: var(--vp-c-text-3);">Application</div>
            </div>
            <div class="text-sm truncate">
              <div v-if="environment.appName" class="text-xs font-bold">
                {{ environment.appName }}
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span v-if="environment.appVersion" class="inline-flex items-center px-3 py-1 text-xs font-mono font-bold rounded-lg border" style="background: var(--vp-c-indigo-dimm); color: var(--vp-c-indigo-1); border-color: var(--vp-c-indigo-soft);">
                  v{{ environment.appVersion }}
                </span>
                <span v-if="environment.testEnvironment" class="inline-flex items-center px-3 py-1 text-xs font-semibold rounded-lg" style="color: var(--vp-c-text-2); background: var(--vp-c-default-soft);">
                  {{ environment.testEnvironment }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Build & Repository Information -->
        <div v-if="hasBuildOrRepoInfo" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="absolute top-0 right-0 opacity-[0.03]"></div>
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg mr-1">
                <svg class="w-5 h-5" style="color: var(--vp-c-indigo-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="text-xs uppercase tracking-wider" style="color: var(--vp-c-text-3);">Build & Repository</div>
            </div>
            <div class="text-sm truncate" style="color: var(--vp-c-text-1);">
              <div v-if="environment.repositoryName || environment.branchName || environment.commit">
                <a
                  v-if="environment.repositoryUrl"
                  :href="environment.repositoryUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-base font-bold hover:underline transition-colors inline-flex items-center gap-1"
                  style="color: var(--vp-c-indigo-1);"
                >
                  {{ environment.repositoryName || 'Repository' }}
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <div v-else-if="environment.repositoryName" class="text-base font-bold" style="color: var(--vp-c-text-1);">{{ environment.repositoryName }}</div>
              </div>
              <div class="flex flex-wrap items-center gap-2">
                <span v-if="environment.branchName" class="inline-flex items-center px-3 py-1 text-xs font-mono font-semibold rounded-lg border" style="background: var(--vp-c-indigo-dimm); color: var(--vp-c-indigo-1); border-color: var(--vp-c-indigo-soft);">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                  </svg>
                  {{ environment.branchName }}
                </span>
                <span v-if="environment.commit" class="inline-flex items-center px-3 py-1 text-xs font-mono font-semibold rounded-lg" style="background: var(--vp-c-default-soft); color: var(--vp-c-text-2);">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"></path>
                  </svg>
                  {{ environment.commit.substring(0, 7) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Operating System Information -->
        <div v-if="environment.osPlatform || environment.osRelease || environment.osVersion" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="absolute top-0 right-0 opacity-[0.03]"></div>
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg mr-1">
                <svg class="w-5 h-5" style="color: var(--vp-c-indigo-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="text-xs uppercase tracking-wider" style="color: var(--vp-c-text-3);">Operating System</div>
            </div>
            <div class="text-sm truncate" style="color: var(--vp-c-text-1);">
              <p v-if="environment.osPlatform" style="color: var(--vp-c-text-1);">{{ environment.osPlatform }}</p>
              <p v-if="environment.osRelease || environment.osVersion" class="text-sm font-medium" style="color: var(--vp-c-text-2);">
                {{ environment.osRelease }}{{ environment.osVersion ? ' ' + environment.osVersion : '' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Extra Information -->
        <div v-if="environment.extra" class="relative overflow-hidden rounded-xl transition-all duration-200">
          <div class="absolute top-0 right-0 opacity-[0.03]"></div>
          <div class="py-1 px-3">
            <div class="flex items-center">
              <div class="flex items-center justify-center w-10 h-10 rounded-lg mr-1">
                <svg class="w-5 h-5" style="color: var(--vp-c-indigo-1);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <div class="text-xs uppercase tracking-wider" style="color: var(--vp-c-text-3);">Additional Information</div>
            </div>
            <div class="text-sm truncate" style="color: var(--vp-c-text-1);">
              <template v-if="typeof environment.extra === 'object'">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="(value, key) in environment.extra" :key="`extra-${key}`" class="space-y-2">
                    <p class="text-xs font-semibold uppercase tracking-wider" style="color: var(--vp-c-text-3);">{{ formatLabel(String(key)) }}</p>
                    <p class="px-3 py-2 text-sm font-medium break-words rounded-lg" style="color: var(--vp-c-text-1); background: var(--vp-c-default-soft);">{{ formatValue(value) }}</p>
                  </div>
                </div>
              </template>
              <template v-else>
                <p class="text-sm font-medium" style="color: var(--vp-c-text-1);">{{ environment.extra }}</p>
              </template>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div v-else class="flex flex-col items-center justify-center p-12 rounded-xl border-2 border-dashed" style="background: var(--vp-c-bg-soft); border-color: var(--vp-c-divider);">
    <svg class="w-12 h-12 mb-3" style="color: var(--vp-c-text-3);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
    </svg>
    <p class="text-sm font-medium" style="color: var(--vp-c-text-3);">No environment data available</p>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { formatLabel, formatValue } from '../../../helpers/formatter';
import type { Report, Environment } from 'ctrf';

const report = inject<Report | null>('report', null);
const environment = report?.results?.environment || {};

// const props = defineProps({
//   environment: {
//     type: Object as () => Environment,
//     default: () => ({}),
//     validator: (value) => {
//       // Environment should be an object
//       return typeof value === 'object' && value !== null;
//     }
//   }
// });

// Check if there's any environment data to display
const hasEnvironmentData = computed(() => {
  const env = environment;
  if (!env || typeof env !== 'object') return false;
  
  return !!(
    env.reportName ||
    env.appName ||
    env.appVersion ||
    env.testEnvironment ||
    env.buildId ||
    env.buildName ||
    env.buildNumber ||
    env.buildUrl ||
    env.repositoryName ||
    env.repositoryUrl ||
    env.commit ||
    env.branchName ||
    env.osPlatform ||
    env.osRelease ||
    env.osVersion ||
    env.extra
  );
});

// Check if there's any build or repository information
const hasBuildOrRepoInfo = computed(() => {
  const env = environment;
  return !!(
    env.buildId ||
    env.buildName ||
    env.buildNumber ||
    env.buildUrl ||
    env.repositoryName ||
    env.repositoryUrl ||
    env.commit ||
    env.branchName
  );
});
</script>

