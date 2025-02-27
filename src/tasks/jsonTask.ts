import fs from 'fs';
import path from 'path';
import { JsonTaskType } from '../types/mod.types';
import { applyObjectModification } from '../utils/applyObjectModification';
import { checkCondition } from '../utils/checkCondition';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export function jsonTask(args: {
  configPath: string;
  packageName: string;
  content: Record<string, any>;
  task: JsonTaskType;
}): Record<string, any> {
  let { content } = args;
  const { task } = args;

  for (const action of task.actions) {
    variables.set('CONTENT', content);
    if (action.when && !checkCondition(action.when)) {
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

  return content;
}

function getJsonPath(filePath: string) {
  const projectPath = getProjectPath();
  const jsonPath = path.join(projectPath, filePath);
  // security check
  if (!jsonPath.startsWith(projectPath)) {
    throw new Error('invalid destination path');
  }
  return jsonPath;
}

function readJsonContent(filePath: string): Record<string, any> {
  const jsonPath = getJsonPath(filePath);
  return fs.existsSync(jsonPath)
    ? (JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as Record<string, any>)
    : {};
}

function writeJsonContent(
  content: Record<string, any>,
  filePath: string
): void {
  const jsonPath = getJsonPath(filePath);
  return fs.writeFileSync(jsonPath, JSON.stringify(content, null, 2), 'utf-8');
}

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: JsonTaskType;
}): void {
  let content = readJsonContent(args.task.path);

  content = jsonTask({
    ...args,
    content,
  });

  writeJsonContent(content, args.task.path);
}

export const summary = 'Json file modification';
