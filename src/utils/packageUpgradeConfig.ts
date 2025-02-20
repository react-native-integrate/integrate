import fs from 'fs';
import path from 'path';
import { logWarning } from '../prompter';
import { PackageUpgradeConfig } from '../types/integrator.types';
import { getProjectPath } from './getProjectPath';

export function getPackageUpgradeConfig(
  packageName: string
): PackageUpgradeConfig {
  const projectPath = getProjectPath();
  const upgradePath = path.join(
    projectPath,
    '.upgrade',
    'packages',
    packageName,
    'upgrade.json'
  );
  if (!fs.existsSync(upgradePath)) {
    return {};
  }
  try {
    return JSON.parse(
      fs.readFileSync(upgradePath, 'utf8')
    ) as PackageUpgradeConfig;
  } catch (_e) {
    return {};
  }
}

export function addPackageUpgradeFile(packageName: string, file: string): void {
  return writePackageUpgradeConfig(packageName, {
    files: {
      [file]: file,
    },
  });
}
export function addPackageUpgradeInput(
  packageName: string,
  name: string,
  value: unknown
): void {
  return writePackageUpgradeConfig(packageName, {
    inputs: {
      [name]: value,
    },
  });
}
export function writePackageUpgradeConfig(
  packageName: string,
  config: PackageUpgradeConfig
): void {
  const projectPath = getProjectPath();
  const upgradeJsonPath = path.join(
    projectPath,
    '.upgrade',
    'packages',
    packageName,
    'upgrade.json'
  );
  let existingConfig: PackageUpgradeConfig;
  if (!fs.existsSync(upgradeJsonPath)) {
    existingConfig = {};
  } else {
    try {
      existingConfig = JSON.parse(
        fs.readFileSync(upgradeJsonPath, 'utf8')
      ) as PackageUpgradeConfig;
    } catch (e: any) {
      logWarning(e?.message as string);
      existingConfig = {};
    }
  }

  if (config.inputs) {
    existingConfig.inputs = Object.assign(
      existingConfig.inputs || {},
      config.inputs
    );
  }

  if (config.files) {
    for (const destination of Object.keys(config.files)) {
      const allExistingFiles = Object.values(existingConfig.files || {});
      const fullPath = path.join(getProjectPath(), destination);
      let fileName = path.basename(fullPath);
      const extName = path.extname(fullPath);
      if (allExistingFiles.includes(fileName)) {
        const fileNameWithoutExt = fileName.replace(extName, '');
        const cloneCount = +(/ \(\d+\)$/.exec(fileNameWithoutExt)?.[0] || '1');
        fileName = `${fileNameWithoutExt.replace(/ \(\d+\)$/, '')} (${
          cloneCount + 1
        })${extName}`;
      }
      const upgradeFilePath = path.join(
        projectPath,
        '.upgrade',
        'packages',
        packageName,
        'files',
        fileName
      );

      // copy file
      fs.mkdirSync(path.dirname(upgradeFilePath), { recursive: true });
      fs.copyFileSync(fullPath, upgradeFilePath);

      // set fileName
      config.files[destination] = fileName;

      existingConfig.files = Object.assign(
        existingConfig.files || {},
        config.files
      );
    }
  }

  fs.mkdirSync(path.dirname(upgradeJsonPath), { recursive: true });
  fs.writeFileSync(upgradeJsonPath, JSON.stringify(existingConfig, null, 2));
}
