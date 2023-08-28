import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { AppDelegateModType } from '../types/mod.types';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { findInsertionPoint } from '../utils/findInsertionPoint';
import { getModContent } from '../utils/getModContent';
import { getProjectPath } from '../utils/getProjectPath';
import { stringSplice } from '../utils/stringSplice';

export function appDelegateTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: AppDelegateModType;
}): string {
  let { content } = args;
  const { task, packageName, configPath } = args;

  task.imports?.forEach(imp => {
    const codeToInsert = `#import ${imp}`;
    if (!content.includes(imp)) content = `${codeToInsert}\n` + content;
  });
  let regex, makeNewMethod;
  switch (task.method) {
    case 'didFinishLaunchingWithOptions':
      regex = /didFinishLaunchingWithOptions.*?\{/s;
      makeNewMethod = () => {
        throw new Error(
          'didFinishLaunchingWithOptions not implemented, something is wrong?'
        );
      };
      break;
    case 'applicationDidBecomeActive':
      regex = /applicationDidBecomeActive.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)applicationDidBecomeActive:(UIApplication *)application {${codeToInsert}}`;
      };
      break;
    case 'applicationWillResignActive':
      regex = /applicationWillResignActive.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)applicationWillResignActive:(UIApplication *)application {${codeToInsert}}`;
      };
      break;
    case 'applicationDidEnterBackground':
      regex = /applicationDidEnterBackground.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)applicationDidEnterBackground:(UIApplication *)application {${codeToInsert}}`;
      };
      break;
    case 'applicationWillEnterForeground':
      regex = /applicationWillEnterForeground.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)applicationWillEnterForeground:(UIApplication *)application {${codeToInsert}}`;
      };
      break;
    case 'applicationWillTerminate':
      regex = /applicationWillTerminate.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)applicationWillTerminate:(UIApplication *)application {${codeToInsert}}`;
      };
      break;
    case 'openURL':
      regex = /openURL:.*?options:.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {${codeToInsert}}`;
      };
      break;
    case 'restorationHandler':
      regex = /continueUserActivity:.*?restorationHandler:.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))restorationHandler {${codeToInsert}}`;
      };
      break;
    case 'didRegisterForRemoteNotificationsWithDeviceToken':
      regex = /didRegisterForRemoteNotificationsWithDeviceToken.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {${codeToInsert}}`;
      };
      break;
    case 'didFailToRegisterForRemoteNotificationsWithError':
      regex = /didFailToRegisterForRemoteNotificationsWithError.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {${codeToInsert}}`;
      };
      break;
    case 'didReceiveRemoteNotification':
      regex = /didReceiveRemoteNotification((?!fetchCompletionHandler).)*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {${codeToInsert}}`;
      };
      break;
    case 'fetchCompletionHandler':
      regex = /didReceiveRemoteNotification:.*?fetchCompletionHandler:.*?\{/s;
      makeNewMethod = (codeToInsert: string) => {
        return `- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {${codeToInsert}}`;
      };
      break;
  }

  if (!regex) throw new Error(`Invalid method: ${task.method}`);
  const getCodeToInsert = (text: string) => `
  // ${task.comment || packageName}
  ${text}
`;
  let methodStartMatch = regex.exec(content);
  if ('prepend' in task) {
    const prependText = getModContent(configPath, task.prepend);
    const codeToInsert = getCodeToInsert(prependText);
    if (!methodStartMatch) {
      const newMethod = makeNewMethod(codeToInsert);
      content = appendNewMethod(content, newMethod);
      methodStartMatch = regex.exec(content);
    } else {
      const methodEndIndex = findClosingTagIndex(
        content,
        methodStartMatch.index + methodStartMatch[0].length
      );
      const methodBody = content.substring(
        methodStartMatch.index + methodStartMatch[0].length,
        methodEndIndex
      );
      if (!methodBody.includes(prependText))
        content = stringSplice(
          content,
          methodStartMatch.index + methodStartMatch[0].length,
          0,
          codeToInsert
        );
    }
  }
  if ('append' in task) {
    const appendText = getModContent(configPath, task.append);
    const codeToInsert = getCodeToInsert(appendText);
    if (!methodStartMatch) {
      const newMethod = makeNewMethod(codeToInsert);
      content = appendNewMethod(content, newMethod);
      methodStartMatch = regex.exec(content);
    } else {
      const methodEndIndex = findClosingTagIndex(
        content,
        methodStartMatch.index + methodStartMatch[0].length
      );
      const methodBody = content.substring(
        methodStartMatch.index + methodStartMatch[0].length,
        methodEndIndex
      );
      if (!methodBody.includes(appendText)) {
        content = stringSplice(content, methodEndIndex - 1, 0, codeToInsert);
      }
    }
  }
  if ('before' in task) {
    const text = getModContent(configPath, task.before.insert);
    const codeToInsert = getCodeToInsert(text);
    if (!methodStartMatch) {
      const newMethod = makeNewMethod(codeToInsert);
      content = appendNewMethod(content, newMethod);
      methodStartMatch = regex.exec(content);
    } else {
      const foundIndex = findInsertionPoint(content, task.before);
      if (foundIndex.start == -1)
        throw new Error('Could not find insertion point');
      const methodEndIndex = findClosingTagIndex(
        content,
        methodStartMatch.index + methodStartMatch[0].length
      );
      const methodBody = content.substring(
        methodStartMatch.index + methodStartMatch[0].length,
        methodEndIndex
      );
      if (!methodBody.includes(text)) {
        content = stringSplice(content, foundIndex.start, 0, codeToInsert);
      }
    }
  }
  if ('after' in task) {
    const text = getModContent(configPath, task.after.insert);
    const codeToInsert = getCodeToInsert(text);
    if (!methodStartMatch) {
      const newMethod = makeNewMethod(codeToInsert);
      content = appendNewMethod(content, newMethod);
    } else {
      const foundIndex = findInsertionPoint(content, task.after);
      if (foundIndex.start == -1)
        throw new Error('Could not find insertion point');
      const methodEndIndex = findClosingTagIndex(
        content,
        methodStartMatch.index + methodStartMatch[0].length
      );
      const methodBody = content.substring(
        methodStartMatch.index + methodStartMatch[0].length,
        methodEndIndex
      );
      if (!methodBody.includes(text)) {
        content = stringSplice(content, foundIndex.end, 0, codeToInsert);
      }
    }
  }
  return content;
}

