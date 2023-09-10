import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../constants';
import { logMessage, logMessageGray } from '../prompter';
import {
  IosResourcesModifierType,
  IosResourcesTaskType,
} from '../types/mod.types';
import { XcodeProjectType, XcodeType } from '../types/xcode.type';
import { getPbxProjectPath } from '../utils/getIosProjectPath';
import { getText } from '../variables';

const xcode: XcodeType = require('xcode');

export function iosResourcesTask(args: {
  configPath: string;
  packageName: string;
  content: XcodeProjectType;
  task: IosResourcesTaskType;
}): XcodeProjectType {
  let { content } = args;
  const { task } = args;

  task.updates.forEach(update => {
    content = applyIosResourcesModification(content, update);
  });

  return content;
}

function applyIosResourcesModification(
  content: XcodeProjectType,
  update: IosResourcesModifierType
) {
  let { target } = update;
  target = target || 'root';
  if (typeof target == 'string') target = getText(target) as 'root' | 'app';
  update.add = getText(update.add);

  const fileName = path.basename(update.add);
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
      if (target.name != null) target.name = getText(target.name);
      if (target.path != null) target.path = getText(target.path);
      group = content.findPBXGroupKey(target);
      logTarget = `${target.name} target`;
      break;
  }
  const groupObj = content.getPBXGroupByKey(group);
  if (groupObj.children.some(x => x.comment == update.add)) {
    logMessageGray(
      `skipped adding resource, ${color.yellow(
        update.add
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
    `added ${color.yellow(update.add)} reference in ${color.yellow(logTarget)}`
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
  task: IosResourcesTaskType;
}): void {
  let content = readPbxProjContent();

  content = iosResourcesTask({
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
