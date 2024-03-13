import { Command } from 'commander';
import 'isomorphic-fetch';
import { options } from './options';
import { logIntro, logOutro } from './prompter';
import { IntegratorOptions } from './types/integrator.types';
import { upgrade } from './upgrade';

const { version } = require('../package.json');

const program = new Command();

program
  .version(version as string)
  .name('upgrade')
  .description(
    'Upgrade React Native project. Re-integrate previously integrated modules and apply own changes.'
  )
  .option('-d, --debug', 'enables verbose logging', false)
  .action(async (args: IntegratorOptions) => {
    options.set(args);
    logIntro('react-native-integrate - upgrade project');
    await upgrade();
    logOutro('completed project upgrade');
  })
  .showHelpAfterError();

program.parseAsync().catch(console.warn);
