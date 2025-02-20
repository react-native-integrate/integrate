import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getProjectPath } from '../../getProjectPath';

export function importAndroidVersionCode(
  projectPath: string
): ImportGetter | null {
  try {
    // get android version code from build.gradle
    const buildGradlePath = path.join(projectPath, 'android/app/build.gradle');
    const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
    const versionCodeMatch = buildGradle.match(/versionCode (.*)/);
    const versionCode = versionCodeMatch?.[1];
    if (!versionCode) return null;
    return {
      id: 'androidVersionCode',
      title: 'Android Version Code',
      value: versionCode,
      apply: () => setAndroidVersionCode(versionCode),
    };
  } catch (_e) {
    return null;
  }
}

async function setAndroidVersionCode(version: string) {
  const buildGradlePath = path.join(
    getProjectPath(),
    'android/app/build.gradle'
  );
  const buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  const newBuildGradle = buildGradle.replace(
    /versionCode (.*)/,
    `versionCode ${version}`
  );
  fs.writeFileSync(buildGradlePath, newBuildGradle);
  logMessage(`set ${color.yellow('versionCode')} to ${color.yellow(version)}`);
  return Promise.resolve();
}
