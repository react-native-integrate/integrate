import { spawn } from 'child_process';
import color from 'picocolors';
import {
  getLastLine,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from '../prompter';
import { getProjectPath } from './getProjectPath';

export type RunCommandOptions = {
  cwd?: string;
  progressText?: string;
  completeText?: string;
  errorText?: string;
  silent?: boolean;
};

export async function runCommand(
  commandName: string,
  args: string[],
  options: RunCommandOptions
): Promise<{ exitCode: number; output: string }>;
export async function runCommand(
  commandStr: string,
  options: RunCommandOptions
): Promise<{ exitCode: number; output: string }>;
export async function runCommand(
  ...args: [string, string[], RunCommandOptions] | [string, RunCommandOptions]
): Promise<{ exitCode: number; output: string }> {
  const options = (args.length === 3 ? args[2] : args[1]) || {};
  options.silent = options.silent ?? true;
  options.cwd = options.cwd ?? getProjectPath();

  const commandStr =
    args.length === 3 ? `${args[0]} ${args[1].join(' ')}` : args[0];
  const progressText = options.progressText || 'running command';
  const completeText =
    options.completeText || `run ${color.yellow(commandStr)} successfully`;
  const errorText =
    options.errorText || `running ${color.yellow(commandStr)} was failed`;
  if (!options.silent) startSpinner(progressText);

  let isDone = false;
  let output = '';
  const exitCode = await new Promise<number>(resolve => {
    const parts = commandStr.split(' ');
    const command = args.length === 3 ? args[0] : parts[0];
    const child = spawn(command, args.length === 3 ? args[1] : parts.slice(1), {
      shell: process.platform == 'win32',
      cwd: options.cwd,
    });
    child.stdout.on('data', (chunk: Buffer) => {
      if (isDone) return;
      const partialOutput = chunk.toString('utf8');
      if (!options.silent)
        updateSpinner(
          `${progressText} ${color.gray(getLastLine(partialOutput))}`
        );
      output += partialOutput;
    });
    child.stderr.on('data', (chunk: Buffer) => {
      if (isDone) return;
      const partialOutput = chunk.toString('utf8');
      if (!options.silent)
        updateSpinner(
          `${progressText} ${color.gray(getLastLine(partialOutput))}`
        );
      output += partialOutput;
    });

    child.on('close', code => {
      resolve(code ?? 0);
    });
  });
  isDone = true;

  if (!options.silent) {
    if (exitCode !== 0) {
      stopSpinner(
        `${color.red(`${errorText}, command exit with `)}${color.yellow(exitCode?.toString())}`
      );
    } else stopSpinner(completeText);
  }

  return {
    exitCode,
    output,
  };
}
