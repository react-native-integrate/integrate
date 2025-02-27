import { processScript } from '../processScript';
import { ScriptTaskType } from '../types/mod.types';
import { checkCondition } from '../utils/checkCondition';
import { getErrMessage } from '../utils/getErrMessage';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export async function scriptTask(args: {
  configPath: string;
  packageName: string;
  task: ScriptTaskType;
}): Promise<void> {
  const { task } = args;

  for (const action of task.actions) {
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
      const resultValue = await processScript(
        action.script,
        variables,
        false,
        true
      );
      if (action.name) variables.set(action.name, resultValue);
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
        error: true,
      });
      throw e;
    }
  }
}

export const runTask = scriptTask;

export const summary = '';

// noinspection JSUnusedGlobalSymbols
export const isSystemTask = true;
