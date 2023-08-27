export type TextOrFileValue =
  | {
      text: string;
    }
  | {
      file: string;
    };

export type FindType = {
  find: string;
};

export type AppendPrependContentMod =
  | {
      append: TextOrFileValue;
    }
  | {
      prepend: TextOrFileValue;
    };

export type BeforeAfterContentMod = (
  | {
      after: TextOrFileValue;
    }
  | {
      before: TextOrFileValue;
    }
) &
  FindType;

export type AnyContentMod = AppendPrependContentMod | BeforeAfterContentMod;

export type PlistModType = {
  type: 'plist';
} & AnyContentMod;

export type AppDelegateModType = AppendPrependContentMod & {
  type: 'app_delegate';
  imports?: string[];
  method:
    | 'didFinishLaunchingWithOptions'
    | 'applicationDidBecomeActive'
    | 'applicationWillResignActive'
    | 'applicationDidEnterBackground'
    | 'applicationWillEnterForeground'
    | 'applicationWillTerminate'
    | 'openURL'
    | 'restorationHandler'
    | 'didRegisterForRemoteNotificationsWithDeviceToken'
    | 'didFailToRegisterForRemoteNotificationsWithError'
    | 'didReceiveRemoteNotification'
    | 'fetchCompletionHandler';
};

export type ValidationType = {
  type: 'validate';
  file: string;
  text?: string;
};

export type BuildGradleModType = {
  type: 'build_gradle';
} & AnyContentMod;

export type AppBuildGradleModType = {
  type: 'app_build_gradle';
} & AnyContentMod;

export type AndroidManifestModType = {
  type: 'android_manifest';
} & AnyContentMod;

export type AddResourceType = {
  type: 'add_resource';
  file: string;
};

export type ModStep =
  | PlistModType
  | AppDelegateModType
  | ValidationType
  | BuildGradleModType
  | AppBuildGradleModType
  | AndroidManifestModType
  | AddResourceType;

export type IntegrationConfig = {
  steps: ModStep[];
};
