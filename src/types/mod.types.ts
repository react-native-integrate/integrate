import {
  ConfirmPromptArgs,
  MultiselectPromptArgs,
  TextPromptArgs,
} from './prompt.types';

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

  // specifies that before, after, append and prepend
  // should insert text without line management
  exact?: boolean;

  // narrows context to after this point
  after?: TextOrRegex;

  // narrows context to before this point
  before?: TextOrRegex;

  // narrows context to this point
  search?: TextOrRegex;

  // throws if before or after fails to find insertion point
  strict?: boolean;

  // appends text to the end of file context
  append?: TextOrFileValue;

  // appends text to the start of file context
  prepend?: TextOrFileValue;

  // replaces the file context with text
  replace?: TextOrFileValue;
};

export type ActionBase<T> = T & {
  when?: any;
};

export type ActionsType<T> = {
  actions: ActionBase<T>[];
};

// plist task

export type PlistTaskType = ModTaskBase &
  ActionsType<PlistModifierType> & {
    type: 'plist';
    target?: string;
  };

export type PlistModifierType = {
  set: {
    [key: string]: any;
  };
  strategy?: 'merge_concat' | 'merge' | 'assign';
};

// app_delegate task

export type AppDelegateTaskType = ModTaskBase &
  ActionsType<ContentModifierType<AppDelegateBlockType>> & {
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
  ActionsType<ContentModifierType> & {
    type: 'build_gradle';
    location?: BuildGradleLocationType;
  };

export type BuildGradleLocationType = 'root' | 'app';

// android manifest task

export type AndroidManifestTaskType = ModTaskBase &
  ActionsType<AndroidManifestModifierType> & {
    type: 'android_manifest';
  };

export type AndroidManifestBlockType = 'manifest' | 'application' | 'activity';

export type AndroidManifestModifierType =
  ContentModifierType<AndroidManifestBlockType> & {
    attributes?: Record<string, any>;
  };

// add resource task

export type IosResourcesTaskType = ModTaskBase &
  ActionsType<IosResourcesModifierType> & {
    type: 'ios_resources';
  };

export type IosResourcesModifierType = {
  addFile: string;
  message?: string;
  target?:
    | 'root'
    | 'app'
    | {
        name?: string;
        path?: string;
      };
};

// pod file task

export type PodFileTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    type: 'podfile';
  };

// fs task

export type FsTaskType = ModTaskBase &
  ActionsType<FsModifierType> & {
    type: 'fs';
  };

export type FsModifierType = {
  copyFile?: string;
  message?: string;
  destination: string;
};

export type ModTaskBase = {
  label?: string;
  prompts?: Prompt[];
  when?: any;
};

export type ModTask =
  | PlistTaskType
  | AppDelegateTaskType
  | ValidationTaskType
  | BuildGradleTaskType
  | AndroidManifestTaskType
  | IosResourcesTaskType
  | PodFileTaskType
  | FsTaskType;

export type TextPrompt = TextPromptArgs & {
  type: undefined;
};
export type ConfirmPrompt = ConfirmPromptArgs & {
  type: 'boolean';
};
export type MultiselectPrompt = MultiselectPromptArgs & {
  type: 'multiselect';
};

export type Prompt = {
  name: string;
  text: string;
} & (TextPrompt | ConfirmPrompt | MultiselectPrompt);

export type IntegrationConfig = {
  env?: Record<string, any>;
  prompts?: Prompt[];
  tasks: ModTask[];
};

export type BlockContentType = {
  start: number;
  end: number;
  match: string;
  justCreated: boolean;
  space: string;
};
