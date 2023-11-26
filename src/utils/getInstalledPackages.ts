import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { PackageTuples } from '../types/integrator.types';
import { getProjectPath } from './getProjectPath';

export function getInstalledPackages(): PackageTuples {
  try {
    const packageJson = getPackageJson();
    return Object.entries({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    });
  } catch (error) {
    console.error('Error fetching installed packages:', error);
    process.abort();
  }
}

export function getPackageJson(): Record<string, any> {
  const packageJsonPath = getPackageJsonPath();
  const packageJsonFile = fs.readFileSync(packageJsonPath, 'utf-8');
  return JSON.parse(packageJsonFile) as Record<string, any>;
}

export function getPackageJsonPath(): string {
  const projectPath = getProjectPath();
  return path.join(projectPath, Constants.PACKAGE_JSON_FILE_NAME);
}
