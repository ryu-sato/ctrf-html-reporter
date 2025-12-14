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
        v-if="environment.appName || environment.appVersion || environment.testEnvironment || environment.healthy !== undefined"
        class="info-section"
      >
        <h4 class="section-title">Application</h4>
        <div class="section-content">
          <span v-if="environment.appName">{{ environment.appName }}</span>
          <code v-if="environment.appVersion">v{{ environment.appVersion }}</code>
          <span v-if="environment.testEnvironment" class="test-env"> ({{ environment.testEnvironment }})</span>
          <Badge 
            v-if="environment.healthy !== undefined" 
            :type="environment.healthy ? 'success' : 'danger'"
            class="health-badge"
          >
            {{ environment.healthy ? 'Healthy' : 'Unhealthy' }}
          </Badge>
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
              <span class="extra-label">{{ formatLabel(key) }}:</span>
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

<script setup>
import { computed } from 'vue';
import { formatLabel, formatValue } from '../../../helpers/formatter';

const props = defineProps({
  environment: {
    type: Object,
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
    env.healthy !== undefined ||
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
.environment-info {
  margin: 1rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.info-section {
  display: flex;
  flex-direction: column;
}

.extra-section {
  grid-column: 1 / -1;
}

.section-title {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.section-content {
  padding-left: 1rem;
  font-size: 0.9em;
  color: var(--vp-c-text-2);
}

.test-env {
  opacity: 0.7;
}

.health-badge {
  margin-left: 0.5rem;
}

.inline-code {
  margin-left: 0.5rem;
  padding: 0.125rem 0.375rem;
  background: var(--vp-c-bg-soft);
  border-radius: 4px;
  font-size: 0.875em;
  font-family: var(--vp-font-family-mono);
}

.commit-hash {
  font-size: 0.85em;
}

.build-info {
  margin-top: 0.25rem;
}

.build-id {
  font-size: 0.85em;
}

.extra-item {
  margin-bottom: 0.5rem;
}

.extra-label {
  font-weight: 600;
  margin-right: 0.5rem;
}

.extra-value {
  word-break: break-word;
}

.environment-info-empty {
  padding: 1rem;
  text-align: center;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}

/* Links styling */
.section-content a {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.section-content a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .extra-section {
    grid-column: 1;
  }
}
</style>
