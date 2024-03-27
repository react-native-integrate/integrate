import * as app_delegate from '../tasks/appDelegateTask';
import * as plist from '../tasks/plistTask';
import * as build_gradle from '../tasks/buildGradleTask';
import * as xcode from '../tasks/xcode/xcodeTask';
import * as android_manifest from '../tasks/androidManifestTask';
import * as strings_xml from '../tasks/stringsXmlTask';
import * as podfile from '../tasks/podFileTask';
import * as gitignore from '../tasks/gitignoreTask';
import * as fs from '../tasks/fsTask';
import * as json from '../tasks/jsonTask';
import * as prompt from '../tasks/promptTask';
import * as notification_service from '../tasks/notificationServiceTask';
import * as notification_view_controller from '../tasks/notificationViewControllerTask';
import * as main_application from '../tasks/mainApplicationTask';
import * as main_activity from '../tasks/mainActivityTask';
import * as settings_gradle from '../tasks/settingsGradleTask';
import * as shell from '../tasks/shellTask';
import { ModStep } from '../types/mod.types';

const task: Record<string, TaskExports> = {
  app_delegate,
  plist,
  build_gradle,
  xcode,
  android_manifest,
  podfile,
  gitignore,
  fs,
  json,
  prompt,
  notification_service,
  notification_view_controller,
  main_application,
  main_activity,
  settings_gradle,
  strings_xml,
  shell,
};

const systemTaskTypes = Object.entries(task)
  .filter(x => x[1].isSystemTask)
  .map(x => x[0]);

function isSystemTask(task: string): boolean {
  return systemTaskTypes.includes(task);
}
function getNonSystemTasks(steps: ModStep[]): ModStep[] {
  return steps.filter(x => !isSystemTask(x.task));
}
export const taskManager: {
  task: Record<string, TaskExports>;
  isSystemTask: (task: string) => boolean;
  getNonSystemTasks: (steps: ModStep[]) => ModStep[];
} = {
  task,
  isSystemTask,
  getNonSystemTasks,
};

export interface RunTaskArgs {
  configPath: string;
  packageName: string;
  task: any;
}

export interface TaskExports {
  runTask: (args: RunTaskArgs) => void | Promise<void>;
  summary: string;
  isSystemTask?: boolean;
}
