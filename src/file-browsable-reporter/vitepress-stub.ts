/**
 * Stub for VitePress composables used by shared components (e.g. DoughnutChart).
 * Provides the same interface without requiring the VitePress package.
 */
import { ref, onMounted } from 'vue'

export const useData = () => {
  const isDark = ref(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  )

  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      isDark.value = e.matches
    })
  }

  return { isDark }
}
