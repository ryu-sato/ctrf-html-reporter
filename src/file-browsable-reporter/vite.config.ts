import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: __dirname,
  plugins: [
    vue(),
    tailwindcss(),
    viteSingleFile(),
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
