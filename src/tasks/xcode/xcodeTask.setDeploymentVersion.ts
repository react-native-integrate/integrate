import color from 'picocolors';
import { XcodeProjectType } from 'xcode';
import { Constants } from '../../constants';
import { logMessage } from '../../prompter';
import { XcodeSetDeploymentVersion } from '../../types/mod.types';
import { getIosDeploymentVersionFromXcodeProject } from '../../utils/getDeploymentVersion';
import { getText } from '../../variables';

export function applySetDeploymentVersion(
  content: XcodeProjectType,
  action: XcodeSetDeploymentVersion
): XcodeProjectType {
  let { target } = action;
  target = getText(target);

  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let projTarget;
  let logTarget;
  switch (target) {
    case 'root':
      projTarget = content.getFirstProject().firstProject;
      logTarget = 'project root';
      break;
    case 'main':
      projTarget = nativeTarget.target;
      logTarget = `${nativeTarget.target.name} target`;
      break;
    default:
      projTarget =
        content.pbxTargetByName(target) ||
        content.pbxTargetByName(`"${target}"`);
      logTarget = `${target} target`;
      break;
  }
  const minVersion = isNumberOrText(action.setDeploymentVersion)
    ? getVersionFromText(action.setDeploymentVersion)
    : getVersionFromText(action.setDeploymentVersion.min);

  // get current version from target
  let currentVersion = +(
    content.getBuildPropertyByTarget(
      'IPHONEOS_DEPLOYMENT_TARGET',
      'Release',
      projTarget
    ) || 0
  );

  // get version from main/root target
  if (currentVersion == 0) {
    const versionData = getIosDeploymentVersionFromXcodeProject(content);
    currentVersion = +versionData.version;

    // write to root target if current target has no version
    if (versionData.target == 'root')
      projTarget = content.getFirstProject().firstProject;
  }

  const maxVersion = isNumberOrText(action.setDeploymentVersion)
    ? getVersionFromText(action.setDeploymentVersion)
    : getVersionFromText(action.setDeploymentVersion.max || currentVersion);

  const newVersion = Math.min(
    Math.max(currentVersion, minVersion),
    maxVersion
  ).toFixed(1);

  // should write back to root target

  content.updateBuildPropertyByTarget(
    'IPHONEOS_DEPLOYMENT_TARGET',
    `${newVersion}`,
    'Debug',
    projTarget
  );
  content.updateBuildPropertyByTarget(
    'IPHONEOS_DEPLOYMENT_TARGET',
    `${newVersion}`,
    'Release',
    projTarget
  );
  logMessage(
    `set deployment version to ${color.yellow(newVersion)} in ${color.yellow(
      logTarget
    )}`
  );

  return content;
}

function isNumberOrText(value: any): value is number | string {
  const typeofValue = typeof value;
  return typeofValue == 'string' || typeofValue == 'number';
}
function getVersionFromText(value: number | string): number {
  if (typeof value == 'number') return value;
  return +getText(value);
}
