import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { PackageTuples } from '../types/integrator.types';
import { getProjectPath } from './getProjectPath';

export function getInstalledPackages(): PackageTuples {
  try {
    const packageJsonPath = getPackageJsonPath();
    const packageJsonFile = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonFile);
    return Object.entries(packageJson.dependencies || {});
  } catch (error) {
    console.error('Error fetching installed packages:', error);
    process.abort();
  }
}

export function getPackageJsonPath(): string {
  const projectPath = getProjectPath();
  return path.join(projectPath, Constants.PACKAGE_JSON_FILE_NAME);
}
