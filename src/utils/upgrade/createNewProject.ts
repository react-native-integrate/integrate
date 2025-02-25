import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../constants';
import {
  getLastLine,
  logMessage,
  startSpinner,
  stopSpinner,
  text,
  updateSpinner,
} from '../../prompter';
import { variables } from '../../variables';
import { getIosProjectName } from '../getIosProjectPath';
import { getProjectPath } from '../getProjectPath';

export async function createNewProject(): Promise<boolean> {
  // prepare workspace in tmp folder
  const tmpDir = os.tmpdir();
  const workspaceDir = path.join(tmpDir, Constants.TMP_WORKSPACE_DIR);

  fs.mkdirSync(workspaceDir, { recursive: true });

  // confirm command to create project
  let createCommand = `npx @react-native-community/cli@latest init ${getIosProjectName()}`;
  createCommand = await text('Enter command to create the new project', {
    initialValue: createCommand,
    defaultValue: createCommand,
    placeholder: createCommand,
  });

  // parse new project name from command
  const projectName = createCommand.match(/ init (\w+)/)?.[1];
  if (!projectName) throw new Error('could not find project name from command');

  const tmpProjectDir = path.join(workspaceDir, projectName);

  // make sure the tmp project folder does not exist
  if (fs.existsSync(tmpProjectDir)) {
    fs.rmSync(tmpProjectDir, { recursive: true, force: true });
  }

  logMessage(`creating new project at ${color.yellow(tmpProjectDir)}`);

  startSpinner('running cli');
  // execute command
  let isDone = false;
  const exitCode = await new Promise<number>(resolve => {
    const parts = createCommand.split(' ');
    const command = parts[0];
    const child = spawn(command, parts.slice(1), {
      shell: process.platform == 'win32',
      cwd: workspaceDir,
    });
    child.stdout.on('data', (chunk: Buffer) => {
      if (isDone) return;
      updateSpinner(
        `running cli ${color.gray(getLastLine(chunk.toString('utf8')))}`
      );
    });
    child.stderr.on('data', (chunk: Buffer) => {
      if (isDone) return;
      updateSpinner(
        `running command ${color.gray(getLastLine(chunk.toString('utf8')))}`
      );
    });
    child.stdin.write('n'); // do not install cocoapods
    child.stdin.end();

    child.on('close', code => {
      resolve(code ?? 0);
    });
  });
  isDone = true;

  if (exitCode !== 0) {
    stopSpinner(
      `${color.red('could not create project, command exit with ')}${color.yellow(exitCode?.toString())}`
    );
    return false;
  }

  stopSpinner('run create command');

  variables.setPredefined('__OLD_PROJECT_DIR__', getProjectPath());
  process.chdir(tmpProjectDir);

  return true;
}