function appendNewMethod(content: string, newMethod: string): string {
  const appDelegateMatch = /@implementation AppDelegate.*?@end/s.exec(content);
  if (!appDelegateMatch)
    throw new Error('Could not find @implementation AppDelegate');
  const codeToInsert = `${newMethod}

`;
  return stringSplice(
    content,
    appDelegateMatch.index + appDelegateMatch[0].length - 4,
    0,
    codeToInsert
  );
}

function getAppDelegatePath() {
  const projectPath = getProjectPath();
  const workspaceFolder = fs
    .readdirSync(path.join(projectPath, 'ios'))
    .find(x => x.endsWith(Constants.WORKSPACE_EXT));
  if (!workspaceFolder) throw new Error('iOS workspace not found.');
  const projectName = workspaceFolder.replace(Constants.WORKSPACE_EXT, '');

  const appDelegatePath = path.join(
    projectPath,
    'ios',
    projectName,
    Constants.APP_DELEGATE_FILE_NAME
  );
  if (!fs.existsSync(appDelegatePath))
    throw new Error(`AppDelegate file not found at ${appDelegatePath}`);
  return appDelegatePath;
}
function readAppDelegateContent() {
  const appDelegatePath = getAppDelegatePath();
  return fs.readFileSync(appDelegatePath, 'utf-8');
}

function writeAppDelegateContent(content: string): void {
  const appDelegatePath = getAppDelegatePath();
  return fs.writeFileSync(appDelegatePath, content, 'utf-8');
}

export function runTask(args: {
  configPath: string;
  packageName: string;
  task: AppDelegateModType;
}): void {
  let content = readAppDelegateContent();

  content = appDelegateTask({
    ...args,
    content,
  });

  writeAppDelegateContent(content);
}
