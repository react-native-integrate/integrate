import { runTask as runAppDelegateTask } from '../tasks/appDelegateTask';
import { runTask as runPListTask } from '../tasks/plistTask';
import { runTask as runBuildGradleTask } from '../tasks/buildGradleTask';
import { runTask as runAddResourceTask } from '../tasks/xcodeTask';
import { runTask as runAndroidManifestTask } from '../tasks/androidManifestTask';
import { runTask as runPodFileTask } from '../tasks/podFileTask';
import { runTask as runFsTask } from '../tasks/fsTask';
import { ModTask } from '../types/mod.types';

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: ModTask;
}): Promise<void> {
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
    case 'xcode':
      await runAddResourceTask({
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
    case 'fs':
      await runFsTask({
        configPath,
        packageName,
        task,
      });
      break;
  }
}
