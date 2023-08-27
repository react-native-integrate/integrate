import { Command } from 'commander';
import { version } from '../package.json';
import { integrate } from './integrate';
import { options } from './options';

const program = new Command();

program
  .version(version)
  .name('integrate')
  .option('-d, --debug', 'enables verbose logging', false)
  .action(args => {
    options.set(args);
    integrate();
  });

program.parse();

// Function code for CLI goes here
