import { ModStep } from '../types/mod.types';
import { taskManager } from './taskManager';

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: ModStep;
}): Promise<void> {
  const { task, packageName, configPath } = args;
  await taskManager.task[task.task].runTask({
    configPath,
    packageName,
    task,
  });
}
