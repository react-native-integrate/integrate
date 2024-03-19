import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getProjectPath } from '../../getProjectPath';

export function importAndroidDisplayName(
  projectPath: string
): ImportGetter | null {
  try {
    const stringsPath = path.join(
      projectPath,
      'android/app/src/main/res/values/strings.xml'
    );
    const strings = fs.readFileSync(stringsPath, 'utf8');
    const displayNameMatch = strings.match(
      /<string name="app_name">(.*)<\/string>/
    );
    const displayName = displayNameMatch?.[1];
    if (!displayName) return null;
    return {
      id: 'androidDisplayName',
      title: 'Android Display Name',
      value: displayName,
      apply: () => setAndroidDisplayName(displayName),
    };
  } catch (e) {
    return null;
  }
}

async function setAndroidDisplayName(name: string) {
  const stringsPath = path.join(
    getProjectPath(),
    'android/app/src/main/res/values/strings.xml'
  );
  const strings = fs.readFileSync(stringsPath, 'utf8');
  const newStrings = strings.replace(
    /<string name="app_name">(.*)<\/string>/,
    `<string name="app_name">${name}</string>`
  );
  fs.writeFileSync(stringsPath, newStrings);

  logMessage(`changed ${color.yellow('app_name')} to ${color.yellow(name)}`);
  return Promise.resolve();
}
