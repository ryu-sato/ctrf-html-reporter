import { sortReportsByTimestamp } from 'ctrf';
import { loadCtrfReport } from './loadCtrfReport.js';

export default {
  async load() {
    const report = await loadCtrfReport();
    if (report.error) {
      return report;
    }
    const sortedReportsByTimestamp = sortReportsByTimestamp([report], 'desc');
    return sortedReportsByTimestamp;
  }
};
