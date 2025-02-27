import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import semver from 'semver/preload';
import { options } from './options';
import {
  logError,
  logInfo,
  logMessageGray,
  logSuccess,
  logWarning,
  startSpinner,
  stopSpinner,
  text,
} from './prompter';
import { LockProjectData } from './types/integrator.types';
import { IntegrationConfig, PackageWithConfig } from './types/mod.types';
import { analyzePackages } from './utils/analyzePackages';
import { checkCondition } from './utils/checkCondition';
import { getErrMessage } from './utils/getErrMessage';
import { getPackageConfig } from './utils/getPackageConfig';
import { getProjectPath } from './utils/getProjectPath';
import { parseConfig } from './utils/parseConfig';
import { runCommand } from './utils/runCommand';
import { runTask } from './utils/runTask';
import { setState } from './utils/setState';
import { taskManager } from './utils/taskManager';
import { topologicalSort } from './utils/topologicalSort';
import { updateIntegrationStatus } from './utils/updateIntegrationStatus';
import { createNewProject } from './utils/upgrade/createNewProject';
import { importFromOldProject } from './utils/upgrade/importFromOldProject';
import { installModules } from './utils/upgrade/other/importPackageJson';
import { runUpgradeTasks } from './utils/upgrade/runUpgradeTasks';
import { restoreBackupFiles } from './utils/upgrade/restoreBackupFiles';
import { validateOldProjectPath } from './utils/upgrade/validateOldProjectPath';
import { getText, transformTextInObject, variables } from './variables';

