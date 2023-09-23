import { ModTask } from '../types/mod.types';
import { taskManager } from './taskManager';

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: ModTask;
}): Promise<void> {
  const { task, packageName, configPath } = args;
  await taskManager[task.type].runTask({
    configPath,
    packageName,
    task,
  });
}
