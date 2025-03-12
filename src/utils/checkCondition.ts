import { processScript } from './processScript';
import { AnyObject } from '../types/mod.types';
import { transformTextInObject, variables } from '../variables';
import { satisfies } from './satisfies';

export function checkCondition(condition: string | AnyObject): boolean {
  if (typeof condition === 'string') {
    return !!processScript(condition, variables, true, false);
  }
  return satisfies(variables.getStore(), transformTextInObject(condition));
}
