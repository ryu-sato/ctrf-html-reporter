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
        <div class="info-row" v-if="test.id">
          <span class="info-label">ID:</span>
          <span class="info-value code">{{ test.id }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">{{ test.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Status:</span>
          <span class="info-value">{{ test.status }}</span>
        </div>
        <div class="info-row" v-if="test.rawStatus">
          <span class="info-label">Raw Status:</span>
          <span class="info-value">{{ test.rawStatus }}</span>
        </div>
        <div class="info-row" v-if="test.duration !== undefined">
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
        <div class="info-row" v-if="test.type">
          <span class="info-label">Type:</span>
          <span class="info-value">{{ test.type }}</span>
        </div>
        <div class="info-row" v-if="test.flaky !== undefined">
          <span class="info-label">Flaky:</span>
          <span class="info-value">{{ test.flaky ? 'Yes' : 'No' }}</span>
        </div>
        <div class="info-row" v-if="test.retries !== undefined">
          <span class="info-label">Retries:</span>
          <span class="info-value">{{ test.retries }}</span>
        </div>
      </div>
    </div>

    <div class="detail-section" v-if="test.suite && test.suite.length > 0">
      <h4>Suite Path</h4>
      <div class="suite-path">
        <span v-for="(suiteName, index) in test.suite" :key="index" class="suite-name">
          {{ suiteName }}<span v-if="index < test.suite.length - 1" class="separator"> › </span>
        </span>
      </div>
    </div>

    <div class="detail-section" v-if="test.filePath || test.line !== undefined">
      <h4>Location</h4>
      <div class="detail-info">
        <div class="info-row" v-if="test.filePath">
          <span class="info-label">File Path:</span>
          <span class="info-value code">{{ test.filePath }}</span>
        </div>
        <div class="info-row" v-if="test.line !== undefined">
          <span class="info-label">Line:</span>
          <span class="info-value">{{ test.line }}</span>
        </div>
      </div>
    </div>

    <div class="detail-section" v-if="test.browser || test.device || test.threadId">
      <h4>Environment</h4>
      <div class="detail-info">
        <div class="info-row" v-if="test.browser">
          <span class="info-label">Browser:</span>
          <span class="info-value">{{ test.browser }}</span>
        </div>
        <div class="info-row" v-if="test.device">
          <span class="info-label">Device:</span>
          <span class="info-value">{{ test.device }}</span>
        </div>
        <div class="info-row" v-if="test.threadId">
          <span class="info-label">Thread ID:</span>
          <span class="info-value code">{{ test.threadId }}</span>
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

    <div class="detail-section" v-if="test.snippet">
      <h4>Code Snippet</h4>
      <div class="snippet-box">
        <pre>{{ test.snippet }}</pre>
      </div>
    </div>

    <div class="detail-section" v-if="test.ai">
      <h4>AI Analysis</h4>
      <div class="ai-box">
        <pre>{{ test.ai }}</pre>
      </div>
    </div>
    
    <div class="detail-section" v-if="test.tags && test.tags.length > 0">
      <h4>Tags</h4>
      <div class="tags">
        <Badge v-for="tag in test.tags" :key="tag" type="tip">{{ tag }}</Badge>
      </div>
    </div>

    <div class="detail-section" v-if="test.parameters && Object.keys(test.parameters).length > 0">
      <h4>Parameters</h4>
      <div class="extra-info">
        <pre>{{ JSON.stringify(test.parameters, null, 2) }}</pre>
      </div>
    </div>

    <div class="detail-section" v-if="test.steps && test.steps.length > 0">
      <h4>Steps</h4>
      <div class="steps-list">
        <div v-for="(step, index) in test.steps" :key="index" class="step-item">
          <span :class="['step-status', step.status]">{{ step.status }}</span>
          <span class="step-name">{{ step.name }}</span>
          <div v-if="step.extra" class="step-extra">
            <pre>{{ JSON.stringify(step.extra, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-section" v-if="test.retryAttempts && test.retryAttempts.length > 0">
      <h4>Retry Attempts</h4>
      <div class="retry-attempts">
        <div v-for="(attempt, index) in test.retryAttempts" :key="index" class="retry-item">
          <div class="retry-header">
            <span class="retry-label">Attempt {{ attempt.attempt }}</span>
            <span :class="['retry-status', attempt.status]">{{ attempt.status }}</span>
          </div>
          <div class="retry-details">
            <div v-if="attempt.duration !== undefined" class="retry-info">
              Duration: {{ formatDuration(attempt.duration) }}
            </div>
            <div v-if="attempt.start" class="retry-info">
              Start: {{ formatDateTime(attempt.start) }}
            </div>
            <div v-if="attempt.stop" class="retry-info">
              Stop: {{ formatDateTime(attempt.stop) }}
            </div>
            <div v-if="attempt.message" class="retry-message">
              <strong>Message:</strong>
              <pre>{{ attempt.message }}</pre>
            </div>
            <div v-if="attempt.trace" class="retry-trace">
              <strong>Trace:</strong>
              <pre>{{ attempt.trace }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-section" v-if="test.stdout && test.stdout.length > 0">
      <h4>Standard Output</h4>
      <div class="output-box">
        <pre>{{ test.stdout.join('\n') }}</pre>
      </div>
    </div>

    <div class="detail-section" v-if="test.stderr && test.stderr.length > 0">
      <h4>Standard Error</h4>
      <div class="error-box">
        <pre>{{ test.stderr.join('\n') }}</pre>
      </div>
    </div>

    <div class="detail-section" v-if="test.screenshot">
      <h4>Screenshot</h4>
      <div class="screenshot-box">
        <img :src="test.screenshot" alt="Test screenshot" class="screenshot-img" />
      </div>
    </div>

    <div class="detail-section" v-if="test.attachments && test.attachments.length > 0">
      <h4>Attachments</h4>
      <div class="attachments-list">
        <div v-for="(attachment, index) in test.attachments" :key="index" class="attachment-item">
          <div class="attachment-name">{{ attachment.name }}</div>
          <div class="attachment-info">
            <span class="attachment-type">{{ attachment.contentType }}</span>
            <a :href="attachment.path" target="_blank" class="attachment-link">View</a>
          </div>
          <div v-if="attachment.extra" class="attachment-extra">
            <pre>{{ JSON.stringify(attachment.extra, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-section" v-if="test.insights">
      <h4>Test Insights</h4>
      <div class="insights-info">
        <div v-if="test.insights.passRate" class="insight-metric">
          <div class="metric-label">Pass Rate</div>
          <div class="metric-values">
            <span>Current: {{ formatPercentString(test.insights.passRate.current, 2) }}</span>
            <span>Baseline: {{ formatPercentString(test.insights.passRate.baseline, 2) }}</span>
            <span :class="['metric-change', test.insights.passRate.change >= 0 ? 'positive' : 'negative']">
              Change: {{ formatChange(test.insights.passRate.change) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.failRate" class="insight-metric">
          <div class="metric-label">Fail Rate</div>
          <div class="metric-values">
            <span>Current: {{ formatPercentString(test.insights.failRate.current, 2) }}</span>
            <span>Baseline: {{ formatPercentString(test.insights.failRate.baseline, 2) }}</span>
            <span :class="['metric-change', test.insights.failRate.change <= 0 ? 'positive' : 'negative']">
              Change: {{ formatChange(test.insights.failRate.change) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.flakyRate" class="insight-metric">
          <div class="metric-label">Flaky Rate</div>
          <div class="metric-values">
            <span>Current: {{ formatPercentString(test.insights.flakyRate.current, 2) }}</span>
            <span>Baseline: {{ formatPercentString(test.insights.flakyRate.baseline, 2) }}</span>
            <span :class="['metric-change', test.insights.flakyRate.change <= 0 ? 'positive' : 'negative']">
              Change: {{ formatChange(test.insights.flakyRate.change) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.averageTestDuration" class="insight-metric">
          <div class="metric-label">Average Duration</div>
          <div class="metric-values">
            <span>Current: {{ formatDuration(test.insights.averageTestDuration.current) }}</span>
            <span>Baseline: {{ formatDuration(test.insights.averageTestDuration.baseline) }}</span>
            <span :class="['metric-change', test.insights.averageTestDuration.change <= 0 ? 'positive' : 'negative']">
              Change: {{ formatDuration(Math.abs(test.insights.averageTestDuration.change)) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.p95TestDuration" class="insight-metric">
          <div class="metric-label">P95 Duration</div>
          <div class="metric-values">
            <span>Current: {{ formatDuration(test.insights.p95TestDuration.current) }}</span>
            <span>Baseline: {{ formatDuration(test.insights.p95TestDuration.baseline) }}</span>
            <span :class="['metric-change', test.insights.p95TestDuration.change <= 0 ? 'positive' : 'negative']">
              Change: {{ formatDuration(Math.abs(test.insights.p95TestDuration.change)) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.executedInRuns !== undefined" class="insight-metric">
          <div class="metric-label">Executed in Runs</div>
          <div class="metric-values">
            <span>{{ test.insights.executedInRuns }}</span>
          </div>
        </div>
        <div v-if="test.insights.extra" class="insight-extra">
          <pre>{{ JSON.stringify(test.insights.extra, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <div class="detail-section" v-if="test.extra && Object.keys(test.extra).length > 0">
      <h4>Additional Information</h4>
      <div class="extra-info">
        <pre>{{ JSON.stringify(test.extra, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPercentString, formatDuration, formatDateTime, formatChange } from '../../helpers/formatter'
import type { Test } from 'ctrf';

defineProps({
  test: {
    type: Object as () => Test,
    required: true
  }
})
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
  min-width: 120px;
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

.suite-path {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
  font-size: 13px;
}

.suite-name {
  color: var(--vp-c-text-1);
}

.separator {
  color: var(--vp-c-text-2);
  margin: 0 8px;
}

.message-box,
.trace-box,
.snippet-box,
.ai-box,
.output-box,
.error-box,
.extra-info {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}

.message-box pre,
.trace-box pre,
.snippet-box pre,
.ai-box pre,
.output-box pre,
.error-box pre,
.extra-info pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.trace-box pre,
.error-box pre {
  color: var(--vp-c-red-1);
}

.snippet-box pre {
  color: var(--vp-c-text-1);
  background: var(--vp-code-bg);
  padding: 12px;
  border-radius: 4px;
}

.ai-box {
  background: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand);
}

.ai-box pre {
  color: var(--vp-c-brand-1);
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

.steps-list {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
}

.step-item {
  padding: 12px;
  margin-bottom: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  border-left: 3px solid var(--vp-c-divider);
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  margin-right: 8px;
}

.step-status.passed {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}

.step-status.failed {
  background: var(--vp-c-red-soft);
  color: var(--vp-c-red-1);
}

.step-status.skipped {
  background: var(--vp-c-yellow-soft);
  color: var(--vp-c-yellow-1);
}

.step-name {
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.step-extra {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
}

.step-extra pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.retry-attempts {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
}

.retry-item {
  padding: 12px;
  margin-bottom: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
  border-left: 3px solid var(--vp-c-yellow);
}

.retry-item:last-child {
  margin-bottom: 0;
}

.retry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.retry-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

.retry-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.retry-status.passed {
  background: var(--vp-c-green-soft);
  color: var(--vp-c-green-1);
}

.retry-status.failed {
  background: var(--vp-c-red-soft);
  color: var(--vp-c-red-1);
}

.retry-details {
  font-size: 12px;
}

.retry-info {
  color: var(--vp-c-text-2);
  margin-bottom: 4px;
}

.retry-message,
.retry-trace {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
}

.retry-message pre,
.retry-trace pre {
  margin: 4px 0 0 0;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--vp-c-text-1);
  white-space: pre-wrap;
}

.retry-trace pre {
  color: var(--vp-c-red-1);
}

.screenshot-box {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.screenshot-img {
  max-width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.attachments-list {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
}

.attachment-item {
  padding: 12px;
  margin-bottom: 8px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}

.attachment-item:last-child {
  margin-bottom: 0;
}

.attachment-name {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 13px;
  margin-bottom: 4px;
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.attachment-type {
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
}

.attachment-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.attachment-link:hover {
  text-decoration: underline;
}

.attachment-extra {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--vp-c-divider);
}

.attachment-extra pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--vp-c-text-2);
}

.insights-info {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px;
}

.insight-metric {
  padding: 12px;
  margin-bottom: 12px;
  background: var(--vp-c-bg-soft);
  border-radius: 6px;
}

.insight-metric:last-child {
  margin-bottom: 0;
}

.metric-label {
  font-weight: 600;
  color: var(--vp-c-text-1);
  font-size: 13px;
  margin-bottom: 8px;
}

.metric-values {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.metric-change {
  font-weight: 600;
}

.metric-change.positive {
  color: var(--vp-c-green-1);
}

.metric-change.negative {
  color: var(--vp-c-red-1);
}

.insight-extra {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.insight-extra pre {
  margin: 0;
  font-family: var(--vp-font-family-mono);
  font-size: 11px;
  color: var(--vp-c-text-2);
}
</style>
