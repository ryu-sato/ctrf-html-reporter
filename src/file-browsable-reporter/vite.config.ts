import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'node:fs'
import { enrichReportWithInsights } from 'ctrf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DATA_PLACEHOLDER = '<script type="application/json" id="ctrf-data">null</script>'

function injectCtrfDataPlugin() {
  return {
    name: 'inject-ctrf-data',
    transformIndexHtml(html: string): string {
      const reportPath = process.env.CTRF_REPORT_PATH
      if (!reportPath) return html
      const resolvedPath = path.resolve(process.cwd(), reportPath)
      const rawReport = JSON.parse(fs.readFileSync(resolvedPath, 'utf-8'))
      const enrichedReport = enrichReportWithInsights(rawReport)
      return html.replace(
        DATA_PLACEHOLDER,
        `<script type="application/json" id="ctrf-data">${JSON.stringify(enrichedReport)}</script>`
      )
    },
  }
}

export default defineConfig({
  root: __dirname,
  plugins: [
    vue(),
    tailwindcss(),
    viteSingleFile(),
    injectCtrfDataPlugin(),
  ],
  resolve: {
    alias: {
      // Replace VitePress with a stub so shared components (e.g. DoughnutChart)
      // that use `useData()` work without VitePress installed at runtime.
      'vitepress': path.resolve(__dirname, './vitepress-stub.ts'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, '../../dist/file-browsable-reporter'),
    emptyOutDir: true,
    // Ensure assets are inlined, not written to separate files
    assetsInlineLimit: Infinity,
  },
})
