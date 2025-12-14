<template>
  <div class="test-detail">
    <div class="detail-header">
      <h3>{{ test.name }}</h3>
      <span :class="['status-badge', test.status]">
        {{ test.status.toUpperCase() }}
      </span>
    </div>
    
    <div class="detail-section">
      <h4>Basic Information</h4>
      <div class="detail-info">
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value">{{ test.status }}</span>
        </div>
        <div class="info-row" v-if="test.duration">
          <span class="info-label">Duration:</span>
          <span class="info-value">{{ formatDuration(test.duration) }}</span>
        </div>
        <div class="info-row" v-if="test.start">
          <span class="info-label">Start Time:</span>
          <span class="info-value">{{ formatDateTime(test.start) }}</span>
        </div>
        <div class="info-row" v-if="test.stop">
          <span class="info-label">End Time:</span>
          <span class="info-value">{{ formatDateTime(test.stop) }}</span>
        </div>
        <div class="info-row" v-if="test.filePath">
          <span class="info-label">File Path:</span>
          <span class="info-value code">{{ test.filePath }}</span>
        </div>
        <div class="info-row" v-if="test.retry !== undefined">
          <span class="info-label">Retry Count:</span>
          <span class="info-value">{{ test.retry }}</span>
        </div>
        <div class="info-row" v-if="test.flaky">
          <span class="info-label">Flaky:</span>
          <span class="info-value">Yes</span>
        </div>
      </div>
    </div>
    
    <div class="detail-section" v-if="test.message">
      <h4>Message</h4>
      <div class="message-box">
        <pre>{{ test.message }}</pre>
      </div>
    </div>
    
    <div class="detail-section" v-if="test.trace">
      <h4>Stack Trace</h4>
      <div class="trace-box">
        <pre>{{ test.trace }}</pre>
      </div>
    </div>
    
    <div class="detail-section" v-if="test.rawStatus">
      <h4>Raw Status</h4>
      <div class="info-value">{{ test.rawStatus }}</div>
    </div>
    
    <div class="detail-section" v-if="test.tags && test.tags.length > 0">
      <h4>Tags</h4>
      <div class="tags">
        <span v-for="tag in test.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </div>
    
    <div class="detail-section" v-if="test.type">
      <h4>Test Type</h4>
      <div class="info-value">{{ test.type }}</div>
    </div>
    
    <div class="detail-section" v-if="test.extra">
      <h4>Additional Information</h4>
      <div class="extra-info">
        <pre>{{ JSON.stringify(test.extra, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  test: {
    type: Object,
    required: true
  }
})

const formatDuration = (ms) => {
  if (ms < 1000) return `${ms}ms`
  const seconds = (ms / 1000).toFixed(2)
  return `${seconds}s`
}

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A'
  const date = new Date(timestamp)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.test-detail {
  width: 100%;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.detail-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
  word-break: break-word;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  margin-left: 12px;
}

.status-badge.passed {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}

.status-badge.failed {
  background: var(--vp-c-red-soft);
  color: var(--vp-c-red-1);
}

.status-badge.skipped {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-1);
}

.status-badge.pending {
  background: var(--vp-c-gray-soft);
  color: var(--vp-c-gray-1);
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-info {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
}

.info-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid var(--vp-c-divider);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: var(--vp-c-text-2);
  min-width: 100px;
  font-size: 13px;
}

.info-value {
  color: var(--vp-c-text-1);
  flex: 1;
  font-size: 13px;
  word-break: break-word;
}

.info-value.code {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
}

.message-box,
.trace-box,
.extra-info {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.message-box pre,
.trace-box pre,
.extra-info pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.trace-box pre {
  color: var(--vp-c-red-1);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  padding: 4px 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}
</style>
