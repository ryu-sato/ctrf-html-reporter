import { readReportFromFile } from 'ctrf';
import { resolve } from 'path';

/**
 * Load baseline CTRF report from file using environment variable
 * @returns {Promise<Object>} The CTRF report object
 * @throws {Error} If the report fails to load
 */
export async function loadBaselineCtrfReport() {
  try {
    if (!process.env.BASELINE_CTRF_REPORT_PATH) {
      return undefined;
    }

    // Resolve the path to the report file
    // Use environment variable if set
    const reportPath = resolve(
      process.cwd(), 
      process.env.BASELINE_CTRF_REPORT_PATH,
    );

    const report = await readReportFromFile(reportPath);
    return report;
  } catch (error) {
    console.error('Failed to load CTRF report:', error);
    return {
      error: error.message,
    };
  }
}
