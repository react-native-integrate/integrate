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
  let workspaceFolder: string | undefined;
  try {
    workspaceFolder = fs
      .readdirSync(path.join(projectPath, 'ios'))
      .find(x => x.endsWith(Constants.WORKSPACE_EXT));
  } catch (e) {
    workspaceFolder = undefined;
  }
  if (!workspaceFolder) throw new Error('iOS workspace not found.');
  return workspaceFolder.replace(Constants.WORKSPACE_EXT, '');
}

export function getPbxProjectPath(): string {
  const iosProjectPath = getIosProjectPath();
  return path.join(iosProjectPath + '.xcodeproj', 'project.pbxproj');
}
