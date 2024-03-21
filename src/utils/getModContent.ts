import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { TextOrFileValue } from '../types/mod.types';
import { getText } from '../variables';
import { downloadFile, getRemotePath } from './getPackageConfig';

export async function getModContent(
  configPath: string,
  packageName: string,
  textOrFile: TextOrFileValue
): Promise<string> {
  if (typeof textOrFile == 'string') return getText(textOrFile);
  const fullFilePath = path.join(configPath, '..', textOrFile.file);
  if (
    !fs.existsSync(fullFilePath) &&
    packageName !== Constants.UPGRADE_CONFIG_FILE_NAME
  ) {
    const remotePath =
      getRemotePath(packageName, Constants.REMOTE_REPO) +
      fullFilePath.replace(path.join(configPath, '../'), '');

    const localDir = path.join(fullFilePath, '..');
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });
    const success = await downloadFile(remotePath, fullFilePath);
    if (!success) throw new Error(`File not found at ${fullFilePath}`);
  }
  return getText(fs.readFileSync(fullFilePath, 'utf-8'));
}
