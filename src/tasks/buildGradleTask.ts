import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import {
  BlockContentType,
  BuildGradleLocationType,
  BuildGradleTaskType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { checkCondition } from '../utils/checkCondition';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { variables } from '../variables';

export async function buildGradleTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: BuildGradleTaskType;
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
        indentation: 4,
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

export function findOrCreateBlock(
  content: string,
  block: string
): {
  blockContent: BlockContentType;
  content: string;
} {
  let blockContent = {
    start: 0,
    end: content.length,
    match: content,
    space: '',
    justCreated: false,
  };

  const blockPath = block.split('.');
  let contentOffset = 0;

  for (let i = 0; i < blockPath.length; i++) {
    const matcherRegex = new RegExp(`^((\\s+)?)${blockPath[i]}\\s+\\{`, 'ms');
    let blockStart = matcherRegex.exec(blockContent.match);

    const justCreated = !blockStart;
    if (!blockStart) {
      const blockName = blockPath[i];
      // create block in block
      const space = ' '.repeat(4 * i);
      const previousSpace = ' '.repeat(Math.max(0, 4 * (i - 1)));
      const newBlock = `${space}${blockName} {}`;
      const codeToInsert = `
${newBlock}
${previousSpace}`;
      const contentLengthBeforeInsert = content.length;
      content = stringSplice(content, blockContent.end, 0, codeToInsert);
      if (codeToInsert.length && contentLengthBeforeInsert < content.length) {
        blockContent.match += codeToInsert;
        blockContent.end += codeToInsert.length;
        blockStart = matcherRegex.exec(blockContent.match);
      }
    }
    if (!blockStart) {
      throw new Error('block could not be inserted, something wrong?');
    }

    const blockEndIndex = findClosingTagIndex(
      content,
      contentOffset + blockStart.index + blockStart[0].length
    );
    const blockBody = content.substring(
      contentOffset + blockStart.index + blockStart[0].length,
      blockEndIndex
    );
    blockContent = {
      start: contentOffset + blockStart.index + blockStart[0].length,
      end: blockEndIndex,
      match: blockBody,
      justCreated,
      space: ' '.repeat(4 * i),
    };
    contentOffset += blockStart.index + blockStart[0].length;
  }

  return {
    blockContent,
    content,
  };
}

function getBuildGradlePath(location: BuildGradleLocationType) {
  const projectPath = getProjectPath();

  const buildGradlePath = path.join(
    projectPath,
    'android',
    location == 'app' ? 'app' : '',
    Constants.BUILD_GRADLE_FILE_NAME
  );
  if (!fs.existsSync(buildGradlePath))
    throw new Error(`build.gradle file not found at ${buildGradlePath}`);
  return buildGradlePath;
}

function readBuildGradleContent(location = 'root' as BuildGradleLocationType) {
  const buildGradlePath = getBuildGradlePath(location);
  return fs.readFileSync(buildGradlePath, 'utf-8');
}

function writeBuildGradleContent(
  content: string,
  location = 'root' as BuildGradleLocationType
): void {
  const buildGradlePath = getBuildGradlePath(location);
  return fs.writeFileSync(buildGradlePath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: BuildGradleTaskType;
}): Promise<void> {
  let content = readBuildGradleContent(args.task.location);

  content = await buildGradleTask({
    ...args,
    content,
  });

  writeBuildGradleContent(content, args.task.location);
}

export const summary = 'build.gradle modification';
