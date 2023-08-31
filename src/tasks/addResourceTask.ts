import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../constants';
import { logMessage, logMessageGray } from '../prompter';
import { AddResourceType } from '../types/mod.types';
import { XcodeProjectType, XcodeType } from '../types/xcode.type';
import { getPbxProjectPath } from '../utils/getIosProjectPath';

const xcode: XcodeType = require('xcode');

export function addResourceTask(args: {
  configPath: string;
  packageName: string;
  content: XcodeProjectType;
  task: AddResourceType;
}): XcodeProjectType {
  const { content, task } = args;
  let { target } = task;
  target = target || 'root';

  const fileName = path.basename(task.file);
  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let group;
  let logTarget;
  switch (target) {
    case 'root':
      group = content.getFirstProject().firstProject.mainGroup;
      logTarget = 'project root';
      break;
    case 'app':
      group = content.findPBXGroupKey({
        name: nativeTarget.target.name,
      });
      logTarget = `${nativeTarget.target.name} target`;
      break;
    default:
      group = content.findPBXGroupKey(target);
      logTarget = `${target.name} target`;
      break;
  }
  const groupObj = content.getPBXGroupByKey(group);
  if (groupObj.children.some(x => x.comment == task.file)) {
    logMessageGray(
      `skipped adding resource, ${color.yellow(
        task.file
      )} is already referenced in ${color.yellow(logTarget)}`
    );
    return content;
  }
  const releasePatch = patchXcodeProject();
  try {
    content.addResourceFile(fileName, { target: nativeTarget.uuid }, group);
  } finally {
    releasePatch();
  }
  logMessage(
    `added ${color.yellow(task.file)} reference in ${color.yellow(logTarget)}`
  );
  return content;
}

function getPbxProjPath() {
  const pbxFilePath = getPbxProjectPath();
  if (!fs.existsSync(pbxFilePath)) {
    // noinspection SpellCheckingInspection
    throw new Error(`project.pbxproj file not found at ${pbxFilePath}`);
  }
  return pbxFilePath;
}

function readPbxProjContent() {
  const pbxFilePath = getPbxProjPath();
  const proj = xcode.project(pbxFilePath);
  proj.parseSync();
  return proj;
}

function writePbxProjContent(proj: XcodeProjectType): void {
  const appDelegatePath = getPbxProjPath();
  return fs.writeFileSync(appDelegatePath, proj.writeSync(), 'utf-8');
}

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: AddResourceType;
}): void {
  let content = readPbxProjContent();

  content = addResourceTask({
    ...args,
    content,
  });

  writePbxProjContent(content);
}

function patchXcodeProject() {
  /* eslint-disable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
  // fixes a bug in pbxGroupByName
  const pbxGroupByNameOriginal = xcode.project.prototype.pbxGroupByName as (
    name: string
  ) => { path: string };
  xcode.project.prototype.pbxGroupByName = function (name: string) {
    const result = pbxGroupByNameOriginal.call(this, name);
    if (name == 'Resources' && result == null) return { path: null };
    return result;
  };
  // makes files to be added on top
  const arrayPushOriginal = Array.prototype.push;
  Array.prototype.push = function (item: any) {
    return this.unshift(item);
  };
  /* eslint-enable @typescript-eslint/unbound-method, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
  return () => {
    xcode.project.prototype.pbxGroupByName = pbxGroupByNameOriginal;
    Array.prototype.push = arrayPushOriginal;
  };
}
