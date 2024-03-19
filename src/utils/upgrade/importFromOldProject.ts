import color from 'picocolors';
import {
  confirm,
  logInfo,
  logMessage,
  logMessageGray,
  logWarning,
} from '../../prompter';
import { ImportGetter } from '../../types/upgrade.types';
import { getAndroidAppId } from './android/importAndroidAppId';
import { getAndroidDisplayName } from './android/importAndroidDisplayName';
import { getAndroidLaunchIcon } from './android/importAndroidLaunchIcon';
import { getAndroidVersionCode } from './android/importAndroidVersionCode';
import { getAndroidVersionName } from './android/importAndroidVersionName';
import { getIosAssets } from './ios/importIosAssets';
import { getIosBundleId } from './ios/importIosBundleId';
import { getIosDisplayName } from './ios/importIosDisplayName';
import { getIosMarketingVersion } from './ios/importIosMarketingVersion';
import { getIosProjectVersion } from './ios/importIosProjectVersion';
import { importIntegrateLockJson } from './other/importIntegrateLockJson';
import { importPackageJson } from './other/importPackageJson';
import { importUpgradeFolder } from './other/importUpgradeFolder';

export async function importFromOldProject(
  oldProjectPath: string
): Promise<boolean> {
  const importedData: ImportGetter[] = [
    importPackageJson(oldProjectPath),
    importIntegrateLockJson(oldProjectPath),
    importUpgradeFolder(oldProjectPath),
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
