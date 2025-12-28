import DefaultTheme from 'vitepress/theme'
import './custom.css'
import TestInsights from './components/insights/TestInsights.vue'
import DateTimeFormatter from './components/DateTimeFormatter.vue'
import ReportInfo from './components/overview/ReportInfo.vue'
import EnvironmentInfo from './components/overview/EnvironmentInfo.vue'
import SummaryView from './components/overview/SummaryView.vue'
import TestTreeView from './components/suites/TestTreeView.vue'
import TreeNodeInfo from './components/suites/TreeNodeInfo.vue'
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
    app.component('TreeNodeInfo', TreeNodeInfo)
    app.component('TestDetail', TestDetail)
    app.component('TimelineChart', TimelineChart)
    app.component('PercentFormatter', PercentFormatter)
    app.component('InsightsView', InsightsView)
  }
}