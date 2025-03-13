import { XcodeProjectType } from 'xcode';
import type { taskList } from '../utils/taskManager';
import {
  ConfirmPromptArgs,
  MultiselectPromptArgs,
  SelectPromptArgs,
  TextPromptArgs,
} from './prompt.types';

export type TextOrFileValue =
  | string
  | {
      file: string;
    };

export type TextOrRegex = string | { regex: string; flags?: string };

export type TextOrTitleMessage =
  | string
  | {
      title: string;
      message: string;
    };

export type ContentModifierType<TBlock = string> = ActionBase & {
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

  // run script in the context
  script?: string;
};

export type ObjectModifierType = ActionBase &
  (
    | {
        set: {
          [key: string]: any;
        };
        strategy?: ObjectModifierStrategy;
      }
    | {
        script: string;
      }
  );

export type ObjectModifierStrategy =
  | 'merge_concat'
  | 'merge_distinct'
  | 'merge'
  | 'append'
  | 'assign';

export type ActionBase = {
  name?: string;
  when?: string | AnyObject;
};

export type ActionsType<T extends ActionBase> = {
  actions: T[];
};

// plist task

export type PlistTaskType = ModTaskBase &
  ActionsType<ObjectModifierType> & {
    task: 'plist';
    target?: string;
  };

// json task

export type JsonTaskType = ModTaskBase &
  ActionsType<ObjectModifierType> & {
    task: 'json';
    path: string;
  };

// app_delegate task

export type AppDelegateTaskType = ModTaskBase &
  ActionsType<ContentModifierType<AppDelegateBlockType>> & {
    task: 'app_delegate';
    lang?: IosCodeType;
  };
export type IosCodeType = 'objc' | 'swift';

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

// notification_service task

export type NotificationServiceTaskType = ModTaskBase &
  ActionsType<ContentModifierType<NotificationServiceBlockType>> & {
    task: 'notification_service';
    target: string;
    lang?: IosCodeType;
  };
export type NotificationServiceBlockType =
  | 'didReceiveNotificationRequest'
  | 'serviceExtensionTimeWillExpire';

// notification_view_controller task

export type NotificationViewControllerTaskType = ModTaskBase &
  ActionsType<ContentModifierType<NotificationContentBlockType>> & {
    task: 'notification_view_controller';
    target: string;
    lang?: IosCodeType;
  };
export type NotificationContentBlockType =
  | 'viewDidLoad'
  | 'viewWillAppear'
  | 'viewDidAppear'
  | 'viewWillDisappear'
  | 'dealloc'
  | 'didReceiveNotification'
  | 'didReceiveNotificationResponse';

// validation task

// export type ValidationTaskType = ModTaskBase & {
//   task: 'validate';
//   file: string | { regex: string; flags?: string };
//   find?: string | { regex: string; flags?: string };
//   errorMsg?: string;
// };

// build gradle task

export type BuildGradleTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'build_gradle';
    location?: BuildGradleLocationType;
  };

export type BuildGradleLocationType = 'root' | 'app';

// settings gradle task

export type SettingsGradleTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'settings_gradle';
  };

// main application task

export type MainApplicationTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'main_application';
    lang?: AndroidCodeType;
  };

export type AndroidCodeType = 'java' | 'kotlin';

// main activity

export type MainActivityTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'main_activity';
    lang?: AndroidCodeType;
  };

// android manifest task

export type AndroidManifestTaskType = ModTaskBase &
  ActionsType<AndroidManifestModifierType> & {
    task: 'android_manifest';
  };

export type AndroidManifestBlockType = 'manifest' | 'application' | 'activity';

export type AndroidManifestModifierType =
  ContentModifierType<AndroidManifestBlockType> & {
    attributes?: AnyObject;
  };

// strings xml task

export type StringsXmlTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'strings_xml';
  };

// styles xml task

export type StylesXmlTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'styles_xml';
  };

// add resource task

export type XcodeTaskType = ModTaskBase &
  ActionsType<XcodeModifierType> & {
    task: 'xcode';
  };

export type XcodeAddFile = ActionBase & {
  addFile: string;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  target?: 'root' | 'main' | string;
};
export type XcodeAddTarget = Omit<ActionBase, 'name'> & {
  name: string;
  addTarget: string;
  type: XcodeAddTargetType;
  message?: string;
};

