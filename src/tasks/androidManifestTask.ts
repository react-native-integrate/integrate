import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { logMessage, logMessageGray, summarize } from '../prompter';
import {
  AndroidManifestBlockType,
  AndroidManifestModifierType,
  AndroidManifestTaskType,
  BlockContentType,
} from '../types/mod.types';
import {
  applyContentModification,
  getBlockName,
  updateBlockContent,
} from '../utils/applyContentModification';
import { checkCondition } from '../utils/checkCondition';
import { escapeRegExp } from '../utils/escapeRegExp';
import {
  findClosingTagIndex,
  TagDefinitions,
} from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { transformTextInObject, variables } from '../variables';

export async function androidManifestTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: AndroidManifestTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

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
      const additionalModification = (args: {
        content: string;
        blockContent: BlockContentType;
      }) => applyAttributeModification({ ...args, action });
      content = await applyContentModification({
        action,
        findOrCreateBlock,
        configPath,
        packageName,
        content,
        indentation: 0,
        additionalModification,
        buildComment: buildXmlComment,
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

function buildXmlComment(comment: string): string[] {
  return comment.split('\n').map(x => `<!-- ${x} -->`);
}

function applyAttributeModification(args: {
  content: string;
  blockContent: BlockContentType;
  action: AndroidManifestModifierType;
}): string {
  const { action, blockContent } = args;
  let { content } = args;
  if (action.attributes) {
    if (!action.block)
      throw new Error('you must set block to update attributes');
    const blockDefinition = blockDefinitions[action.block];
    const { regex, indentation } = blockDefinition;

    const getCodeToInsert = (text: string, isReplacing: boolean) => {
      let openingNewLine = '\n',
        closingNewLine = '',
        blockIndentation = ' '.repeat(indentation);
      if (isReplacing) {
        openingNewLine = '';
        closingNewLine = '\n';
      }

      if (isReplacing) {
        closingNewLine = '';
        blockIndentation = '';
      }
      return `${openingNewLine}${
        isReplacing ? '' : blockIndentation
      }${text}${closingNewLine}`;
    };

    Object.entries(action.attributes).forEach(([name, value]) => {
      value = transformTextInObject(value);
      const blockStart = regex.exec(content);

      checkBlockStartValue(blockStart);

      if (blockStart) {
        // noinspection RegExpSimplifiable
        const existingMatcher = new RegExp(
          `\\b${escapeRegExp(name)}="(?:\\\\.|[^\\\\"])*"([\\s]+)?`
        );
        const existingMatch = existingMatcher.exec(blockStart[0]);
        // delete
        if (typeof value == 'object' && value.$delete) {
          if (existingMatch) {
            const start = existingMatch.index + blockStart.index,
              rem = existingMatch[0].length,
              insert = '';
            content = stringSplice(content, start, rem, insert);
            updateBlockContent(blockContent, rem, insert, content);
            logMessage(
              `deleted attribute ${summarize(name)} in ${summarize(
                getBlockName(action)
              )}`
            );
          } else {
            logMessageGray(
              `attribute ${summarize(name)} does not exist in ${summarize(
                getBlockName(action)
              )} - skipping delete operation`
            );
          }
        } else {
          // set or replace
          const codeToInsert = getCodeToInsert(
            `${name}="${value}"`,
            !!existingMatch
          );
          if (existingMatch) {
            // replace
            const start = existingMatch.index + blockStart.index,
              rem = existingMatch[0].length,
              insert = codeToInsert;
            content = stringSplice(content, start, rem, insert);
            updateBlockContent(blockContent, rem, insert, content);
            logMessage(
              `set existing attribute in ${summarize(
                getBlockName(action)
              )} - ${summarize(name)}: ${summarize(value as string)}`
            );
          } else {
            // set
            const endOfOpeningTagIndex =
              blockStart.index + blockStart[0].length - 1;

            // noinspection UnnecessaryLocalVariableJS
            const start = endOfOpeningTagIndex,
              rem = 0,
              insert = codeToInsert;
            content = stringSplice(content, start, rem, insert);
            updateBlockContent(blockContent, rem, insert, content);
            logMessage(
              `set new attribute in ${summarize(
                getBlockName(action)
              )} - ${summarize(name)}: ${summarize(value as string)}`
            );
          }
        }
      }
    });
  }
  return content;
}

function checkBlockStartValue(value: any) {
  if (!value) {
    throw new Error('block could not be found, something wrong?');
  }
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

  const blockDefinition = blockDefinitions[block as AndroidManifestBlockType];

  if (!blockDefinition) throw new Error(`Invalid block: ${block}`);
  const { regex } = blockDefinition;
  const blockStart = regex.exec(content);

  checkBlockStartValue(blockStart);

  if (blockStart) {
    const blockEndIndex = findClosingTagIndex(
      content,
      blockStart.index + blockStart[0].length,
      TagDefinitions.XML
    );

    const blockBody = content.substring(
      blockStart.index + blockStart[0].length,
      blockEndIndex
    );
    blockContent = {
      start: blockStart.index + blockStart[0].length,
      end: blockEndIndex,
      match: blockBody,
      justCreated: false,
      space: ' '.repeat(blockDefinition.indentation),
    };
  }
  return {
    blockContent,
    content,
  };
}

const blockDefinitions: Record<
  AndroidManifestBlockType,
  { regex: RegExp; indentation: number }
> = {
  manifest: {
    regex: /<manifest.*?>/s,
    indentation: 4,
  },
  application: {
    regex: /<application.*?>/s,
    indentation: 6,
  },
  activity: {
    regex: /<activity.*?>/s,
    indentation: 8,
  },
};

function getAndroidManifestPath() {
  const projectPath = getProjectPath();

  const buildGradlePath = path.join(
    projectPath,
    Constants.ANDROID_MAIN_FILE_PATH,
    Constants.ANDROID_MANIFEST_FILE_NAME
  );
  if (!fs.existsSync(buildGradlePath))
    throw new Error(`AndroidManifest.xml file not found at ${buildGradlePath}`);
  return buildGradlePath;
}

function readAndroidManifestContent() {
  const manifestPath = getAndroidManifestPath();
  return fs.readFileSync(manifestPath, 'utf-8');
}

function writeAndroidManifestContent(content: string): void {
  const manifestPath = getAndroidManifestPath();
  return fs.writeFileSync(manifestPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: AndroidManifestTaskType;
}): Promise<void> {
  let content = readAndroidManifestContent();

  content = await androidManifestTask({
    ...args,
    content,
  });

  writeAndroidManifestContent(content);
}

export const summary = 'AndroidManifest.xml modification';
