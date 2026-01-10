import pluginVue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue: pluginVue,
    },
    rules: {
      // Warning for unused components and variables
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',

      // Apply Vue 3 recommended rules
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    ignores: ['node_modules/', '.vitepress/cache/', '**/.vitepress/cache/'],
  },
]