export type XcodeAddTargetType =
  | 'notification-service'
  | 'notification-content';

export type XcodeAddCapabilityBase = ActionBase & {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  target: 'main' | string;
};

export type XcodeAddCommonCapability = XcodeAddCapabilityBase & {
  addCapability: XcodeAddCommonCapabilityType;
};

export type XcodeAddCommonCapabilityType =
  | 'push'
  | 'wireless-configuration'
  | 'app-attest'
  | 'data-protection'
  | 'homekit'
  | 'healthkit'
  | 'inter-app-audio'
  | 'increased-memory';

export type XcodeAddGroupCapability = XcodeAddCapabilityBase & {
  addCapability: 'groups';
  groups: string[];
};

export type XcodeAddDomainsCapability = XcodeAddCapabilityBase & {
  addCapability: 'domains';
  domains: string[];
};

export type XcodeAddBMCapability = XcodeAddCapabilityBase & {
  addCapability: 'background-mode';
  modes: XcodeAddBMCapabilityModes[];
};
export type XcodeAddBMCapabilityModes =
  | 'audio'
  | 'bluetooth-central'
  | 'bluetooth-peripheral'
  | 'external-accessory'
  | 'fetch'
  | 'location'
  | 'nearby-interaction'
  | 'processing'
  | 'push-to-talk'
  | 'remote-notification'
  | 'voip';

export type XcodeAddGCCapability = XcodeAddCapabilityBase & {
  addCapability: 'game-controllers';
  controllers: XcodeAddGCCapabilityControllers[];
};

export type XcodeAddGCCapabilityControllers =
  | 'extended'
  | 'micro'
  | 'directional';

export type XcodeAddMapsCapability = XcodeAddCapabilityBase & {
  addCapability: 'maps';
  routing: XcodeAddMapsCapabilityRouting[];
};
export type XcodeAddMapsCapabilityRouting =
  | 'bike'
  | 'bus'
  | 'car'
  | 'ferry'
  | 'other'
  | 'pedestrian'
  | 'plane'
  | 'ride-share'
  | 'street-car'
  | 'subway'
  | 'taxi'
  | 'train';

export type XcodeAddKSCapability = XcodeAddCapabilityBase & {
  addCapability: 'keychain-sharing';
  groups: string[];
};

export type XcodeAddCapability =
  | XcodeAddCommonCapability
  | XcodeAddGroupCapability
  | XcodeAddDomainsCapability
  | XcodeAddBMCapability
  | XcodeAddGCCapability
  | XcodeAddMapsCapability
  | XcodeAddKSCapability;

export type XcodeSetDeploymentVersion = ActionBase & {
  setDeploymentVersion:
    | string
    | number
    | { min: string | number; max?: string | number };
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  target: 'root' | 'main' | string;
};

export type XcodeAddConfiguration = ActionBase & {
  addConfiguration: TextOrFileValue;
};

export type XcodeAddPreBuildRunScriptAction = ActionBase & {
  addPreBuildRunScriptAction: TextOrFileValue;
};

export type XcodeScriptAction = ActionBase & {
  script: string | ((project: XcodeProjectType) => Promise<any>);
};

export type XcodeModifierType =
  | XcodeAddFile
  | XcodeAddTarget
  | XcodeAddCapability
  | XcodeSetDeploymentVersion
  | XcodeAddConfiguration
  | XcodeAddPreBuildRunScriptAction
  | XcodeScriptAction;

// pod file task

export type PodFileTaskType = ModTaskBase &
  ActionsType<PodFileModifierType> & {
    task: 'podfile';
  };

export type PodFileModifierType = ContentModifierType & {
  useFrameworks?: 'dynamic' | 'static';
  staticLibrary?: string | string[];
  disableFlipper?: boolean;
};

// gitignore task

export type GitignoreTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'gitignore';
  };

// gradle properties task

export type GradlePropertiesTaskType = ModTaskBase &
  ActionsType<ContentModifierType> & {
    task: 'gradle_properties';
  };

// fs task

export type FsTaskType = ModTaskBase &
  ActionsType<FsModifierType> & {
    task: 'fs';
  };

