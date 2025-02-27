import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import {
  BlockContentType,
  IosCodeType,
  NotificationServiceBlockType,
  NotificationServiceTaskType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { checkCondition } from '../utils/checkCondition';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { setState } from '../utils/setState';
import { stringSplice } from '../utils/stringSplice';
import { getText, variables } from '../variables';

export async function notificationServiceTask(args: {
  configPath: string;
  packageName: string;
  content: string;
  task: NotificationServiceTaskType;
}): Promise<string> {
  let { content } = args;
  const { task, configPath, packageName } = args;

  for (const action of task.actions) {
    variables.set('CONTENT', content);
    if (action.when && !checkCondition(action.when)) {
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
        indentation: 4,
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
      blockDefinitions[_lang][block as NotificationServiceBlockType];

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
    NotificationServiceBlockType,
    { regex: RegExp; makeNewMethod: () => string }
  >
> = {
  objc: {
    didReceiveNotificationRequest: {
      regex: /didReceiveNotificationRequest:.*?withContentHandler.*?\{/s,
      makeNewMethod: () => {
        return '- (void)didReceiveNotificationRequest:(UNNotificationRequest *)request withContentHandler:(void (^)(UNNotificationContent * _Nonnull))contentHandler {}';
      },
    },
    serviceExtensionTimeWillExpire: {
      regex: /serviceExtensionTimeWillExpire.*?\{/s,
      makeNewMethod: () => {
        return '- (void)serviceExtensionTimeWillExpire {}';
      },
    },
  },
  swift: {
    didReceiveNotificationRequest: {
      regex: /didReceive.*?\{/s,
      makeNewMethod: () => {
        return `override func didReceive(
    _ request: UNNotificationRequest, 
    withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void
) {}`;
      },
    },
    serviceExtensionTimeWillExpire: {
      regex: /serviceExtensionTimeWillExpire.*?\{/s,
      makeNewMethod: () => {
        return 'override func serviceExtensionTimeWillExpire() {}';
      },
    },
  },
};

function appendNewMethod(
  content: string,
  newMethod: string,
  lang: IosCodeType
): string {
  const notificationServiceMatch =
    lang === 'objc'
      ? /@implementation NotificationService.*?@end/s.exec(content)
      : /class NotificationService:.*\}/s.exec(content);
  if (!notificationServiceMatch)
    throw new Error('Could not find @implementation NotificationService');
  const codeToInsert = `${newMethod}

`;
  return stringSplice(
    content,
    notificationServiceMatch.index +
      notificationServiceMatch[0].length -
      (lang === 'objc' ? 4 : 1),
    0,
    codeToInsert
  );
}

function getNotificationServicePath(target: string, lang?: IosCodeType) {
  const projectPath = getProjectPath();

  const notificationServicePath = path.join(
    projectPath,
    'ios',
    target,
    lang === 'swift'
      ? Constants.NOTIFICATION_SERVICE_SWIFT_FILE_NAME
      : Constants.NOTIFICATION_SERVICE_M_FILE_NAME
  );
  if (!fs.existsSync(notificationServicePath))
    throw new Error(
      `NotificationService file not found at ${notificationServicePath}`
    );
  return notificationServicePath;
}

function readNotificationServiceContent(target: string, lang?: IosCodeType) {
  const notificationServicePath = getNotificationServicePath(target, lang);
  return fs.readFileSync(notificationServicePath, 'utf-8');
}

function writeNotificationServiceContent(
  content: string,
  target: string,
  lang?: IosCodeType
): void {
  const notificationServicePath = getNotificationServicePath(target, lang);
  return fs.writeFileSync(notificationServicePath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: NotificationServiceTaskType;
}): Promise<void> {
  args.task.target = getText(args.task.target);
  let content = readNotificationServiceContent(
    args.task.target,
    args.task.lang
  );

  content = await notificationServiceTask({
    ...args,
    content,
  });

  writeNotificationServiceContent(content, args.task.target, args.task.lang);
}

export const summary = 'NotificationService modification';
