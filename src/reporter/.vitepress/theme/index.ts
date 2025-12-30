import './custom.css'

import Badge from './components/Badge.vue'
import DateTimeFormatter from './components/DateTimeFormatter.vue'
import PercentFormatter from './components/PercentFormatter.vue'
import PassedIcon from './components/status-icons/PassedIcon.vue'
import FailedIcon from './components/status-icons/FailedIcon.vue'
import SkippedIcon from './components/status-icons/SkippedIcon.vue'
import PendingIcon from './components/status-icons/PendingIcon.vue'
import FlakyIcon from './components/status-icons/FlakyIcon.vue'
import SuitesDurationBarChart from './components/charts/SuitesDurationBarChart.vue';

import ReportInfo from './features/overview/ReportInfo.vue'
import EnvironmentInfo from './features/overview/EnvironmentInfo.vue'
import SummaryView from './features/overview/SummaryView.vue'

import TestInsightsInfo from './features/insights/TestInsightsInfo.vue'
import InsightsView from './features/insights/InsightsView.vue';

import TestTreeView from './features/suites/TestTreeView.vue'
import TreeNodeArrayInfo from './features/suites/TreeNodeArrayInfo.vue'
import TreeNodeInfo from './features/suites/TreeNodeInfo.vue'

import TimelineChart from './features/timeline/TimelineChart.vue'

import TestDetail from './layouts/TestDetail.vue'
import Layout from './layouts/Layout.vue'

export default {
  Layout,
  enhanceApp({ app }: { app: any }) {
    app.component('Badge', Badge)
    app.component('DateTimeFormatter', DateTimeFormatter)
    app.component('PercentFormatter', PercentFormatter)

    app.component('PassedIcon', PassedIcon)
    app.component('FailedIcon', FailedIcon)
    app.component('SkippedIcon', SkippedIcon)
    app.component('PendingIcon', PendingIcon)
    app.component('FlakyIcon', FlakyIcon)

    app.component('SuitesDurationBarChart', SuitesDurationBarChart)

    app.component('ReportInfo', ReportInfo)
    app.component('EnvironmentInfo', EnvironmentInfo)
    app.component('SummaryView', SummaryView)

    app.component('TestInsightsInfo', TestInsightsInfo)
    app.component('InsightsView', InsightsView)

    app.component('TestTreeView', TestTreeView)
    app.component('TreeNodesInfo', TreeNodeArrayInfo)
    app.component('TreeNodeInfo', TreeNodeInfo)

    app.component('TimelineChart', TimelineChart)

    app.component('TestDetail', TestDetail)
  }
}