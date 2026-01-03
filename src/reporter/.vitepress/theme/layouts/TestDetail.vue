<template>
  <div class="w-full">
    <div class="flex items-center justify-between mb-6 pb-4 border-b border-[var(--vp-c-divider)]">
      <h3 class="m-0 text-lg font-semibold text-[var(--vp-c-text-1)] flex-1 break-words">{{ test.name }}</h3>
      <span 
        class="px-3 py-1 rounded-xl text-xs font-semibold uppercase whitespace-nowrap ml-3"
        :class="{
          'bg-[var(--vp-c-green-soft)] text-[var(--vp-c-green-1)]': test.status === 'passed',
          'bg-[var(--vp-c-red-soft)] text-[var(--vp-c-red-1)]': test.status === 'failed',
          'bg-[var(--vp-c-yellow-soft)] text-[var(--vp-c-yellow-1)]': test.status === 'skipped',
          'bg-[var(--vp-c-gray-soft)] text-[var(--vp-c-gray-1)]': test.status === 'pending'
        }"
      >
        {{ test.status.toUpperCase() }}
      </span>
    </div>
    
    <div class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Basic Information</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3">
        <div v-if="test.id" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">ID:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words font-mono text-xs">{{ test.id }}</span>
        </div>
        <div class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Name:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.name }}</span>
        </div>
        <div class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Status:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.status }}</span>
        </div>
        <div v-if="test.rawStatus" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Raw Status:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.rawStatus }}</span>
        </div>
        <div v-if="test.duration !== undefined" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Duration:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ formatDuration(test.duration) }}</span>
        </div>
        <div v-if="test.start" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Start Time:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ formatDateTime(test.start) }}</span>
        </div>
        <div v-if="test.stop" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">End Time:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ formatDateTime(test.stop) }}</span>
        </div>
        <div v-if="test.type" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Type:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.type }}</span>
        </div>
        <div v-if="test.flaky !== undefined" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Flaky:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.flaky ? 'Yes' : 'No' }}</span>
        </div>
        <div v-if="test.retries !== undefined" class="flex py-2 border-b-0">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Retries:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.retries }}</span>
        </div>
      </div>
    </div>

    <div v-if="test.suite && test.suite.length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Suite Path</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3 text-[13px]">
        <span v-for="(suiteName, index) in test.suite" :key="index" class="text-[var(--vp-c-text-1)] break-words">
          {{ suiteName }}<span v-if="index < test.suite.length - 1" class="text-[var(--vp-c-text-2)] mx-2"> › </span>
        </span>
      </div>
    </div>

    <div v-if="test.filePath || test.line !== undefined" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Location</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3">
        <div v-if="test.filePath" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">File Path:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words font-mono text-xs">{{ test.filePath }}</span>
        </div>
        <div v-if="test.line !== undefined" class="flex py-2 border-b-0">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Line:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.line }}</span>
        </div>
      </div>
    </div>

    <div v-if="test.browser || test.device || test.threadId" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Environment</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3">
        <div v-if="test.browser" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Browser:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.browser }}</span>
        </div>
        <div v-if="test.device" class="flex py-2 border-b border-[var(--vp-c-divider)]">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Device:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words">{{ test.device }}</span>
        </div>
        <div v-if="test.threadId" class="flex py-2 border-b-0">
          <span class="font-semibold text-[var(--vp-c-text-2)] min-w-[120px] text-[13px]">Thread ID:</span>
          <span class="text-[var(--vp-c-text-1)] flex-1 text-[13px] break-words font-mono text-xs">{{ test.threadId }}</span>
        </div>
      </div>
    </div>
    
    <div v-if="test.message" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Message</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-text-1)] whitespace-pre-wrap break-words">{{ test.message }}</pre>
      </div>
    </div>
    
    <div v-if="test.trace" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Stack Trace</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-red-1)] whitespace-pre-wrap break-words">{{ test.trace }}</pre>
      </div>
    </div>

    <div v-if="test.snippet" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Code Snippet</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-text-1)] bg-[var(--vp-code-bg)] p-3 rounded whitespace-pre-wrap break-words">{{ test.snippet }}</pre>
      </div>
    </div>

    <div v-if="test.ai" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">AI Analysis</h4>
      <div class="bg-[var(--vp-c-brand-soft)] border border-[var(--vp-c-brand)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-brand-1)] whitespace-pre-wrap break-words">{{ test.ai }}</pre>
      </div>
    </div>
    
    <div v-if="test.tags && test.tags.length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Tags</h4>
      <div class="flex flex-wrap gap-2">
        <span v-for="tag in test.tags" :key="tag" class="inline-block px-2 py-1 rounded-xl text-xs leading-none border">{{ tag }}</span>
      </div>
    </div>

    <div v-if="test.parameters && Object.keys(test.parameters).length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Parameters</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-text-1)] whitespace-pre-wrap break-words">{{ JSON.stringify(test.parameters, null, 2) }}</pre>
      </div>
    </div>

    <div v-if="test.steps && test.steps.length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Steps</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3">
        <div v-for="(step, index) in test.steps" :key="index" class="p-3 mb-2 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md border-l-[3px] border-[var(--vp-c-divider)]">
          <span 
            class="inline-block px-2 py-0.5 rounded-lg text-[11px] font-semibold uppercase mr-2"
            :class="{
              'bg-[var(--vp-c-green-soft)] text-[var(--vp-c-green-1)]': step.status === 'passed',
              'bg-[var(--vp-c-red-soft)] text-[var(--vp-c-red-1)]': step.status === 'failed',
              'bg-[var(--vp-c-yellow-soft)] text-[var(--vp-c-yellow-1)]': step.status === 'skipped'
            }"
          >{{ step.status }}</span>
          <span class="text-[var(--vp-c-text-1)] text-[13px]">{{ step.name }}</span>
          <div v-if="step.extra" class="mt-2 pt-2 border-t border-[var(--vp-c-divider)]">
            <pre class="m-0 font-mono text-[11px] text-[var(--vp-c-text-2)]">{{ JSON.stringify(step.extra, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div v-if="test.retryAttempts && test.retryAttempts.length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Retry Attempts</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3">
        <div v-for="(attempt, index) in test.retryAttempts" :key="index" class="p-3 mb-3 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md border-l-[3px] border-[var(--vp-c-yellow)]">
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-[var(--vp-c-text-1)] text-[13px]">Attempt {{ attempt.attempt }}</span>
            <span 
              class="inline-block px-2 py-0.5 rounded-lg text-[11px] font-semibold uppercase"
              :class="{
                'bg-[var(--vp-c-green-soft)] text-[var(--vp-c-green-1)]': attempt.status === 'passed',
                'bg-[var(--vp-c-red-soft)] text-[var(--vp-c-red-1)]': attempt.status === 'failed'
              }"
            >{{ attempt.status }}</span>
          </div>
          <div class="text-xs">
            <div v-if="attempt.duration !== undefined" class="text-[var(--vp-c-text-2)] mb-1">
              Duration: {{ formatDuration(attempt.duration) }}
            </div>
            <div v-if="attempt.start" class="text-[var(--vp-c-text-2)] mb-1">
              Start: {{ formatDateTime(attempt.start) }}
            </div>
            <div v-if="attempt.stop" class="text-[var(--vp-c-text-2)] mb-1">
              Stop: {{ formatDateTime(attempt.stop) }}
            </div>
            <div v-if="attempt.message" class="mt-2 pt-2 border-t border-[var(--vp-c-divider)]">
              <strong>Message:</strong>
              <pre class="m-0 mt-1 font-mono text-[11px] text-[var(--vp-c-text-1)] whitespace-pre-wrap">{{ attempt.message }}</pre>
            </div>
            <div v-if="attempt.trace" class="mt-2 pt-2 border-t border-[var(--vp-c-divider)]">
              <strong>Trace:</strong>
              <pre class="m-0 mt-1 font-mono text-[11px] text-[var(--vp-c-red-1)] whitespace-pre-wrap">{{ attempt.trace }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="test.stdout && test.stdout.length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Standard Output</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-text-1)] whitespace-pre-wrap break-words">{{ test.stdout.join('\n') }}</pre>
      </div>
    </div>

    <div v-if="test.stderr && test.stderr.length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Standard Error</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-red-1)] whitespace-pre-wrap break-words">{{ test.stderr.join('\n') }}</pre>
      </div>
    </div>

    <div v-if="test.screenshot" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Screenshot</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 text-center">
        <img :src="test.screenshot" alt="Test screenshot" class="max-w-full rounded shadow-[0_2px_8px_rgba(0,0,0,0.1)]" />
      </div>
    </div>

    <div v-if="test.attachments && test.attachments.length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Attachments</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3">
        <div v-for="(attachment, index) in test.attachments" :key="index" class="p-3 mb-2 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md">
          <div class="font-semibold text-[var(--vp-c-text-1)] text-[13px] mb-1">{{ attachment.name }}</div>
          <div class="flex items-center gap-3 text-xs">
            <span class="text-[var(--vp-c-text-2)] font-mono">{{ attachment.contentType }}</span>
            <a :href="attachment.path" target="_blank" class="text-[var(--vp-c-brand-1)] no-underline font-medium hover:underline">View</a>
          </div>
          <div v-if="attachment.extra" class="mt-2 pt-2 border-t border-[var(--vp-c-divider)]">
            <pre class="m-0 font-mono text-[11px] text-[var(--vp-c-text-2)]">{{ JSON.stringify(attachment.extra, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div v-if="test.insights" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Test Insights</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-3">
        <div v-if="test.insights.passRate" class="p-3 mb-3 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md">
          <div class="font-semibold text-[var(--vp-c-text-1)] text-[13px] mb-2">Pass Rate</div>
          <div class="flex flex-col gap-1 text-xs text-[var(--vp-c-text-2)]">
            <span>Current: {{ formatPercentString(test.insights.passRate.current, 2) }}</span>
            <span>Baseline: {{ formatPercentString(test.insights.passRate.baseline, 2) }}</span>
            <span 
              class="font-semibold"
              :class="test.insights.passRate.change >= 0 ? 'text-[var(--vp-c-green-1)]' : 'text-[var(--vp-c-red-1)]'"
            >
              Change: {{ formatChange(test.insights.passRate.change) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.failRate" class="p-3 mb-3 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md">
          <div class="font-semibold text-[var(--vp-c-text-1)] text-[13px] mb-2">Fail Rate</div>
          <div class="flex flex-col gap-1 text-xs text-[var(--vp-c-text-2)]">
            <span>Current: {{ formatPercentString(test.insights.failRate.current, 2) }}</span>
            <span>Baseline: {{ formatPercentString(test.insights.failRate.baseline, 2) }}</span>
            <span 
              class="font-semibold"
              :class="test.insights.failRate.change <= 0 ? 'text-[var(--vp-c-green-1)]' : 'text-[var(--vp-c-red-1)]'"
            >
              Change: {{ formatChange(test.insights.failRate.change) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.flakyRate" class="p-3 mb-3 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md">
          <div class="font-semibold text-[var(--vp-c-text-1)] text-[13px] mb-2">Flaky Rate</div>
          <div class="flex flex-col gap-1 text-xs text-[var(--vp-c-text-2)]">
            <span>Current: {{ formatPercentString(test.insights.flakyRate.current, 2) }}</span>
            <span>Baseline: {{ formatPercentString(test.insights.flakyRate.baseline, 2) }}</span>
            <span 
              class="font-semibold"
              :class="test.insights.flakyRate.change <= 0 ? 'text-[var(--vp-c-green-1)]' : 'text-[var(--vp-c-red-1)]'"
            >
              Change: {{ formatChange(test.insights.flakyRate.change) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.averageTestDuration" class="p-3 mb-3 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md">
          <div class="font-semibold text-[var(--vp-c-text-1)] text-[13px] mb-2">Average Duration</div>
          <div class="flex flex-col gap-1 text-xs text-[var(--vp-c-text-2)]">
            <span>Current: {{ formatDuration(test.insights.averageTestDuration.current) }}</span>
            <span>Baseline: {{ formatDuration(test.insights.averageTestDuration.baseline) }}</span>
            <span 
              class="font-semibold"
              :class="test.insights.averageTestDuration.change <= 0 ? 'text-[var(--vp-c-green-1)]' : 'text-[var(--vp-c-red-1)]'"
            >
              Change: {{ formatDuration(Math.abs(test.insights.averageTestDuration.change)) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.p95TestDuration" class="p-3 mb-3 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md">
          <div class="font-semibold text-[var(--vp-c-text-1)] text-[13px] mb-2">P95 Duration</div>
          <div class="flex flex-col gap-1 text-xs text-[var(--vp-c-text-2)]">
            <span>Current: {{ formatDuration(test.insights.p95TestDuration.current) }}</span>
            <span>Baseline: {{ formatDuration(test.insights.p95TestDuration.baseline) }}</span>
            <span 
              class="font-semibold"
              :class="test.insights.p95TestDuration.change <= 0 ? 'text-[var(--vp-c-green-1)]' : 'text-[var(--vp-c-red-1)]'"
            >
              Change: {{ formatDuration(Math.abs(test.insights.p95TestDuration.change)) }}
            </span>
          </div>
        </div>
        <div v-if="test.insights.executedInRuns !== undefined" class="p-3 mb-3 last:mb-0 bg-[var(--vp-c-bg-soft)] rounded-md">
          <div class="font-semibold text-[var(--vp-c-text-1)] text-[13px] mb-2">Executed in Runs</div>
          <div class="flex flex-col gap-1 text-xs text-[var(--vp-c-text-2)]">
            <span>{{ test.insights.executedInRuns }}</span>
          </div>
        </div>
        <div v-if="test.insights.extra" class="mt-3 pt-3 border-t border-[var(--vp-c-divider)]">
          <pre class="m-0 font-mono text-[11px] text-[var(--vp-c-text-2)]">{{ JSON.stringify(test.insights.extra, null, 2) }}</pre>
        </div>
      </div>
    </div>
    
    <div v-if="test.extra && Object.keys(test.extra).length > 0" class="mb-6">
      <h4 class="m-0 mb-3 text-sm font-semibold text-[var(--vp-c-text-1)] uppercase tracking-wide">Additional Information</h4>
      <div class="bg-[var(--vp-c-bg)] border border-[var(--vp-c-divider)] rounded-lg p-4 overflow-x-auto">
        <pre class="m-0 font-mono text-xs leading-relaxed text-[var(--vp-c-text-1)] whitespace-pre-wrap break-words">{{ JSON.stringify(test.extra, null, 2) }}</pre>
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
