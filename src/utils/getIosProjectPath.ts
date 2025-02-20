import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { getProjectPath } from './getProjectPath';

export function getIosProjectPath(
  projectPath: string = getProjectPath()
): string {
  const projectName = getIosProjectName(projectPath);
  return path.join(projectPath, 'ios', projectName);
}

export function getIosProjectName(
  projectPath: string = getProjectPath()
): string {
  let xcodeProjFolder: string | undefined;
  try {
    xcodeProjFolder = fs
      .readdirSync(path.join(projectPath, 'ios'))
      .find(x => x.endsWith(Constants.XCODEPROJ_EXT));
  } catch (_e) {
    xcodeProjFolder = undefined;
  }
  if (!xcodeProjFolder) throw new Error('iOS project not found.');
  return xcodeProjFolder.replace(Constants.XCODEPROJ_EXT, '');
}

export function getPbxProjectPath(
  projectPath: string = getProjectPath()
): string {
  const iosProjectPath = getIosProjectPath(projectPath);
  return path.join(iosProjectPath + '.xcodeproj', 'project.pbxproj');
}
