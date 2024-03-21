import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../constants';
import { logError, logInfo, logMessageGray } from '../../prompter';
import { RunUpgradeTaskResult, UpgradeConfig } from '../../types/upgrade.types';
import { getText, transformTextInObject, variables } from '../../variables';
import { getErrMessage } from '../getErrMessage';
import { getProjectPath } from '../getProjectPath';
import { parseConfig } from '../parseConfig';
import { runTask } from '../runTask';
import { satisfies } from '../satisfies';
import { setState } from '../setState';
import { taskManager } from '../taskManager';

export async function runUpgradeTasks(): Promise<RunUpgradeTaskResult> {
  const configPath = path.join(
    getProjectPath(),
    Constants.UPGRADE_FOLDER_NAME,
    Constants.UPGRADE_CONFIG_FILE_NAME
  );
  if (!fs.existsSync(configPath)) {
    logMessageGray('skipped execution, no upgrade.yml found at .upgrade');
    return { didRun: false };
  }

  const packageName = Constants.UPGRADE_CONFIG_FILE_NAME;

  let config: UpgradeConfig;
  try {
    config = parseConfig(configPath) as UpgradeConfig;
  } catch (e) {
    logError(
      color.bold(color.bgRed(' error ')) +
        color.bold(color.blue(` ${packageName} `)) +
        color.red('could not parse package configuration\n') +
        color.gray(getErrMessage(e, 'validation')),
      true
    );
    return { didRun: false };
  }

  variables.clear(); // reset variables
  if (config.env) {
    Object.entries(config.env).forEach(([name, value]) =>
      variables.set(name, transformTextInObject(value))
    );
  }

  let failedTaskCount = 0,
    completedTaskCount = 0;

  for (const task of config.tasks) {
    if (
      task.when &&
      !satisfies(variables.getStore(), transformTextInObject(task.when))
    ) {
      setState(task.name, {
        state: 'skipped',
        error: false,
      });
      continue;
    }

    setState(task.name, {
      state: 'progress',
      error: false,
    });

    const isNonSystemTask = !taskManager.isSystemTask(task.type);
    if (isNonSystemTask) {
      if (task.label) task.label = getText(task.label);
      else task.label = taskManager.task[task.type].summary;
      logInfo(
        color.bold(color.inverse(color.cyan(' task '))) +
          color.bold(color.cyan(` ${task.label} `))
      );
    }

    try {
      await runTask({
        configPath,
        packageName,
        task,
      });
      completedTaskCount++;

      setState(task.name, {
        state: 'done',
        error: false,
      });
    } catch (e) {
      failedTaskCount++;
      const errMessage = getErrMessage(e);
      logError(errMessage);

      setState(task.name, {
        state: 'error',
        reason: errMessage,
        error: true,
      });
    }
  }

  return { didRun: true, failedTaskCount, completedTaskCount };
}
