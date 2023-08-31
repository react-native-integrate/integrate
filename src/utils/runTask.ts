import { runTask as runAppDelegateTask } from '../tasks/appDelegateTask';
import { runTask as runPListTask } from '../tasks/plistTask';
import { runTask as runBuildGradleTask } from '../tasks/buildGradleTask';
import { runTask as runAddResourceTask } from '../tasks/addResourceTask';
import { ModTask } from '../types/mod.types';

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: ModTask;
}): void {
  const { task, packageName, configPath } = args;
  switch (task.type) {
    case 'plist':
      runPListTask({
        configPath,
        packageName,
        task,
      });
      break;
    case 'app_delegate':
      runAppDelegateTask({
        configPath,
        packageName,
        task,
      });
      break;
    case 'validate':
      break;
    case 'build_gradle':
      runBuildGradleTask({
        isInAppFolder: false,
        configPath,
        packageName,
        task,
      });
      break;
    case 'app_build_gradle':
      runBuildGradleTask({
        isInAppFolder: true,
        configPath,
        packageName,
        task,
      });
      break;
    case 'android_manifest':
      break;
    case 'add_resource':
      runAddResourceTask({
        configPath,
        packageName,
        task,
      });
      break;
  }
}
