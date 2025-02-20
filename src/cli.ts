import { Command } from 'commander';
import 'isomorphic-fetch';
import { getInfo } from './getInfo';
import { integrate } from './integrate';
import { options } from './options';
import { logIntro, logOutro } from './prompter';
import { IntegratorOptions } from './types/integrator.types';
import { upgrade } from './upgrade';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('../package.json');

const program = new Command();

program
  .version(version as string)
  .name('integrate')
  .description('Integrate new packages into your project.')
  .argument('[package-name]', 'Specify a package to integrate')
  .option('-d, --debug', 'enables verbose logging', false)
  .action(async (packageName: string, args: IntegratorOptions) => {
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
  .action(async (packageName: string) => {
    logIntro('react-native-integrate - package information');
    await getInfo(packageName);
    logOutro('completed package information');
  });

program
  .command('upgrade')
  .description(
    'Upgrade React Native project. Re-integrate previously integrated modules and apply own changes.'
  )
  .action(async () => {
    logIntro('react-native-integrate - upgrade project');
    await upgrade();
    logOutro('completed project upgrade');
  });

program.parseAsync().catch(console.warn);
