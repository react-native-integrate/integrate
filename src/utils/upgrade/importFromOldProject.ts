import color from 'picocolors';
import {
  confirm,
  logInfo,
  logMessage,
  logMessageGray,
  logWarning,
} from '../../prompter';
import { ImportGetter } from '../../types/upgrade.types';
import { importAndroidAppId } from './android/importAndroidAppId';
import { importAndroidDisplayName } from './android/importAndroidDisplayName';
import { importAndroidLaunchIcon } from './android/importAndroidLaunchIcon';
import { importAndroidVersionCode } from './android/importAndroidVersionCode';
import { importAndroidVersionName } from './android/importAndroidVersionName';
import { importIosAssets } from './ios/importIosAssets';
import { importIosBundleId } from './ios/importIosBundleId';
import { importIosDisplayName } from './ios/importIosDisplayName';
import { importIosMarketingVersion } from './ios/importIosMarketingVersion';
import { importIosProjectVersion } from './ios/importIosProjectVersion';
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
    importAndroidDisplayName(oldProjectPath),
    importAndroidAppId(oldProjectPath),
    importAndroidLaunchIcon(oldProjectPath),
    importAndroidVersionCode(oldProjectPath),
    importAndroidVersionName(oldProjectPath),
    importIosBundleId(oldProjectPath),
    importIosDisplayName(oldProjectPath),
    importIosProjectVersion(oldProjectPath),
    importIosMarketingVersion(oldProjectPath),
    importIosAssets(oldProjectPath),
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
    await d.apply().catch((e: Error) => {
      logWarning(e.message);
    });
  }
  return true;
}
