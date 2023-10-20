/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import { appDelegateTask, runTask } from '../../../tasks/appDelegateTask';
import { AppDelegateTaskType } from '../../../types/mod.types';
import { writeMockAppDelegate } from '../../mocks/mockAll';
import { mockAppDelegateTemplate } from '../../mocks/mockAppDelegateTemplate';

describe('appDelegateTask', () => {
  it('should skip insert when ifNotPresent exists', () => {
    mockPrompter.log.message.mockReset();
    const content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          ifNotPresent: 'RCTAppSetupPrepareApp',
          before: { regex: 'return' },
          prepend: '[FIRApp configure];',
          append: '[FIRApp configure];',
        },
      ],
    };
    appDelegateTask({
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
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          prepend: '[FIRApp configure];',
        },
      ],
    };
    content = appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append text into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          append: '[FIRApp configure];',
        },
      ],
    };
    content = appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          after: { regex: 'RCTBridge \\*bridge' },
          prepend: '[FIRApp configure];',
        },
      ],
    };

    content = appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content)
      .toContain(`RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  [FIRApp configure];`);
  });
  it('should insert text before point into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          before: { regex: 'RCTBridge \\*bridge' },
          append: '[FIRApp configure];',
        },
      ],
    };
    content = appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
  [FIRApp configure];
  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
`);
  });
  it('should throw when didLaunchWithOptions does not exist', () => {
    const content = '';
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    expect(() =>
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('didFinishLaunchingWithOptions not implemented');
  });
  it('should skip if condition not met', () => {
    const content = '';
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          when: { test: 'random' },
          prepend: '#import <Firebase.h>',
        },
        {
          when: { test: 'random' },
          block: 'didFinishLaunchingWithOptions',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    expect(() =>
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).not.toThrow();
  });
  it('should throw when insertion point not found', () => {
    const content = mockAppDelegateTemplate;
    const taskInsertBefore: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          search: 'random',
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          before: 'random',
          append: '[FIRApp configure];',
          strict: true,
        },
      ],
    };

    expect(() =>
      appDelegateTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    const taskInsertAfter: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          after: 'random',
          prepend: '[FIRApp configure];',
          strict: true,
        },
      ],
    };

    expect(() =>
      appDelegateTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
  });
  it('should throw when AppDelegate implementation not found', () => {
    const content = '';
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'applicationDidBecomeActive',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    expect(() =>
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('@implementation AppDelegate');
  });
  it('should throw for invalid method', () => {
    const content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
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
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('Invalid block');
  });
  it('should append text into non existing applicationDidBecomeActive', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'applicationDidBecomeActive',
          append: 'appended code',
        },
      ],
    };

    content = appDelegateTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text before point into non existing applicationDidBecomeActive', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'applicationDidBecomeActive',
          before: 'random',
          append: 'inserted code',
        },
      ],
    };

    content = appDelegateTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into non existing applicationDidBecomeActive', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          prepend: '#import <Firebase.h>',
        },
        {
          block: 'applicationDidBecomeActive',
          after: 'random',
          prepend: 'inserted code',
        },
      ],
    };

    content = appDelegateTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append/prepend/insert after/before text into non existing blocks}', () => {
    [
      'applicationDidBecomeActive' as const,
      'applicationWillResignActive' as const,
      'applicationDidEnterBackground' as const,
      'applicationWillEnterForeground' as const,
      'applicationWillTerminate' as const,
      'openURL' as const,
      'restorationHandler' as const,
      'didRegisterForRemoteNotificationsWithDeviceToken' as const,
      'didFailToRegisterForRemoteNotificationsWithError' as const,
      'didReceiveRemoteNotification' as const,
      'fetchCompletionHandler' as const,
    ].map(block => {
      let content = mockAppDelegateTemplate;
      const task: AppDelegateTaskType = {
        type: 'app_delegate',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = appDelegateTask({
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
      const task2: AppDelegateTaskType = {
        type: 'app_delegate',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = appDelegateTask({
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
    const content = mockAppDelegateTemplate;
    mock.mockImplementationOnce(content => content);
    const task: AppDelegateTaskType = {
      type: 'app_delegate',
      actions: [
        {
          block: 'applicationDidBecomeActive',
          prepend: 'random',
        },
      ],
    };
    expect(() =>
      appDelegateTask({
        configPath: 'path/to/config',
        task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('block could not be inserted');
  });

  describe('runTask', () => {
    it('should read and write app delegate file', () => {
      const appDelegatePath = writeMockAppDelegate();
      const task: AppDelegateTaskType = {
        type: 'app_delegate',
        actions: [
          {
            prepend: '#import <Firebase.h>',
          },
          {
            block: 'didFinishLaunchingWithOptions',
            prepend: '[FIRApp configure];',
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(appDelegatePath);
      // @ts-ignore
      expect(content).toContain(task.actions[1].prepend);
    });
    it('should throw when app delegate does not exist', () => {
      const task: AppDelegateTaskType = {
        type: 'app_delegate',
        actions: [
          {
            prepend: '#import <Firebase.h>',
          },
          {
            block: 'didFinishLaunchingWithOptions',
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
      }).toThrowError('AppDelegate file not found');
    });
    it('should throw when project does not exist', () => {
      const mock = jest.spyOn(mockFs, 'readdirSync').mockImplementation(() => {
        throw new Error('Directory not found');
      });
      const task: AppDelegateTaskType = {
        type: 'app_delegate',
        actions: [
          {
            prepend: '#import <Firebase.h>',
          },
          {
            block: 'didFinishLaunchingWithOptions',
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
      }).toThrowError('project not found');
      mock.mockRestore();
    });
  });
});
