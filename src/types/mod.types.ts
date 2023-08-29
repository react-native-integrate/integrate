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

export type AnyContentMod = {
  ifNotPresent?: string;
} & (AppendPrependContentMod | BeforeAfterContentMod);

export type PlistModType = ModTaskBase & {
  type: 'plist';
  set: {
    [key: string]: any;
  };
  strategy?: 'merge_concat' | 'merge' | 'assign';
};

export type AppDelegateModType = ModTaskBase &
  AnyContentMod & {
    type: 'app_delegate';
    comment?: string;
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
  file: string | { regex: string; flags?: string };
  find?: string | { regex: string; flags?: string };
  errorMsg?: string;
};

export type BuildGradleModType = ModTaskBase & {
  type: 'build_gradle';
  comment?: string;
  method?: string;
} & AnyContentMod;

export type AppBuildGradleModType = Omit<BuildGradleModType, 'type'> & {
  type: 'app_build_gradle';
};

export type AndroidManifestModType = ModTaskBase & {
  type: 'android_manifest';
} & AnyContentMod;

export type AddResourceType = ModTaskBase & {
  type: 'add_resource';
  file: string;
};

export type ModTaskBase = {
  label?: string;
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
