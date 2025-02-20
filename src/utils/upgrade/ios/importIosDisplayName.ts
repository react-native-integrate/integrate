import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import plist from 'simple-plist';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getIosProjectName } from '../../getIosProjectPath';
import { getProjectPath } from '../../getProjectPath';

export function importIosDisplayName(projectPath: string): ImportGetter | null {
  try {
    const target = getIosProjectName(projectPath);
    const plistPath = path.join(
      projectPath,
      'ios',
      target,
      Constants.PLIST_FILE_NAME
    );
    const content: Record<string, any> = plist.parse(
      fs.readFileSync(plistPath, 'utf-8')
    );
    const displayName = content.CFBundleDisplayName as string;

    if (!displayName) return null;
    return {
      id: 'iosDisplayName',
      title: 'Ios Display Name',
      value: displayName,
      apply: () => setIosDisplayName(displayName),
    };
  } catch (_e) {
    return null;
  }
}

async function setIosDisplayName(name: string) {
  const target = getIosProjectName();
  const plistPath = path.join(
    getProjectPath(),
    'ios',
    target,
    Constants.PLIST_FILE_NAME
  );
  const content: Record<string, any> = plist.parse(
    fs.readFileSync(plistPath, 'utf-8')
  );
  content.CFBundleDisplayName = name;
  fs.writeFileSync(plistPath, plist.stringify(content), 'utf-8');

  logMessage(
    `changed ${color.yellow('CFBundleDisplayName')} to ${color.yellow(name)}`
  );
  return Promise.resolve();
}
