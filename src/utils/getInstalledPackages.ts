import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { PackageTuples } from '../types/integrator.types';
import { PackageJsonType } from '../types/mod.types';
import { getProjectPath } from './getProjectPath';

export function getInstalledPackages(): PackageTuples {
  try {
    const packageJson = getPackageJson();
    return Object.entries({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    } as Record<string, any>) as PackageTuples;
  } catch (error) {
    console.error('Error fetching installed packages:', error);
    process.exit(0);
  }
}

export function getPackageJson(
  projectPath = getProjectPath()
): PackageJsonType {
  const packageJsonPath = getPackageJsonPath(projectPath);
  const packageJsonFile = fs.readFileSync(packageJsonPath, 'utf-8');
  return JSON.parse(packageJsonFile) as PackageJsonType;
}

export function getPackageJsonPath(projectPath = getProjectPath()): string {
  return path.join(projectPath, Constants.PACKAGE_JSON_FILE_NAME);
}
