export type TextOrFileValue =
  | string
  | {
      file: string;
    };

export type TextOrRegex = string | { regex: string; flags?: string };

export type ContentModifierType<TBlock = string> = {
  // adds comment with code
  comment?: string;

  // block to insert
  block?: TBlock;

  // inserts if text is not present
  ifNotPresent?: string;

  // narrows context to after this point
  after?: TextOrRegex;

  // narrows context to before this point
  before?: TextOrRegex;

  // throws if before or after fails to find insertion point
  strict?: boolean;
} & (
  | {
      // appends text to the end of file context
      append: TextOrFileValue;
    }
  | {
      // appends tex to the start of file context
      prepend: TextOrFileValue;
    }
);

export type UpdatesType<T> = {
  updates: T[];
};

// plist task

export type PlistTaskType = ModTaskBase &
  UpdatesType<PlistModifierType> & {
    type: 'plist';
  };

export type PlistModifierType = {
  set: {
    [key: string]: any;
  };
  strategy?: 'merge_concat' | 'merge' | 'assign';
};

// app_delegate task

export type AppDelegateTaskType = ModTaskBase &
  UpdatesType<ContentModifierType<AppDelegateBlockType>> & {
    type: 'app_delegate';
  };
export type AppDelegateBlockType =
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

// validation task

export type ValidationTaskType = ModTaskBase & {
  type: 'validate';
  file: string | { regex: string; flags?: string };
  find?: string | { regex: string; flags?: string };
  errorMsg?: string;
};

// build gradle task

export type BuildGradleTaskType = ModTaskBase &
  UpdatesType<ContentModifierType> & {
    type: 'build_gradle';
    inAppFolder?: boolean;
  };

// android manifest task

export type AndroidManifestTaskType = ModTaskBase & {
  type: 'android_manifest';
};

// add resource task

export type IosResourcesTaskType = ModTaskBase &
  UpdatesType<IosResourcesModifierType> & {
    type: 'ios_resources';
  };

export type IosResourcesModifierType = {
  add: string;
  target?:
    | 'root'
    | 'app'
    | {
        name?: string;
        path?: string;
      };
};

export type ModTaskBase = {
  label?: string;
};

export type ModTask =
  | PlistTaskType
  | AppDelegateTaskType
  | ValidationTaskType
  | BuildGradleTaskType
  | AndroidManifestTaskType
  | IosResourcesTaskType;

export type IntegrationConfig = {
  tasks: ModTask[];
};

export type BlockContentType = {
  start: number;
  end: number;
  match: string;
  justCreated: boolean;
  space: string;
};
