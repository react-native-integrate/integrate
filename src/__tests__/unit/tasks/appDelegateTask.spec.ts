/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import { appDelegateTask, runTask } from '../../../tasks/appDelegateTask';
import { AppDelegateTaskType } from '../../../types/mod.types';
import { writeMockAppDelegate } from '../../mocks/mockAll';
import { mockAppDelegateSwiftTemplate } from '../../mocks/mockAppDelegateSwiftTemplate';
import { mockAppDelegateTemplate } from '../../mocks/mockAppDelegateTemplate';

describe('appDelegateTask', () => {
  it('should skip insert when ifNotPresent exists', async () => {
    mockPrompter.log.message.mockReset();
    const content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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
    await appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should prepend text into didLaunchWithOptions in swift lang', async () => {
    let content = mockAppDelegateSwiftTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
      lang: 'swift',
      actions: [
        {
          prepend: 'import Firebase',
        },
        {
          block: 'didFinishLaunchingWithOptions',
          prepend: 'FirebaseApp.configure()',
        },
      ],
    };
    content = await appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should prepend text into didLaunchWithOptions', async () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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
    content = await appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append text into didLaunchWithOptions', async () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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
    content = await appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into didLaunchWithOptions', async () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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

    content = await appDelegateTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content)
      .toContain(`RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  [FIRApp configure];`);
  });
  it('should insert text before point into didLaunchWithOptions', async () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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
    content = await appDelegateTask({
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
  it('should throw when didLaunchWithOptions does not exist', async () => {
    const content = '';
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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

    await expect(
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('didFinishLaunchingWithOptions not implemented');
  });
  it('should skip if condition not met', async () => {
    const content = '';
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
      actions: [
        {
          when: { test: 'random' },
          prepend: '#import <Firebase.h>',
        },
        {
          when: 'test === "random"',
          block: 'didFinishLaunchingWithOptions',
          prepend: '[FIRApp configure];',
        },
      ],
    };

    await expect(
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrow();
  });
  it('should throw when insertion point not found', async () => {
    const content = mockAppDelegateTemplate;
    const taskInsertBefore: AppDelegateTaskType = {
      task: 'app_delegate',
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

    await expect(
      appDelegateTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    const taskInsertAfter: AppDelegateTaskType = {
      task: 'app_delegate',
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

    await expect(
      appDelegateTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
  });
  it('should throw when AppDelegate implementation not found', async () => {
    const content = '';
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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

    await expect(
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('@implementation AppDelegate');
  });
  it('should throw for invalid method', async () => {
    const content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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
      appDelegateTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('Invalid block');
  });
  it('should append text into non existing applicationDidBecomeActive', async () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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

    content = await appDelegateTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text before point into non existing applicationDidBecomeActive', async () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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

    content = await appDelegateTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    // @ts-ignore
    expect(content).toContain(task.actions[1].append);
  });
  it('should insert text after point into non existing applicationDidBecomeActive', async () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
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

    content = await appDelegateTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    // @ts-ignore
    expect(content).toContain(task.actions[1].prepend);
  });
  it('should append/prepend/insert after/before text into non existing blocks}', async () => {
    for (const block of [
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
    ]) {
      let content = mockAppDelegateTemplate;
      const task: AppDelegateTaskType = {
        task: 'app_delegate',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = await appDelegateTask({
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
        task: 'app_delegate',
        actions: [
          {
            block,
            prepend: 'prepended code',
            append: 'appended code',
          },
        ],
      };

      content = await appDelegateTask({
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
    const content = mockAppDelegateTemplate;
    mock.mockImplementationOnce(content => content);
    const task: AppDelegateTaskType = {
      task: 'app_delegate',
      actions: [
        {
          block: 'applicationDidBecomeActive',
          prepend: 'random',
        },
      ],
    };
    await expect(
      appDelegateTask({
        configPath: 'path/to/config',
        task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('block could not be inserted');
  });

  describe('runTask', () => {
    it('should read and write app delegate file', async () => {
      const appDelegatePath = writeMockAppDelegate();
      const task: AppDelegateTaskType = {
        task: 'app_delegate',
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

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(appDelegatePath);
      // @ts-ignore
      expect(content).toContain(task.actions[1].prepend);
    });
    it('should throw when app delegate does not exist', async () => {
      const task: AppDelegateTaskType = {
        task: 'app_delegate',
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
      await expect(
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('AppDelegate file not found');
    });
    it('should throw when project does not exist', async () => {
      const mock = jest.spyOn(mockFs, 'readdirSync').mockImplementation(() => {
        throw new Error('Directory not found');
      });
      const task: AppDelegateTaskType = {
        task: 'app_delegate',
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
      await expect(
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('project not found');
      mock.mockRestore();
    });
  });
});
