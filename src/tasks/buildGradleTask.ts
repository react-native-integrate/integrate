import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { logMessage, logMessageGray, summarize } from '../prompter';
import {
  AppBuildGradleModType,
  BuildGradleModType,
  FindType,
} from '../types/mod.types';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { findInsertionPoint } from '../utils/findInsertionPoint';
import { findLineEnd, findLineStart } from '../utils/findLineTools';
import { getModContent } from '../utils/getModContent';
import { getProjectPath } from '../utils/getProjectPath';
import { stringSplice } from '../utils/stringSplice';

export function buildGradleTask(args: {
  isInAppFolder: boolean;
  configPath: string;
  packageName: string;
  content: string;
  task: BuildGradleModType | AppBuildGradleModType;
}): string {
  let { content } = args;
  const { task, configPath } = args;

  let blockContent = {
    start: 0,
    end: content.length - 1,
    match: content,
    justCreated: false,
    space: '',
  };

  if (task.path) {
    const checked = checkAndCreatePath(content, task.path);
    blockContent = checked.blockContent;
    content = checked.content;
  }
  const getCodeToInsert = (text: string) => {
    let comment = '',
      blockIndentation = '',
      openingNewLine = '\n',
      closingNewLine = `\n${
        blockContent.start == blockContent.end - 1 ? blockContent.space : ''
      }`;
    const isAppend = 'append' in task || 'before' in task;
    const isBlockSameLine = !blockContent.match.includes('\n');
    if (!isBlockSameLine) {
      if (isAppend) openingNewLine = '';
      else closingNewLine = '';
    }

    if (task.path) blockIndentation = ' '.repeat(4);
    if (task.comment)
      comment = `${blockContent.space}${blockIndentation}// ${task.comment}
`;
    return `${openingNewLine}${comment}${blockContent.space}${blockIndentation}${text}${closingNewLine}`;
  };
  if ('prepend' in task) {
    const prependText = getModContent(configPath, task.prepend);
    const codeToInsert = getCodeToInsert(prependText);

    if (task.ifNotPresent && blockContent.match.includes(task.ifNotPresent)) {
      logMessageGray(
        `found existing ${summarize(
          task.ifNotPresent
        )}, skipped inserting: ${summarize(prependText)}`
      );
    } else if (!blockContent.match.includes(prependText)) {
      content = stringSplice(content, blockContent.start, 0, codeToInsert);
      logMessage(
        `prepended code in ${summarize(getPathName(task))}: ${summarize(
          prependText
        )}`
      );

      const updateResult = updateBlockContent(task, content);
      content = updateResult.content;
      blockContent = updateResult.blockContent;
    } else
      logMessageGray(
        `code already exists, skipped prepending: ${summarize(prependText)}`
      );
  }
  if ('append' in task) {
    const appendText = getModContent(configPath, task.append);
    const codeToInsert = getCodeToInsert(appendText);
    if (task.ifNotPresent && blockContent.match.includes(task.ifNotPresent)) {
      logMessageGray(
        `found existing ${summarize(
          task.ifNotPresent
        )}, skipped inserting: ${summarize(appendText)}`
      );
    } else if (!blockContent.match.includes(appendText)) {
      content = stringSplice(
        content,
        findLineStart(content, blockContent.end - 1, blockContent.start),
        0,
        codeToInsert
      );
      logMessage(
        `appended code in ${summarize(getPathName(task))}: ${summarize(
          appendText
        )}`
      );

      const updateResult = updateBlockContent(task, content);
      content = updateResult.content;
      blockContent = updateResult.blockContent;
    } else
      logMessageGray(
        `code already exists, skipped appending: ${summarize(appendText)}`
      );
  }
  if ('before' in task) {
    const text = getModContent(configPath, task.before.insert);
    const codeToInsert = getCodeToInsert(text);
    let foundIndex = resolveInsertionPoint(blockContent, content, task.before);
    if (foundIndex.start == -1) {
      if (task.before.strict) throw new Error('Could not find insertion point');

      // behave like append
      foundIndex = {
        start: blockContent.end - 1,
        end: blockContent.end - 1,
        match: 'bottom',
      };
      logMessageGray('insertion point not found, appending instead');
    }
    if (task.ifNotPresent && blockContent.match.includes(task.ifNotPresent)) {
      logMessageGray(
        `found existing ${summarize(
          task.ifNotPresent
        )}, skipped inserting: ${summarize(text)}`
      );
    } else if (!blockContent.match.includes(text)) {
      content = stringSplice(
        content,
        findLineStart(content, foundIndex.start, blockContent.start),
        0,
        codeToInsert
      );
      logMessage(
        `inserted code into ${summarize(getPathName(task))} (before ${summarize(
          foundIndex.match,
          20
        )}): ${summarize(text)}`
      );
      const updateResult = updateBlockContent(task, content);
      content = updateResult.content;
      blockContent = updateResult.blockContent;
    } else
      logMessageGray(
        `code already exists, skipped inserting: ${summarize(text)}`
      );
  }
  if ('after' in task) {
    const text = getModContent(configPath, task.after.insert);
    const codeToInsert = getCodeToInsert(text);
    let foundIndex = resolveInsertionPoint(blockContent, content, task.after);
    if (foundIndex.start == -1) {
      if (task.after.strict) throw new Error('Could not find insertion point');

      // behave like prepend
      foundIndex = {
        start: blockContent.start,
        end: blockContent.start,
        match: 'top',
      };
      logMessageGray('insertion point not found, appending instead');
    }
    if (task.ifNotPresent && blockContent.match.includes(task.ifNotPresent)) {
      logMessageGray(
        `found existing ${summarize(
          task.ifNotPresent
        )}, skipped inserting: ${summarize(text)}`
      );
    } else if (!blockContent.match.includes(text)) {
      content = stringSplice(
        content,
        findLineEnd(content, foundIndex.end, blockContent.end - 1),
        0,
        codeToInsert
      );
      logMessage(
        `inserted code into ${summarize(getPathName(task))} (after ${summarize(
          foundIndex.match,
          20
        )}): ${summarize(text)}`
      );
    } else
      logMessageGray(
        `code already exists, skipped inserting: ${summarize(text)}`
      );
  }
  return content;
}

