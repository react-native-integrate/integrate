import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../constants';
import {
  logMessageGray,
  startSpinner,
  stopSpinner,
  updateSpinner,
} from '../../prompter';
import { getProjectPath } from '../getProjectPath';

export async function restoreBackupFiles(): Promise<boolean> {
  const backupFiles = globSync(
    [getProjectPath(), Constants.UPGRADE_FOLDER_NAME, 'backup', '**/*'].join(
      '/'
    ),
    { nodir: true }
  );
  if (backupFiles.length === 0) {
    logMessageGray('skipped restore, no backup files found');
    return false;
  }

  startSpinner(`copying files from ${color.yellow('.upgrade/backup')}`);

  for (let i = 0; i < backupFiles.length; i++) {
    updateSpinner(
      `copying files from ${color.yellow('.upgrade/backup')} (${i + 1}/${backupFiles.length})`
    );
    const file = backupFiles[i];
    const relativePath = path.relative(
      path.join(getProjectPath(), Constants.UPGRADE_FOLDER_NAME, 'backup'),
      file
    );
    const destination = path.join(getProjectPath(), relativePath);
    // ensure dir exists
    await new Promise(r =>
      fs.mkdir(path.dirname(destination), { recursive: true }, r)
    );
    await new Promise((res, rej) => {
      fs.copyFile(file, destination, err => {
        if (err) rej(err);
        else res(null);
      });
    });
  }
  stopSpinner(`copied ${color.yellow(backupFiles.length)} files`);
  return true;
}
