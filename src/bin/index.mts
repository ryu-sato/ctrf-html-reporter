#!/usr/bin/env node
import { Command } from 'commander';
import { version, description } from './package-info.mjs';
import { build } from 'vitepress';
import path from 'path';
import { fileURLToPath } from 'url';
import { commanderToCommandArguments } from './command-parameters.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .version(version)
  .description(description)
  .argument('<report.ctrf.json>', 'Path to the CTRF report file')
  .action((options) => {
    const commandArgs = commanderToCommandArguments(program); 
    console.log(`Processing report file...: ${commandArgs.inputFilePath}`);
    
    // Set the report path as an environment variable for VitePress data loaders
    process.env.CTRF_REPORT_PATH = commandArgs.inputFilePath;
    
    const reporterPath = path.resolve(__dirname, 'reporter');
    build(reporterPath);
  });

program.parse(process.argv);
