import { readReportFromFile, readReportsFromDirectory, readReportsFromGlobPattern } from 'ctrf';
import { resolve } from 'path';
import { stat } from 'fs/promises';

/**
 * Load previous CTRF reports from path(s) using environment variable
 * Transparently handles file path, directory path, or glob pattern
 * @returns {Promise<Array<Object>>} Array of CTRF report objects
 * @throws {Error} If the reports fail to load
 */
export async function loadPreviousCtrfReports() {
  try {
    if (!process.env.PREVIOUS_CTRF_REPORTS) {
      return [];
    }

    const inputPath = process.env.PREVIOUS_CTRF_REPORTS;
    const resolvedPath = resolve(process.cwd(), inputPath);

    // Try to stat the path to determine if it's a file or directory
    let stats;
    try {
      stats = await stat(resolvedPath);
    } catch (error) {
      // If stat fails, treat as glob pattern
      try {
        const reports = readReportsFromGlobPattern(inputPath);
        return reports;
      } catch (globError) {
        console.error('Failed to load reports from glob pattern:', globError);
        throw globError;
      }
    }

    // If it's a file, read it directly
    if (stats.isFile()) {
      const report = readReportFromFile(resolvedPath);
      return [report];
    }

    // If it's a directory, read all JSON files in it
    if (stats.isDirectory()) {
      const reports = readReportsFromDirectory(resolvedPath);
      return reports;
    }

    throw new Error(`Invalid path type: ${resolvedPath}`);
  } catch (error) {
    console.error('Failed to load CTRF reports:', error);
    return [{
      error: error.message,
    }];
  }
}
