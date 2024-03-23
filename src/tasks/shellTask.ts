// noinspection ExceptionCaughtLocallyJS

import { spawn } from 'child_process';
import color from 'picocolors';
import { Constants } from '../constants';
import {
  confirm,
  logMessageGray,
  startSpinner,
  stopSpinner,
} from '../prompter';
import { ShellTaskType } from '../types/mod.types';
import { getErrMessage } from '../utils/getErrMessage';
import { parseArgs } from '../utils/parseArgs';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export async function shellTask(args: {
  configPath: string;
  packageName: string;
  task: ShellTaskType;
}): Promise<void> {
  const { task, packageName } = args;

  for (const action of task.actions) {
    if (action.when && !satisfies(variables.getStore(), action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
        error: false,
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
      error: false,
    });
    try {
      let command: string, args: string[];
      if (action.args) {
        command = action.command;
        args = action.args;
      } else {
        const cmdWithArgs = parseArgs(action.command);
        command = cmdWithArgs[0];
        args = cmdWithArgs.slice(1);
      }

      if (packageName !== Constants.UPGRADE_CONFIG_FILE_NAME) {
        const isAllowed = await confirm(
          `requesting permission to run ${color.yellow(command + ' ' + args.join(' '))}`,
          {
            positive: 'allow',
            negative: 'skip',
          }
        );
        if (!isAllowed) {
          setState(action.name, {
            state: 'skipped',
            reason: 'user denied',
            error: false,
          });
          logMessageGray(
            `skipped running ${color.yellow(command + ' ' + args.join(' '))}`
          );
          continue;
        }
      }
      let output = '';
      startSpinner(`running ${color.yellow(command + ' ' + args.join(' '))}`);
      let exitCode: number | undefined = undefined;
      try {
        exitCode = await new Promise<number>((resolve, reject) => {
          try {
            const child = spawn(command, args);
            child.stdout.on('data', chunk => {
              output += chunk;
            });
            child.stderr.on('data', chunk => {
              output += chunk;
            });
            // child.stdout.pipe(process.stdout);
            // child.stderr.pipe(process.stderr);
            child.on('close', code => {
              resolve(code);
            });
          } catch (e) {
            reject(e);
          }
        });
      } finally {
        if (action.name) variables.set(`${action.name}.output`, output);
        if (exitCode == null) {
          // throwing error
          stopSpinner(
            `run failed using ${color.yellow(command + ' ' + args.join(' '))}`
          );
        }
      }
      if (exitCode != 0) {
        stopSpinner(
          `run failed using ${color.yellow(command + ' ' + args.join(' '))}`
        );
        throw new Error(`process exit with non zero exit code (${exitCode})`);
      } else {
        stopSpinner(`run ${color.yellow(command + ' ' + args.join(' '))}`);
      }
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
        error: true,
      });
      throw e;
    }
  }
}

export const runTask = shellTask;

export const summary = 'shell execution';
