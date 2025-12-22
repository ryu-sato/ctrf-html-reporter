import type { Command } from 'commander';

const DEFAULT_OUTPUT_PATH = '.ctrf/report';
const DEFAULT_PREVIOUS_REPORT_PATHS: string[] = [];
const DEFAULT_BASELINE_REPORT_PATH: string | undefined = undefined;

interface CommandOptions {
  outputPath: string;
  previousReportPaths: string[];
  baselineReportPath: string | undefined;
}

interface CommandArguments {
  inputFilePath: string;
  outputPath: string;
  previousReportPaths: string[];
  baselineReportPath: string | undefined;
}

const commanderToCommandArguments = (command: Command): CommandArguments => {
  const options = command.opts() as CommandOptions;
  return {
    inputFilePath: command.args[0] as string, // argument is required, so this cast is safe
    outputPath: options.outputPath || DEFAULT_OUTPUT_PATH,
    previousReportPaths: options.previousReportPaths || DEFAULT_PREVIOUS_REPORT_PATHS,
    baselineReportPath: options.baselineReportPath || DEFAULT_BASELINE_REPORT_PATH,
  };
};

export {
  type CommandArguments,
  type CommandOptions,
  commanderToCommandArguments,
  DEFAULT_OUTPUT_PATH,
  DEFAULT_PREVIOUS_REPORT_PATHS,
  DEFAULT_BASELINE_REPORT_PATH,
};
