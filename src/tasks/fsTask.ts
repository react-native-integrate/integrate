import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { confirm, logMessage, logMessageGray, text } from '../prompter';
import { FsModifierType, FsTaskType } from '../types/mod.types';
import { handlePackageUpgradeCopyFile } from '../utils/copyPackageUpgradeFile';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { addPackageUpgradeFile } from '../utils/packageUpgradeConfig';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { waitForFile } from '../utils/waitForFile';
import { getText, variables } from '../variables';

export async function fsTask(args: {
  configPath: string;
  packageName: string;
  task: FsTaskType;
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
      await applyFsModification(action, packageName);
      setState(action.name, {
        state: 'done',
        error: false,
      });
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

export async function applyFsModification(
  action: FsModifierType,
  packageName: string
): Promise<void> {
  if ('copyFile' in action) {
    if (
      handlePackageUpgradeCopyFile(packageName, getText(action.destination))
    ) {
      return;
    }
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
      let fileExists;
      try {
        fileExists = await waitForFile(destination);
      } catch (e) {
        if (getErrMessage(e) == 'skip') {
          logMessageGray('skipped copy operation');
          return;
        } else throw e;
      }
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
    addPackageUpgradeFile(packageName, action.destination);
  }
  if ('removeFile' in action) {
    action.removeFile = getText(action.removeFile);

    const projectPath = getProjectPath();
    const destination = path.join(projectPath, action.removeFile);
    // security check
    if (!destination.startsWith(projectPath)) {
      throw new Error('invalid path to remove');
    }
    if (!fs.existsSync(action.removeFile)) {
      if (action.strict)
        throw new Error(`${color.yellow(action.removeFile)} does not exist`);
      else
        logMessageGray(
          `${color.yellow(action.removeFile)} does not exist, skipped remove operation`
        );
    } else {
      fs.rmSync(action.removeFile);
      logMessage(`removed ${color.yellow(action.removeFile)}`);
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

export const summary = 'File system operation';
