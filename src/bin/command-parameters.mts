import type { Command } from 'commander';

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
    outputPath: options.outputPath || '.ctrf/report',
  };
};

export {
  type CommandArguments,
  type CommandOptions,
  commanderToCommandArguments,
};
