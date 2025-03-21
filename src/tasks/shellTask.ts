// noinspection ExceptionCaughtLocallyJS

import { spawn } from 'child_process';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../constants';
import {
  confirm,
  getLastLine,
  logMessageGray,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from '../prompter';
import { ShellTaskType } from '../types/mod.types';
import { checkCondition } from '../utils/checkCondition';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { parseArgs } from '../utils/parseArgs';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export async function shellTask(args: {
  configPath: string;
  packageName: string;
  task: ShellTaskType;
}): Promise<void> {
  const { task, packageName } = args;

  for (const action of task.actions) {
    if (action.when && !checkCondition(action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
    });
    try {
      let command: string, args: string[], cwd: string;
      if (action.args) {
        command = action.command;
        args = action.args;
      } else {
        const cmdWithArgs = parseArgs(action.command);
        command = cmdWithArgs[0];
        args = cmdWithArgs.slice(1);
      }
      if (action.cwd) {
        const cwdPath = path.join(getProjectPath(), action.cwd);
        // security check
        if (!cwdPath.startsWith(getProjectPath())) {
          throw new Error('invalid cwd path');
        }
        cwd = cwdPath;
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
          });
          logMessageGray(
            `skipped running ${color.yellow(command + ' ' + args.join(' '))}`
          );
          continue;
        }
      }
      let output: string = '';
      startSpinner(`running ${color.yellow(command + ' ' + args.join(' '))}`);
      let exitCode: number | undefined = undefined;
      let isDone = false;
      try {
        exitCode = await new Promise<number>((resolve, reject) => {
          try {
            const child = spawn(command, args, {
              cwd,
              shell: process.platform == 'win32',
            });
            child.stdout.on('data', (chunk: Buffer) => {
              if (isDone) return;
              const partialOutput = chunk.toString('utf8');
              updateSpinner(
                `running ${color.yellow(command + ' ' + args.join(' '))} ${color.gray(getLastLine(partialOutput))}`
              );
              output += partialOutput;
            });
            child.stderr.on('data', (chunk: Buffer) => {
              if (isDone) return;
              const partialOutput = chunk.toString('utf8');
              updateSpinner(
                `running ${color.yellow(command + ' ' + args.join(' '))} ${color.gray(getLastLine(partialOutput))}`
              );
              output += partialOutput;
            });
            // child.stdout.pipe(process.stdout);
            // child.stderr.pipe(process.stderr);
            child.on('close', code => {
              resolve(code ?? 0);
            });
          } catch (e) {
            reject(e instanceof Error ? e : new Error(e?.toString() ?? ''));
          }
        });
      } finally {
        isDone = true;

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
      });
      throw e;
    }
  }
}

export const runTask = shellTask;

export const summary = 'shell execution';
