import fs from 'fs';
import color from 'picocolors';
import xcode from 'xcode';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import { ImportGetter } from '../../../types/upgrade.types';
import { getPbxProjectPath } from '../../getIosProjectPath';

export function getIosProjectVersion(projectPath: string): ImportGetter | null {
  try {
    const pbxFilePath = getPbxProjectPath(projectPath);
    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
    const projectVersion = proj.getBuildProperty(
      'CURRENT_PROJECT_VERSION',
      'Release',
      nativeTarget.target.name
    );

    if (!projectVersion) return null;
    const versionVariable = projectVersion.match(/\$\{(.*?)}/)?.[1];
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
      id: 'iosProjectVersion',
      title: 'Ios Project Version',
      value:
        projectVersion +
        (versionVariableValue ? ` (${versionVariableValue})` : ''),
      setter: () =>
        setIosProjectVersion(
          projectVersion,
          versionVariable,
          versionVariableValue
        ),
    };
  } catch (e) {
    return null;
  }
}

async function setIosProjectVersion(
  newProjectVersion: string,
  versionVariable: string | undefined,
  versionVariableValue: string | undefined
) {
  const pbxFilePath = getPbxProjectPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
  proj.updateBuildPropertyByTarget(
    'CURRENT_PROJECT_VERSION',
    newProjectVersion,
    'Debug',
    nativeTarget.target
  );
  proj.updateBuildPropertyByTarget(
    'CURRENT_PROJECT_VERSION',
    newProjectVersion,
    'Release',
    nativeTarget.target
  );
  logMessage(
    `set ${color.yellow('CURRENT_PROJECT_VERSION')} to ${color.yellow(newProjectVersion)}`
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
