import fs from 'fs';
import color from 'picocolors';
import xcode from 'xcode';
import { Constants } from '../../../constants';
import { logMessage } from '../../../prompter';
import '../../../tasks/xcode/xcodeTask.helpers';
import { ImportGetter } from '../../../types/upgrade.types';
import { getPbxProjectPath } from '../../getIosProjectPath';

export function importIosBuildProperties(
  projectPath: string
): ImportGetter | null {
  try {
    const pbxFilePath = getPbxProjectPath(projectPath);
    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
    const propertyNames = ['DEVELOPMENT_TEAM', 'TARGETED_DEVICE_FAMILY'];
    const buildProperties: BuildProperty[] = [];
    for (const propertyName of propertyNames) {
      const debugProperty = proj.getBuildProperty(
        propertyName,
        'Debug',
        nativeTarget.target.name
      );
      if (debugProperty)
        buildProperties.push({
          name: propertyName,
          value: debugProperty,
          type: 'Debug',
        });
      const releaseProperty = proj.getBuildProperty(
        propertyName,
        'Release',
        nativeTarget.target.name
      );
      if (releaseProperty)
        buildProperties.push({
          name: propertyName,
          value: releaseProperty,
          type: 'Release',
        });
    }
    if (!buildProperties.length) return null;

    return {
      id: 'iosBuildProperties',
      title: 'Ios Build Properties',
      value: buildProperties.length + ' properties',
      apply: () => setIosBuildProperties(buildProperties),
    };
  } catch (_e) {
    return null;
  }
}

async function setIosBuildProperties(buildProperties: BuildProperty[]) {
  const pbxFilePath = getPbxProjectPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
  for (const buildProperty of buildProperties) {
    proj.updateBuildPropertyByTarget(
      buildProperty.name,
      buildProperty.value,
      buildProperty.type,
      nativeTarget.target
    );
    logMessage(
      `set ${color.yellow(buildProperty.name)} (${buildProperty.type}) to ${color.yellow(buildProperty.value)}`
    );
  }

  fs.writeFileSync(pbxFilePath, proj.writeSync(), 'utf-8');

  return Promise.resolve();
}

type BuildProperty = { name: string; value: string; type: string };
