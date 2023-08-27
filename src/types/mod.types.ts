export type TextOrFileValue =
  | string
  | {
      file: string;
    };

export type FindType = {
  find: string | { regex: string; flags?: string };
  insert: TextOrFileValue;
};

export type AppendPrependContentMod =
  | {
      append: TextOrFileValue;
    }
  | {
      prepend: TextOrFileValue;
    };

export type BeforeAfterContentMod =
  | {
      after: FindType;
    }
  | {
      before: FindType;
    };

export type AnyContentMod = AppendPrependContentMod | BeforeAfterContentMod;

export type PlistModType = ModTaskBase & {
  type: 'plist';
} & AnyContentMod;

export type AppDelegateModType = ModTaskBase &
  AnyContentMod & {
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

export type ValidationType = ModTaskBase & {
  type: 'validate';
  file: string;
  text?: string;
};

export type BuildGradleModType = ModTaskBase & {
  type: 'build_gradle';
} & AnyContentMod;

export type AppBuildGradleModType = ModTaskBase & {
  type: 'app_build_gradle';
} & AnyContentMod;

export type AndroidManifestModType = ModTaskBase & {
  type: 'android_manifest';
} & AnyContentMod;

export type AddResourceType = ModTaskBase & {
  type: 'add_resource';
  file: string;
};

export type ModTaskBase = {
  comment?: string;
};

export type ModTask =
  | PlistModType
  | AppDelegateModType
  | ValidationType
  | BuildGradleModType
  | AppBuildGradleModType
  | AndroidManifestModType
  | AddResourceType;

export type IntegrationConfig = {
  tasks: ModTask[];
};
