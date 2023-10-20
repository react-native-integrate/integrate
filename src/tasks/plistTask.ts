import fs from 'fs';
import path from 'path';
import plist from 'simple-plist';
import { Constants } from '../constants';
import { PlistTaskType } from '../types/mod.types';
import { applyObjectModification } from '../utils/applyObjectModification';
import { getErrMessage } from '../utils/getErrMessage';
import { getIosProjectName } from '../utils/getIosProjectPath';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export function plistTask(args: {
  configPath: string;
  packageName: string;
  content: Record<string, any>;
  task: PlistTaskType;
}): Record<string, any> {
  let { content } = args;
  const { task } = args;

  for (const action of task.actions) {
    variables.set('CONTENT', content);
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
      content = applyObjectModification(content, action);
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

  content = Object.keys(content)
    .sort()
    .reduce((temp_obj, key) => {
      temp_obj[key] = content[key];
      return temp_obj;
    }, {} as Record<string, any>);

  return content;
}

function getPListPath(
  target: string | undefined,
  filename: string,
  skipCheck: boolean
) {
  if (!target) target = getIosProjectName();
  const projectPath = getProjectPath();
  const pListPath = path.join(projectPath, 'ios', target, filename);
  if (!skipCheck && !fs.existsSync(pListPath))
    throw new Error(`Plist file not found at ${pListPath}`);
  return pListPath;
}

export function readPListContent(
  target: string | undefined,
  filename = Constants.PLIST_FILE_NAME,
  skipCheck = false
): Record<string, any> {
  const plistPath = getPListPath(target, filename, skipCheck);
  if (skipCheck && !fs.existsSync(plistPath)) return {};
  return plist.parse(fs.readFileSync(plistPath, 'utf-8'));
}

export function writePListContent(
  content: Record<string, any>,
  target: string | undefined,
  filename = Constants.PLIST_FILE_NAME
): void {
  const plistPath = getPListPath(target, filename, true);
  return fs.writeFileSync(plistPath, plist.stringify(content), 'utf-8');
}

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: PlistTaskType;
}): void {
  let content = readPListContent(args.task.target);

  content = plistTask({
    ...args,
    content,
  });

  writePListContent(content, args.task.target);
}

export const summary = 'Info.plist modification';
