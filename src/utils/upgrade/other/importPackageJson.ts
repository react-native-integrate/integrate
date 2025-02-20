import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import {
  logMessage,
  multiselect,
  select,
  startSpinner,
  stopSpinner,
} from '../../../prompter';
import { PackageJsonType } from '../../../types/mod.types';
import { SelectOption } from '../../../types/prompt.types';
import { ImportGetter } from '../../../types/upgrade.types';
import { modifyObject } from '../../applyObjectModification';
import { getPackageJson, getPackageJsonPath } from '../../getInstalledPackages';

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
      apply: () => setPackageJson(projectPath, packageJson),
    };
  } catch (e) {
    return null;
  }
}

async function setPackageJson(
  oldProjectPath: string,
  oldPackageJson: PackageJsonType
) {
  const packageJson = getPackageJson();

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

  const installCommand = await getInstallCommand(oldProjectPath);
  startSpinner(
    `installing modules using ${color.yellow(installCommand)} ${color.gray('(this may take a while)')}`
  );

  const exitCode = await new Promise<number>(resolve => {
    const parts = installCommand.split(' ');
    const command = parts[0] + (process.platform == 'win32' ? '.cmd' : '');
    const child = spawn(command, parts.slice(1));
    // child.stdout.pipe(process.stdout);
    // child.stderr.pipe(process.stderr);
    child.on('close', code => {
      resolve(code ?? 0);
    });
  });

  if (exitCode !== 0) {
    stopSpinner(
      `${color.red(`installation using ${color.yellow(installCommand)} ended with exit code `)}${color.yellow(exitCode?.toString())}`
    );
    await multiselect(
      'Please complete installation manually and return here to proceed.',
      {
        options: [
          { label: 'completed installation, continue upgrade', value: true },
        ],
        required: true,
      }
    );
  } else {
    stopSpinner('installed modules');
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
  const isBunLockPresent = fs.existsSync(path.join(projectPath, 'bun.lockb'));

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
