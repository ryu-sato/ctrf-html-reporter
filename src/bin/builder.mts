import { fileURLToPath } from 'url';
import { build } from 'vitepress';
import path from 'path';
import type { CommandArguments } from './command-parameters.mjs';

const buildReport = (commandArgs: CommandArguments) => {
  console.log(`Processing report file...: ${commandArgs.inputFilePath}`);

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Set the report path as an environment variable for VitePress data loaders
  process.env.CTRF_REPORT_PATH = commandArgs.inputFilePath;

  const reporterPath = path.resolve(__dirname, 'reporter');
  build(reporterPath);
};

export {
  buildReport,
};
