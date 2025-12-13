import { Command } from 'commander';
import { version, description } from './package-info.mjs';

const program = new Command();

program
  .version(version)
  .description(description)
  .action((options) => {
    console.log('Hello World!');
  });

program.parse(process.argv);
