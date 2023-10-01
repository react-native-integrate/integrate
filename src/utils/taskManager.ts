import * as app_delegate from '../tasks/appDelegateTask';
import * as plist from '../tasks/plistTask';
import * as build_gradle from '../tasks/buildGradleTask';
import * as xcode from '../tasks/xcodeTask';
import * as android_manifest from '../tasks/androidManifestTask';
import * as podfile from '../tasks/podFileTask';
import * as fs from '../tasks/fsTask';
import * as json from '../tasks/jsonTask';

export const taskManager: Record<string, TaskExports> = {
  app_delegate,
  plist,
  build_gradle,
  xcode,
  android_manifest,
  podfile,
  fs,
  json,
};

export interface RunTaskArgs {
  configPath: string;
  packageName: string;
  task: any;
}

export interface TaskExports {
  runTask: (args: RunTaskArgs) => void | Promise<void>;
  summary: string;
}
