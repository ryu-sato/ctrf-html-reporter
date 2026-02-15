<template>
  <div class="all-tests-view">
    <h1 class="text-2xl font-bold mb-6 text-[var(--vp-c-text-1)]">All Tests</h1>

    <!-- Summary -->
    <SummaryView :summary="report.results.summary" class="mb-8" />

    <!-- Filter Controls -->
    <div class="mb-6 p-4 rounded-lg border bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]">
      <div class="flex flex-wrap gap-4 mb-4 max-md:flex-col">
        <!-- Search -->
        <div class="flex flex-col gap-2 flex-1 min-w-[200px]">
          <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="search">Search:</label>
          <input
            id="search"
            v-model="searchText"
            type="text"
            placeholder="Filter by test name..."
            class="px-3 py-2 rounded border text-sm bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)]"
            @input="resetPage"
          />
        </div>

        <!-- Status Filter -->
        <div class="flex flex-col gap-2 min-w-[120px]">
          <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="status-filter">Status:</label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="px-3 py-2 rounded border text-sm cursor-pointer bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)]"
            @change="resetPage"
          >
            <option value="all">All</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="skipped">Skipped</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="flex flex-col gap-2 min-w-[120px]">
          <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="sort-by">Sort by:</label>
          <select
            id="sort-by"
            v-model="sortBy"
            class="px-3 py-2 rounded border text-sm cursor-pointer bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)]"
            @change="resetPage"
          >
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="duration">Duration</option>
            <option value="suite">Suite</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div class="flex flex-col gap-2 min-w-[120px]">
          <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="sort-order">Order:</label>
          <select
            id="sort-order"
            v-model="sortOrder"
            class="px-3 py-2 rounded border text-sm cursor-pointer bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)]"
            @change="resetPage"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>

        <!-- Items Per Page -->
        <div class="flex flex-col gap-2 min-w-[120px]">
          <label class="text-sm font-semibold text-[var(--vp-c-text-1)]" for="items-per-page">Per page:</label>
          <select
            id="items-per-page"
            v-model="itemsPerPage"
            class="px-3 py-2 rounded border text-sm cursor-pointer bg-[var(--report-control-bg)] border-[var(--report-control-border)] text-[var(--vp-c-text-1)] focus:outline-none focus:border-[var(--vp-c-brand-1)]"
            @change="resetPage"
          >
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
            <option :value="96">96</option>
          </select>
        </div>
      </div>

      <div class="text-sm text-[var(--vp-c-text-2)] pt-2 border-t border-[var(--vp-c-divider)]">
        Showing {{ startIndex + 1 }} - {{ endIndex }} of {{ filteredTests.length }} tests
      </div>
    </div>

    <!-- Test Cards -->
    <div class="flex flex-col gap-3">
      <AllTestsCard
        v-for="test in paginatedTests"
        :key="test.name + (test.filePath || '') + (test.suite?.join('/') || '')"
        :test="test"
      />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-center gap-4 mt-8 p-4 rounded-lg border bg-[var(--vp-c-bg-soft)] border-[var(--vp-c-divider)]">
      <button
        class="px-4 py-2 rounded text-sm font-semibold text-white border-0 cursor-pointer transition-all bg-[var(--report-btn-bg)] hover:bg-[var(--report-btn-hover-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <div class="flex gap-2">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="px-3 py-2 rounded border text-sm cursor-pointer transition-all min-w-[40px] bg-[var(--vp-c-bg)] text-[var(--vp-c-text-1)] border-[var(--vp-c-divider)] hover:border-[var(--vp-c-brand-1)]"
          :class="{ 'text-white bg-[var(--vp-c-brand-1)] border-[var(--vp-c-brand-1)]': page === currentPage }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      <button
        class="px-4 py-2 rounded text-sm font-semibold text-white border-0 cursor-pointer transition-all bg-[var(--report-btn-bg)] hover:bg-[var(--report-btn-hover-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import type { CtrfReport } from 'ctrf'
import AllTestsCard from '../reporter/.vitepress/theme/features/all-tests/AllTestsCard.vue'

const report = inject<CtrfReport>('report') as CtrfReport

// Filter and sort state
const searchText = ref('')
const statusFilter = ref<'all' | 'passed' | 'failed' | 'skipped' | 'pending'>('all')
const sortBy = ref<'name' | 'status' | 'duration' | 'suite'>('name')
const sortOrder = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const itemsPerPage = ref(24)

// Get all tests
const allTests = computed(() => report?.results?.tests || [])

// Filter tests
const filteredTests = computed(() => {
  let tests = [...allTests.value]

  // Apply search filter
  if (searchText.value.trim()) {
    const search = searchText.value.toLowerCase()
    tests = tests.filter(test =>
      test.name.toLowerCase().includes(search) ||
      test.suite?.join(' ').toLowerCase().includes(search)
    )
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    tests = tests.filter(test => test.status === statusFilter.value)
  }

  // Apply sorting
  tests.sort((a, b) => {
    let comparison = 0
    switch (sortBy.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'status':
        comparison = a.status.localeCompare(b.status)
        break
      case 'duration':
        comparison = (a.duration || 0) - (b.duration || 0)
        break
      case 'suite':
        comparison = (a.suite?.join('/') || '').localeCompare(b.suite?.join('/') || '')
        break
    }
    return sortOrder.value === 'asc' ? comparison : -comparison
  })

  return tests
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredTests.value.length / itemsPerPage.value))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredTests.value.length))

const paginatedTests = computed(() => {
  return filteredTests.value.slice(startIndex.value, endIndex.value)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  for (let i = 1; i <= totalPages.value; i++) {
    if (Math.abs(i - currentPage.value) < 3 || i === 1 || i === totalPages.value) {
      pages.push(i)
    }
  }
  return pages
})

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const resetPage = () => {
  currentPage.value = 1
}
</script>
