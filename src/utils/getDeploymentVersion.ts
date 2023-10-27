import xcode, { XcodeProjectType } from 'xcode';
import { Constants } from '../constants';
import { getPbxProjectPath } from './getIosProjectPath';
import { xcodeContext } from './xcode.context';

export function getIosDeploymentVersion(): string {
  // get current xcode context
  let proj = xcodeContext.get();

  if (!proj) {
    // open project from file
    const pbxFilePath = getPbxProjectPath();
    proj = xcode.project(pbxFilePath);
    proj.parseSync();
  }
  return getIosDeploymentVersionFromXcodeProject(proj).version;
}

export function getIosDeploymentVersionFromXcodeProject(
  proj: XcodeProjectType
): { target: 'root' | 'main'; version: string } {
  const nativeTarget = proj.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let version = proj.getBuildPropertyByTarget(
    'IPHONEOS_DEPLOYMENT_TARGET',
    'Release',
    nativeTarget.target
  ) as string;
  let target: 'root' | 'main' = 'main';
  if (!version) {
    version = proj.getBuildPropertyByTarget(
      'IPHONEOS_DEPLOYMENT_TARGET',
      'Release',
      proj.getFirstProject().firstProject
    );
    target = 'root';
  }

  return { target, version };
}
