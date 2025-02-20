import mergeWith from 'lodash.mergewith';
import color from 'picocolors';
import { logMessage, summarize } from '../prompter';
import { ObjectModifierStrategy, ObjectModifierType } from '../types/mod.types';
import { transformTextInObject } from '../variables';
import { deepEquals } from './satisfies';

export function applyObjectModification(
  content: Record<string, any>,
  action: ObjectModifierType
): Record<string, any> {
  const strategy = action.strategy || 'assign';
  action.set = transformTextInObject(action.set);

  content = modifyObject(content, action.set, strategy);

  Object.entries(action.set).forEach(([key, value]) => {
    const strValue = typeof value === 'string' ? value : JSON.stringify(value);
    logMessage(
      `set ${color.yellow(key)} with ${color.yellow(
        strategy
      )} strategy: ${summarize(strValue)}`
    );
  });

  return content;
}

export function modifyObject(
  content: Record<string, any>,
  modifier: Record<string, any>,
  strategy: ObjectModifierStrategy
): Record<string, any> {
  if (strategy == 'assign') {
    content = Object.assign(content, modifier);
  } else if (strategy == 'append') {
    for (const key in modifier) {
      if (!(key in content)) content[key] = modifier[key];
    }
  } else {
    /* eslint-disable @typescript-eslint/no-unsafe-return */
    const fieldsToDelete: [Record<string, any>, string][] = [];
    const customizer = function (
      objValue: any,
      srcValue: any,
      field: string,
      objParent: Record<string, any>
    ) {
      if (strategy == 'merge_concat') {
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return objValue.concat(srcValue);
        }
      } else if (strategy == 'merge_distinct')
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return objValue.concat(
            srcValue.filter(objB =>
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
      if (typeof srcValue === 'object' && srcValue.$delete) {
        fieldsToDelete.push([objParent, field]);
        return true;
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

    content = mergeWith(content, modifier, customizer);
    fieldsToDelete.forEach(([obj, field]) => delete obj[field]);
    /* eslint-enable @typescript-eslint/no-unsafe-return */
  }
  return content;
}
