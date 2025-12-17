import DefaultTheme from 'vitepress/theme'
import './custom.css'
import TestInsights from './components/insights/TestInsights.vue'
import DateTimeFormatter from './components/DateTimeFormatter.vue'
import ReportInfo from './components/report/ReportInfo.vue'
import EnvironmentInfo from './components/report/EnvironmentInfo.vue'
import SummaryView from './components/report/SummaryView.vue'
import TestTreeView from './components/test-tree/TestTreeView.vue'
import SuiteNode from './components/test-tree/SuiteNode.vue'
import TestDetail from './layouts/TestDetail.vue'
import TimelineChart from './components/timeline/TimelineChart.vue'
import PercentFormatter from './components/PercentFormatter.vue'
import Layout from './layouts/Layout.vue'
import InsightsView from './components/insights/InsightsView.vue';

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }: { app: any }) {
    app.component('TestInsights', TestInsights)
    app.component('DateTimeFormatter', DateTimeFormatter)
    app.component('ReportInfo', ReportInfo)
    app.component('EnvironmentInfo', EnvironmentInfo)
    app.component('SummaryView', SummaryView)
    app.component('TestTreeView', TestTreeView)
    app.component('SuiteNode', SuiteNode)
    app.component('TestDetail', TestDetail)
    app.component('TimelineChart', TimelineChart)
    app.component('PercentFormatter', PercentFormatter)
    app.component('InsightsView', InsightsView)
  }
}