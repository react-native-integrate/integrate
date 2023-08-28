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
    }] Checking config for package: ${packageName}`
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

function getLocalPackageConfig(packageName: string) {
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

export function getRemotePath(packageName: string): string {
  const md5 = getMd5(packageName);
  const md5Path = md5.substring(0, 3).split('').join('/');
  return Constants.REMOTE_CONFIG_REPO.replace(
    '[package]',
    md5Path +
      '/' +
      packageName
        .split('/')
        .map(x => encodeURIComponent(x))
        .join('/')
  );
}

async function downloadFile(remotePath: string, localPath: string) {
  const configContent = await fetch(remotePath).then(x => {
    if (x.status == 404) return null;
    return x.text();
  });
  if (!configContent) return false;
  fs.writeFileSync(localPath, configContent);
  return true;
}
