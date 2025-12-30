<template>
  <div v-if="hasEnvironmentData" class="environment-info">
    <div class="info-grid">
      <!-- Report Information -->
      <div v-if="environment.reportName" class="info-section">
        <h4 class="section-title">Report</h4>
        <div class="section-content">
          {{ environment.reportName }}
        </div>
      </div>

      <!-- Application & Test Environment -->
      <div 
        v-if="environment.appName || environment.appVersion || environment.testEnvironment"
        class="info-section"
      >
        <h4 class="section-title">Application</h4>
        <div class="section-content">
          <span v-if="environment.appName">{{ environment.appName }}</span>
          <code v-if="environment.appVersion">v{{ environment.appVersion }}</code>
          <span v-if="environment.testEnvironment" class="test-env"> ({{ environment.testEnvironment }})</span>
        </div>
      </div>

      <!-- Build & Repository Information -->
      <div 
        v-if="hasBuildOrRepoInfo"
        class="info-section"
      >
        <h4 class="section-title">Build & Repository</h4>
        <div class="section-content">
          <div v-if="environment.repositoryName || environment.branchName || environment.commit">
            <a 
              v-if="environment.repositoryUrl" 
              :href="environment.repositoryUrl" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {{ environment.repositoryName || 'Repository' }}
            </a>
            <span v-else-if="environment.repositoryName">{{ environment.repositoryName }}</span>
            <code v-if="environment.branchName" class="inline-code">{{ environment.branchName }}</code>
            <code v-if="environment.commit" class="inline-code commit-hash">
              {{ environment.commit.substring(0, 7) }}
            </code>
          </div>
          <div v-if="environment.buildName || environment.buildNumber || environment.buildId" class="build-info">
            <span v-if="environment.buildName">
              <a 
                v-if="environment.buildUrl" 
                :href="environment.buildUrl" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                {{ environment.buildName }}
              </a>
              <span v-else>{{ environment.buildName }}</span>
            </span>
            <span v-if="environment.buildNumber">
              <a 
                v-if="environment.buildUrl && !environment.buildName" 
                :href="environment.buildUrl" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                #{{ environment.buildNumber }}
              </a>
              <span v-else>#{{ environment.buildNumber }}</span>
            </span>
            <code v-if="environment.buildId" class="inline-code build-id">{{ environment.buildId }}</code>
          </div>
        </div>
      </div>

      <!-- Operating System Information -->
      <div 
        v-if="environment.osPlatform || environment.osRelease || environment.osVersion"
        class="info-section"
      >
        <h4 class="section-title">OS</h4>
        <div class="section-content">
          <span v-if="environment.osPlatform">{{ environment.osPlatform }}</span>
          <span v-if="environment.osRelease || environment.osVersion">
            {{ environment.osRelease }}{{ environment.osVersion ? ' ' + environment.osVersion : '' }}
          </span>
        </div>
      </div>

      <!-- Extra Information -->
      <div v-if="environment.extra" class="info-section extra-section">
        <h4 class="section-title">Additional</h4>
        <div class="section-content">
          <template v-if="typeof environment.extra === 'object'">
            <div v-for="(value, key) in environment.extra" :key="`extra-${key}`" class="extra-item">
              <span class="extra-label">{{ formatLabel(String(key)) }}:</span>
              <span class="extra-value">{{ formatValue(value) }}</span>
            </div>
          </template>
          <template v-else>
            {{ environment.extra }}
          </template>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="environment-info-empty">
    <p>No environment data available</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatLabel, formatValue } from '../../../helpers/formatter';
import type { Environment } from 'ctrf';

const props = defineProps({
  environment: {
    type: Object as () => Environment,
    default: () => ({}),
    validator: (value) => {
      // Environment should be an object
      return typeof value === 'object' && value !== null;
    }
  }
});

// Check if there's any environment data to display
const hasEnvironmentData = computed(() => {
  const env = props.environment;
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
  const env = props.environment;
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

<style scoped>
@import "tailwindcss" reference;

.environment-info {
  @apply my-4;
}

.info-grid {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.info-section {
  @apply flex flex-col;
}

.extra-section {
  @apply col-span-full;
}

.section-title {
  @apply m-0 mb-2 text-base font-semibold;
  color: var(--vp-c-text-1);
}

.section-content {
  @apply pl-4 text-sm;
  color: var(--vp-c-text-2);
}

.test-env {
  @apply opacity-70;
}

.health-badge {
  @apply ml-2;
}

.inline-code {
  @apply ml-2 px-1.5 py-0.5 rounded text-sm;
  background: var(--vp-c-bg-soft);
  font-family: var(--vp-font-family-mono);
}

.commit-hash {
  @apply text-xs;
}

.build-info {
  @apply mt-1;
}

.build-id {
  @apply text-xs;
}

.extra-item {
  @apply mb-2;
}

.extra-label {
  @apply font-semibold mr-2;
}

.extra-value {
  @apply break-words;
}

.environment-info-empty {
  @apply p-4 text-center rounded-lg border text-sm;
  background: var(--vp-c-bg-soft);
  border-color: var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.section-content a {
  @apply no-underline;
  color: var(--vp-c-brand-1);
}

.section-content a:hover {
  @apply underline;
}

@media (max-width: 768px) {
  .info-grid {
    @apply grid-cols-1;
  }

  .extra-section {
    @apply col-span-1;
  }
}
</style>
