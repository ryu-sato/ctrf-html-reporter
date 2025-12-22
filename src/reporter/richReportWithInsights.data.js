import { enrichReportWithInsights } from 'ctrf';
import { loadCtrfReport } from './loadCtrfReport.js';
import { loadPreviousCtrfReports } from './loadPreviousCtrfReport.js';
import { loadBaselineCtrfReport } from './loadBaselineCtrfReport.js';

// ref. https://github.com/ctrf-io/ctrf-core-js/blob/e29dacd83f9ea8c0aebcd5311d854645c4adf77f/src/methods/run-insights.ts#L573-L586
function isIncludedInPreviousReports(baselineReport, previousReports) {
  const baselineStart = baselineReport.results?.summary?.start;
  return previousReports.some(
    report => report.results?.summary?.start === baselineStart
  );
}

export default {
  async load() {
    const report = await loadCtrfReport();
    if (report.error) {
      return report;
    }
    const previousReports = await loadPreviousCtrfReports();
    const baselineReport = await loadBaselineCtrfReport();

    // Validate baseline report is included in previousReports for trend analysis
    let validatedBaselineReport = baselineReport;
    if (baselineReport && !baselineReport.error && isIncludedInPreviousReports(baselineReport, previousReports) === false) {
      console.warn(
        'Warning: Baseline report is not included in previous reports. ' +
        'For trend analysis, the baseline report must be part of the previous reports. ' +
        'Baseline comparison will be ignored. ' +
        'Please ensure BASELINE_CTRF_REPORT_PATH points to a report that is also included in PREVIOUS_CTRF_REPORT_PATH.'
      );
      validatedBaselineReport = undefined;
    }

    const richReportWithInsights = enrichReportWithInsights(report, previousReports, validatedBaselineReport);
    return richReportWithInsights;
  }
};
