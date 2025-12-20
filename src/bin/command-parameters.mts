import type { Command } from 'commander';

const DEFAULT_OUTPUT_PATH = '.ctrf/report';

interface CommandOptions {
  outputPath: string;
}

interface CommandArguments {
  inputFilePath: string;
  outputPath: string;
}

const commanderToCommandArguments = (command: Command): CommandArguments => {
  const options = command.opts() as CommandOptions;
  return {
    inputFilePath: command.args[0] as string, // argument is required, so this cast is safe
    outputPath: options.outputPath || DEFAULT_OUTPUT_PATH,
  };
};

export {
  type CommandArguments,
  type CommandOptions,
  commanderToCommandArguments,
  DEFAULT_OUTPUT_PATH,
};
