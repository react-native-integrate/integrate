import color from 'picocolors';
import {
  confirm,
  logInfo,
  logMessage,
  logMessageGray,
  logWarning,
} from '../../prompter';
import { ImportGetter } from '../../types/upgrade.types';
import { getAndroidAppId } from './android/androidAppId';
import { getAndroidDisplayName } from './android/androidDisplayName';
import { getAndroidLaunchIcon } from './android/androidLaunchIcon';
import { getAndroidVersionCode } from './android/androidVersionCode';
import { getAndroidVersionName } from './android/androidVersionName';
import { getIosAssets } from './ios/iosAssets';
import { getIosBundleId } from './ios/iosBundleId';
import { getIosDisplayName } from './ios/iosDisplayName';
import { getIosMarketingVersion } from './ios/iosMarketingVersion';
import { getIosProjectVersion } from './ios/iosProjectVersion';

export async function importFromOldProject(
  oldProjectPath: string
): Promise<boolean> {
  const importedData: ImportGetter[] = [
    getAndroidDisplayName(oldProjectPath),
    getAndroidAppId(oldProjectPath),
    getAndroidLaunchIcon(oldProjectPath),
    getAndroidVersionCode(oldProjectPath),
    getAndroidVersionName(oldProjectPath),
    getIosBundleId(oldProjectPath),
    getIosDisplayName(oldProjectPath),
    getIosProjectVersion(oldProjectPath),
    getIosMarketingVersion(oldProjectPath),
    getIosAssets(oldProjectPath),
  ].filter(d => d != null) as ImportGetter[];

  logMessage(
    'importing following project data:\n\n' +
      importedData.map(d => `➤ ${d.title}: ${color.green(d.value)}`).join('\n')
  );

  const confirmed = await confirm('Would you like to proceed?', {
    initialValue: true,
    positive: 'yes',
    negative: 'no, just re-integrate',
  });

  if (!confirmed) {
    logMessageGray('skipping import from old project');
    return false;
  }

  for (const d of importedData) {
    logInfo(
      color.bold(color.inverse(color.cyan(' import '))) +
        color.bold(color.cyan(` ${d.title} `))
    );
    await d.setter().catch((e: Error) => {
      logWarning(e.message);
    });
  }
  return true;
}
