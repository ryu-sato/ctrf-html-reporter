import { fileURLToPath } from 'url';
import { build } from 'vitepress';
import path from 'path';
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

  // Set the report path as an environment variable for VitePress data loaders
  process.env.CTRF_REPORT_PATH = commandArgs.inputFilePath;

  const reporterPath = resolveReporterPath();
  const outputPath = resolveOutputPath(commandArgs.outputPath);
  build(reporterPath, { outDir: outputPath });
};

export {
  buildReport,
  resolveOutputPath,
  resolveReporterPath,
};
