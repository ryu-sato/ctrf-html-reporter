#!/usr/bin/env node
import { Command } from 'commander';
import { version, description } from './package-info.mjs';
import {
  commanderToCommandArguments,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PREVIOUS_REPORT_PATH,
  DEFAULT_BASELINE_REPORT_PATH,
 } from './command-parameters.mjs';
import { buildReport, buildFileReport } from './builder.mjs';

const program = new Command();

program
  .version(version)
  .description(description)
  .argument('<report.ctrf.json>', 'Path to the CTRF report file')
  .option('-o, --output-path <path>', 'Output path for the HTML report', DEFAULT_OUTPUT_PATH)
  .option('-p, --previous-report-path <path or glob pattern or directory>', 'Path to previous CTRF report file(s) or directory for comparison', DEFAULT_PREVIOUS_REPORT_PATH)
  .option('-b, --baseline-report-path <path>', 'Path to the baseline CTRF report file', DEFAULT_BASELINE_REPORT_PATH)
  .option('-s, --single-file', 'Generate a single self-contained HTML file that can be opened directly in a browser via file://', false)
  .action(() => {
    const commandArgs = commanderToCommandArguments(program);
    if (commandArgs.singleFile) {
      buildFileReport(commandArgs);
    } else {
      buildReport(commandArgs);
    }
  });

program.parse(process.argv);
