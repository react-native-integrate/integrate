import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { BlockContentType, StylesXmlTaskType } from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { checkCondition } from '../utils/checkCondition';
import {
  findClosingTagIndex,
  TagDefinitions,
} from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export async function stylesXmlTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: StylesXmlTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    action.block = 'resources';
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
      content = await applyContentModification({
        action,
        findOrCreateBlock,
        configPath,
        packageName,
        content,
        indentation: 0,
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

function checkBlockStartValue(value: any) {
  if (!value) {
    throw new Error('block could not be found, something wrong?');
  }
}

function findOrCreateBlock(content: string): {
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

  const blockDefinition = blockDefinitions['resources'];

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
  'resources',
  { regex: RegExp; indentation: number }
> = {
  resources: {
    regex: /<resources.*?>/s,
    indentation: 4,
  },
};

function getStylesXmlPath() {
  const projectPath = getProjectPath();

  const stylesXmlPath = path.join(
    projectPath,
    Constants.ANDROID_MAIN_FILE_PATH,
    'res',
    'values',
    Constants.STYLES_XML_FILE_NAME
  );
  if (!fs.existsSync(stylesXmlPath))
    throw new Error(`styles.xml file not found at ${stylesXmlPath}`);
  return stylesXmlPath;
}

function readStylesXmlContent() {
  const xmlPath = getStylesXmlPath();
  return fs.readFileSync(xmlPath, 'utf-8');
}

function writeStylesXmlContent(content: string): void {
  const xmlPath = getStylesXmlPath();
  return fs.writeFileSync(xmlPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: StylesXmlTaskType;
}): Promise<void> {
  let content = readStylesXmlContent();

  content = await stylesXmlTask({
    ...args,
    content,
  });

  writeStylesXmlContent(content);
}

export const summary = 'styles.xml modification';
