import fs from 'fs';
import path from 'path';
import color from 'picocolors';
import prettier from 'prettier';
import { Constants } from '../constants';
import { processScript } from '../utils/processScript';
import { logMessage, logMessageGray, summarize } from '../prompter';
import {
  BabelConfigModifierType,
  BabelConfigTaskType,
  ContentModifierType,
  ObjectModifierStrategy,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { checkCondition } from '../utils/checkCondition';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { JsObjectParser } from '../utils/jsObjectParser';
import { setState } from '../utils/setState';
import { getText, transformTextInObject, variables } from '../variables';

export async function babelConfigTask(args: {
  configPath: string;
  packageName: string;
  content: JsObjectParser;
  task: BabelConfigTaskType;
}): Promise<JsObjectParser> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    if (action.when && !checkCondition(action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
    });
    try {
      if ('mode' in action && action.mode === 'text') {
        const textContent = await applyContentModification({
          action,
          findOrCreateBlock: undefined!,
          configPath,
          packageName,
          content: content.stringify(),
          indentation: 2,
        });
        content.parse(textContent);
      } else {
        content = applyJSObjectModification(content, action);
      }
      setState(action.name, {
        state: 'done',
      });
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
      });
      throw e;
    }
  }
  return Promise.resolve(content);
}

export function applyJSObjectModification(
  content: JsObjectParser,
  action: BabelConfigModifierType
): JsObjectParser {
  const setAction = (
    obj: Record<string, any>,
    strategy: ObjectModifierStrategy = 'merge_concat'
  ) => {
    if ('mode' in action) return content;
    content.merge({ [action.root ?? 'module.exports']: obj }, { strategy });
    Object.entries(obj).forEach(([key, value]) => {
      const strValue =
        typeof value === 'string' ? value : JSON.stringify(value);
      logMessage(
        `set ${color.yellow(key)} with ${color.yellow(
          strategy
        )} strategy: ${summarize(strValue)}`
      );
    });
  };
  if ('set' in action) {
    const strategy = action.strategy || 'merge_concat';
    action.set = transformTextInObject(action.set);

    setAction(action.set, strategy);
  } else if (action.script) {
    processScript(action.script, variables, false, false, {
      merge: setAction,
    });
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
      });
      return false;
    }
  }

  if (array.some(x => x.includes(value))) {
    logMessageGray(`code already exists, skipped adding: ${summarize(value)}`);
    setState(action.name, {
      state: 'skipped',
      reason: 'insert.exists',
    });
    return false;
  }
  return true;
}

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

export function readBabelConfigContent(): JsObjectParser {
  const babelConfigPath = getBabelConfigPath();
  const parser = new JsObjectParser();
  parser.parse(fs.readFileSync(babelConfigPath, 'utf-8'));
  return parser;
}

export async function writeBabelConfigContent(
  parser: JsObjectParser
): Promise<void> {
  const babelConfigPath = getBabelConfigPath();

  let prettierConfig = await prettier.resolveConfig(getProjectPath());
  if (!prettierConfig) prettierConfig = {};
  if (!prettierConfig.parser) prettierConfig.parser = 'babel';
  const content = await prettier.format(parser.stringify(), prettierConfig);
  return fs.writeFileSync(babelConfigPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: BabelConfigTaskType;
}): Promise<void> {
  const parser = readBabelConfigContent();

  await babelConfigTask({
    ...args,
    content: parser,
  });

  await writeBabelConfigContent(parser);
}

export const summary = 'babel.config.js modification';
