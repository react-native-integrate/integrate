import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { updateSpinner } from '../prompter';
import { getMd5 } from './getMd5';
import { getProjectPath } from './getProjectPath';

export async function getPackageConfig(
  packageName: string,
  pagination: { index: number; count: number } = { index: 0, count: 1 }
): Promise<string | null> {
  updateSpinner(
    `[${pagination.index + 1}/${
      pagination.count
    }] checking package configuration: ${packageName}`
  );
  let localConfigPath = getLocalPackageConfig(packageName);
  if (!localConfigPath) {
    localConfigPath = await downloadRemotePackageConfig(packageName);
  }
  return localConfigPath;
}

export function getPackagePath(packageName: string): string {
  const projectPath = getProjectPath();
  return path.join(projectPath, 'node_modules', packageName);
}

export function getLocalPackageConfig(packageName: string): string | null {
  const localPackagePath = getPackagePath(packageName);
  const localConfigPath = path.join(
    localPackagePath,
    Constants.CONFIG_FILE_NAME
  );

  if (!fs.existsSync(localConfigPath)) return null;

  return localConfigPath;
}

export async function downloadRemotePackageConfig(
  packageName: string
): Promise<string | null> {
  const localPackagePath = getPackagePath(packageName);
  const localConfigPath = path.join(
    localPackagePath,
    Constants.CONFIG_FILE_NAME
  );
  const remotePath = getRemotePath(packageName);
  const didDownload = await downloadFile(remotePath, localConfigPath);
  if (!didDownload) return null;

  return localConfigPath;
}

export function getRemotePath(
  packageName: string,
  pathTemplate = Constants.REMOTE_CONFIG_REPO
): string {
  const md5 = getMd5(packageName);
  const md5Path = md5.substring(0, 3).split('').join('/');
  return pathTemplate.replace(
    '[package]',
    md5Path +
      '/' +
      packageName
        .split('/')
        .map(x => encodeURIComponent(x))
        .join('/')
  );
}

export async function downloadFile(
  remotePath: string,
  localPath: string
): Promise<boolean> {
  const configContent = await getRemoteFile(remotePath);
  if (!configContent) return false;
  fs.writeFileSync(localPath, configContent);
  return true;
}

export async function getRemoteFile(
  remotePath: string
): Promise<string | null> {
  const response = await fetch(remotePath);
  if (response.status != 200) return null;
  return response.text();
}
