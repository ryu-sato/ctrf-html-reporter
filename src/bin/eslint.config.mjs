import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'

export default [
  {
    files: ['**/*.{ts,mts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Warning for unused components and variables
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    ignores: [
      'node_modules/',
    ],
  },
]
