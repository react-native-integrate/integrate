import { AppDelegateModType } from '../types/mod.types';

export function appDelegateMod(args: {
  packageName: string;
  content: string;
  step: AppDelegateModType;
}): string {
  let { content } = args;
  const { step, packageName } = args;

  step.imports?.forEach(imp => {
    const codeToInsert = `#import ${imp}`;
    if (!content.includes(codeToInsert))
      content = `${codeToInsert}\n` + content;
  });
  let regex;
  switch (step.method) {
    case 'didFinishLaunchingWithOptions':
      regex = /didFinishLaunchingWithOptions.*?\{/s;
      break;
    case 'applicationDidBecomeActive':
      break;
    case 'applicationWillResignActive':
      break;
    case 'applicationDidEnterBackground':
      break;
    case 'applicationWillEnterForeground':
      break;
    case 'applicationWillTerminate':
      break;
    case 'openURL':
      break;
    case 'restorationHandler':
      break;
    case 'didRegisterForRemoteNotificationsWithDeviceToken':
      break;
    case 'didFailToRegisterForRemoteNotificationsWithError':
      break;
    case 'didReceiveRemoteNotification':
      break;
    case 'fetchCompletionHandler':
      break;
  }

  if (!regex) throw new Error(`Invalid method: ${step.method}`);
  const methodStartMatch = regex.exec(content);
  if (!methodStartMatch) {
    // TODO: handle non existing method
  } else {
    if ('append' in step) {
      const append = step.append;
      if ('text' in append) {
        const codeToInsert = `
  // ${packageName}
  ${append.text}
`;
        content = content.replace(
          methodStartMatch[0],
          methodStartMatch[0] + codeToInsert
        );
      }
    }
  }
  return content;
}
