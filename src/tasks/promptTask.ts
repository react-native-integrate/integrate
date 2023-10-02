import { PromptTaskType } from '../types/mod.types';
import { getErrMessage } from '../utils/getErrMessage';
import { runPrompt } from '../utils/runPrompt';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { variables } from '../variables';

export async function promptTask(args: {
  configPath: string;
  packageName: string;
  task: PromptTaskType;
}): Promise<void> {
  const { task } = args;

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
      await runPrompt(action);
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

export const runTask = promptTask;

export const summary = '';

// noinspection JSUnusedGlobalSymbols
export const isSystemTask = true;