export type FsCopyModifierType = ActionBase & {
  copyFile: string;
  message?: string;
  destination: string;
};
export type FsRemoveModifierType = ActionBase & {
  removeFile: string;
  strict?: boolean;
};
export type FsModifierType = FsCopyModifierType | FsRemoveModifierType;

// shell task

export type ShellTaskType = ModTaskBase &
  ActionsType<ShellActionType> & {
    task: 'shell';
  };

export type ShellActionType = ActionBase & {
  command: string;
  args?: string[];
  cwd?: string;
};

// prompt task

export type PromptTaskType = ModTaskBase &
  ActionsType<PromptActionType> & {
    task: 'prompt';
  };

export type PromptActionType = ActionBase & Prompt;

// babel config task

export type BabelConfigTaskType = ModTaskBase &
  ActionsType<BabelConfigModifierType> & {
    task: 'babel_config';
  };

export type BabelConfigModifierType =
  | (ObjectModifierType & {
      root?: string;
    })
  | (ContentModifierType & {
      mode: 'text';
    });

// script task

export type ScriptTaskType = ModTaskBase &
  ActionsType<ScriptActionType> & {
    task: 'script';
  };

export type TextScriptActionType = ActionBase & {
  script: string;
};
export type ModuleScriptActionType = ActionBase & {
  module: string;
};
export type ScriptActionType = TextScriptActionType | ModuleScriptActionType;

export type ModTaskBase = {
  name?: string;
  label?: string;
  when?: string | AnyObject;
  preInfo?: TextOrTitleMessage;
  postInfo?: TextOrTitleMessage;
};

export type ModStep =
  | PlistTaskType
  | AppDelegateTaskType
  | BuildGradleTaskType
  | SettingsGradleTaskType
  | MainApplicationTaskType
  | MainActivityTaskType
  | AndroidManifestTaskType
  | StringsXmlTaskType
  | StylesXmlTaskType
  | NotificationServiceTaskType
  | NotificationViewControllerTaskType
  | XcodeTaskType
  | PodFileTaskType
  | GitignoreTaskType
  | GradlePropertiesTaskType
  | FsTaskType
  | JsonTaskType
  | PromptTaskType
  | ShellTaskType
  | BabelConfigTaskType
  | ScriptTaskType;

export type ValidationType = { regex: string; flags?: string; message: string };
export type TextPrompt = Omit<TextPromptArgs, 'validate'> & {
  type: 'text';
  validate?: ValidationType | ValidationType[];
};
export type ConfirmPrompt = ConfirmPromptArgs & {
  type: 'boolean';
};
export type MultiselectPrompt = MultiselectPromptArgs & {
  type: 'multiselect';
};
export type SelectPrompt = SelectPromptArgs & {
  type: 'select';
};

export type Prompt = {
  name: string;
  text: string;
} & (TextPrompt | ConfirmPrompt | MultiselectPrompt | SelectPrompt);

/**
 * @TJS-additionalProperties true
 */
export type AnyObject = Record<string, any>;

export type IntegrationConfig = {
  env?: AnyObject;
  steps: ModStep[];
  preInfo?: TextOrTitleMessage;
  postInfo?: TextOrTitleMessage;
  dependencies?: string[];
  minRNVersion?: number | string;
  minVersion?: number | string;
};

export type PackageWithConfig = {
  packageName: string;
  version: string;
  configPath: string;
  config: IntegrationConfig;
};

export type BlockContentType = {
  start: number;
  end: number;
  match: string;
  justCreated: boolean;
  space: string;
};

export type TaskState = {
  state: 'progress' | 'error' | 'skipped' | 'done';
  error: boolean;
  reason?: string;
};

export type PackageJsonType = {
  name: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies?: Record<string, string>;
} & Record<string, any>;

export type TaskName = keyof typeof taskList;
export type ModuleContext = {
  [K in TaskName]: (
    action:
      | Extract<ModStep, { task: K }>['actions'][number]
      | Extract<ModStep, { task: K }>['actions'][number][],
    opts?: Omit<Extract<ModStep, { task: K }>, 'task' | 'actions'>
  ) => Promise<void>;
} & {
  /**
   * Gets a variable value
   * @param variableName Name of the variable
   */
  get: <T>(variableName: string) => T;

  /**
   * Sets a variable value
   * @param variableName Name of the variable
   * @param value Value of the variable
   */
  set: (variableName: string, value: any) => void;
};
