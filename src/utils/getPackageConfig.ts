import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { getMd5 } from './getMd5';
import { getProjectPath } from './getProjectPath';

export async function getPackageConfig(
  packageName: string
): Promise<string | null> {
  let localConfigPath = getLocalPackageConfig(packageName);
  if (!localConfigPath) {
    localConfigPath = await downloadRemotePackageConfig(packageName);
  }
  return localConfigPath;
}

function getLocalPackageConfig(packageName: string) {
  const projectPath = getProjectPath();
  const localConfigPath = path.join(
    projectPath,
    'node_modules',
    packageName,
    Constants.CONFIG_FILE_NAME
  );

  if (!fs.existsSync(localConfigPath)) return null;

  return localConfigPath;
}

export async function downloadRemotePackageConfig(
  packageName: string
): Promise<string | null> {
  const projectPath = getProjectPath();
  const localPackagePath = path.join(projectPath, 'node_modules', packageName);
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
