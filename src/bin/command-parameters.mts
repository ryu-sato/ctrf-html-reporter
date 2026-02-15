import type { Command } from 'commander';

const DEFAULT_OUTPUT_PATH = '.ctrf/report';
const DEFAULT_PREVIOUS_REPORT_PATH: string | undefined = undefined;
const DEFAULT_BASELINE_REPORT_PATH: string | undefined = undefined;

interface CommandOptions {
  outputPath: string;
  previousReportPath: string | undefined;
  baselineReportPath: string | undefined;
  singleFile: boolean;
}

interface CommandArguments {
  inputFilePath: string;
  outputPath: string;
  previousReportPath: string | undefined;
  baselineReportPath: string | undefined;
  singleFile: boolean;
}

const commanderToCommandArguments = (command: Command): CommandArguments => {
  const options = command.opts() as CommandOptions;
  const singleFile = options.singleFile ?? false;
  return {
    inputFilePath: command.args[0] as string, // argument is required, so this cast is safe
    outputPath: options.outputPath || DEFAULT_OUTPUT_PATH,
    previousReportPath: options.previousReportPath || DEFAULT_PREVIOUS_REPORT_PATH,
    baselineReportPath: options.baselineReportPath || DEFAULT_BASELINE_REPORT_PATH,
    singleFile,
  };
};

export {
  type CommandArguments,
  type CommandOptions,
  commanderToCommandArguments,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PREVIOUS_REPORT_PATH,
  DEFAULT_BASELINE_REPORT_PATH,
};
