import fs from 'fs';
import { globSync } from 'glob';
import { Constants } from '../constants';
import {
  AndroidCodeType,
  BlockContentType,
  MainApplicationTaskType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { variables } from '../variables';

export async function mainApplicationTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: MainApplicationTaskType;
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
        indentation: 2,
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
  let contentOffset = 0;

  for (let i = 0; i < blockPath.length; i++) {
    const matcherRegex = new RegExp(`^((\\s+)?)${blockPath[i]}\\s+\\{`, 'ms');
    let blockStart = matcherRegex.exec(blockContent.match);

    const justCreated = !blockStart;
    if (!blockStart) {
      const blockName = blockPath[i];
      // create block in block
      const space = ' '.repeat(2 * i);
      const previousSpace = ' '.repeat(Math.max(0, 2 * (i - 1)));
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
      space: ' '.repeat(2 * i),
    };
    contentOffset += blockStart.index + blockStart[0].length;
  }

  return {
    blockContent,
    content,
  };
}

function getMainApplicationPath(lang?: AndroidCodeType) {
  const projectPath = getProjectPath();

  const mainApplicationPath = globSync(
    [
      projectPath,
      'android',
      'app',
      'src',
      'main',
      'java',
      '**',
      lang === 'kotlin'
        ? Constants.MAIN_APPLICATION_KT_FILE_NAME
        : Constants.MAIN_APPLICATION_JAVA_FILE_NAME,
    ].join('/'),
    { nodir: true }
  )[0];
  if (!mainApplicationPath)
    throw new Error(
      `MainApplication.${lang === 'kotlin' ? 'kt' : 'java'} file not found`
    );
  return mainApplicationPath;
}

function readMainApplicationContent(lang?: AndroidCodeType) {
  const mainApplicationPath = getMainApplicationPath(lang);
  return fs.readFileSync(mainApplicationPath, 'utf-8');
}

function writeAppDelegateContent(
  content: string,
  lang?: AndroidCodeType
): void {
  const mainApplicationPath = getMainApplicationPath(lang);
  return fs.writeFileSync(mainApplicationPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: MainApplicationTaskType;
}): Promise<void> {
  let content = readMainApplicationContent(args.task.lang);

  content = await mainApplicationTask({
    ...args,
    content,
  });

  writeAppDelegateContent(content, args.task.lang);
}

export const summary = 'MainApplication modification';
