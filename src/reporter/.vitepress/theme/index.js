import DefaultTheme from 'vitepress/theme'
import './custom.css'
import TestStats from './components/TestStats.vue'
import DateTimeFormatter from './components/DateTimeFormatter.vue'
import ReportInfo from './components/ReportInfo.vue'
import EnvironmentInfo from './components/EnvironmentInfo.vue'
import SummaryView from './components/SummaryView.vue'
import TestTreeView from './components/TestTreeView.vue'
import SuiteNode from './components/SuiteNode.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('TestStats', TestStats)
    app.component('DateTimeFormatter', DateTimeFormatter)
    app.component('ReportInfo', ReportInfo)
    app.component('EnvironmentInfo', EnvironmentInfo)
    app.component('SummaryView', SummaryView)
    app.component('TestTreeView', TestTreeView)
    app.component('SuiteNode', SuiteNode)
  }
}