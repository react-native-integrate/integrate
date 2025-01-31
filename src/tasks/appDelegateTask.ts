import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import {
  AppDelegateBlockType,
  AppDelegateTaskType,
  BlockContentType,
  IosCodeType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getIosProjectPath } from '../utils/getIosProjectPath';
import { satisfies } from '../utils/satisfies';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { variables } from '../variables';

export async function appDelegateTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: AppDelegateTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    variables.set('CONTENT', content);
    if (action.when && !satisfies(variables.getStore(), action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
        error: false,
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
      error: false,
    });
    try {
      content = await applyContentModification({
        action,
        findOrCreateBlock: findOrCreateBlock(task.lang),
        configPath,
        packageName,
        content,
        indentation: 2,
      });

      setState(action.name, {
        state: 'done',
        error: false,
      });
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
        error: true,
      });
      throw e;
    }
  }

  return content;
}

const findOrCreateBlock = (lang?: IosCodeType) => {
  const _lang = lang || 'objc';
  return (
    content: string,
    block: string
  ): {
    blockContent: BlockContentType;
    content: string;
  } => {
    let blockContent = {
      start: 0,
      end: content.length,
      match: content,
      space: '',
      justCreated: false,
    };
    const blockDefinition =
      blockDefinitions[_lang][block as AppDelegateBlockType];

    if (!blockDefinition) throw new Error(`Invalid block: ${block}`);
    const { regex, makeNewMethod } = blockDefinition;
    let blockStart = regex.exec(content);

    const justCreated = !blockStart;
    if (!blockStart) {
      const newMethod = makeNewMethod();
      content = appendNewMethod(content, newMethod, _lang);

      blockStart = regex.exec(content);
    }
    if (!blockStart) {
      throw new Error('block could not be inserted, something wrong?');
    }
    const blockEndIndex = findClosingTagIndex(
      content,
      blockStart.index + blockStart[0].length
    );
    const blockBody = content.substring(
      blockStart.index + blockStart[0].length,
      blockEndIndex
    );
    blockContent = {
      start: blockStart.index + blockStart[0].length,
      end: blockEndIndex,
      match: blockBody,
      justCreated,
      space: _lang === 'swift' ? ' '.repeat(2) : '',
    };

    return {
      blockContent,
      content,
    };
  };
};

const blockDefinitions: Record<
  IosCodeType,
  Record<AppDelegateBlockType, { regex: RegExp; makeNewMethod: () => string }>
