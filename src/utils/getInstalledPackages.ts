import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { InstalledPackages } from '../types/integrator.types';
import { getProjectPath } from './getProjectPath';

export function getInstalledPackages(): InstalledPackages {
  try {
    const projectPath = getProjectPath();
    const packageJsonPath = path.join(
      projectPath,
      Constants.PACKAGE_JSON_FILE_NAME
    );
    const packageJsonFile = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonFile);
    return Object.entries(packageJson.dependencies || {});
  } catch (error) {
    console.error('Error fetching installed packages:', error);
    process.abort();
  }
}
