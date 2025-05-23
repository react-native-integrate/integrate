import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../../constants';
import { logMessage, logWarning, multiselect, select } from '../../../prompter';
import { PackageJsonType } from '../../../types/mod.types';
import { SelectOption } from '../../../types/prompt.types';
import { ImportGetter } from '../../../types/upgrade.types';
import { modifyObject } from '../../applyObjectModification';
import { getPackageJson, getPackageJsonPath } from '../../getInstalledPackages';
import { getRemoteFile } from '../../getPackageConfig';
import { runCommand } from '../../runCommand';

export function importPackageJson(projectPath: string): ImportGetter | null {
  try {
    const packageJson = getPackageJson(projectPath);
    // check if it is rn project
    if (
      !packageJson.dependencies ||
      !('react-native' in packageJson.dependencies)
    )
      return null;

    return {
      id: 'packageJson',
      title: 'Package.json',
      value: `${packageJson.name}@${packageJson.version}`,
      apply: () => setPackageJson(packageJson),
    };
  } catch (_e) {
    return null;
  }
}

async function setPackageJson(oldPackageJson: PackageJsonType) {
  const packageJson = getPackageJson();

  const { deprecatedPackages, deprecatedDevPackages } =
    await findDeprecatedPackages(oldPackageJson, packageJson);

  // process rest
  Object.entries(oldPackageJson).forEach(([key, value]) => {
    switch (key) {
      case 'dependencies':
        // append new dependencies only
        packageJson.dependencies = modifyObject(
          packageJson.dependencies,
          value as Record<string, any>,
          'append'
        );

        // delete deprecated package
        for (const dependency of deprecatedPackages) {
          delete packageJson.dependencies[dependency];
        }

        // sort dependencies
        packageJson.dependencies = Object.fromEntries(
          Object.entries(packageJson.dependencies).sort()
        );
        break;
      case 'devDependencies':
        // append new dev dependencies only
        packageJson.devDependencies = modifyObject(
          packageJson.devDependencies || {},
          value as Record<string, any>,
          'append'
        );

        // delete deprecated package
        for (const dependency of deprecatedDevPackages) {
          delete packageJson.devDependencies[dependency];
        }

        // sort devDependencies
        packageJson.devDependencies = Object.fromEntries(
          Object.entries(packageJson.devDependencies).sort()
        );
        break;
      case 'version':
      case 'description':
        // import version and description
        packageJson[key] = value as string;
        break;
      default:
        if (typeof value === 'string') {
          // import any old string which doesn't exist in new
          if (!(key in packageJson)) packageJson[key] = value;
        } else if (typeof value === 'object') {
          if (packageJson[key] == null) {
            // import any old object which doesn't exist in new
            packageJson[key] = value;
          } else if (typeof packageJson[key] === 'object') {
            // merge old object with append mode
            packageJson[key] = modifyObject(
              packageJson[key] as Record<string, any>,
              value as Record<string, any>,
              'append'
            ) as any;
          }
        }
        break;
    }
  });

  const packageJsonPath = getPackageJsonPath();

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );
  logMessage(`merged ${color.yellow('package.json')}`);
}

export async function installModules(oldProjectPath: string) {
  const installCommand = await getInstallCommand(oldProjectPath);
  const { exitCode } = await runCommand(installCommand, {
    silent: false,
    progressText: `running ${color.yellow(installCommand)}`,
    errorText: `installation using ${color.yellow(installCommand)} failed`,
    completeText: 'installed modules',
  });

  if (exitCode !== 0) {
    await multiselect(
      'Please complete installation manually and return here to proceed.',
      {
        options: [
          { label: 'completed installation, continue upgrade', value: true },
        ],
        required: true,
      }
    );
  }
}

export async function getInstallCommand(projectPath: string) {
  const isNpmLockPresent = fs.existsSync(
    path.join(projectPath, 'package-lock.json')
  );
  const isYarnLockPresent = fs.existsSync(path.join(projectPath, 'yarn.lock'));
  const isPnpmLockPresent = fs.existsSync(
    path.join(projectPath, 'pnpm-lock.yaml')
  );
  const isBunLockPresent =
    fs.existsSync(path.join(projectPath, 'bun.lockb')) ||
    fs.existsSync(path.join(projectPath, 'bun.lock'));

  const options: SelectOption[] = [];
  if (isNpmLockPresent) options.push({ label: 'npm', value: 'npm install' });
  if (isYarnLockPresent) options.push({ label: 'yarn', value: 'yarn install' });
  if (isPnpmLockPresent) options.push({ label: 'pnpm', value: 'pnpm install' });
  if (isBunLockPresent) options.push({ label: 'bun', value: 'bun install' });
  let installer: string;
  if (options.length > 1) {
    installer = (await select(
      'Multiple lock files found, please select an installer:',
      {
        options,
      }
    )) as string;
  } else if (options.length === 1) {
    installer = options[0].value as string;
  } else {
    installer = 'npm install';
  }
  return installer;
}

async function findDeprecatedPackages(
  oldPackageJson: PackageJsonType,
  packageJson: PackageJsonType
) {
  const deprecatedPackages: string[] = [];
  const deprecatedDevPackages: string[] = [];
  const oldRNVersion = oldPackageJson.dependencies?.['react-native'];
  const newRNVersion = packageJson.dependencies?.['react-native'];
  if (oldRNVersion && newRNVersion) {
    try {
      const oldDiffPackageJsonContent = await getRemoteFile(
        Constants.REMOTE_DIFF_PACKAGE_JSON.replace('[version]', oldRNVersion)
      );
      const newDiffPackageJsonContent = await getRemoteFile(
        Constants.REMOTE_DIFF_PACKAGE_JSON.replace('[version]', newRNVersion)
      );
      if (oldDiffPackageJsonContent && newDiffPackageJsonContent) {
        const oldDiffPackageJson: PackageJsonType = JSON.parse(
          oldDiffPackageJsonContent
        );
        const newDiffPackageJson: PackageJsonType = JSON.parse(
          newDiffPackageJsonContent
        );
        for (const dependency in oldDiffPackageJson.dependencies) {
          if (!(dependency in newDiffPackageJson.dependencies)) {
            deprecatedPackages.push(dependency);
          }
        }
        for (const dependency in oldDiffPackageJson.devDependencies) {
          if (!(dependency in (newDiffPackageJson.devDependencies || {}))) {
            deprecatedDevPackages.push(dependency);
          }
        }
      }
    } catch (e: any) {
      logWarning(
        'warning: could not get package.json diff, skipping deprecated package check: ' +
          e?.message
      );
    }
  }
  return { deprecatedPackages, deprecatedDevPackages };
}
