import { organizeTestsBySuite } from 'ctrf';
import { loadCtrfReport } from './loadCtrfReport.js';

export default {
  async load() {
    const report = await loadCtrfReport();
    if (report.error) {
      return report;
    }
    const tree = organizeTestsBySuite(report.results.tests);
    return tree;
  }
};
