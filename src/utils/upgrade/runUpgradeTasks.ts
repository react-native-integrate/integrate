import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../constants';
import {
  logError,
  logInfo,
  logMessageGray,
  logWarning,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from '../../prompter';
import { RunUpgradeTaskResult, UpgradeConfig } from '../../types/upgrade.types';
import { getText, transformTextInObject, variables } from '../../variables';
import { getErrMessage } from '../getErrMessage';
import { getProjectPath } from '../getProjectPath';
import { parseConfig } from '../parseConfig';
import { runTask } from '../runTask';
import { satisfies } from '../satisfies';
import { setState } from '../setState';
import { taskManager } from '../taskManager';

export async function runUpgradeTasks(
  oldProjectPath: string | undefined,
  stage?: 'pre_install'
): Promise<RunUpgradeTaskResult> {
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

  if (stage && !config[stage]) return { didRun: false };

  variables.clear(); // reset variables
  if (config.env) {
    Object.entries(config.env).forEach(([name, value]) =>
      variables.set(name, transformTextInObject(value))
    );
  }

  let failedTaskCount = 0,
    completedTaskCount = 0;

  const imports = stage ? config[stage]!.imports : config.imports;
  if (imports) {
    logInfo(
      color.bold(color.inverse(color.cyan(' task '))) +
        color.bold(color.cyan(' Import files from old project '))
    );
    if (oldProjectPath) {
      startSpinner(`discovering files from ${color.yellow('old project')}`);

      const filesToCopy: string[] = [];
      const blackListedPaths = [
        'android',
        'ios',
        '.upgrade/',
        'node_modules/',
        'package.json',
        'integrate-lock.json',
      ];
      for (let i = 0; i < imports.length; i++) {
        updateSpinner(
          `discovering files from ${color.yellow('old project')} (${i + 1}/${imports.length})`
        );
        const relativePath = getText(imports[i]);
        if (
          blackListedPaths.some(p => {
            if (p.endsWith('/'))
              return (
                relativePath.startsWith(p) ||
                relativePath === p.substring(0, p.length - 1)
              );
            return relativePath === p;
          })
        ) {
          logWarning(
            `skipped import of ${color.yellow(relativePath)}, this path is handled internally so you can remove it from imports list.`
          );
          continue;
        }
        const importPath = path.join(oldProjectPath, relativePath);
        if (!fs.existsSync(importPath)) {
          logWarning(
            `skipped import of ${color.yellow(relativePath)}, path not found in old project`
          );
          continue;
        }
        const stat = fs.lstatSync(importPath);
        if (stat.isDirectory()) {
          filesToCopy.push(
            ...(await glob(importPath + '/**/*', { nodir: true, dot: true }))
          );
        } else {
          filesToCopy.push(importPath);
        }
      }
      for (let i = 0; i < filesToCopy.length; i++) {
        updateSpinner(
          `copying files from ${color.yellow('old project')} (${i + 1}/${filesToCopy.length})`
        );
        const file = filesToCopy[i];
        const relativePath = path.relative(oldProjectPath, file);
        const destination = path.join(getProjectPath(), relativePath);
        // ensure dir exists
        await new Promise(r =>
          fs.mkdir(path.dirname(destination), { recursive: true }, r)
        );
        await new Promise((res, rej) => {
          fs.copyFile(file, destination, err => {
            if (err) rej(err);
            else res(null);
          });
        });
      }
      stopSpinner(`copied ${color.yellow(filesToCopy.length)} files`);
      completedTaskCount++;
    } else {
      logMessageGray(
        'skipped importing from old project, no old project path specified'
      );
    }
  }

  const steps = stage ? config[stage]!.steps : config.steps;
  if (steps) {
    for (const task of steps) {
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

      const isNonSystemTask = !taskManager.isSystemTask(task.task);
      if (isNonSystemTask) {
        if (task.label) task.label = getText(task.label);
        else task.label = taskManager.task[task.task].summary;
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
  }
  return { didRun: true, failedTaskCount, completedTaskCount };
}
