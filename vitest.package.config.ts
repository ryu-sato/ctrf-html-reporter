import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/*.test.{ts,mts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/*.{ts,mts}'],
      exclude: [
        'src/bin/**/*.test.{ts,mts}',
        'src/bin/index.mts',
        'src/reporter/**/*.test.{ts,mts}',
        'src/reporter/index.mts',
      ],
    },
  },
});
