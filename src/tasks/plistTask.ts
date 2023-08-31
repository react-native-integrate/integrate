import fs from 'fs';
import mergeWith from 'lodash.mergewith';
import path from 'path';
import color from 'picocolors';
import { Constants } from '../constants';
import { logMessage, summarize } from '../prompter';
import { PlistModType } from '../types/mod.types';
import { getIosProjectPath } from '../utils/getIosProjectPath';
import plist from 'simple-plist';

export function plistTask(args: {
  configPath: string;
  packageName: string;
  content: Record<string, any>;
  task: PlistModType;
}): Record<string, any> {
  let { content } = args;
  const { task } = args;
  const strategy = task.strategy || 'assign';

  if (strategy == 'assign') {
    content = Object.assign(content, task.set);
  } else {
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    content = mergeWith(
      content,
      task.set,
      function customizer(objValue: any, srcValue: any) {
        if (strategy == 'merge_concat')
          if (Array.isArray(objValue) && Array.isArray(srcValue)) {
            return objValue.concat(srcValue);
          }
        if (typeof srcValue === 'object' && srcValue.__assign) {
          delete srcValue.__assign;
          return srcValue;
        }
      }
    );
    /* eslint-enable @typescript-eslint/no-unsafe-return */
  }

  content = Object.keys(content)
    .sort()
    .reduce((temp_obj, key) => {
      temp_obj[key] = content[key];
      return temp_obj;
    }, {} as Record<string, any>);
  Object.entries(task.set).forEach(([key, value]) => {
    value = typeof value === 'string' ? value : JSON.stringify(value);
    logMessage(
      `set ${color.yellow(key)} with ${color.yellow(
        strategy
      )} strategy in plist: ${summarize(value)}`
    );
  });
  return content;
}

function getPListPath() {
  const iosProjectPath = getIosProjectPath();

  const pListPath = path.join(iosProjectPath, Constants.PLIST_FILE_NAME);
  if (!fs.existsSync(pListPath))
    throw new Error(`Plist file not found at ${pListPath}`);
  return pListPath;
}

function readPListContent() {
  const appDelegatePath = getPListPath();
  return plist.parse(fs.readFileSync(appDelegatePath, 'utf-8'));
}

function writePListContent(content: Record<string, any>): void {
  const appDelegatePath = getPListPath();
  return fs.writeFileSync(appDelegatePath, plist.stringify(content), 'utf-8');
}

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: PlistModType;
}): void {
  let content = readPListContent();

  content = plistTask({
    ...args,
    content,
  });

  writePListContent(content);
}
