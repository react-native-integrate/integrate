import fs from 'fs';
import { globSync } from 'glob';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getProjectPath } from '../../getProjectPath';

export function importUpgradeFolder(projectPath: string): ImportGetter | null {
  try {
    const upgradeFolderPath = path.join(
      projectPath,
      Constants.UPGRADE_FOLDER_NAME
    );

    if (!fs.existsSync(upgradeFolderPath)) return null;
    const files = globSync(upgradeFolderPath + '/**/*', { nodir: true });

    return {
      id: 'upgradeFolder',
      title: '.upgrade',
      value: `${files.length} files`,
      apply: () => setUpgradeFolder(projectPath, files),
    };
  } catch (e) {
    return null;
  }
}

async function setUpgradeFolder(oldProjectPath: string, files: string[]) {
  for (const file of files) {
    const relativePath = path.relative(oldProjectPath, file);
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

  logMessage(`imported ${color.yellow('.upgrade')}`);
  return Promise.resolve();
}
