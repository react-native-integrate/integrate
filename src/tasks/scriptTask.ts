import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { downloadFile, getRemotePath } from '../utils/getPackageConfig';
import { processScript } from '../utils/processScript';
import {
  ModStep,
  ScriptTaskType,
  ModuleContext,
  TaskName,
} from '../types/mod.types';
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
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
    });
    try {
      const ctx = Object.entries(args.taskManager.task).reduce(
        (ctx, [taskName, task]) => {
          ctx[taskName as TaskName] = async (actionOneOrList, opts) => {
            const dynamicTask = {
              task: taskName as TaskName,
              ...opts,
              actions: Array.isArray(actionOneOrList)
                ? actionOneOrList
                : [actionOneOrList],
            } as Extract<ModStep, { task: TaskName }>;
            await task.runTask({
              configPath: args.configPath,
              packageName: args.packageName,
              task: dynamicTask as never,
              taskManager: args.taskManager,
            });
          };
          return ctx;
        },
        {
          get: function <T>(variable: string): T {
            return variables.get<T>(variable);
          },
          set: function (variable: string, value: any): void {
            variables.set(variable, value);
          },
        } as ModuleContext
      );
      let resultValue: any;
      if ('script' in action) {
        resultValue = await processScript(
          action.script,
          variables,
          false,
          true,
          ctx
        );
      } else {
        const pluginPath = path.join(
          path.dirname(args.configPath),
          action.module
        );
        if (
          !fs.existsSync(pluginPath) &&
          args.packageName !== Constants.UPGRADE_CONFIG_FILE_NAME
        ) {
          const remotePath =
            getRemotePath(args.packageName, Constants.REMOTE_REPO) +
            pluginPath.replace(path.join(args.configPath, '../'), '');

          const localDir = path.join(pluginPath, '..');
          if (!fs.existsSync(localDir))
            fs.mkdirSync(localDir, { recursive: true });
          const success = await downloadFile(remotePath, pluginPath);
          if (!success) throw new Error(`File not found at ${pluginPath}`);
        }

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const plugin = require(
          path.relative(
            __dirname,
            path.join(path.dirname(args.configPath), action.module)
          )
        ) as ((ctx: any) => any) | { default: (ctx: any) => any };
        if ('default' in plugin) {
          resultValue = await plugin.default(ctx);
        } else resultValue = await plugin(ctx);
      }
      if (action.name && resultValue != null)
        variables.set(action.name, resultValue);
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
      });
      throw e;
    }
  }
}

export const runTask = scriptTask;

export const summary = '';

// noinspection JSUnusedGlobalSymbols
export const isSystemTask = true;
