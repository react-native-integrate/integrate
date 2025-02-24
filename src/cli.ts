import { Command } from 'commander';
import 'isomorphic-fetch';
import { getInfo } from './getInfo';
import { integrate } from './integrate';
import { options } from './options';
import { logError, logIntro, logOutro } from './prompter';
import { IntegratorOptions } from './types/integrator.types';
import { upgrade } from './upgrade';
import { getErrMessage } from './utils/getErrMessage';

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
  .option(
    '-m, --manual',
    'enables manual upgrade, you must run this command in the folder of the new created project',
    false
  )
  .action(async (args: IntegratorOptions) => {
    options.set(args);
    logIntro('react-native-integrate - upgrade project');
    try {
      await upgrade();
      logOutro('completed project upgrade');
    } catch (e) {
      const errMessage = getErrMessage(e);
      logError(errMessage);
      logOutro('project upgrade failed', true);
    }
  });

program.parseAsync().catch(console.warn);
