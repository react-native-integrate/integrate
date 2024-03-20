import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import { LockData } from '../../../types/integrator.types';
import { ImportGetter } from '../../../types/upgrade.types';
import { getProjectPath } from '../../getProjectPath';

export function importIntegrateLockJson(
  projectPath: string
): ImportGetter | null {
  try {
    const lockFilePath = path.join(projectPath, Constants.LOCK_FILE_NAME);

    if (!fs.existsSync(lockFilePath)) return null;

    const lockFile = fs.readFileSync(lockFilePath, 'utf-8');

    // parse json file to object type
    const lockData = JSON.parse(lockFile) as LockData;

    return {
      id: 'integrateLockJson',
      title: 'Integrate Lock File',
      value: `${Object.keys(lockData.packages).length} total, ${Object.values(lockData.packages).filter(x => x.integrated).length} integrated packages`,
      apply: () => setIntegrateLockJson(lockData),
    };
  } catch (e) {
    return null;
  }
}

async function setIntegrateLockJson(oldLockJson: LockData) {
  const lockFilePath = path.join(getProjectPath(), Constants.LOCK_FILE_NAME);

  fs.writeFileSync(lockFilePath, JSON.stringify(oldLockJson, null, 2), 'utf-8');

  logMessage(`imported ${color.yellow('integrate-lock.json')}`);
  return Promise.resolve();
}
