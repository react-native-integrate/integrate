import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { BlockContentType, PodFileTaskType } from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import {
  findClosingTagIndex,
  TagDefinitions,
} from '../utils/findClosingTagIndex';
import { getProjectPath } from '../utils/getProjectPath';
import { stringSplice } from '../utils/stringSplice';

export function podFileTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: PodFileTaskType;
}): string {
  let { content } = args;
  const { task, configPath } = args;

  task.actions.forEach(action => {
    content = applyContentModification({
      action,
      findOrCreateBlock,
      configPath,
      content,
      indentation: 2,
      buildComment: buildPodComment,
    });
  });
  return content;
}

function buildPodComment(comment: string): string[] {
  return comment.split('\n').map(x => `# ${x}`);
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
      `^((\\s+)?)${partialPath.join(
        '.*?^(\\s+)?'
      )}.*?\\bdo\\b(\\s\\|.*?\\|)? ?`,
      'ms'
    );
    let blockStart = matcherRegex.exec(content);

    const justCreated = !blockStart;
    if (!blockStart) {
      const blockName = blockPath[i];
      // create block in block
      const space = ' '.repeat(2 * i);
      const previousSpace = ' '.repeat(Math.max(0, 2 * (i - 1)));
      const newBlock = buildBlock(space, blockName);
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
      blockStart.index + blockStart[0].length,
      TagDefinitions.POD
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
      space: ' '.repeat(2 * i),
    };
  }

  return {
    blockContent,
    content,
  };
}

function buildBlock(space: string, blockName: string) {
  if (blockName === 'target') {
    // name is not specified so cannot create, throw error
    throw new Error('target not found, something is wrong?');
  } else if (/target '.*?'/.test(blockName)) {
    // name is specified, create block
    return `${space}${blockName} do end`;
  } else if (podHooks.includes(blockName)) {
    return `${space}${blockName} do |installer| end`;
  } else {
    throw new Error('invalid block: ' + blockName);
  }
}

const podHooks = [
  'pre_install',
  'pre_integrate',
  'post_install',
  'post_integrate',
];

function getPodFilePath() {
  const projectPath = getProjectPath();

  const podFilePath = path.join(projectPath, 'ios', Constants.POD_FILE_NAME);
  if (!fs.existsSync(podFilePath))
    throw new Error(`Pod file not found at ${podFilePath}`);
  return podFilePath;
}

function readPodFileContent() {
  const podFilePath = getPodFilePath();
  return fs.readFileSync(podFilePath, 'utf-8');
}

function writePodFileContent(content: string): void {
  const podFilePath = getPodFilePath();
  return fs.writeFileSync(podFilePath, content, 'utf-8');
}

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: PodFileTaskType;
}): void {
  let content = readPodFileContent();

  content = podFileTask({
    ...args,
    content,
  });

  writePodFileContent(content);
}
