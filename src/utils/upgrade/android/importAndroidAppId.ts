import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { logMessageGray, startSpinner, stopSpinner } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { escapeRegExp } from '../../escapeRegExp';
import { getProjectPath } from '../../getProjectPath';
import { searchReplaceAllFiles } from '../../searchReplaceAllFiles';

export function importAndroidAppId(projectPath: string): ImportGetter | null {
  try {
    const buildGradlePath = path.join(projectPath, 'android/app/build.gradle');
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    const appIdMatch = buildGradle.match(/applicationId "(.*)"/);
    const appId = appIdMatch?.[1];

    const currentBuildGradlePath = path.join(
      getProjectPath(),
      'android/app/build.gradle'
    );
    const currentBuildGradle = fs.readFileSync(currentBuildGradlePath, 'utf8');
    const currentAppIdMatch = currentBuildGradle.match(/applicationId "(.*)"/);
    const currentAppId = currentAppIdMatch?.[1];
    if (!appId || !currentAppId) return null;
    return {
      id: 'androidAppId',
      title: 'Android App Id',
      value: appId,
      apply: () => setAndroidAppId(currentAppId, appId),
    };
  } catch (_e) {
    return null;
  }
}

async function setAndroidAppId(currentAppId: string, newAppId: string) {
  if (currentAppId == newAppId) {
    logMessageGray(
      `android app id is already set to ${color.yellow(newAppId)}`
    );
    return;
  }
  startSpinner(
    `changing android app id in all files from ${color.yellow(currentAppId)} to ${color.yellow(newAppId)}`
  );

  const changes = await searchReplaceAllFiles(
    path.join(getProjectPath(), 'android'),
    escapeRegExp(currentAppId),
    newAppId,
    false
  );

  stopSpinner(
    `changed android app id in ${color.yellow(changes)} files from ${color.yellow(currentAppId)} to ${color.yellow(newAppId)}`
  );
}
