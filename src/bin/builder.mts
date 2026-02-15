import { fileURLToPath } from 'url';
import { build } from 'vitepress';
import path from 'path';
import fs from 'fs';
import { enrichReportWithInsights } from 'ctrf';
import type { CommandArguments } from './command-parameters.mjs';

/**
 * Resolves the output path to an absolute path based on the current working directory.
 * @param outputPath - The output path (relative or absolute) to resolve
 * @returns The resolved absolute path
 */
const resolveOutputPath = (outputPath: string): string => {
  return path.resolve(process.cwd(), outputPath);
};

/**
 * Resolves the reporter path to the 'reporter' directory relative to this module.
 * @returns The absolute path to the reporter directory
 */
const resolveReporterPath = (): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '..', 'reporter');
};

/**
 * Builds the HTML report using VitePress.
 * Sets the CTRF report path as an environment variable and builds the report
 * from the reporter directory to the specified output directory.
 * @param commandArgs - The command arguments containing input file path and output path
 */
const buildReport = (commandArgs: CommandArguments) => {
  console.log(`Processing report file...: ${commandArgs.inputFilePath}`);
  console.log(`Output path: ${commandArgs.outputPath}`);
  if (commandArgs.previousReportPath) {
    console.log(`Previous report: ${commandArgs.previousReportPath}`);
  }
  if (commandArgs.baselineReportPath) {
    console.log(`Baseline report: ${commandArgs.baselineReportPath}`);
  }

  // Set the report path as an environment variable for VitePress data loaders
  process.env.CTRF_REPORT_PATH = commandArgs.inputFilePath;
  if (commandArgs.previousReportPath) {
    process.env.PREVIOUS_CTRF_REPORT_PATH = commandArgs.previousReportPath;
  }
  if (commandArgs.baselineReportPath) {
    process.env.BASELINE_CTRF_REPORT_PATH = commandArgs.baselineReportPath;
  }

  const reporterPath = resolveReporterPath();
  const outputPath = resolveOutputPath(commandArgs.outputPath);
  build(reporterPath, { outDir: outputPath });
};

/**
 * Resolves the path to the pre-built file-browsable reporter template HTML.
 * @returns The absolute path to the template HTML file
 */
const resolveFileReportTemplatePath = (): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, '..', 'file-browsable-reporter', 'index.html');
};

/**
 * Builds a single self-contained HTML file report by injecting CTRF data
 * into the pre-built file-browsable reporter template.
 * The output HTML can be opened directly in a browser via file:// without CORS errors.
 * @param commandArgs - The command arguments containing input file path and output path
 */
const buildFileReport = (commandArgs: CommandArguments) => {
  console.log(`Processing report file...: ${commandArgs.inputFilePath}`);
  console.log(`Output path: ${commandArgs.outputPath}`);

  const inputPath = path.resolve(process.cwd(), commandArgs.inputFilePath);
  const outputPath = resolveOutputPath(commandArgs.outputPath);

  const rawReport = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
  const enrichedReport = enrichReportWithInsights(rawReport);

  const templatePath = resolveFileReportTemplatePath();
  const template = fs.readFileSync(templatePath, 'utf-8');

  const DATA_PLACEHOLDER = '<script type="application/json" id="ctrf-data">null</script>';
  const dataScript = `<script type="application/json" id="ctrf-data">${JSON.stringify(enrichedReport)}</script>`;
  const output = template.replace(DATA_PLACEHOLDER, dataScript);

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`Single-file report generated: ${outputPath}`);
};

export {
  buildReport,
  buildFileReport,
  resolveOutputPath,
  resolveReporterPath,
  resolveFileReportTemplatePath,
};
