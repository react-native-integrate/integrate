import * as app_delegate from '../tasks/appDelegateTask';
import * as plist from '../tasks/plistTask';
import * as build_gradle from '../tasks/buildGradleTask';
import * as xcode from '../tasks/xcode/xcodeTask';
import * as android_manifest from '../tasks/androidManifestTask';
import * as strings_xml from '../tasks/stringsXmlTask';
import * as styles_xml from '../tasks/stylesXmlTask';
import * as podfile from '../tasks/podFileTask';
import * as gitignore from '../tasks/gitignoreTask';
import * as gradle_properties from '../tasks/gradlePropertiesTask';
import * as fs from '../tasks/fsTask';
import * as json from '../tasks/jsonTask';
import * as prompt from '../tasks/promptTask';
import * as notification_service from '../tasks/notificationServiceTask';
import * as notification_view_controller from '../tasks/notificationViewControllerTask';
import * as main_application from '../tasks/mainApplicationTask';
import * as main_activity from '../tasks/mainActivityTask';
import * as settings_gradle from '../tasks/settingsGradleTask';
import * as shell from '../tasks/shellTask';
import * as babel_config from '../tasks/babelConfigTask';
import * as script from '../tasks/scriptTask';
import { ModStep } from '../types/mod.types';

export const taskList = {
  /*
  Modify AppDelegate file
   */
  app_delegate,
  /*
  Modify Info.plist file
   */
  plist,
  /*
  Modify build.gradle files
   */
  build_gradle,
  /*
  Modify Xcode project
   */
  xcode,
  /*
  Modify AndroidManifest.xml file
   */
  android_manifest,
  /*
  Modify Podfile in ios folder
   */
  podfile,
  /*
  Modify .gitignore file
   */
  gitignore,
  /*
  Modify gradle.properties file
   */
  gradle_properties,
  /*
  Copy or delete files
   */
  fs,
  /*
  Create or modify any json file
   */
  json,
  /*
  Ask for user input
   */
  prompt,
  /*
  Modify NotificationService.m file
   */
  notification_service,
  /*
  Modify NotificationViewController.m file
   */
  notification_view_controller,
  /*
  Modify MainApplication java or kt file
   */
  main_application,
  /*
  Modify MainActivity java or kt file
   */
  main_activity,
  /*
  Modify settings.gradle file
   */
  settings_gradle,
  /*
  Modify strings.xml file
   */
  strings_xml,
  /*
  Modify styles.xm file
   */
  styles_xml,
  /*
  Run shell commands
   */
  shell,
  /*
  Modify babel.config.js file
   */
  babel_config,
  /*
  Execute custom JS script
   */
  script,
};

const systemTaskTypes = Object.entries(taskList)
  .filter(x => 'isSystemTask' in x[1] && x[1].isSystemTask)
  .map(x => x[0]);

function isSystemTask(task: string): boolean {
  return systemTaskTypes.includes(task);
}
function getNonSystemTasks(steps: ModStep[]): ModStep[] {
  return steps.filter(x => !isSystemTask(x.task));
}
export const taskManager: {
  task: typeof taskList;
  isSystemTask: (task: string) => boolean;
  getNonSystemTasks: (steps: ModStep[]) => ModStep[];
} = {
  task: taskList,
  isSystemTask,
  getNonSystemTasks,
};
