import { Command } from 'commander';
import 'isomorphic-fetch';
import { getInfo } from './getInfo';
import { integrate } from './integrate';
import { options } from './options';
import { logIntro, logOutro } from './prompter';

const { version } = require('../package.json');

const program = new Command();

program
  .version(version)
  .name('integrate')
  .description('Integrate new packages into your project.')
  .argument('[package-name]', 'Specify a package to integrate')
  .option('-d, --debug', 'enables verbose logging', false)
  .action(async (packageName, args) => {
    options.set(args);
    logIntro();
    await integrate(packageName);
    logOutro();
  })
  .showHelpAfterError();

program
  .command('info')
  .description('Get integration info about a package.')
  .argument('<package-name>', 'Package name to integrate')
  .action(async packageName => {
    logIntro('react-native-integrate - package information');
    await getInfo(packageName);
    logOutro('completed package information');
  });

program.parseAsync().catch(console.warn);
