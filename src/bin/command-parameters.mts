import type { Command } from 'commander';

interface CommandOptions {
  outputPath: string;
}

interface CommandArguments {
  inputFilePath: string;
}

const commanderToCommandArguments = (command: Command): CommandArguments => {
  return {
    inputFilePath: command.args[0] as string, // argument is required, so this cast is safe
  };
};

export {
  type CommandArguments,
  type CommandOptions,
  commanderToCommandArguments,
};
