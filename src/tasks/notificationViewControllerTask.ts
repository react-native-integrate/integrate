import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import {
  BlockContentType,
  IosCodeType,
  NotificationContentBlockType,
  NotificationViewControllerTaskType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { checkCondition } from '../utils/checkCondition';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { getText, variables } from '../variables';

export async function notificationViewControllerTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: NotificationViewControllerTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    variables.set('CONTENT', content);
    if (action.when && !checkCondition(action.when)) {
      setState(action.name, {
        state: 'skipped',
        reason: 'when',
      });
      continue;
    }

    setState(action.name, {
      state: 'progress',
    });
    try {
      content = await applyContentModification({
        action,
        findOrCreateBlock: findOrCreateBlock(task.lang),
        configPath,
        packageName,
        content,
        indentation: 4,
      });

      setState(action.name, {
        state: 'done',
      });
    } catch (e) {
      setState(action.name, {
        state: 'error',
        reason: getErrMessage(e),
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
      blockDefinitions[_lang][block as NotificationContentBlockType];

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
  Record<
    NotificationContentBlockType,
    { regex: RegExp; makeNewMethod: () => string }
  >
> = {
  objc: {
    viewDidLoad: {
      regex: /viewDidLoad.*?\{/s,
      makeNewMethod: () => {
        return '- (void)viewDidLoad {}';
      },
    },
    viewWillAppear: {
      regex: /viewWillAppear.*?\{/s,
      makeNewMethod: () => {
        return '- (void)viewWillAppear:(BOOL)animated {}';
      },
    },
    viewDidAppear: {
      regex: /viewDidAppear.*?\{/s,
      makeNewMethod: () => {
        return '- (void)viewDidAppear:(BOOL)animated {}';
      },
    },
    viewWillDisappear: {
      regex: /viewWillDisappear.*?\{/s,
      makeNewMethod: () => {
        return '- (void)viewWillDisappear:(BOOL)animated {}';
      },
    },
    dealloc: {
      regex: /dealloc.*?\{/s,
      makeNewMethod: () => {
        return '- (void)dealloc {}';
      },
    },
    didReceiveNotification: {
      regex: /didReceiveNotification\b.*?\{/s,
      makeNewMethod: () => {
        return '- (void)didReceiveNotification:(UNNotification *)notification {}';
      },
    },
    didReceiveNotificationResponse: {
      regex: /didReceiveNotificationResponse.*?\{/s,
      makeNewMethod: () => {
        return '- (void)didReceiveNotificationResponse:(UNNotificationResponse *)response completionHandler:(void (^)(UNNotificationContentExtensionResponseOption option))completion {}';
      },
    },
  },
  swift: {
    viewDidLoad: {
      regex: /viewDidLoad.*?\{/s,
      makeNewMethod: () => {
        return `override func viewDidLoad() {
    super.viewDidLoad()
}`;
      },
    },
    viewWillAppear: {
      regex: /viewWillAppear.*?\{/s,
      makeNewMethod: () => {
        return `override func viewWillAppear(_ animated: Bool) {
    super.viewWillAppear(animated)
}`;
      },
    },
    viewDidAppear: {
      regex: /viewDidAppear.*?\{/s,
      makeNewMethod: () => {
        return `override func viewDidAppear(_ animated: Bool) {
    super.viewDidAppear(animated)
}`;
      },
    },
    viewWillDisappear: {
      regex: /viewWillDisappear.*?\{/s,
      makeNewMethod: () => {
        return `override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
}`;
      },
    },
    dealloc: {
      regex: /deinit.*?\{/s,
      makeNewMethod: () => {
        return 'deinit {}';
      },
    },
    didReceiveNotification: {
      regex: /didReceive\s*\(.*?UNNotification.*?\{/s,
      makeNewMethod: () => {
        return 'func didReceive(_ notification: UNNotification) {}';
      },
    },
    didReceiveNotificationResponse: {
      regex: /didReceive\s*\(.*?UNNotificationResponse.*?\{/s,
      makeNewMethod: () => {
        return `func didReceive(
    _ response: UNNotificationResponse, 
    completionHandler: @escaping (UNNotificationContentExtensionResponseOption) -> Void
) {}`;
      },
    },
  },
};

function appendNewMethod(
  content: string,
  newMethod: string,
  lang: IosCodeType
): string {
  const notificationContentMatch =
    lang === 'objc'
      ? /@implementation NotificationViewController.*?@end/s.exec(content)
      : /class NotificationViewController:.*\}/s.exec(content);
  if (!notificationContentMatch)
    throw new Error(
      'Could not find @implementation NotificationViewController'
    );
  const codeToInsert = `${newMethod}

`;
  return stringSplice(
    content,
    notificationContentMatch.index +
      notificationContentMatch[0].length -
      (lang === 'objc' ? 4 : 1),
    0,
    codeToInsert
  );
}

function getNotificationContentPath(target: string, lang?: IosCodeType) {
  const projectPath = getProjectPath();

  const notificationContentPath = path.join(
    projectPath,
    'ios',
    target,
    lang === 'swift'
      ? Constants.NOTIFICATION_VIEW_CONTROLLER_SWIFT_FILE_NAME
      : Constants.NOTIFICATION_VIEW_CONTROLLER_M_FILE_NAME
  );
  if (!fs.existsSync(notificationContentPath))
    throw new Error(
      `NotificationContent file not found at ${notificationContentPath}`
    );
  return notificationContentPath;
}

function readNotificationContentContent(target: string, lang?: IosCodeType) {
  const notificationContentPath = getNotificationContentPath(target, lang);
  return fs.readFileSync(notificationContentPath, 'utf-8');
}

function writeNotificationContentContent(
  content: string,
  target: string,
  lang?: IosCodeType
): void {
  const notificationContentPath = getNotificationContentPath(target, lang);
  return fs.writeFileSync(notificationContentPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: NotificationViewControllerTaskType;
}): Promise<void> {
  args.task.target = getText(args.task.target);
  let content = readNotificationContentContent(
    args.task.target,
    args.task.lang
  );

  content = await notificationViewControllerTask({
    ...args,
    content,
  });

  writeNotificationContentContent(content, args.task.target, args.task.lang);
}

export const summary = 'NotificationViewController modification';
