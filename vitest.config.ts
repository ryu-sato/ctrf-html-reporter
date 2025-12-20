import { defineConfig } from 'vitest/config';
import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.{ts,mts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/bin/**/*.{ts,mts}'],
      exclude: ['src/bin/**/*.test.{ts,mts}', 'src/bin/index.mts'],
    },
  },
  define: {
    '__PACKAGE_VERSION__': JSON.stringify(packageJson.version),
    '__PACKAGE_DESCRIPTION__': JSON.stringify(packageJson.description),
  },
});
