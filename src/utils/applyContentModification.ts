import color from 'picocolors';
import { logMessage, logMessageGray, summarize } from '../prompter';
import {
  BlockContentType,
  ContentModifierType,
  TextOrRegex,
} from '../types/mod.types';
import { getText } from '../variables';
import { escapeRegExp } from './escapeRegExp';
import { findInsertionPoint } from './findInsertionPoint';
import { findLineEnd, findLineStart } from './findLineTools';
import { getModContent } from './getModContent';
import { setState } from './setState';
import { stringSplice } from './stringSplice';

export type FindOrCreateBlockType = (
  content: string,
  block: string
) => { blockContent: BlockContentType; content: string };
export type ApplyContentModificationArgType = {
  packageName: string;
  configPath: string;
  content: string;
  action: ContentModifierType;
  findOrCreateBlock: FindOrCreateBlockType;
  indentation: number;
  additionalModification?: (args: {
    content: string;
    blockContent: BlockContentType;
  }) => string;
  buildComment?: (comment: string) => string[];
};

export async function applyContentModification(
  args: ApplyContentModificationArgType
): Promise<string> {
  let { content } = args;
  const {
    configPath,
    packageName,
    action,
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
  if (action.block) {
    action.block = getText(action.block);
    const foundBlock = findOrCreateBlock(content, action.block);
    blockContent = foundBlock.blockContent;
    content = foundBlock.content;
  }
  const getCodeToInsert = (text: string) => {
    const isBlockSameLine = !blockContent.match.includes('\n');
    let comment = '',
      blockIndentation = '',
      openingNewLine = '\n',
      closingNewLine = `\n${isBlockSameLine ? blockContent.space : ''}`;
    const isAppend = 'append' in action || 'before' in action;
    if (!isBlockSameLine) {
      if (isAppend || blockContent.start == 0) openingNewLine = '';
      else closingNewLine = '';
    }

    if (action.block) blockIndentation = ' '.repeat(indentation);
    if (action.comment) {
      const _buildCommand = buildComment || buildCommonComment;
      const commentLines = _buildCommand(getText(action.comment));
      commentLines.forEach(line => {
        comment += `${blockContent.space}${blockIndentation}${line}\n`;
      });
    }
    return `${openingNewLine}${comment}${blockContent.space}${blockIndentation}${text}${closingNewLine}`;
  };
  const splittingMsgArr = applyContextReduction(action, blockContent, content);
  const splittingMsg = splittingMsgArr.length
    ? ` (${splittingMsgArr.join(', ')})`
    : '';
  const runModifiers = async (
    spliceCallback?: (start: number, rem: number, insert: string) => void
  ) => {
    for (const key of Object.keys(action)) {
      switch (key) {
        case 'prepend':
          if (action.prepend) {
            const prependText = await getModContent(
              configPath,
              packageName,
              action.prepend
            );
            const codeToInsert = action.exact
              ? prependText
              : getCodeToInsert(prependText);

            if (
              action.ifNotPresent &&
              blockContent.match.includes(getText(action.ifNotPresent))
            ) {
              logMessageGray(
                `found existing ${summarize(
                  getText(action.ifNotPresent)
                )}, skipped inserting: ${summarize(prependText)}`
              );
              setState(action.name, {
                state: 'skipped',
                reason: 'prepend.ifNotPresent',
                error: false,
              });
            } else if (!blockContent.match.includes(prependText)) {
              const start = blockContent.start,
                rem = 0,
                insert = codeToInsert;
              content = stringSplice(content, start, rem, insert);

              if (spliceCallback) spliceCallback(start, rem, insert);
              updateBlockContent(blockContent, rem, insert, content);
              logMessage(
                `prepended code in ${summarize(
                  getBlockName(action)
                )}${splittingMsg}: ${summarize(prependText)}`
              );
            } else {
              logMessageGray(
                `code already exists, skipped prepending: ${summarize(
                  prependText
                )}`
              );
              setState(action.name, {
                state: 'skipped',
                reason: 'prepend.exists',
                error: false,
              });
            }
          }
          break;
        case 'append':
          if (action.append) {
            const appendText = await getModContent(
              configPath,
              packageName,
              action.append
            );
            const codeToInsert = action.exact
              ? appendText
              : getCodeToInsert(appendText);
            if (
              action.ifNotPresent &&
              blockContent.match.includes(getText(action.ifNotPresent))
            ) {
              logMessageGray(
                `found existing ${summarize(
                  getText(action.ifNotPresent)
                )}, skipped inserting: ${summarize(appendText)}`
              );
              setState(action.name, {
                state: 'skipped',
                reason: 'append.ifNotPresent',
                error: false,
              });
            } else if (!blockContent.match.includes(appendText)) {
              const lineStart = action.exact
                ? blockContent.end
                : findLineStart(content, blockContent.end, blockContent.start);

              const start = lineStart,
                rem = 0,
                insert = codeToInsert;
              content = stringSplice(content, start, rem, insert);

              if (spliceCallback) spliceCallback(start, rem, insert);
              updateBlockContent(blockContent, rem, insert, content);

              logMessage(
                `appended code in ${summarize(
                  getBlockName(action)
                )}${splittingMsg}: ${summarize(appendText)}`
              );
            } else {
              logMessageGray(
                `code already exists, skipped appending: ${summarize(
                  appendText
                )}`
              );
              setState(action.name, {
                state: 'skipped',
                reason: 'append.exists',
                error: false,
              });
            }
          }
          break;
        case 'replace':
          if (action.replace) {
            const replaceText = await getModContent(
              configPath,
              packageName,
              action.replace
            );
            if (
              action.ifNotPresent &&
              blockContent.match.includes(getText(action.ifNotPresent))
            ) {
              logMessageGray(
                `found existing ${summarize(
                  getText(action.ifNotPresent)
                )}, skipped inserting: ${summarize(replaceText)}`
              );
              setState(action.name, {
                state: 'skipped',
                reason: 'replace.ifNotPresent',
                error: false,
              });
            } else if (!blockContent.match.includes(replaceText)) {
              const start = blockContent.start,
                rem = blockContent.end - blockContent.start,
                insert = replaceText;
              content = stringSplice(content, start, rem, insert);

              if (spliceCallback) spliceCallback(start, rem, insert);
              updateBlockContent(blockContent, rem, insert, content);
              logMessage(
                `replaced code in ${summarize(
                  getBlockName(action)
                )}${splittingMsg}: ${summarize(replaceText)}`
              );
            } else {
              logMessageGray(
                `code already exists, skipped replacing: ${summarize(
                  replaceText
                )}`
              );
              setState(action.name, {
                state: 'skipped',
                reason: 'replace.exists',
                error: false,
              });
            }
          }
          break;
      }
    }
  };
  if (action.search) {
    const searchBlockContent = { ...blockContent };
    let searchMatcher =
      typeof action.search == 'string'
        ? new RegExp(escapeRegExp(getText(action.search)))
        : new RegExp(getText(action.search.regex), action.search.flags);
    const searchOnce = !searchMatcher.flags.includes('g');
    if (searchOnce)
      searchMatcher = new RegExp(
        searchMatcher.source,
        searchMatcher.flags + 'g'
      );
    let searching = true;
    let isFirstSearch = true;
    while (searching) {
      const match = searchMatcher.exec(searchBlockContent.match);
      if (!match) {
        if (isFirstSearch)
          setState(action.name, {
            state: 'skipped',
            reason: 'search',
            error: false,
          });
        break;
      }
      isFirstSearch = false;
      blockContent.start = searchBlockContent.start + match.index;
      blockContent.end =
        searchBlockContent.start + match.index + match[0].length;
      blockContent.match = match[0];

      await runModifiers((start, rem, insert) => {
        searchMatcher.lastIndex += -rem + insert.length;
        updateBlockContent(searchBlockContent, rem, insert, content);
      });

      if (searchOnce) searching = false;
    }
  } else await runModifiers();
  if (additionalModification) {
    content = additionalModification({
      content,
      blockContent,
    });
  }
  return content;
}

function buildCommonComment(comment: string): string[] {
  return comment.split('\n').map(x => `// ${x}`);
}
export function updateBlockContent(
  blockContent: BlockContentType,
  rem: number,
  insert: string,
  content: string
): void {
  blockContent.end += -rem + insert.length;
  blockContent.match = content.substring(blockContent.start, blockContent.end);
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

export function getBlockName(action: ContentModifierType): string {
  return action.block || 'file';
}

export function applyContextReduction(
  action: ContentModifierType,
  blockContent: BlockContentType,
  content: string
): string[] {
  const splittingMsgArr: string[] = [];
  if (action.after) {
    const foundIndex = resolveInsertionPoint(
      blockContent,
      content,
      action.after
    );
    if (foundIndex.start == -1) {
      if (action.strict) throw new Error('Could not find insertion point');

      logMessageGray(
        `insertion point not found, ignoring ${color.yellow('before')} criteria`
      );
    } else {
      blockContent.start = action.exact
        ? foundIndex.end
        : findLineEnd(content, foundIndex.end, blockContent.end);
      blockContent.match = content.substring(
        blockContent.start,
        blockContent.end
      );
      splittingMsgArr.push(`after ${summarize(foundIndex.match, 20)}`);
    }
  }

  if (action.before) {
    const foundIndex = resolveInsertionPoint(
      blockContent,
      content,
      action.before
    );
    if (foundIndex.start == -1) {
      if (action.strict) throw new Error('Could not find insertion point');

      logMessageGray(
        `insertion point not found, ignoring ${color.yellow('before')} criteria`
      );
    } else {
      blockContent.end = action.exact
        ? foundIndex.start
        : findLineStart(content, foundIndex.start, blockContent.start);
      blockContent.match = content.substring(
        blockContent.start,
        blockContent.end
      );
      splittingMsgArr.push(`before ${summarize(foundIndex.match, 20)}`);
    }
  }
  return splittingMsgArr;
}
