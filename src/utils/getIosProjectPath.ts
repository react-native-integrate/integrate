import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { getProjectPath } from './getProjectPath';

export function getIosProjectPath(): string {
  const projectPath = getProjectPath();
  const projectName = getIosProjectName();
  return path.join(projectPath, 'ios', projectName);
}

export function getIosProjectName(): string {
  const projectPath = getProjectPath();
  let xcodeProjFolder: string | undefined;
  try {
    xcodeProjFolder = fs
      .readdirSync(path.join(projectPath, 'ios'))
      .find(x => x.endsWith(Constants.XCODEPROJ_EXT));
  } catch (e) {
    xcodeProjFolder = undefined;
  }
  if (!xcodeProjFolder) throw new Error('iOS project not found.');
  return xcodeProjFolder.replace(Constants.XCODEPROJ_EXT, '');
}

export function getPbxProjectPath(): string {
  const iosProjectPath = getIosProjectPath();
  return path.join(iosProjectPath + '.xcodeproj', 'project.pbxproj');
}
