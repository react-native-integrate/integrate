import mergeWith from 'lodash.mergewith';
import color from 'picocolors';
import { logMessage, summarize } from '../prompter';
import { ObjectModifierType } from '../types/mod.types';
import { transformTextInObject } from '../variables';
import { deepEquals } from './satisfies';

export function applyObjectModification(
  content: Record<string, any>,
  action: ObjectModifierType
): Record<string, any> {
  const strategy = action.strategy || 'assign';
  action.set = transformTextInObject(action.set);

  if (strategy == 'assign') {
    content = Object.assign(content, action.set);
  } else if (strategy == 'append') {
    for (const key in action.set) {
      if (!(key in content)) content[key] = action.set[key];
    }
  } else {
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    const customizer = function (objValue: any, srcValue: any) {
      if (strategy == 'merge_concat') {
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return objValue.concat(srcValue);
        }
      } else if (strategy == 'merge_distinct')
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return objValue.concat(
            srcValue.filter(objB =>
              objValue.every(objA => !deepEquals(objA, objB))
            )
          );
        }
      if (typeof srcValue === 'object' && srcValue.$assign) {
        delete srcValue.$assign;
        return srcValue;
      }
      if (typeof srcValue === 'object' && srcValue.$append) {
        delete srcValue.$append;
        return objValue;
      }
      if (
        Array.isArray(objValue) &&
        typeof srcValue === 'object' &&
        srcValue.$index != null
      ) {
        const index = srcValue.$index;
        delete srcValue.$index;
        objValue[index] = mergeWith(objValue[index], srcValue, customizer);

        return objValue;
      }
    };

    content = mergeWith(content, action.set, customizer);
    /* eslint-enable @typescript-eslint/no-unsafe-return */
  }

  Object.entries(action.set).forEach(([key, value]) => {
    value = typeof value === 'string' ? value : JSON.stringify(value);
    logMessage(
      `set ${color.yellow(key)} with ${color.yellow(
        strategy
      )} strategy: ${summarize(value)}`
    );
  });

  return content;
}
