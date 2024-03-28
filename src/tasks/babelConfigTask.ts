import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import prettier from 'prettier';
import { Constants } from '../constants';
import { logMessageGray, summarize } from '../prompter';
import {
  BabelConfigBlockType,
  BabelConfigTaskType,
  ContentModifierType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import {
  findClosingTagIndex,
  stripNonCode,
  TagDefinitions,
} from '../utils/findClosingTagIndex';
import { findInsertionPoint } from '../utils/findInsertionPoint';
import { getErrMessage } from '../utils/getErrMessage';
import { getModContent } from '../utils/getModContent';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { getText, variables } from '../variables';

export async function babelConfigTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: BabelConfigTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
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
      if (action.block) {
        content = await applyArrayFieldModification({
          configPath,
          packageName,
          content,
          action,
        });
      } else {
        content = await applyContentModification({
          action,
          findOrCreateBlock: undefined!,
          configPath,
          packageName,
          content,
          indentation: 2,
        });
      }
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

export function shouldApplyInsertion(
  array: string[],
  action: ContentModifierType,
  value: string
): boolean {
  if (action.ifNotPresent) {
    const { ifNotPresent } = action;
    if (array.some(x => x.includes(ifNotPresent))) {
      logMessageGray(
        `found existing ${summarize(
          getText(action.ifNotPresent)
        )}, skipped adding: ${summarize(value)}`
      );

      setState(action.name, {
        state: 'skipped',
        reason: 'insert.ifNotPresent',
        error: false,
      });
      return false;
    }
  }

  if (array.some(x => x.includes(value))) {
    logMessageGray(`code already exists, skipped adding: ${summarize(value)}`);
    setState(action.name, {
      state: 'skipped',
      reason: 'insert.exists',
      error: false,
    });
    return false;
  }
  return true;
}

export function getReducedContext(
  array: string[],
  action: ContentModifierType
): [number, number] {
  let contextStart = 0;
  let contextEnd = array.length;
  // context reduction
  for (const key of Object.keys(action)) {
    let foundIndex: number;
    switch (key) {
      case 'before':
        foundIndex = array.findIndex(
          x => findInsertionPoint(x, action.before!).start != -1
        );
        if (foundIndex == -1) {
          if (action.strict) throw new Error('Could not find insertion point');
          else
            logMessageGray(
              `insertion point not found, ignoring ${color.yellow('before')} criteria`
            );
        } else contextEnd = foundIndex;
        break;
      case 'after':
        foundIndex = array.findIndex(
          x => findInsertionPoint(x, action.after!).start != -1
        );
        if (foundIndex == -1) {
          if (action.strict) throw new Error('Could not find insertion point');
          else
            logMessageGray(
              `insertion point not found, ignoring ${color.yellow('after')} criteria`
            );
        } else contextStart = foundIndex + 1;
        break;
      case 'search':
        foundIndex = array.findIndex(
          x => findInsertionPoint(x, action.search!).start != -1
        );
        if (foundIndex == -1) {
          if (action.strict) throw new Error('Could not find insertion point');
          else
            logMessageGray(
              `insertion point not found, ignoring ${color.yellow('search')} criteria`
            );
        } else {
          contextStart = foundIndex;
          contextEnd = foundIndex + 1;
        }
        break;
    }
  }
  return [contextStart, contextEnd];
}

async function applyArrayFieldModification(args: {
  configPath: string;
  packageName: string;
  content: string;
  action: ContentModifierType<BabelConfigBlockType>;
}) {
  const { action, configPath, packageName } = args;
  const { content } = args;
  const babelContent = babelParser.parse(content);
  const block = action.block!;

  const [contextStart, contextEnd] = getReducedContext(
    babelContent[block],
    action
  );
  for (const key of Object.keys(action)) {
    let value: string;
    switch (key) {
      case 'prepend':
        value = await getModContent(configPath, packageName, action.prepend!);
        if (shouldApplyInsertion(babelContent[block], action, value)) {
          babelContent[block].splice(contextStart, 0, value);
        }
        break;
      case 'append':
        value = await getModContent(configPath, packageName, action.append!);
        if (shouldApplyInsertion(babelContent[block], action, value)) {
          babelContent[block].splice(contextEnd, 0, value);
        }
        break;
      case 'replace':
        value = await getModContent(configPath, packageName, action.replace!);
        if (shouldApplyInsertion(babelContent[block], action, value)) {
          babelContent[block].splice(contextStart, 1, value);
        }
        break;
    }
  }
  return babelParser.stringify(babelContent);
}

export const babelParser = {
  _readArrayAsString(content: string, name: string): string[] {
    const match = new RegExp(`${name}:\\s*\\[`).exec(content);
    if (!match) return [];
    const start = match.index + match[0].length;
    const end = findClosingTagIndex(content, start, TagDefinitions.BRACKETS);
    const bracketContent = content.substring(start, end);
    const strippedBracketContent = stripNonCode(
      bracketContent,
      TagDefinitions.BRACKETS.comment
    );
    const array = [];
    let nextItemStart = -1;
    for (let i = 0; i < strippedBracketContent.length; i++) {
      const char = strippedBracketContent[i];
      const isSplitter = char == ',';
      const isBracketStart = char == '[';
      const isCurlyStart = char == '{';
      if (nextItemStart == -1) {
        nextItemStart = i;
      }
      if (isBracketStart) {
        i = findClosingTagIndex(
          strippedBracketContent,
          i + 1,
          TagDefinitions.BRACKETS
        ); // bracket end
      }
      if (isCurlyStart) {
        i = findClosingTagIndex(
          strippedBracketContent,
          i + 1,
          TagDefinitions.CURLY
        ); // curly end
      }
      if (isSplitter) {
        array.push(
          bracketContent.substring(nextItemStart, i).replace(/\n/g, '').trim()
        );
        nextItemStart = i + 1;
      }
    }
    if (nextItemStart != -1) {
      const lastItem = bracketContent
        .substring(nextItemStart)
        .replace(/\n/g, '')
        .trim();
      if (lastItem) array.push(lastItem);
    }
    return array;
  },
  _writeArrayAsString(content: string, name: string, array: string[]): string {
    const currentArray = this._readArrayAsString(content, name);
    if (!currentArray.length && !array.length) return content;
    const match = new RegExp(`${name}:\\s*\\[`).exec(content);
    const arrayAsString = array
      .map(x => {
        // wrap string
        if (!['"', "'", '[', '{'].includes(x[0])) return `'${x}'`;
        return x;
      })
      .join(', ');
    if (!match) {
      const codeToInsert = `${name}: [${arrayAsString}]`;
      const exportsStart = /module.exports\s*=\s*{/.exec(content);
      if (!exportsStart) throw new Error('Could not find exports start');
      const exportsEnd = findClosingTagIndex(
        content,
        exportsStart.index + exportsStart[0].length,
        TagDefinitions.CURLY
      );
      return stringSplice(content, exportsEnd, 0, codeToInsert);
    }
    const start = match.index + match[0].length;
    const end = findClosingTagIndex(content, start, TagDefinitions.BRACKETS);
    return stringSplice(content, start, end - start, `${arrayAsString}`);
  },
  parse(content: string): BabelConfigContentType {
    const presets = this._readArrayAsString(content, 'presets');
    const plugins = this._readArrayAsString(content, 'plugins');
    return { content, presets, plugins };
  },
  stringify(content: BabelConfigContentType): string {
    const { content: contentString, presets, plugins } = content;
    const newContent = this._writeArrayAsString(
      contentString,
      'presets',
      presets
    );
    return this._writeArrayAsString(newContent, 'plugins', plugins);
  },
};

type BabelConfigContentType = {
  content: string;
  presets: string[];
  plugins: string[];
};

function getBabelConfigPath() {
  const projectPath = getProjectPath();
  const babelConfigPath = path.join(
    projectPath,
    Constants.BABEL_CONFIG_FILE_NAME
  );
  if (!fs.existsSync(babelConfigPath))
    throw new Error(`babel.config.js file not found at ${babelConfigPath}`);
  return babelConfigPath;
}

export function readBabelConfigContent(): string {
  const babelConfigPath = getBabelConfigPath();
  return fs.readFileSync(babelConfigPath, 'utf-8');
}

export async function writeBabelConfigContent(content: string): Promise<void> {
  const babelConfigPath = getBabelConfigPath();

  let prettierConfig = await prettier.resolveConfig(getProjectPath());
  if (!prettierConfig) prettierConfig = {};
  if (!prettierConfig.parser) prettierConfig.parser = 'babel';
  content = await prettier.format(content, prettierConfig);
  return fs.writeFileSync(babelConfigPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: BabelConfigTaskType;
}): Promise<void> {
  let content = readBabelConfigContent();

  content = await babelConfigTask({
    ...args,
    content,
  });

  await writeBabelConfigContent(content);
}

export const summary = 'babel.config.js modification';