export async function upgrade(): Promise<void> {
  let stage = 1;
  const isManual = options.get().manual;
  if (!isManual) {
    const { output: gitStatus } = await runCommand('git status -s -uno', {
      silent: true,
    });
    if (gitStatus) {
      throw new Error(
        'your git status is dirty, please stash or commit changes before upgrading'
      );
    }
    logInfo(
      color.bold(color.inverse(color.magenta(` stage ${stage++} `))) +
        color.bold(color.magenta(' Create new project '))
    );

    const didCreate = await createNewProject();
    if (didCreate) {
      logSuccess(
        color.inverse(color.bold(color.green(' created '))) +
          color.green(' new project created successfully')
      );
    }
  }

  logInfo(
    color.bold(color.inverse(color.magenta(` stage ${stage++} `))) +
      color.bold(color.magenta(' Import old project data '))
  );
  // get old project path
  let oldProjectPath =
    variables.get<string>('__OLD_PROJECT_DIR__') ||
    (await text(
      'Enter old project path to import some basic data (display name, icons, etc.)',
      {
        placeholder: 'leave empty to skip',
        validate: validateOldProjectPath,
      }
    ));
  if (oldProjectPath) {
    oldProjectPath = path.resolve(oldProjectPath);
    const didImport = await importFromOldProject(oldProjectPath);
    if (didImport) {
      logSuccess(
        color.inverse(color.bold(color.green(' imported '))) +
          color.green(' imported project data successfully')
      );
    }
  } else {
    logMessageGray('skipping import from old project');
  }

  logInfo(
    color.bold(color.inverse(color.magenta(` stage ${stage++} `))) +
      color.bold(color.magenta(' Execute upgrade.yml pre install steps '))
  );
  variables.setPredefined('__UPGRADE__', true);

  const upgradePreInstallResult = await runUpgradeTasks(
    oldProjectPath,
    'pre_install'
  ).catch((e: Error) => {
    logWarning(e.message);
  });
  if (upgradePreInstallResult && upgradePreInstallResult.didRun) {
    if (upgradePreInstallResult.failedTaskCount) {
      logWarning(
        color.inverse(color.bold(color.yellow(' executed with errors '))) +
          color.bold(color.blue(' upgrade.yml pre_install ')) +
          color.yellow(
            `failed to complete ${upgradePreInstallResult.failedTaskCount} task(s) - please complete upgrade manually`
          ),
        true
      );
    } else {
      logSuccess(
        color.inverse(color.bold(color.green(' executed '))) +
          color.black(color.bold(color.blue(' upgrade.yml pre_install '))) +
          color.green(
            `completed ${upgradePreInstallResult.completedTaskCount} task(s) successfully`
          )
      );
    }
  }

  await installModules(oldProjectPath);

  logInfo(
    color.bold(color.inverse(color.magenta(` stage ${stage++} `))) +
      color.bold(color.magenta(' Re-integrate packages '))
  );

  let skipStage3 = false;
  startSpinner('analyzing packages');
  const analyzedPackages = analyzePackages();
  const { installedPackages, integratedPackages } = analyzedPackages;

  if (analyzedPackages.justCreatedLockFile) {
    stopSpinner(
      color.gray(
        color.italic('integrate-lock.json not found. Nothing to re-integrate.')
      )
    );
    skipStage3 = true;
  }

  if (!skipStage3) {
    stopSpinner(`analyzed ${installedPackages.length} packages`);

    const packageLockUpdates: {
      packageName: string;
      lockProjectData: LockProjectData;
    }[] = [];
    let packagesToIntegrate: PackageWithConfig[] = [];

    startSpinner('checking package configuration');
    for (let i = 0; i < integratedPackages.length; i++) {
      const [packageName] = integratedPackages[i];
      const installedPackage = installedPackages.find(
        ([installedPackageName]) => installedPackageName === packageName
      );
      if (!installedPackage) {
        logWarning(
          `Skipping integration of ${color.bold(
            color.blue(packageName)
          )} because it is not installed.`
        );
        continue;
      }
      const version = installedPackage[1];
      const configPath = await getPackageConfig(packageName, {
        index: i,
        count: integratedPackages.length,
      });
      if (!configPath) {
        logWarning(
          `Skipping integration of ${color.bold(
            color.blue(packageName)
          )} because currently it has no configuration.`
        );
        continue;
      }
      let config: IntegrationConfig;
      try {
        config = parseConfig(configPath) as IntegrationConfig;
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

      const rnVersionEntry = installedPackages.find(
        entry => entry[0] === 'react-native'
      );
      if (!rnVersionEntry) {
        stopSpinner('checked package configuration');
        logWarning('React Native not installed!?');
        return;
      }
      const rnVersion = rnVersionEntry[1];
      const semRnVersion = semver.coerce(rnVersion);
      if (!semRnVersion) {
        stopSpinner('checked package configuration');
        logWarning(`React Native version (${rnVersion}) is invalid!?`);
        return;
      }
      variables.setPredefined('RN_VERSION', {
        major: semRnVersion.major,
        minor: semRnVersion.minor,
        patch: semRnVersion.patch,
      });
      if (config.minRNVersion) {
        if (
          semver.lt(semRnVersion, semver.coerce(config.minRNVersion) || '0.0.0')
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
      if (config.minVersion) {
        if (
          semver.lt(
            semver.coerce(version) || '0.0.0',
            semver.coerce(config.minVersion) || '0.0.0'
          )
        ) {
          stopSpinner('checked package configuration');
          logWarning(
            `${color.bold(color.blue(packageName))} requires version ${color.bold(
              color.blue(config.minVersion)
            )} - please update it first and try again`
          );
          return;
        }
      }
      if (config.dependencies?.length) {
        for (const dependentPackageName of config.dependencies) {
          // check if dependency is not integrated
          const isNotIntegrated = integratedPackages.every(
            ([packageName]) => packageName != dependentPackageName
          );
          if (isNotIntegrated) {
            stopSpinner('checked package configuration');
            logWarning(
              `Skipping integration of ${color.bold(
                color.blue(packageName)
              )} because the dependant package ${color.bold(
                color.blue(dependentPackageName)
              )} is not integrated.`
            );
            return;
          }
        }
      }
      packagesToIntegrate.push({
        packageName,
        version,
        configPath,
        config,
      });
    }
    let msg = 'checked package configuration';
    if (packagesToIntegrate.length > 0) {
      msg += color.green(
        ` | ${packagesToIntegrate.length} package will be re-integrated`
      );
    } else {
      msg += ' | no packages to integrate';
    }
    stopSpinner(msg);
    if (packagesToIntegrate.length) {
      packagesToIntegrate = topologicalSort(packagesToIntegrate);
      for (let i = 0; i < packagesToIntegrate.length; i++) {
        const { packageName, version, configPath, config } =
          packagesToIntegrate[i];

        logInfo(
          color.bold(color.bgBlue(' package ')) +
            color.bold(color.blue(` ${packageName} `))
        );

        variables.clear(); // reset variables
        if (config.env) {
          Object.entries(config.env).forEach(([name, value]) =>
            variables.set(name, transformTextInObject(value))
          );
        }

        let failedTaskCount = 0,
          completedTaskCount = 0;

        for (const task of config.steps) {
          if (task.when && !checkCondition(task.when)) {
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

        if (failedTaskCount) {
          logWarning(
            color.inverse(
              color.bold(color.yellow(' re-integrated with errors '))
            ) +
              color.bold(color.blue(` ${packageName} `)) +
              color.yellow(
                `failed to complete ${failedTaskCount} task(s) - please complete this integration manually`
              ),
            true
          );
        } else {
          logSuccess(
            color.inverse(color.bold(color.green(' re-integrated '))) +
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
      }
    }

    updateIntegrationStatus(packageLockUpdates);
  }

  logInfo(
    color.bold(color.inverse(color.magenta(` stage ${stage++} `))) +
      color.bold(color.magenta(' Import files from .upgrade/imports '))
  );

  const didRestore = await restoreBackupFiles().catch((e: Error) => {
    logWarning(e.message);
  });
  if (didRestore) {
    logSuccess(
      color.inverse(color.bold(color.green(' imported '))) +
        color.green(' files were imported successfully')
    );
  }

  logInfo(
    color.bold(color.inverse(color.magenta(` stage ${stage++} `))) +
      color.bold(color.magenta(' Execute upgrade.yml steps '))
  );

  const upgradeResult = await runUpgradeTasks(oldProjectPath).catch(
    (e: Error) => {
      logWarning(e.message);
    }
  );
  if (upgradeResult && upgradeResult.didRun) {
    if (upgradeResult.failedTaskCount) {
      logWarning(
        color.inverse(color.bold(color.yellow(' executed with errors '))) +
          color.bold(color.blue(' upgrade.yml ')) +
          color.yellow(
            `failed to complete ${upgradeResult.failedTaskCount} task(s) - please complete upgrade manually`
          ),
        true
      );
    } else {
      logSuccess(
        color.inverse(color.bold(color.green(' executed '))) +
          color.black(color.bold(color.blue(' upgrade.yml '))) +
          color.green(
            `completed ${upgradeResult.completedTaskCount} task(s) successfully`
          )
      );
    }
  }

  if (!isManual) {
    logInfo(
      color.bold(color.inverse(color.magenta(` stage ${stage++} `))) +
        color.bold(color.magenta(' Commit changes to branch '))
    );

    const rnVersionVar = variables.get('RN_VERSION');
    const rnVersion = `${rnVersionVar.major}.${rnVersionVar.minor}.${rnVersionVar.patch}`;
    const branchName = `upgrade/react-native-${rnVersion}`;
    // checkout into new branch
    const { exitCode: didCheckoutFail } = await runCommand(
      `git checkout -B ${branchName}`,
      {
        silent: false,
        progressText: 'switching branch',
        completeText: `switched branch to ${color.yellow(branchName)}`,
      }
    );
    if (didCheckoutFail) {
      logWarning('please commit changes manually in ' + getProjectPath());
      return;
    }

    // add changes
    const { exitCode: didAddFail } = await runCommand('git add .', {
      silent: false,
      progressText: 'staging changes',
      completeText: 'staged all changes',
    });
    if (didAddFail) {
      logWarning('please commit changes manually in ' + getProjectPath());
      return;
    }

    // commit changes
    const { exitCode: didCommitFail } = await runCommand(
      'git',
      ['commit', '-m', `build(deps): bump react-native to ${rnVersion}`],
      {
        silent: false,
        progressText: 'committing changes',
        completeText: 'committed changes',
      }
    );
    if (didCommitFail) {
      logWarning('please commit changes manually in ' + getProjectPath());
      return;
    }

    // push changes
    const { exitCode: didPushFail } = await runCommand(
      `git push -u origin ${branchName}`,
      {
        silent: false,
        progressText: 'pushing changes to origin',
        completeText: 'pushed changes to origin',
      }
    );
    if (didPushFail) {
      logWarning('please push changes manually in ' + getProjectPath());
      return;
    }

    logSuccess(
      color.inverse(color.bold(color.green(' committed '))) +
        color.green(` saved changes to ${color.bold(branchName)}`)
    );

    startSpinner('cleaning up');
    await new Promise(r =>
      fs.rm(
        getProjectPath(),
        {
          recursive: true,
          force: true,
        },
        r
      )
    );
    stopSpinner('cleaned up');
  }
}
