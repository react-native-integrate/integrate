import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import {
  BlockContentType,
  BuildGradleLocationType,
  BuildGradleTaskType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getProjectPath } from '../utils/getProjectPath';
import { stringSplice } from '../utils/stringSplice';

export function buildGradleTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: BuildGradleTaskType;
}): string {
  let { content } = args;
  const { task, configPath } = args;

  task.updates.forEach(update => {
    content = applyContentModification({
      update,
      findOrCreateBlock,
      configPath,
      content,
      indentation: 4,
    });
  });
  return content;
}

function findOrCreateBlock(
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
  for (let i = 0; i < blockPath.length; i++) {
    const partialPath = blockPath.slice(0, i + 1);
    const matcherRegex = new RegExp(
      `^((\\s+)?)${partialPath.join('.*?^(\\s+)?')}\\s+\\{`,
      'ms'
    );
    let blockStart = matcherRegex.exec(content);

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

      content = stringSplice(content, blockContent.end, 0, codeToInsert);
      blockStart = matcherRegex.exec(content);
    }
    if (!blockStart) {
      throw new Error('block could not be inserted, something wrong?');
    }
    const blockEndIndex = findClosingTagIndex(
      content,
      blockStart.index + blockStart[0].length
    );
    const blockBody = content.substring(
      blockStart.index + blockStart[0].length,
      blockEndIndex
    );
    blockContent = {
      start: blockStart.index + blockStart[0].length,
      end: blockEndIndex,
      match: blockBody,
      justCreated,
      space: ' '.repeat(4 * i),
    };
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

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: BuildGradleTaskType;
}): void {
  let content = readBuildGradleContent(args.task.location);

  content = buildGradleTask({
    ...args,
    content,
  });

  writeBuildGradleContent(content, args.task.location);
}
