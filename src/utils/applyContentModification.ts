import color from 'picocolors';
import { logMessage, logMessageGray, summarize } from '../prompter';
import {
  BlockContentType,
  ContentModifierType,
  TextOrRegex,
} from '../types/mod.types';
import { findInsertionPoint } from './findInsertionPoint';
import { findLineEnd, findLineStart } from './findLineTools';
import { getModContent } from './getModContent';
import { stringSplice } from './stringSplice';

export type FindOrCreateBlockType = (
  content: string,
  block: string
) => { blockContent: BlockContentType; content: string };
export type ApplyContentModificationArgType = {
  configPath: string;
  content: string;
  update: ContentModifierType;
  findOrCreateBlock: FindOrCreateBlockType;
  indentation: number;
  additionalModification?: (args: {
    content: string;
    blockContent: BlockContentType;
  }) => string;
  buildComment?: (comment: string) => string[];
};

export function applyContentModification(
  args: ApplyContentModificationArgType
): string {
  let { content } = args;
  const {
    configPath,
    update,
    findOrCreateBlock,
    indentation,
    additionalModification,
    buildComment,
  } = args;

  let blockContent = {
    start: 0,
    end: content.length - 1,
    match: content,
    justCreated: false,
    space: '',
  };
  if (update.block) {
    const foundBlock = findOrCreateBlock(content, update.block);
    blockContent = foundBlock.blockContent;
    content = foundBlock.content;
  }
  const getCodeToInsert = (text: string) => {
    const isBlockSameLine = !blockContent.match.includes('\n');
    let comment = '',
      blockIndentation = '',
      openingNewLine = '\n',
      closingNewLine = `\n${isBlockSameLine ? blockContent.space : ''}`;
    const isAppend = 'append' in update || 'before' in update;
    if (!isBlockSameLine) {
      if (isAppend || blockContent.start == 0) openingNewLine = '';
      else closingNewLine = '';
    }

    if (update.block) blockIndentation = ' '.repeat(indentation);
    if (update.comment) {
      const _buildCommand = buildComment || buildCommonComment;
      const commentLines = _buildCommand(update.comment);
      commentLines.forEach(line => {
        comment += `${blockContent.space}${blockIndentation}${line}\n`;
      });
    }
    return `${openingNewLine}${comment}${blockContent.space}${blockIndentation}${text}${closingNewLine}`;
  };
  const splittingMsgArr = applyContextReduction(update, blockContent, content);
  const splittingMsg = splittingMsgArr.length
    ? ` (${splittingMsgArr.join(', ')})`
    : '';
  if (update.prepend) {
    const prependText = getModContent(configPath, update.prepend);
    const codeToInsert = getCodeToInsert(prependText);

    if (
      update.ifNotPresent &&
      blockContent.match.includes(update.ifNotPresent)
    ) {
      logMessageGray(
        `found existing ${summarize(
          update.ifNotPresent
        )}, skipped inserting: ${summarize(prependText)}`
      );
    } else if (!blockContent.match.includes(prependText)) {
      content = stringSplice(content, blockContent.start, 0, codeToInsert);
      logMessage(
        `prepended code in ${summarize(
          getBlockName(update)
        )}${splittingMsg}: ${summarize(prependText)}`
      );

      const updateResult = updateBlockContent(
        update,
        content,
        findOrCreateBlock
      );
      content = updateResult.content;
      blockContent = updateResult.blockContent;
    } else
      logMessageGray(
        `code already exists, skipped prepending: ${summarize(prependText)}`
      );
  }
  if (update.append) {
    const appendText = getModContent(configPath, update.append);
    const codeToInsert = getCodeToInsert(appendText);
    if (
      update.ifNotPresent &&
      blockContent.match.includes(update.ifNotPresent)
    ) {
      logMessageGray(
        `found existing ${summarize(
          update.ifNotPresent
        )}, skipped inserting: ${summarize(appendText)}`
      );
    } else if (!blockContent.match.includes(appendText)) {
      content = stringSplice(
        content,
        findLineStart(content, blockContent.end, blockContent.start),
        0,
        codeToInsert
      );
      logMessage(
        `appended code in ${summarize(
          getBlockName(update)
        )}${splittingMsg}: ${summarize(appendText)}`
      );

      const updateResult = updateBlockContent(
        update,
        content,
        findOrCreateBlock
      );
      content = updateResult.content;
      blockContent = updateResult.blockContent;
    } else
      logMessageGray(
        `code already exists, skipped appending: ${summarize(appendText)}`
      );
  }
  if (additionalModification) {
    content = additionalModification({
      content,
      blockContent,
    });
    const updateResult = updateBlockContent(update, content, findOrCreateBlock);
    content = updateResult.content;
    blockContent = updateResult.blockContent;
  }
  return content;
}

function buildCommonComment(comment: string): string[] {
  return comment.split('\n').map(x => `// ${x}`);
}

function updateBlockContent(
  update: ContentModifierType,
  content: string,
  findOrCreateBlock: FindOrCreateBlockType
) {
  let blockContent: BlockContentType;

  if (update.block) {
    const foundBlock = findOrCreateBlock(content, update.block);
    blockContent = foundBlock.blockContent;
    content = foundBlock.content;
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

function resolveInsertionPoint(
  blockContent: BlockContentType,
  content: string,
  textOrRegex: TextOrRegex
) {
  if (blockContent.justCreated) {
    return {
      start: blockContent.start,
      end: blockContent.end,
      match: blockContent.match,
    };
  } else {
    const insertionPoint = findInsertionPoint(blockContent.match, textOrRegex);
    if (insertionPoint.start == -1) return insertionPoint;
    insertionPoint.start += blockContent.start;
    insertionPoint.end += blockContent.start;
    return insertionPoint;
  }
}

export function getBlockName(update: ContentModifierType): string {
  return update.block || 'file';
}

export function applyContextReduction(
  update: ContentModifierType,
  blockContent: BlockContentType,
  content: string
): string[] {
  const splittingMsgArr: string[] = [];
  if (update.after) {
    const foundIndex = resolveInsertionPoint(
      blockContent,
      content,
      update.after
    );
    if (foundIndex.start == -1) {
      if (update.strict) throw new Error('Could not find insertion point');

      logMessageGray(
        `insertion point not found, ignoring ${color.yellow('before')} criteria`
      );
    } else {
      blockContent.start = findLineEnd(
        content,
        foundIndex.end,
        blockContent.end
      );
      blockContent.match = content.substring(
        blockContent.start,
        blockContent.end
      );
      splittingMsgArr.push(`after ${summarize(foundIndex.match, 20)}`);
    }
  }

  if (update.before) {
    const foundIndex = resolveInsertionPoint(
      blockContent,
      content,
      update.before
    );
    if (foundIndex.start == -1) {
      if (update.strict) throw new Error('Could not find insertion point');

      logMessageGray(
        `insertion point not found, skipping ${color.yellow('before')} criteria`
      );
    } else {
      blockContent.end = findLineStart(
        content,
        foundIndex.start,
        blockContent.start
      );
      blockContent.match = content.substring(
        blockContent.start,
        blockContent.end
      );
      splittingMsgArr.push(`before ${summarize(foundIndex.match, 20)}`);
    }
  }
  return splittingMsgArr;
}