> = {
  objc: {
    didFinishLaunchingWithOptions: {
      regex: /didFinishLaunchingWithOptions.*?\{/s,
      makeNewMethod: () => {
        throw new Error(
          'didFinishLaunchingWithOptions not implemented, something is wrong?'
        );
      },
    },
    applicationDidBecomeActive: {
      regex: /applicationDidBecomeActive.*?\{/s,
      makeNewMethod: () => {
        return '- (void)applicationDidBecomeActive:(UIApplication *)application {}';
      },
    },
    applicationWillResignActive: {
      regex: /applicationWillResignActive.*?\{/s,
      makeNewMethod: () => {
        return '- (void)applicationWillResignActive:(UIApplication *)application {}';
      },
    },
    applicationDidEnterBackground: {
      regex: /applicationDidEnterBackground.*?\{/s,
      makeNewMethod: () => {
        return '- (void)applicationDidEnterBackground:(UIApplication *)application {}';
      },
    },
    applicationWillEnterForeground: {
      regex: /applicationWillEnterForeground.*?\{/s,
      makeNewMethod: () => {
        return '- (void)applicationWillEnterForeground:(UIApplication *)application {}';
      },
    },
    applicationWillTerminate: {
      regex: /applicationWillTerminate.*?\{/s,
      makeNewMethod: () => {
        return '- (void)applicationWillTerminate:(UIApplication *)application {}';
      },
    },
    openURL: {
      regex: /openURL:.*?options:.*?\{/s,
      makeNewMethod: () => {
        // noinspection SpellCheckingInspection
        return '- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {}';
      },
    },
    restorationHandler: {
      regex: /continueUserActivity:.*?restorationHandler:.*?\{/s,
      makeNewMethod: () => {
        return '- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray *))restorationHandler {}';
      },
    },
    didRegisterForRemoteNotificationsWithDeviceToken: {
      regex: /didRegisterForRemoteNotificationsWithDeviceToken.*?\{/s,
      makeNewMethod: () => {
        return '- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {}';
      },
    },
    didFailToRegisterForRemoteNotificationsWithError: {
      regex: /didFailToRegisterForRemoteNotificationsWithError.*?\{/s,
      makeNewMethod: () => {
        return '- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {}';
      },
    },
    didReceiveRemoteNotification: {
      regex: /didReceiveRemoteNotification((?!fetchCompletionHandler).)*?\{/s,
      makeNewMethod: () => {
        return '- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo {}';
      },
    },
    fetchCompletionHandler: {
      regex: /didReceiveRemoteNotification:.*?fetchCompletionHandler:.*?\{/s,
      makeNewMethod: () => {
        return '- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler {}';
      },
    },
  },
  swift: {
    didFinishLaunchingWithOptions: {
      regex: /func application\(.*?didFinishLaunchingWithOptions.*?\{/s,
      makeNewMethod: () => {
        throw new Error(
          'didFinishLaunchingWithOptions not implemented, something is wrong?'
        );
      },
    },
    applicationDidBecomeActive: {
      regex: /func application\(.*?didBecomeActive.*?\{/s,
      makeNewMethod: () => {
        return 'func applicationDidBecomeActive(_ application: UIApplication) {}';
      },
    },
    applicationWillResignActive: {
      regex: /func application\(.*?willResignActive.*?\{/s,
      makeNewMethod: () => {
        return 'func applicationWillResignActive(_ application: UIApplication) {}';
      },
    },
    applicationDidEnterBackground: {
      regex: /func application\(.*?didEnterBackground.*?\{/s,
      makeNewMethod: () => {
        return 'func applicationDidEnterBackground(_ application: UIApplication) {}';
      },
    },
    applicationWillEnterForeground: {
      regex: /func application\(.*?willEnterForeground.*?\{/s,
      makeNewMethod: () => {
        return 'func applicationWillEnterForeground(_ application: UIApplication) {}';
      },
    },
    applicationWillTerminate: {
      regex: /func application\(.*?willTerminate.*?\{/s,
      makeNewMethod: () => {
        return 'func applicationWillTerminate(_ application: UIApplication) {}';
      },
    },
    openURL: {
      regex: /func application\(.*?open url:.*?\{/s,
      makeNewMethod: () => {
        return 'func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any]) -> Bool { return true }';
      },
    },
    restorationHandler: {
      regex: /func application\(.*?continue userActivity:.*?\{/s,
      makeNewMethod: () => {
        return 'func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool { return true }';
      },
    },
    didRegisterForRemoteNotificationsWithDeviceToken: {
      regex:
        /func application\(.*?didRegisterForRemoteNotificationsWithDeviceToken.*?\{/s,
      makeNewMethod: () => {
        return 'func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data) {}';
      },
    },
    didFailToRegisterForRemoteNotificationsWithError: {
      regex:
        /func application\(.*?didFailToRegisterForRemoteNotificationsWithError.*?\{/s,
      makeNewMethod: () => {
        return 'func application(_ application: UIApplication, didFailToRegisterForRemoteNotificationsWithError error: Error) {}';
      },
    },
    didReceiveRemoteNotification: {
      regex: /func application\(.*?didReceiveRemoteNotification.*?\{/s,
      makeNewMethod: () => {
        return 'func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any]) {}';
      },
    },
    fetchCompletionHandler: {
      regex:
        /func application\(.*?didReceiveRemoteNotification.*?completionHandler.*?\{/s,
      makeNewMethod: () => {
        return 'func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {}';
      },
    },
  },
};

function appendNewMethod(
  content: string,
  newMethod: string,
  lang: IosCodeType
): string {
  const appDelegateMatch =
    lang === 'objc'
      ? /@implementation AppDelegate.*?@end/s.exec(content)
      : /class AppDelegate:.*\}/s.exec(content);
  if (!appDelegateMatch)
    throw new Error('Could not find @implementation AppDelegate');
  const codeToInsert = `${newMethod}

`;
  return stringSplice(
    content,
    appDelegateMatch.index +
      appDelegateMatch[0].length -
      (lang === 'objc' ? 4 : 1),
    0,
    codeToInsert
  );
}

function getAppDelegatePath(lang?: IosCodeType) {
  const iosProjectPath = getIosProjectPath();

  const appDelegatePath = path.join(
    iosProjectPath,
    lang === 'swift'
      ? Constants.APP_DELEGATE_SWIFT_FILE_NAME
      : Constants.APP_DELEGATE_MM_FILE_NAME
  );
  if (!fs.existsSync(appDelegatePath))
    throw new Error(`AppDelegate file not found at ${appDelegatePath}`);
  return appDelegatePath;
}

function readAppDelegateContent(lang?: IosCodeType) {
  const appDelegatePath = getAppDelegatePath(lang);
  return fs.readFileSync(appDelegatePath, 'utf-8');
}

function writeAppDelegateContent(content: string, lang?: IosCodeType): void {
  const appDelegatePath = getAppDelegatePath(lang);
  return fs.writeFileSync(appDelegatePath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: AppDelegateTaskType;
}): Promise<void> {
  let content = readAppDelegateContent(args.task.lang);

  content = await appDelegateTask({
    ...args,
    content,
  });

  writeAppDelegateContent(content, args.task.lang);
}

export const summary = 'AppDelegate modification';
