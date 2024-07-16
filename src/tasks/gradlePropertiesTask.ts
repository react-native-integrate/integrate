import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { BlockContentType, GradlePropertiesTaskType } from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export async function gradlePropertiesTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: GradlePropertiesTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

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
      content = await applyContentModification({
        action,
        findOrCreateBlock,
        configPath,
        packageName,
        content,
        indentation: 0,
        buildComment: buildGradlePropertiesComment,
      });
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

function findOrCreateBlock(): {
  blockContent: BlockContentType;
  content: string;
} {
  throw new Error('block is not supported in gradleProperties');
}

function buildGradlePropertiesComment(comment: string): string[] {
  return comment.split('\n').map(x => `# ${x}`);
}

function getGradlePropertiesPath() {
  const projectPath = getProjectPath();

  return path.join(
    projectPath,
    'android',
    Constants.GRADLE_PROPERTIES_FILE_NAME
  );
}

function readGradlePropertiesContent() {
  const gradlePropertiesPath = getGradlePropertiesPath();
  if (!fs.existsSync(gradlePropertiesPath)) return '';
  return fs.readFileSync(gradlePropertiesPath, 'utf-8');
}

function writeGradlePropertiesContent(content: string): void {
  const gradlePropertiesPath = getGradlePropertiesPath();
  return fs.writeFileSync(gradlePropertiesPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: GradlePropertiesTaskType;
}): Promise<void> {
  let content = readGradlePropertiesContent();

  content = await gradlePropertiesTask({
    ...args,
    content,
  });

  writeGradlePropertiesContent(content);
}

export const summary = 'gradle.properties modification';
