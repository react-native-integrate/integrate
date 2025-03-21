import { Command } from 'commander';
import 'isomorphic-fetch';
import { options } from './options';
import { progress } from './progress';
import { logError, logIntro, logOutro } from './prompter';
import { IntegratorOptions } from './types/integrator.types';
import { upgrade } from './upgrade';
import { getErrMessage } from './utils/getErrMessage';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { version } = require('../package.json');

const program = new Command();

program
  .version(version as string)
  .name('upgrade')
  .description(
    'Upgrade React Native project. Re-integrate previously integrated modules and apply own changes.'
  )
  .option(
    '-m, --manual',
    'enables manual upgrade, you must run this command in the folder of the new created project',
    false
  )
  .option('-v, --verbose', 'enables verbose logging', false)
  .option('-i, --interactive', 'allow', false)
  .action(async (args: IntegratorOptions) => {
    options.set(args);
    logIntro('react-native-integrate - upgrade project');
    try {
      progress.setOptions({
        title: 'upgrading project',
        total: 8,
        step: 0,
      });
      if (!args.verbose) progress.display();
      await upgrade();
      progress.hide();
      logOutro('completed project upgrade');
    } catch (e) {
      progress.hide();
      const errMessage = getErrMessage(e);
      logError(errMessage);
      logOutro('project upgrade failed', true);
    }
  })
  .showHelpAfterError();

program.parseAsync().catch(console.warn);