function checkAndCreatePath(
  content: string,
  path: string
): {
  blockContent: {
    start: number;
    end: number;
    match: string;
    justCreated: boolean;
    space: string;
  };
  content: string;
} {
  let blockContent = {
    start: 0,
    end: content.length,
    match: content,
    space: '',
    justCreated: false,
  };

  const blockPath = path.split('.');
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
      // create block in path
      const space = ' '.repeat(4 * i);
      const previousSpace = ' '.repeat(Math.max(0, 4 * (i - 1)));
      const newBlock = `${space}${blockName} {}`;
      const codeToInsert = `
${newBlock}
${previousSpace}`;

      content = stringSplice(content, blockContent.end - 1, 0, codeToInsert);
      blockStart = matcherRegex.exec(content);
    }
    if (!blockStart) {
      throw new Error('block could not be inserted, something wrong?');
    }
    const blockEndIndex = findClosingTagIndex(
      content,
      blockStart.index + blockStart[0].length
    );
    const bockBody = content.substring(
      blockStart.index + blockStart[0].length,
      blockEndIndex
    );
    blockContent = {
      start: blockStart.index + blockStart[0].length,
      end: blockEndIndex,
      match: bockBody,
      justCreated,
      space: ' '.repeat(4 * i),
    };
  }

  return {
    blockContent,
    content,
  };
}

function getBuildGradlePath(isInAppFolder: boolean) {
  const projectPath = getProjectPath();

  const buildGradlePath = path.join(
    projectPath,
    'android',
    isInAppFolder ? 'app' : '',
    Constants.BUILD_GRADLE_FILE_NAME
  );
  if (!fs.existsSync(buildGradlePath))
    throw new Error(`build.gradle file not found at ${buildGradlePath}`);
  return buildGradlePath;
}

function readBuildGradleContent(isInAppFolder: boolean) {
  const buildGradlePath = getBuildGradlePath(isInAppFolder);
  return fs.readFileSync(buildGradlePath, 'utf-8');
}

function writeBuildGradleContent(
  isInAppFolder: boolean,
  content: string
): void {
  const buildGradlePath = getBuildGradlePath(isInAppFolder);
  return fs.writeFileSync(buildGradlePath, content, 'utf-8');
}

export function runTask(args: {
  isInAppFolder: boolean;
  configPath: string;
  packageName: string;
  task: BuildGradleModType | AppBuildGradleModType;
}): void {
  let content = readBuildGradleContent(args.isInAppFolder);

  content = buildGradleTask({
    ...args,
    content,
  });

  writeBuildGradleContent(args.isInAppFolder, content);
}

function updateBlockContent(
  task: BuildGradleModType | AppBuildGradleModType,
  content: string
) {
  let blockContent: {
    start: number;
    match: string;
    end: number;
    justCreated: boolean;
    space: string;
  };

  if (task.path) {
    const checked = checkAndCreatePath(content, task.path);
    blockContent = checked.blockContent;
    content = checked.content;
  } else
    blockContent = {
      start: 0,
      end: content.length,
      match: content,
      justCreated: false,
      space: '',
    };
  return { content, blockContent };
}

function getPathName(task: BuildGradleModType | AppBuildGradleModType) {
  return task.path || 'build.gradle';
}

function resolveInsertionPoint(
  blockContent: {
    start: number;
    match: string;
    end: number;
    justCreated: boolean;
    space: string;
  },
  content: string,
  taskInserter: FindType
) {
  if (blockContent.justCreated) {
    return {
      start: blockContent.start,
      end: blockContent.end - 1,
      match: blockContent.match,
    };
  } else {
    const insertionPoint = findInsertionPoint(blockContent.match, taskInserter);
    if (insertionPoint.start == -1) return insertionPoint;
    insertionPoint.start += blockContent.start;
    insertionPoint.end += blockContent.start;
    return insertionPoint;
  }
}
