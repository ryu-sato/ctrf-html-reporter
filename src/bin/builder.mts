import { fileURLToPath } from 'url';
import { build } from 'vitepress';
import path from 'path';
import type { CommandArguments } from './command-parameters.mjs';

const resolveOutputPath = (outputPath: string): string => {
  return path.resolve(process.cwd(), outputPath);
};

const resolveReporterPath = (): string => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.resolve(__dirname, 'reporter');
};

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
