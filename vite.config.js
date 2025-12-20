import { defineConfig } from 'vite'
import { builtinModules } from 'module'
import packageJson from './package.json' with { type: 'json' }
import { copyFile, copyDir } from './src/utils/copy.mts';
import path from 'path';

export default defineConfig({
  build: {
    lib: {
      name: 'ctrf-html-reporter',
      entry: ['src/bin/index.mts'],
      formats: ['es'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: [
        "fsevents",
        "vitepress",
        ...builtinModules,
        ...builtinModules.map(m => `node:${m}`)
      ],
      output: {
        preserveModules: false,
        entryFileNames: '[name].mjs',
      },
    },
    target: 'node18',
    outDir: 'dist/bin',
    emptyOutDir: false,
  },
  define: {
    '__PACKAGE_VERSION__': JSON.stringify(packageJson.version),
    '__PACKAGE_DESCRIPTION__': JSON.stringify(packageJson.description),
  },
  plugins: [
    {
      name: 'copy-reporter-files',
      closeBundle() {
        // After the build completes, copy src/reporter to dist/reporter.
        const srcDir = path.resolve('src/reporter')
        const destDir = path.resolve('dist/reporter')
        
        console.log('Copying reporter files...')
        copyDir(srcDir, destDir, ['node_modules', 'cache'])
        console.log('Reporter files copied successfully!')
        
        // Copy package.json to dist (for npm publishing)
        console.log('Creating package.json for distribution...')
        copyFile('./package.json', './dist/package.json');
        console.log('package.json created successfully!')
      }
    }
  ]
});
