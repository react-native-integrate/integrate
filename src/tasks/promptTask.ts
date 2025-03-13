import { PromptTaskType } from '../types/mod.types';
import { checkCondition } from '../utils/checkCondition';
import { getErrMessage } from '../utils/getErrMessage';
import { runPrompt } from '../utils/runPrompt';
import { setState } from '../utils/setState';

export async function promptTask(args: {
  configPath: string;
  packageName: string;
  task: PromptTaskType;
}): Promise<void> {
  const { task, packageName } = args;

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
      await runPrompt(action, packageName);
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
      });
      throw e;
    }
  }
}

export const runTask = promptTask;

export const summary = '';

// noinspection JSUnusedGlobalSymbols
export const isSystemTask = true;
