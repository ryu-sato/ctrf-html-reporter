import { createApp } from 'vue'
import './standalone-vars.css'
import '../reporter/.vitepress/theme/custom.css'
import App from './App.vue'
import type { CtrfReport } from 'ctrf'

// Apply dark mode class based on OS preference so CSS variables respond correctly
const applyDarkMode = () => {
  document.documentElement.classList.toggle(
    'dark',
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
}
applyDarkMode()
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyDarkMode)

const el = document.getElementById('ctrf-data')
const report: CtrfReport | null = el?.textContent ? JSON.parse(el.textContent) : null

const app = createApp(App)
app.provide('report', report)
app.mount('#app')
