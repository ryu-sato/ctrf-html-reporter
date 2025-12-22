#!/usr/bin/env node
import { Command } from 'commander';
import { version, description } from './package-info.mjs';
import {
  commanderToCommandArguments,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PREVIOUS_REPORT_PATH,
  DEFAULT_BASELINE_REPORT_PATH,
 } from './command-parameters.mjs';
import { buildReport } from './builder.mjs';

const program = new Command();

program
  .version(version)
  .description(description)
  .argument('<report.ctrf.json>', 'Path to the CTRF report file')
  .option('-o, --output-path <path>', 'Output path for the HTML report', DEFAULT_OUTPUT_PATH)
  .option('-p, --previous-reports <path or glob pattern or directory>', 'Path to previous CTRF report file(s) or directory for comparison', DEFAULT_PREVIOUS_REPORT_PATH)
  .option('-b, --baseline-report <path>', 'Path to the baseline CTRF report file', DEFAULT_BASELINE_REPORT_PATH)
  .action((options) => {
    const commandArgs = commanderToCommandArguments(program);
    buildReport(commandArgs);
  });

program.parse(process.argv);
