import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { confirm, logMessage, logMessageGray, text } from '../prompter';
import { FsModifierType, FsTaskType } from '../types/mod.types';
import { getProjectPath } from '../utils/getProjectPath';
import { waitForFile } from '../utils/waitForFile';
import { getText, variables } from '../variables';

export async function fsTask(args: {
  configPath: string;
  packageName: string;
  task: FsTaskType;
}): Promise<void> {
  const { task } = args;

  for (const action of task.actions) {
    await applyFsModification(action);
  }
}

export async function applyFsModification(
  action: FsModifierType
): Promise<void> {
  if (action.copyFile) {
    action.copyFile = getText(action.copyFile);

    const file = await text(
      action.message || `enter the path of ${action.copyFile} to copy`,
      {
        placeholder: 'leave empty do it manually',
      }
    );
    variables.set('FILE_NAME', action.copyFile);
    if (file) {
      const fileName = path.basename(file);
      variables.set('FILE_NAME', fileName);
      action.destination = getText(action.destination);

      const projectPath = getProjectPath();
      const destination = path.join(projectPath, action.destination);
      // security check
      if (!destination.startsWith(projectPath)) {
        throw new Error('invalid destination path');
      }

      fs.copyFileSync(file, destination);
      logMessage(
        `copied ${color.yellow(file)} to ${color.yellow(action.destination)}`
      );
    } else {
      // user copying manually
      action.destination = getText(action.destination);
      const destination = path.join(getProjectPath(), action.destination);

      // wait for file creation
      const fileExists = await waitForFile(destination);
      if (!fileExists) {
        const confirmed = await confirm(
          `confirm after manually updating the file at ${color.yellow(
            action.destination
          )}`,
          {
            positive: 'done',
            negative: 'skip',
            initialValue: true,
          }
        );
        if (!confirmed) {
          logMessageGray('skipped copy operation');
        } else logMessage(`file was updated at ${color.yellow(destination)}`);
      }
    }
  }
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: FsTaskType;
}): Promise<void> {
  return fsTask(args);
}
