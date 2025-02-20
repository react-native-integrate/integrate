import fs from 'fs';
import color from 'picocolors';
import xcode from 'xcode';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import '../../../tasks/xcode/xcodeTask.helpers';
import { ImportGetter } from '../../../types/upgrade.types';
import { getPbxProjectPath } from '../../getIosProjectPath';

export function importIosMarketingVersion(
  projectPath: string
): ImportGetter | null {
  try {
    const pbxFilePath = getPbxProjectPath(projectPath);
    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
    const marketingVersion = proj.getBuildProperty(
      'MARKETING_VERSION',
      'Release',
      nativeTarget.target.name
    );

    if (!marketingVersion) return null;
    const versionVariable = marketingVersion.match(/\$\{(.*?)}/)?.[1];
    let versionVariableValue: string | undefined;
    if (versionVariable) {
      const buildConfigurationLists = proj.pbxXCConfigurationList();
      const buildConfigurationList =
        buildConfigurationLists[
          proj.getFirstProject().firstProject.buildConfigurationList
        ];
      const buildConfigurationSection = proj.pbxXCBuildConfigurationSection();

      for (const buildConfiguration of buildConfigurationList.buildConfigurations) {
        if (buildConfiguration.comment == 'Release') {
          const id = buildConfiguration.value;
          const buildConfig = buildConfigurationSection[id];
          versionVariableValue = buildConfig.buildSettings[versionVariable];
        }
      }
    }
    return {
      id: 'iosMarketingVersion',
      title: 'Ios Marketing Version',
      value:
        marketingVersion +
        (versionVariableValue ? ` (${versionVariableValue})` : ''),
      apply: () =>
        setIosMarketingVersion(
          marketingVersion,
          versionVariable,
          versionVariableValue
        ),
    };
  } catch (_e) {
    return null;
  }
}

async function setIosMarketingVersion(
  newMarketingVersion: string,
  versionVariable: string | undefined,
  versionVariableValue: string | undefined
) {
  const pbxFilePath = getPbxProjectPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
  proj.updateBuildPropertyByTarget(
    'MARKETING_VERSION',
    newMarketingVersion,
    'Debug',
    nativeTarget.target
  );
  proj.updateBuildPropertyByTarget(
    'MARKETING_VERSION',
    newMarketingVersion,
    'Release',
    nativeTarget.target
  );
  logMessage(
    `set ${color.yellow('MARKETING_VERSION')} to ${color.yellow(newMarketingVersion)}`
  );

  if (versionVariable) {
    const buildConfigurationLists = proj.pbxXCConfigurationList();
    const buildConfigurationList =
      buildConfigurationLists[
        proj.getFirstProject().firstProject.buildConfigurationList
      ];
    const buildConfigurationSection = proj.pbxXCBuildConfigurationSection();

    for (const buildConfiguration of buildConfigurationList.buildConfigurations) {
      const id = buildConfiguration.value;
      const buildConfig = buildConfigurationSection[id];
      buildConfig.buildSettings[versionVariable] = versionVariableValue;
    }
    logMessage(
      `set ${color.yellow(versionVariable)} to ${color.yellow(versionVariableValue)}`
    );
  }
  fs.writeFileSync(pbxFilePath, proj.writeSync(), 'utf-8');

  return Promise.resolve();
}
