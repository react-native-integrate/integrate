import { runTask as runAppDelegateTask } from '../tasks/appDelegateTask';
import { runTask as runPListTask } from '../tasks/plistTask';
import { runTask as runBuildGradleTask } from '../tasks/buildGradleTask';
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
        configPath: configPath,
        packageName: packageName,
        task: task,
      });
      break;
    case 'app_delegate':
      runAppDelegateTask({
        configPath: configPath,
        packageName: packageName,
        task: task,
      });
      break;
    case 'validate':
      break;
    case 'build_gradle':
      runBuildGradleTask({
        isInAppFolder: false,
        configPath: configPath,
        packageName: packageName,
        task: task,
      });
      break;
    case 'app_build_gradle':
      runBuildGradleTask({
        isInAppFolder: true,
        configPath: configPath,
        packageName: packageName,
        task: task,
      });
      break;
    case 'android_manifest':
      break;
    case 'add_resource':
      break;
  }
}
