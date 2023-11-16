import fs from 'fs';
import path from 'path';
import { Constants } from '../constants';
import {
  BlockContentType,
  NotificationContentBlockType,
  NotificationViewControllerTaskType,
} from '../types/mod.types';
import { applyContentModification } from '../utils/applyContentModification';
import { findClosingTagIndex } from '../utils/findClosingTagIndex';
import { getErrMessage } from '../utils/getErrMessage';
import { getProjectPath } from '../utils/getProjectPath';
import { satisfies } from '../utils/satisfies';
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
        findOrCreateBlock,
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

function findOrCreateBlock(
  content: string,
  block: string
): {
  blockContent: BlockContentType;
  content: string;
} {
  let blockContent = {
    start: 0,
    end: content.length,
    match: content,
    space: '',
    justCreated: false,
  };
  const blockDefinition =
    blockDefinitions[block as NotificationContentBlockType];

  if (!blockDefinition) throw new Error(`Invalid block: ${block}`);
  const { regex, makeNewMethod } = blockDefinition;
  let blockStart = regex.exec(content);

  const justCreated = !blockStart;
  if (!blockStart) {
    const newMethod = makeNewMethod();
    content = appendNewMethod(content, newMethod);

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
    space: '',
  };

  return {
    blockContent,
    content,
  };
}

const blockDefinitions: Record<
  NotificationContentBlockType,
  { regex: RegExp; makeNewMethod: () => string }
> = {
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
};

function appendNewMethod(content: string, newMethod: string): string {
  const notificationContentMatch =
    /@implementation NotificationViewController.*?@end/s.exec(content);
  if (!notificationContentMatch)
    throw new Error(
      'Could not find @implementation NotificationViewController'
    );
  const codeToInsert = `${newMethod}

`;
  return stringSplice(
    content,
    notificationContentMatch.index + notificationContentMatch[0].length - 4,
    0,
    codeToInsert
  );
}

function getNotificationContentPath(target: string) {
  const projectPath = getProjectPath();

  const notificationContentPath = path.join(
    projectPath,
    'ios',
    target,
    Constants.NOTIFICATION_VIEW_CONTROLLER_FILE_NAME
  );
  if (!fs.existsSync(notificationContentPath))
    throw new Error(
      `NotificationContent file not found at ${notificationContentPath}`
    );
  return notificationContentPath;
}

function readNotificationContentContent(target: string) {
  const notificationContentPath = getNotificationContentPath(target);
  return fs.readFileSync(notificationContentPath, 'utf-8');
}

function writeNotificationContentContent(
  content: string,
  target: string
): void {
  const notificationContentPath = getNotificationContentPath(target);
  return fs.writeFileSync(notificationContentPath, content, 'utf-8');
}

export async function runTask(args: {
  configPath: string;
  packageName: string;
  task: NotificationViewControllerTaskType;
}): Promise<void> {
  args.task.target = getText(args.task.target);
  let content = readNotificationContentContent(args.task.target);

  content = await notificationViewControllerTask({
    ...args,
    content,
  });

  writeNotificationContentContent(content, args.task.target);
}

export const summary = 'NotificationViewController.m modification';
