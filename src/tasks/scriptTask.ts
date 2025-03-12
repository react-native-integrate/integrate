import { processScript } from '../utils/processScript';
import { ModStep, ScriptTaskType } from '../types/mod.types';
import { checkCondition } from '../utils/checkCondition';
import { getErrMessage } from '../utils/getErrMessage';
import { setState } from '../utils/setState';
import type { taskManager } from '../utils/taskManager';
import { variables } from '../variables';

export async function scriptTask(args: {
  configPath: string;
  packageName: string;
  task: ScriptTaskType;
  taskManager: typeof taskManager;
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
      const ctx = Object.entries(args.taskManager.task).reduce(
        (ctx, [taskName, task]) => {
          ctx[taskName] = async (actionOneOrList, opts) => {
            const dynamicTask: ModStep = {
              task: taskName,
              ...opts,
              actions: Array.isArray(actionOneOrList)
                ? actionOneOrList
                : [actionOneOrList],
            };
            await task.runTask({
              configPath: args.configPath,
              packageName: args.packageName,
              task: dynamicTask,
              taskManager: args.taskManager,
            });
          };
          return ctx;
        },
        {} as Record<string, (...args: any[]) => any>
      );
      const resultValue = await processScript(
        action.script,
        variables,
        false,
        true,
        ctx
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
