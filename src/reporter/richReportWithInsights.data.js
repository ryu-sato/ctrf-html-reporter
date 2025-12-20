import { readReportFromFile, enrichReportWithInsights } from 'ctrf';
import { resolve } from 'path';

export default {
  async load() {
    try {
      // Resolve the path to the report file
      // Use environment variable if set, otherwise fall back to sample file
      const reportPath = resolve(process.cwd(), process.env.CTRF_REPORT_PATH || 'sample-ctrf-result.json');

      const report = await readReportFromFile(reportPath);
      const richReportWithInsights = enrichReportWithInsights(report, []);
      return richReportWithInsights;
    } catch (error) {
      console.error('Failed to load CTRF report:', error);
      return {
        error: error.message,
      };
    }
  }
};
