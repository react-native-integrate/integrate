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
  .argument('[package-name]', 'Package name to integrate')
  .option('-d, --debug', 'enables verbose logging', false)
  .action(async (packageName, args) => {
    options.set(args);
    logIntro();
    await integrate(packageName);
    logOutro();
  });

program.parseAsync().catch(console.warn);
