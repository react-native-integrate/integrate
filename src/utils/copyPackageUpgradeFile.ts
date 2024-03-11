import fs from 'fs';
import path from 'path';
import { variables } from '../variables';
import { getProjectPath } from './getProjectPath';
import { getPackageUpgradeConfig } from './packageUpgradeConfig';

export function copyPackageUpgradeFile(
  packageName: string,
  destination: string
): boolean {
  const projectPath = getProjectPath();

  // get from .upgrade folder
  const packageUpgradeConfig = getPackageUpgradeConfig(packageName);

  // check if files is defined
  if (!packageUpgradeConfig.files) return false;

  const fileNameInUpgradeFolder = packageUpgradeConfig.files[destination];
  const filePathInUpgradeFolder = path.join(
    projectPath,
    '.upgrade',
    'packages',
    packageName,
    'files',
    fileNameInUpgradeFolder
  );
  if (!fs.existsSync(filePathInUpgradeFolder)) {
    return false;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  console.log(`Copying ${filePathInUpgradeFolder} to ${destination}`);
  fs.copyFileSync(filePathInUpgradeFolder, path.join(projectPath, destination));
  return true;
}

export function handlePackageUpgradeCopyFile(
  packageName: string,
  destination: string
): boolean {
  const isUpgrade = variables.get('__UPGRADE__') == true;
  if (!isUpgrade) return false;

  return copyPackageUpgradeFile(packageName, destination);
}
