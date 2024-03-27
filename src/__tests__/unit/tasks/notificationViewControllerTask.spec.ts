/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import {
  notificationViewControllerTask,
  runTask,
} from '../../../tasks/notificationViewControllerTask';
import { NotificationViewControllerTaskType } from '../../../types/mod.types';
import { writeMockNotificationContent } from '../../mocks/mockAll';
import { notificationViewControllerM as mockNotificationContentTemplate } from '../../../scaffold/notification-content/notificationViewControllerM';

describe('notificationViewControllerTask', () => {
  it('should skip insert when ifNotPresent exists', async () => {
    mockPrompter.log.message.mockReset();
    const content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          ifNotPresent: 'super viewDidLoad]',
          before: { regex: 'return' },
          prepend: '[FIRApp configure];',
          append: '[FIRApp configure];',
        },
      ],
    };
    await notificationViewControllerTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should prepend text into didLaunchWithOptions', async () => {
    let content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationResponse',
          prepend: '[FIRApp configure];',
        },
      ],
    };
    content = await notificationViewControllerTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append text into didLaunchWithOptions', async () => {
    let content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationResponse',
          append: '[FIRApp configure];',
        },
      ],
    };
    content = await notificationViewControllerTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into didLaunchWithOptions', async () => {
    let content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          after: { regex: 'super viewDidLoad' },
          prepend: '[FIRApp configure];',
        },
      ],
    };

    content = await notificationViewControllerTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`[super viewDidLoad];
    [FIRApp configure];`);
  });
  it('should insert text before point into didLaunchWithOptions', async () => {
    let content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          before: { regex: 'super viewDidLoad' },
          append: '[FIRApp configure];',
        },
      ],
    };
    content = await notificationViewControllerTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
    [FIRApp configure];
    [super viewDidLoad];
`);
  });
  it('should skip if condition not met', async () => {
    const content = '';
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          when: { test: 'random' },
          prepend: '#import <Firebase.h>',
        },
        {
          when: { test: 'random' },
          block: 'didReceiveNotification',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    await expect(
      notificationViewControllerTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrow();
  });
  it('should throw when insertion point not found', async () => {
    const content = mockNotificationContentTemplate;
    const taskInsertBefore: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          search: 'random',
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          before: 'random',
          append: '[FIRApp configure];',
          strict: true,
        },
      ],
    };

    await expect(
      notificationViewControllerTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    const taskInsertAfter: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          after: 'random',
          prepend: '[FIRApp configure];',
          strict: true,
        },
      ],
    };

    await expect(
      notificationViewControllerTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
  });
  it('should throw when NotificationContent implementation not found', async () => {
    const content = '';
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    await expect(
      notificationViewControllerTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('@implementation NotificationViewController');
    const task2: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          block: 'didReceiveNotification',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    await expect(
      notificationViewControllerTask({
        configPath: 'path/to/config',
        task: task2,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('@implementation NotificationViewController');
  });
  it('should throw for invalid method', async () => {
    const content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'invalidMethod' as any,
          prepend: '[FIRApp configure];',
        },
      ],
    };

    await expect(
      notificationViewControllerTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('Invalid block');
  });
  it('should append text into non existing viewDidLoad', async () => {
    let content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          append: 'appended code',
        },
      ],
    };

    content = await notificationViewControllerTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('viewDidLoad');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text before point into non existing viewDidLoad', async () => {
    let content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          before: 'random',
          append: 'inserted code',
        },
      ],
    };

    content = await notificationViewControllerTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('viewDidLoad');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into non existing viewDidLoad', async () => {
    let content = mockNotificationContentTemplate;
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'viewDidLoad',
          after: 'random',
          prepend: 'inserted code',
        },
      ],
    };

    content = await notificationViewControllerTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('viewDidLoad');
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append/prepend/insert after/before text into non existing blocks}', async () => {
    for (const block of [
      'viewDidLoad' as const,
      'viewWillAppear' as const,
      'viewDidAppear' as const,
      'viewWillDisappear' as const,
      'dealloc' as const,
      'didReceiveNotification' as const,
      'didReceiveNotificationResponse' as const,
    ]) {
      let content = mockNotificationContentTemplate.replace(
        /(didReceiveNotificationRequest|viewDidLoad)/,
        'foo'
      );
      const task: NotificationViewControllerTaskType = {
        task: 'notification_view_controller',
        target: 'test',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = await notificationViewControllerTask({
        configPath: 'path/to/config',
        task,
        content,
        packageName: 'test-package',
      });

      expect(content).toContain(block);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
      // @ts-ignore
      expect(content).toContain(task.actions[0].append);

      // second append on existing block
      mockPrompter.log.message.mockReset();
      const task2: NotificationViewControllerTaskType = {
        task: 'notification_view_controller',
        target: 'test',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = await notificationViewControllerTask({
        configPath: 'path/to/config',
        task: task2,
        content,
        packageName: 'test-package',
      });

      // @ts-ignore
      expect(content).toContain(task2.actions[0].prepend);
      // @ts-ignore
      expect(content).toContain(task2.actions[0].append);

      expect(mockPrompter.log.message).toHaveBeenCalledWith(
        expect.stringContaining('code already exists')
      );
    }
  });
  it('should throw when block could not be added', async () => {
    const content = mockNotificationContentTemplate.replace(
      /viewDidLoad/,
      'foo'
    );
    mock.mockImplementationOnce(content => content);
    const task: NotificationViewControllerTaskType = {
      task: 'notification_view_controller',
      target: 'test',
      actions: [
        {
          block: 'didReceiveNotificationResponse',
          prepend: 'random',
        },
      ],
    };
    await expect(
      notificationViewControllerTask({
        configPath: 'path/to/config',
        task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('block could not be inserted');
  });

  describe('runTask', () => {
    it('should read and write app delegate file', async () => {
      const notificationContentPath = writeMockNotificationContent();
      const task: NotificationViewControllerTaskType = {
        task: 'notification_view_controller',
        target: 'test',
        actions: [
          {
            prepend: '#import <Firebase.h>',
          },
          {
            block: 'didReceiveNotificationResponse',
            prepend: '[FIRApp configure];',
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(notificationContentPath);
      // @ts-ignore
      expect(content).toContain(task.actions[1].prepend);
    });
    it('should throw when app delegate does not exist', async () => {
      const task: NotificationViewControllerTaskType = {
        task: 'notification_view_controller',
        target: 'test',
        actions: [
          {
            prepend: '#import <Firebase.h>',
          },
          {
            block: 'didReceiveNotificationResponse',
            prepend: '[FIRApp configure];',
          },
        ],
      };
      await expect(
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('NotificationContent file not found');
    });
  });
});
