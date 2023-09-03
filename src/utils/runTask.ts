import { runTask as runAppDelegateTask } from '../tasks/appDelegateTask';
import { runTask as runPListTask } from '../tasks/plistTask';
import { runTask as runBuildGradleTask } from '../tasks/buildGradleTask';
import { runTask as runAddResourceTask } from '../tasks/iosResourcesTask';
import { runTask as runAndroidManifestTask } from '../tasks/androidManifestTask';
import { runTask as runPodFileTask } from '../tasks/podFileTask';
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
        configPath,
        packageName,
        task,
      });
      break;
    case 'android_manifest':
      runAndroidManifestTask({
        configPath,
        packageName,
        task,
      });
      break;
    case 'ios_resources':
      runAddResourceTask({
        configPath,
        packageName,
        task,
      });
      break;
    case 'podfile':
      runPodFileTask({
        configPath,
        packageName,
        task,
      });
      break;
  }
}
