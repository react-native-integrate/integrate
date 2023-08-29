import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import { logMessage, logMessageGray, summarize } from '../prompter';
import { AppDelegateModType } from '../types/mod.types';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { findInsertionPoint } from '../utils/findInsertionPoint';
import { getIosProjectPath } from '../utils/getIosProjectPath';
import { getModContent } from '../utils/getModContent';
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
    if (!content.includes(imp)) {
      content = `${codeToInsert}\n` + content;
      logMessage(`added import: ${summarize(imp)}`);
    } else
      logMessageGray(
        `import already exists, skipped adding: ${summarize(imp)}`
      );
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
      logMessage(
        `added new method ${task.method} with code: ${summarize(prependText)}`
      );
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
      if (task.ifNotPresent && methodBody.includes(task.ifNotPresent)) {
        logMessageGray(
          `found existing ${summarize(
            task.ifNotPresent
          )}, skipped inserting: ${summarize(prependText)}`
        );
      } else if (!methodBody.includes(prependText)) {
        content = stringSplice(
          content,
          methodStartMatch.index + methodStartMatch[0].length,
          0,
          codeToInsert
        );
        logMessage(
          `prepended code in ${summarize(task.method)}: ${summarize(
            prependText
          )}`
        );
      } else
        logMessageGray(
          `code already exists, skipped prepending: ${summarize(prependText)}`
        );
    }
  }
  if ('append' in task) {
    const appendText = getModContent(configPath, task.append);
    const codeToInsert = getCodeToInsert(appendText);
    if (!methodStartMatch) {
      const newMethod = makeNewMethod(codeToInsert);
      content = appendNewMethod(content, newMethod);
      logMessage(
        `added new method ${task.method} with code: ${summarize(appendText)}`
      );
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
      if (task.ifNotPresent && methodBody.includes(task.ifNotPresent)) {
        logMessageGray(
          `found existing ${summarize(
            task.ifNotPresent
          )}, skipped inserting: ${summarize(appendText)}`
        );
      } else if (!methodBody.includes(appendText)) {
        content = stringSplice(content, methodEndIndex - 1, 0, codeToInsert);
        logMessage(
          `appended code in ${summarize(task.method)}: ${summarize(appendText)}`
        );
      } else
        logMessageGray(
          `code already exists, skipped appending: ${summarize(appendText)}`
        );
    }
  }
  if ('before' in task) {
    const text = getModContent(configPath, task.before.insert);
    const codeToInsert = getCodeToInsert(text);
    if (!methodStartMatch) {
      const newMethod = makeNewMethod(codeToInsert);
      content = appendNewMethod(content, newMethod);
      logMessage(
        `added new method ${task.method} with code: ${summarize(text)}`
      );
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
      if (task.ifNotPresent && methodBody.includes(task.ifNotPresent)) {
        logMessageGray(
          `found existing ${summarize(
            task.ifNotPresent
          )}, skipped inserting: ${summarize(text)}`
        );
      } else if (!methodBody.includes(text)) {
        content = stringSplice(content, foundIndex.start, 0, codeToInsert);
        logMessage(
          `inserted code into ${summarize(task.method)} (before ${summarize(
            foundIndex.match,
            20
          )}): ${summarize(text)}`
        );
      } else
        logMessageGray(
          `code already exists, skipped inserting: ${summarize(text)}`
        );
    }
  }
  if ('after' in task) {
    const text = getModContent(configPath, task.after.insert);
    const codeToInsert = getCodeToInsert(text);
    if (!methodStartMatch) {
      const newMethod = makeNewMethod(codeToInsert);
      content = appendNewMethod(content, newMethod);
      logMessage(
        `added new method ${summarize(task.method)} with code: ${summarize(
          text
        )}`
      );
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
      if (task.ifNotPresent && methodBody.includes(task.ifNotPresent)) {
        logMessageGray(
          `found existing ${summarize(
            task.ifNotPresent
          )}, skipped inserting: ${summarize(text)}`
        );
      } else if (!methodBody.includes(text)) {
        content = stringSplice(content, foundIndex.end, 0, codeToInsert);
        logMessage(
          `inserted code into ${summarize(task.method)} (after ${summarize(
            foundIndex.match,
            20
          )}): ${summarize(text)}`
        );
      } else
        logMessageGray(
          `code already exists, skipped inserting: ${summarize(text)}`
        );
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
  const iosProjectPath = getIosProjectPath();

  const appDelegatePath = path.join(
    iosProjectPath,
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
