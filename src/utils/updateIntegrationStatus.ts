import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { LockData, LockProjectData } from '../types/integrator.types';
import { getProjectPath } from './getProjectPath';

const projectPath = getProjectPath();
const lockFilePath = path.join(projectPath, Constants.LOCK_FILE_NAME);

function createLockObject(): LockData {
  return { packages: {}, lockfileVersion: Constants.CURRENT_LOCK_VERSION };
}

export function readLockFile(): LockData {
  try {
    if (!fs.existsSync(lockFilePath)) return createLockObject();
    // Read the file and parse it as JSON
    const lockFileContent = fs.readFileSync(lockFilePath, 'utf-8');
    if (!lockFileContent) return createLockObject();
    // compare lock version
    const lockData = JSON.parse(lockFileContent) as LockData;
    if (lockData.lockfileVersion !== Constants.CURRENT_LOCK_VERSION) {
      console.error(
        `Error reading integrate-lock.json: lockfileVersion is not equal to ${Constants.CURRENT_LOCK_VERSION}`
      );
      process.abort();
    }
    return lockData;
  } catch (error) {
    console.error('Error reading integrate-lock.json:', error);
    process.abort();
  }
}

function writeLockFile(data: LockData): void {
  try {
    fs.writeFileSync(lockFilePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing integrate-lock.json:', error);
    process.abort();
  }
}

export function updateIntegrationStatus(
  packageIntegrations: {
    packageName: string;
    lockProjectData: LockProjectData;
  }[]
): void {
  const integrationLockData = readLockFile();
  if (!integrationLockData) return;
  if (!integrationLockData.packages) integrationLockData.packages = {};
  packageIntegrations.forEach(integration => {
    if (integration.lockProjectData.deleted)
      delete integrationLockData.packages[integration.packageName];
    else
      integrationLockData.packages[integration.packageName] =
        integration.lockProjectData;
  });
  integrationLockData.packages = Object.keys(integrationLockData.packages)
    .sort()
    .reduce((temp_obj, key) => {
      temp_obj[key] = integrationLockData.packages[key];
      return temp_obj;
    }, {} as Record<string, any>);
  writeLockFile(integrationLockData);
}
