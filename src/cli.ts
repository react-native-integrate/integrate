import { Command } from 'commander';
import 'isomorphic-fetch';
import { version } from '../package.json';
import { integrate } from './integrate';
import { options } from './options';
import { logIntro, logOutro } from './prompter';

const program = new Command();

program
  .version(version)
  .name('integrate')
  .option('-d, --debug', 'enables verbose logging', false)
  .action(async args => {
    logIntro();
    options.set(args);
    await integrate();
    logOutro();
  });

program.parseAsync().catch(console.warn);
