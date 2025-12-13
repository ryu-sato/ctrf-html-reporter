import DefaultTheme from 'vitepress/theme'
import './custom.css'
import TestStats from './components/TestStats.vue'
import DateTimeFormatter from './components/DateTimeFormatter.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TestStats', TestStats)
    app.component('DateTimeFormatter', DateTimeFormatter)
  }
}