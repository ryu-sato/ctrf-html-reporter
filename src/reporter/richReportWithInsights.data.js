import { enrichReportWithInsights } from 'ctrf';
import { loadCtrfReport } from './loadCtrfReport.js';

export default {
  async load() {
    const report = await loadCtrfReport();
    if (report.error) {
      return report;
    }
    const richReportWithInsights = enrichReportWithInsights(report, []);
    return richReportWithInsights;
  }
};
