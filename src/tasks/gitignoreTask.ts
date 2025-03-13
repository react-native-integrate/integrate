import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { BlockContentType, GitignoreTaskType } from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { checkCondition } from '../utils/checkCondition';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export async function gitignoreTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: GitignoreTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    variables.set('CONTENT', content);
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
      content = await applyContentModification({
        action,
        findOrCreateBlock,
        configPath,
        packageName,
        content,
        indentation: 0,
        buildComment: buildGitignoreComment,
      });
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

function findOrCreateBlock(): {
  blockContent: BlockContentType;
  content: string;
} {
  throw new Error('block is not supported in gitignore');
}

function buildGitignoreComment(comment: string): string[] {
  return comment.split('\n').map(x => `# ${x}`);
}

function getGitignorePath() {
  const projectPath = getProjectPath();

  return path.join(projectPath, Constants.GITIGNORE_FILE_NAME);
}

function readGitignoreContent() {
  const gitignorePath = getGitignorePath();
  if (!fs.existsSync(gitignorePath)) return '';
  return fs.readFileSync(gitignorePath, 'utf-8');
}

function writeGitignoreContent(content: string): void {
  const gitignorePath = getGitignorePath();
  return fs.writeFileSync(gitignorePath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: GitignoreTaskType;
}): Promise<void> {
  let content = readGitignoreContent();

  content = await gitignoreTask({
    ...args,
    content,
  });

  writeGitignoreContent(content);
}

export const summary = '.gitignore modification';
