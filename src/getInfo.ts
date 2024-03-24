import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from './constants';
import {
  log,
  logInfo,
  logNote,
  logSuccess,
  logWarning,
  startSpinner,
  stopSpinner,
} from './prompter';
import { IntegrationConfig } from './types/mod.types';
import {
  getInstalledPackages,
  getPackageJsonPath,
} from './utils/getInstalledPackages';
import {
  getPackagePath,
  getRemoteFile,
  getRemotePath,
} from './utils/getPackageConfig';
import { getProjectPath } from './utils/getProjectPath';
import { parseConfig, parseConfigString } from './utils/parseConfig';
import { taskManager } from './utils/taskManager';

export async function getInfo(packageName: string): Promise<void> {
  logInfo(
    color.bold(color.bgBlue(' package ')) +
      color.bold(color.blue(` ${packageName} `))
  );
  const packageJsonPathExists = fs.existsSync(getPackageJsonPath());
  let localPathExists = false,
    localConfigPath: string | undefined;
  if (packageJsonPathExists) {
    const installedPackages = getInstalledPackages();
    const isInstalled = installedPackages.some(
      ([installedPackageName]) => installedPackageName == packageName
    );
    log(
      `package installation: ${
        isInstalled
          ? color.bold(color.green('exists'))
          : color.gray('not found')
      }\n${color.dim('in package.json')}`
    );

    localConfigPath = path.join(
      getPackagePath(packageName),
      Constants.CONFIG_FILE_NAME
    );
    localPathExists = fs.existsSync(localConfigPath);
    log(
      `local configuration: ${
        localPathExists
          ? color.bold(color.green('exists'))
          : color.gray('not found')
      }\n` + color.dim('at ' + localConfigPath.replace(getProjectPath(), '.'))
    );
  }

  const remotePath = getRemotePath(
    packageName,
    Constants.REMOTE_CONFIG_REPO_HOME
  );
  startSpinner('checking remote configuration file');
  const remoteFileContent = await getRemoteFile(getRemotePath(packageName));
  stopSpinner(
    (
      `remote configuration: ${
        remoteFileContent
          ? color.bold(color.green('exists'))
          : color.gray('not found')
      }\n` + color.dim('at ' + remotePath)
    ).replace(/\n/g, `\n${color.gray('│ ')} `)
  );

  let config: IntegrationConfig | undefined;
  if (localPathExists && localConfigPath) {
    config = parseConfig(localConfigPath) as IntegrationConfig;
  } else if (remoteFileContent)
    config = parseConfigString(
      remoteFileContent,
      'integrate'
    ) as IntegrationConfig;
  if (config) {
    const _config = config;
    logSuccess(
      color.inverse(color.bold(color.green(' exists '))) +
        color.black(color.bold(color.blue(` ${packageName} `))) +
        color.green('is ready and available for integration')
    );

    log(
      'tasks: ' +
        color.yellow(taskManager.getNonSystemTasks(_config.tasks).length) +
        '\n' +
        Object.entries(taskManager.task)
          .map(([taskType, value]) => {
            if (taskManager.isSystemTask(taskType)) return null;
            const configTasks = _config.tasks.filter(x => x.type == taskType);
            if (!configTasks.length) return null;
            let summary = value.summary;
            const actionCount = configTasks.reduce((n, o) => {
              if ('actions' in o) n += o.actions.length;
              return n;
            }, 0);
            if (actionCount) summary += ` | ${actionCount} action(s)`;
            return color.yellow(summary);
          })
          .filter(x => x)
          .join('\n')
    );
    if (packageJsonPathExists) {
      logNote(
        `npx react-native-integrate ${packageName}`,
        'run command to integrate'
      );
    }
  } else {
    logWarning(
      color.inverse(color.bold(color.yellow(' not found '))) +
        color.bold(color.blue(` ${packageName} `)) +
        color.yellow('is not available for integration'),
      true
    );
  }
}
