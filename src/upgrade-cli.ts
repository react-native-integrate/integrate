import { Command } from 'commander';
import 'isomorphic-fetch';
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
  .name('upgrade')
  .description(
    'Upgrade React Native project. Re-integrate previously integrated modules and apply own changes.'
  )
  .option('-d, --debug', 'enables verbose logging', false)
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
  })
  .showHelpAfterError();

program.parseAsync().catch(console.warn);
