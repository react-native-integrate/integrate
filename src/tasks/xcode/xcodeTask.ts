import fs from 'fs';
import xcode, { XcodeProjectType } from 'xcode';
import { XcodeModifierType, XcodeTaskType } from '../../types/mod.types';
import { checkCondition } from '../../utils/checkCondition';
import { getErrMessage } from '../../utils/getErrMessage';
import { getPbxProjectPath } from '../../utils/getIosProjectPath';
import { processScript } from '../../utils/processScript';
import { setState } from '../../utils/setState';
import { xcodeContext } from '../../utils/xcode.context';
import { variables } from '../../variables';
import { applyAddCapability } from './xcodeTask.addCapability';
import { applyAddConfiguration } from './xcodeTask.addConfiguration';
import { applyAddFile } from './xcodeTask.addFile';
import { applyAddPreBuildRunScriptAction } from './xcodeTask.addPreBuildRunScriptAction';
import { applyAddTarget } from './xcodeTask.addTarget';
import { applySetDeploymentVersion } from './xcodeTask.setDeploymentVersion';

export async function xcodeTask(args: {
  configPath: string;
  packageName: string;
  content: XcodeProjectType;
  task: XcodeTaskType;
}): Promise<XcodeProjectType> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    if (action.when && !checkCondition(action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
    });
    try {
      content = await applyXcodeModification(
        content,
        action,
        configPath,
        packageName
      );
      setState(action.name, {
        state: 'done',
      });
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
      });
      throw e;
    }
  }

  return content;
}

async function applyXcodeModification(
  content: XcodeProjectType,
  action: XcodeModifierType,
  configPath: string,
  packageName: string
) {
  if ('addFile' in action) return applyAddFile(content, action, packageName);
  if ('addTarget' in action)
    return applyAddTarget(content, action, packageName);
  if ('addCapability' in action) return applyAddCapability(content, action);
  if ('setDeploymentVersion' in action)
    return applySetDeploymentVersion(content, action);
  if ('addConfiguration' in action)
    return applyAddConfiguration(content, action, configPath, packageName);
  if ('addPreBuildRunScriptAction' in action)
    return applyAddPreBuildRunScriptAction(
      content,
      action,
      configPath,
      packageName
    );
  if ('script' in action) {
    if (typeof action.script === 'string') {
      const resultValue = await processScript(
        action.script,
        variables,
        false,
        true,
        {
          project: content,
        }
      );
      if (action.name && resultValue != null)
        variables.set(action.name, resultValue);
    } else {
      const resultValue = await action.script(content);
      if (action.name && resultValue != null)
        variables.set(action.name, resultValue);
    }
    return content;
  }
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
  try {
    xcodeContext.set(content);
    content = await xcodeTask({
      ...args,
      content,
    });

    writePbxProjContent(content);
  } finally {
    xcodeContext.clear();
  }
}

export const summary = 'Xcode project modification';
