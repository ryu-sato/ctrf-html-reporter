import DefaultTheme from 'vitepress/theme'
import './custom.css'
import TestStats from './components/TestStats.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TestStats', TestStats)
  }
}