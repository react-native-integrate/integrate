import color from 'picocolors';
import semver from 'semver/preload';
import {
  confirm,
  log,
  logError,
  logInfo,
  logSuccess,
  logWarning,
  startSpinner,
  stopSpinner,
} from './prompter';
import { AnalyzedPackages, LockProjectData } from './types/integrator.types';
import { IntegrationConfig, PackageWithConfig } from './types/mod.types';
import { analyzePackages } from './utils/analyzePackages';
import { getErrMessage } from './utils/getErrMessage';
import { getPackageConfig } from './utils/getPackageConfig';
import { logInfoNote } from './utils/logInfoNote';
import { parseConfig } from './utils/parseConfig';
import { runTask } from './utils/runTask';
import { satisfies } from './utils/satisfies';
import { setState } from './utils/setState';
import { taskManager } from './utils/taskManager';
import { topologicalSort } from './utils/topologicalSort';
import { updateIntegrationStatus } from './utils/updateIntegrationStatus';
import { getText, transformTextInObject, variables } from './variables';

export async function integrate(packageName?: string): Promise<void> {
  startSpinner('analyzing packages');
  const analyzedPackages = analyzePackages(packageName);
  const { deletedPackages, installedPackages, integratedPackages } =
    analyzedPackages;
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
  let packagesToIntegrate: PackageWithConfig[] = [];
  if (newPackages.length) {
    const globalInfo = [];
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
      else {
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
        if (config.minRNVersion) {
          const rnVersionEntry = installedPackages.find(
            entry => entry[0] === 'react-native'
          );
          if (
            !rnVersionEntry ||
            semver.lt(
              semver.coerce(rnVersionEntry[1]) || '0.0.0',
              semver.coerce(config.minRNVersion) || '0.0.0'
            )
          ) {
            stopSpinner('checked package configuration');
            logWarning(
              `${color.bold(
                color.blue(packageName)
              )} requires React Native version ${color.bold(
                color.blue(config.minRNVersion)
              )}`
            );
            return;
          }
        }
        if (config.dependencies?.length) {
          let warn = null;
          const packageInfo = [];
          for (const dependentPackageName of config.dependencies) {
            // check if dependency is not integrated and not already in new package list
            const isInNewPackages = newPackages.every(
              ([packageName]) => packageName != dependentPackageName
            );
            const isNotIntegrated = integratedPackages.every(
              ([packageName]) => packageName != dependentPackageName
            );
            if (isInNewPackages && isNotIntegrated) {
              //check if dependent is installed
              const installedPackage = installedPackages.find(
                ([packageName]) => packageName == dependentPackageName
              );
              if (!installedPackage) {
                warn = `${color.bold(
                  color.blue(dependentPackageName)
                )} is not installed - please install it first and try again`;
                break;
              } else {
                // installed but not new, force add as new
                newPackages.push(installedPackage);
                packageInfo.push(
                  `${color.bold(color.blue(dependentPackageName))}`
                );
              }
            }
          }
          if (warn) {
            stopSpinner('checked package configuration');
            logWarning(
              `${color.bold(
                color.blue(packageName)
              )} has dependencies that require integration: \n${warn}`
            );
            return;
          } else if (packageInfo.length) {
            globalInfo.push(
              `${color.bold(
                color.blue(packageName)
              )} has dependencies that require integration: ${getInnerLogList(
                packageInfo
              )}`
            );
          }
        }
        packagesToIntegrate.push({
          packageName,
          version,
          configPath,
          config,
        });
      }
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
    if (globalInfo.length) globalInfo.forEach(logInfo);
  }
  if (packagesToIntegrate.length) {
    packagesToIntegrate = topologicalSort(packagesToIntegrate);
    for (let i = 0; i < packagesToIntegrate.length; i++) {
      const { packageName, version, configPath, config } =
        packagesToIntegrate[i];

      logInfo(
        color.bold(color.bgBlue(' new package ')) +
          color.bold(color.blue(` ${packageName} `))
      );
      if (await confirm('would you like to integrate this package?')) {
        variables.clear(); // reset variables
        if (config.env) {
          Object.entries(config.env).forEach(([name, value]) =>
            variables.set(name, transformTextInObject(value))
          );
        }

        let failedTaskCount = 0,
          completedTaskCount = 0;
        await logInfoNote(config.preInfo);

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
            logInfo(
              color.bold(color.inverse(color.cyan(' task '))) +
                color.bold(color.cyan(` ${task.label || task.type} `))
            );
          }
          await logInfoNote(task.preInfo);

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

function getInnerLogList(strings: string[]): string {
  return strings.reduce((o, s, index) => {
    return o + color.gray(index == strings.length - 1 ? '\n└ ' : '\n├ ') + s;
  }, '');
}
