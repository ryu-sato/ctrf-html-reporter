import { readReportFromFile, organizeTestsBySuite } from 'ctrf';
import { resolve } from 'path';

export default {
  async load() {
    try {
      // Resolve the path to the sample report file
      // [TODO] CHANGE THIS TO DYNAMIC PATH
      const reportPath = resolve(process.cwd(), 'sample-ctrf-result.json');

      const report = await readReportFromFile(reportPath);
      const tree = organizeTestsBySuite(report.results.tests);
      return tree;
    } catch (error) {
      console.error('Failed to load CTRF report:', error);
      return {
        error: error.message,
      };
    }
  }
};
