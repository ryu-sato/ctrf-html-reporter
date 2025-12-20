#!/usr/bin/env node
import { Command } from 'commander';
import { version, description } from './package-info.mjs';
import { commanderToCommandArguments } from './command-parameters.mjs';
import { buildReport } from './builder.mjs';

const program = new Command();

program
  .version(version)
  .description(description)
  .argument('<report.ctrf.json>', 'Path to the CTRF report file')
  .option('-o, --output-path <path>', 'Output path for the HTML report', '.ctrf/report')
  .action((options) => {
    const commandArgs = commanderToCommandArguments(program);
    buildReport(commandArgs);
  });

program.parse(process.argv);
