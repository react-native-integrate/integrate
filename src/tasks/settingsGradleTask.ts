import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { BlockContentType, SettingsGradleTaskType } from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { variables } from '../variables';

export async function settingsGradleTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: SettingsGradleTaskType;
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
      const space = ' '.repeat(2 * i);
      const previousSpace = ' '.repeat(Math.max(0, 2 * (i - 1)));
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
      space: ' '.repeat(2 * i),
    };
  }

  return {
    blockContent,
    content,
  };
}

function getSettingsGradlePath() {
  const projectPath = getProjectPath();

  const settingsGradlePath = path.join(
    projectPath,
    'android',
    Constants.SETTINGS_GRADLE_FILE_NAME
  );
  if (!fs.existsSync(settingsGradlePath))
    throw new Error(`settings.gradle file not found at ${settingsGradlePath}`);
  return settingsGradlePath;
}

function readSettingsGradleContent() {
  const settingsGradlePath = getSettingsGradlePath();
  return fs.readFileSync(settingsGradlePath, 'utf-8');
}

function writeSettingsGradleContent(content: string): void {
  const settingsGradlePath = getSettingsGradlePath();
  return fs.writeFileSync(settingsGradlePath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: SettingsGradleTaskType;
}): Promise<void> {
  let content = readSettingsGradleContent();

  content = await settingsGradleTask({
    ...args,
    content,
  });

  writeSettingsGradleContent(content);
}

export const summary = 'settings.gradle modification';
