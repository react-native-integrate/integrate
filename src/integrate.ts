import color from 'picocolors';
import {
  confirm,
  log,
  logError,
  logInfo,
  logNote,
  logSuccess,
  logWarning,
  startSpinner,
  stopSpinner,
} from './prompter';
import { AnalyzedPackages, LockProjectData } from './types/integrator.types';
import { IntegrationConfig } from './types/mod.types';
import { analyzePackages } from './utils/analyzePackages';
import { getErrMessage } from './utils/getErrMessage';
import { getPackageConfig } from './utils/getPackageConfig';
import { logInfoNote } from './utils/logInfoNote';
import { parseConfig } from './utils/parseConfig';
import { waitInputToContinue } from './utils/waitInputToContinue';
import { runPrompt } from './utils/runPrompt';
import { runTask } from './utils/runTask';
import { satisfies } from './utils/satisfies';
import { setState } from './utils/setState';
import { updateIntegrationStatus } from './utils/updateIntegrationStatus';
import { getText, transformTextInObject, variables } from './variables';

export async function integrate(packageName?: string): Promise<void> {
  startSpinner('analyzing packages');
  const analyzedPackages = analyzePackages(packageName);
  const { deletedPackages, installedPackages } = analyzedPackages;
  let { newPackages } = analyzedPackages;

  const shouldBreak = checkIfJustCreatedLockFile(analyzedPackages);
  let msg = `analyzed ${installedPackages.length} packages`;
  if (packageName) {
    // check if package is installed
    newPackages = newPackages.filter(
      ([newPackageName]) => newPackageName == packageName
    );
    if (
      installedPackages.every(
        ([installedPackageName]) => installedPackageName != packageName
      ) ||
      !newPackages.length
    ) {
      stopSpinner(msg);
      logWarning(
        `${color.bold(
          packageName
        )} is not installed - please install it first and try again`
      );
      return;
    }
  } else {
    if (shouldBreak) return;

    // get packages that need to be implemented
    if (newPackages.length || deletedPackages.length) {
      if (newPackages.length > 0) {
        msg += color.green(` | ${newPackages.length} new package(s)`);
      }
      if (deletedPackages.length > 0) {
        msg += color.gray(` | ${deletedPackages.length} deleted package(s)`);
      }
    } else {
      msg += ' | no changes';
    }
  }
  stopSpinner(msg);
  const packageLockUpdates: {
    packageName: string;
    lockProjectData: LockProjectData;
  }[] = [];
  const packagesToIntegrate: {
    packageName: string;
    version: string;
    configPath: string;
  }[] = [];
  if (newPackages.length) {
    startSpinner('checking package configuration');
    for (let i = 0; i < newPackages.length; i++) {
      const [packageName, version] = newPackages[i];
      const configPath = await getPackageConfig(packageName, {
        index: i,
        count: newPackages.length,
      });
      if (!configPath)
        packageLockUpdates.push({
          packageName,
          lockProjectData: {
            version,
            integrated: false,
          },
        });
      else
        packagesToIntegrate.push({
          packageName,
          version,
          configPath,
        });
    }
    let msg = 'checked package configuration';
    if (packageName) {
      if (packagesToIntegrate.length == 0) {
        stopSpinner(msg);
        logWarning(`${color.bold(packageName)} has no configuration specified`);
        return;
      }
    } else {
      if (packagesToIntegrate.length > 0) {
        msg += color.green(
          ` | ${packagesToIntegrate.length} package can be integrated`
        );
      } else {
        msg += ' | no configuration specified';
      }
    }
    stopSpinner(msg);
  }
  if (packagesToIntegrate.length) {
    for (let i = 0; i < packagesToIntegrate.length; i++) {
      const { packageName, version, configPath } = packagesToIntegrate[i];
      let config: IntegrationConfig;
      try {
        config = parseConfig(configPath);
      } catch (e) {
        logError(
          color.bold(color.bgRed(' error ')) +
            color.bold(color.blue(` ${packageName} `)) +
            color.red('could not parse package configuration\n') +
            color.gray(getErrMessage(e, 'validation')),
          true
        );
        continue;
      }
      logInfo(
        color.bold(color.bgBlue(' new package ')) +
          color.bold(color.blue(` ${packageName} `))
      );
      if (await confirm('would you like to integrate this package?')) {
        let failedTaskCount = 0,
          completedTaskCount = 0;
        await logInfoNote(config.preInfo);

        if (config.prompts)
          for (const prompt of config.prompts) {
            await runPrompt(prompt);
          }
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

          if (task.label) task.label = getText(task.label);
          logInfo(
            color.bold(color.inverse(color.cyan(' task '))) +
              color.bold(color.cyan(` ${task.label || task.type} `))
          );
          await logInfoNote(task.preInfo);

          if (task.prompts)
            for (const prompt of task.prompts) {
              await runPrompt(prompt);
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
            await logInfoNote(task.postInfo);
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
        await logInfoNote(config.postInfo);

        if (failedTaskCount) {
          logWarning(
            color.inverse(
              color.bold(color.yellow(' integrated with errors '))
            ) +
              color.bold(color.blue(` ${packageName} `)) +
              color.yellow(
                `failed to complete ${failedTaskCount} task(s) - please complete this integration manually`
              ),
            true
          );
        } else {
          logSuccess(
            color.inverse(color.bold(color.green(' integrated '))) +
              color.black(color.bold(color.blue(` ${packageName} `))) +
              color.green(
                `completed ${completedTaskCount} task(s) successfully`
              )
          );
        }
        packageLockUpdates.push({
          packageName,
          lockProjectData: {
            version,
            integrated: true,
          },
        });
      } else {
        packageLockUpdates.push({
          packageName,
          lockProjectData: {
            version,
            integrated: false,
          },
        });
        log(color.gray(color.italic('skipped package integration')));
      }
    }
  }
  for (let i = 0; i < deletedPackages.length; i++) {
    const [packageName, lockProjectData] = deletedPackages[i];
    lockProjectData.deleted = true;
    packageLockUpdates.push({
      packageName,
      lockProjectData,
    });
  }
  updateIntegrationStatus(packageLockUpdates);
}

function checkIfJustCreatedLockFile(analyzedPackages: AnalyzedPackages) {
  const { newPackages, justCreatedLockFile } = analyzedPackages;
  if (justCreatedLockFile) {
    if (!analyzedPackages.forceIntegratePackageName)
      stopSpinner(
        color.gray(color.italic('first run, skipped integration checks'))
      );

    const packageLockUpdates: {
      packageName: string;
      lockProjectData: LockProjectData;
    }[] = [];
    for (let i = 0; i < newPackages.length; i++) {
      const [packageName, version] = newPackages[i];
      packageLockUpdates.push({
        packageName,
        lockProjectData: {
          version,
          integrated: false,
        },
      });
    }
    updateIntegrationStatus(packageLockUpdates);
    return true;
  }
  return false;
}
