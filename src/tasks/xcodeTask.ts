import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../constants';
import { logMessage, logMessageGray } from '../prompter';
import { XcodeModifierType, XcodeTaskType } from '../types/mod.types';
import { XcodeProjectType, XcodeType } from '../types/xcode.type';
import { getErrMessage } from '../utils/getErrMessage';
import { getPbxProjectPath } from '../utils/getIosProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { getText, variables } from '../variables';
import { applyFsModification } from './fsTask';

const xcode: XcodeType = require('xcode');

export async function xcodeTask(args: {
  configPath: string;
  packageName: string;
  content: XcodeProjectType;
  task: XcodeTaskType;
}): Promise<XcodeProjectType> {
  let { content } = args;
  const { task } = args;

  for (const action of task.actions) {
    if (action.when && !satisfies(variables.getStore(), action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
        error: false,
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
      error: false,
    });
    try {
      content = await applyXcodeModification(content, action);
      setState(action.name, {
        state: 'done',
        error: false,
      });
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
        error: true,
      });
      throw e;
    }
  }

  return content;
}

async function applyXcodeModification(
  content: XcodeProjectType,
  action: XcodeModifierType
) {
  let { target } = action;
  target = target || 'root';
  if (typeof target == 'string') target = getText(target) as 'root' | 'app';
  action.addFile = getText(action.addFile);

  const fileName = path.basename(action.addFile);
  const nativeTarget = content.getTarget(Constants.XCODE_APPLICATION_TYPE);
  let group;
  let logTarget;
  let destination = 'ios';
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
      destination += `/${nativeTarget.target.name}`;
      break;
    default:
      if (target.name != null) target.name = getText(target.name);
      if (target.path != null) target.path = getText(target.path);
      group = content.findPBXGroupKey(target);
      logTarget = `${target.name} target`;
      destination += `/${target.name}`;
      break;
  }
  destination += `/${fileName}`;
  const groupObj = content.getPBXGroupByKey(group);
  if (groupObj.children.some(x => x.comment == action.addFile)) {
    logMessageGray(
      `skipped adding resource, ${color.yellow(
        action.addFile
      )} is already referenced in ${color.yellow(logTarget)}`
    );
    return content;
  }

  // copy file
  await applyFsModification({
    copyFile: fileName,
    destination,
    message: action.message,
  });

  const releasePatch = patchXcodeProject();
  try {
    content.addResourceFile(fileName, { target: nativeTarget.uuid }, group);
  } finally {
    releasePatch();
  }
  logMessage(
    `added ${color.yellow(action.addFile)} reference in ${color.yellow(
      logTarget
    )}`
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

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: XcodeTaskType;
}): Promise<void> {
  let content = readPbxProjContent();

  content = await xcodeTask({
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
