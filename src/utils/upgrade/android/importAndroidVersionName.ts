import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getProjectPath } from '../../getProjectPath';

export function importAndroidVersionName(
  projectPath: string
): ImportGetter | null {
  try {
    // get android version code from build.gradle
    const buildGradlePath = path.join(projectPath, 'android/app/build.gradle');
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    const versionNameMatch = buildGradle.match(/versionName (.*)/);
    const versionName = versionNameMatch?.[1];
    if (!versionName) return null;
    return {
      id: 'androidVersionName',
      title: 'Android Version Name',
      value: versionName,
      apply: () => setAndroidVersionName(versionName),
    };
  } catch (e) {
    return null;
  }
}

async function setAndroidVersionName(version: string) {
  const buildGradlePath = path.join(
    getProjectPath(),
    'android/app/build.gradle'
  );
  const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  const newBuildGradle = buildGradle.replace(
    /versionName (.*)/,
    `versionName ${version}`
  );
  fs.writeFileSync(buildGradlePath, newBuildGradle);
  logMessage(`set ${color.yellow('versionName')} to ${color.yellow(version)}`);
  return Promise.resolve();
}
