/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import {
  notificationServiceTask,
  runTask,
} from '../../../tasks/notificationServiceTask';
import { NotificationServiceTaskType } from '../../../types/mod.types';
import { writeMockNotificationService } from '../../mocks/mockAll';
import { notificationServiceM as mockNotificationServiceTemplate } from '../../../scaffold/notification-service/notificationServiceM';

describe('notificationServiceTask', () => {
  it('should skip insert when ifNotPresent exists', () => {
    mockPrompter.log.message.mockReset();
    const content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationRequest',
          ifNotPresent: 'request.content mutableCopy',
          before: { regex: 'return' },
          prepend: '[FIRApp configure];',
          append: '[FIRApp configure];',
        },
      ],
    };
    notificationServiceTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should prepend text into didLaunchWithOptions', () => {
    let content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationRequest',
          prepend: '[FIRApp configure];',
        },
      ],
    };
    content = notificationServiceTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append text into didLaunchWithOptions', () => {
    let content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationRequest',
          append: '[FIRApp configure];',
        },
      ],
    };
    content = notificationServiceTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into didLaunchWithOptions', () => {
    let content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationRequest',
          after: { regex: 'request\\.content mutableCopy' },
          prepend: '[FIRApp configure];',
        },
      ],
    };

    content = notificationServiceTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content)
      .toContain(`self.bestAttemptContent = [request.content mutableCopy];
    [FIRApp configure];`);
  });
  it('should insert text before point into didLaunchWithOptions', () => {
    let content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationRequest',
          before: { regex: 'request\\.content mutableCopy' },
          append: '[FIRApp configure];',
        },
      ],
    };
    content = notificationServiceTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
    [FIRApp configure];
    self.bestAttemptContent = [request.content mutableCopy];
`);
  });
  it('should skip if condition not met', () => {
    const content = '';
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          when: { test: 'random' },
          prepend: '#import <Firebase.h>',
        },
        {
          when: { test: 'random' },
          block: 'didReceiveNotificationRequest',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    expect(() =>
      notificationServiceTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).not.toThrow();
  });
  it('should throw when insertion point not found', () => {
    const content = mockNotificationServiceTemplate;
    const taskInsertBefore: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          search: 'random',
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationRequest',
          before: 'random',
          append: '[FIRApp configure];',
          strict: true,
        },
      ],
    };

    expect(() =>
      notificationServiceTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    const taskInsertAfter: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didReceiveNotificationRequest',
          after: 'random',
          prepend: '[FIRApp configure];',
          strict: true,
        },
      ],
    };

    expect(() =>
      notificationServiceTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
  });
  it('should throw when NotificationService implementation not found', () => {
    const content = '';
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'serviceExtensionTimeWillExpire',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    expect(() =>
      notificationServiceTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('@implementation NotificationService');
  });
  it('should throw for invalid method', () => {
    const content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
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

    expect(() =>
      notificationServiceTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('Invalid block');
  });
  it('should append text into non existing serviceExtensionTimeWillExpire', () => {
    let content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'serviceExtensionTimeWillExpire',
          append: 'appended code',
        },
      ],
    };

    content = notificationServiceTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('serviceExtensionTimeWillExpire');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text before point into non existing serviceExtensionTimeWillExpire', () => {
    let content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'serviceExtensionTimeWillExpire',
          before: 'random',
          append: 'inserted code',
        },
      ],
    };

    content = notificationServiceTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('serviceExtensionTimeWillExpire');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into non existing serviceExtensionTimeWillExpire', () => {
    let content = mockNotificationServiceTemplate;
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'serviceExtensionTimeWillExpire',
          after: 'random',
          prepend: 'inserted code',
        },
      ],
    };

    content = notificationServiceTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('serviceExtensionTimeWillExpire');
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append/prepend/insert after/before text into non existing blocks}', () => {
    [
      'didReceiveNotificationRequest' as const,
      'serviceExtensionTimeWillExpire' as const,
    ].map(block => {
      let content = mockNotificationServiceTemplate.replace(
        /(didReceiveNotificationRequest|serviceExtensionTimeWillExpire)/,
        'foo'
      );
      const task: NotificationServiceTaskType = {
        type: 'notification_service',
        target: 'test',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = notificationServiceTask({
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
      const task2: NotificationServiceTaskType = {
        type: 'notification_service',
        target: 'test',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = notificationServiceTask({
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
    });
  });
  it('should throw when block could not be added', () => {
    const content = mockNotificationServiceTemplate.replace(
      /serviceExtensionTimeWillExpire/,
      'foo'
    );
    mock.mockImplementationOnce(content => content);
    const task: NotificationServiceTaskType = {
      type: 'notification_service',
      target: 'test',
      actions: [
        {
          block: 'serviceExtensionTimeWillExpire',
          prepend: 'random',
        },
      ],
    };
    expect(() =>
      notificationServiceTask({
        configPath: 'path/to/config',
        task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('block could not be inserted');
  });

  describe('runTask', () => {
    it('should read and write app delegate file', () => {
      const notificationServicePath = writeMockNotificationService();
      const task: NotificationServiceTaskType = {
        type: 'notification_service',
        target: 'test',
        actions: [
          {
            prepend: '#import <Firebase.h>',
          },
          {
            block: 'didReceiveNotificationRequest',
            prepend: '[FIRApp configure];',
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(notificationServicePath);
      // @ts-ignore
      expect(content).toContain(task.actions[1].prepend);
    });
    it('should throw when app delegate does not exist', () => {
      const task: NotificationServiceTaskType = {
        type: 'notification_service',
        target: 'test',
        actions: [
          {
            prepend: '#import <Firebase.h>',
          },
          {
            block: 'didReceiveNotificationRequest',
            prepend: '[FIRApp configure];',
          },
        ],
      };
      expect(() => {
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        });
      }).toThrowError('NotificationService file not found');
    });
  });
});
