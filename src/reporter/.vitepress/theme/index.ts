import DefaultTheme from 'vitepress/theme'
import './custom.css'
import TestInsights from './features/insights/TestInsights.vue'
import DateTimeFormatter from './components/DateTimeFormatter.vue'
import ReportInfo from './features/overview/ReportInfo.vue'
import EnvironmentInfo from './features/overview/EnvironmentInfo.vue'
import SummaryView from './features/overview/SummaryView.vue'
import TestTreeView from './features/suites/TestTreeView.vue'
import TreeNodeInfo from './features/suites/TreeNodeInfo.vue'
import TestDetail from './layouts/TestDetail.vue'
import TimelineChart from './features/timeline/TimelineChart.vue'
import PercentFormatter from './components/PercentFormatter.vue'
import Layout from './layouts/Layout.vue'
import InsightsView from './features/insights/InsightsView.vue';

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