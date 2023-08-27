/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');
import { appDelegateMod } from '../../../mods/appDelegateMod';
import { AppDelegateModType } from '../../../types/mod.types';
import { mockAppDelegateTemplate } from '../../mocks/mockAppDelegateTemplate';

describe('appDelegateMod', () => {
  it('should prepend text into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      prepend: '[FIRApp configure];',
    };
    content = appDelegateMod({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(task.prepend);
  });
  it('should append text into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      append: '[FIRApp configure];',
    };
    content = appDelegateMod({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(task.append);
  });
  it('should insert text after point into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      after: {
        find: { regex: 'RCTBridge \\*bridge.*?\n' },
        insert: '[FIRApp configure];',
      },
    };
    content = appDelegateMod({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content)
      .toContain(`RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  // test-package
  [FIRApp configure];`);
  });
  it('should insert text before point into didLaunchWithOptions', () => {
    let content = mockAppDelegateTemplate;
    const task: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      before: {
        find: { regex: '\n.*?RCTBridge \\*bridge' },
        insert: '[FIRApp configure];',
      },
    };
    content = appDelegateMod({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
  // test-package
  [FIRApp configure];

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
`);
  });
  it('should throw when didLaunchWithOptions does not exist', () => {
    const content = '';
    const task: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      prepend: '[FIRApp configure];',
    };
    expect(() =>
      appDelegateMod({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('didFinishLaunchingWithOptions not implemented');
  });
  it('should throw when insertion point not found', () => {
    const content = mockAppDelegateTemplate;
    const taskInsertBefore: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      before: {
        find: 'random',
        insert: '[FIRApp configure];',
      },
    };
    expect(() =>
      appDelegateMod({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    const taskInsertAfter: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      after: {
        find: 'random',
        insert: '[FIRApp configure];',
      },
    };
    expect(() =>
      appDelegateMod({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
  });
  it('should throw when AppDelegate implementation not found', () => {
    const content = '';
    const task: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'applicationDidBecomeActive',
      prepend: '[FIRApp configure];',
    };
    expect(() =>
      appDelegateMod({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('@implementation AppDelegate');
  });
  it('should throw for invalid method', () => {
    const content = mockAppDelegateTemplate;
    const task: AppDelegateModType = {
      type: 'app_delegate',
      method: 'invalidMethod' as any,
      prepend: '[FIRApp configure];',
    };
    expect(() =>
      appDelegateMod({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('Invalid method');
  });
  it('should append text into non existing applicationDidBecomeActive', () => {
    let content = mockAppDelegateTemplate;
    const step: AppDelegateModType = {
      type: 'app_delegate',
      method: 'applicationDidBecomeActive',
      append: 'appended code',
    };
    content = appDelegateMod({
      configPath: 'path/to/config',
      task: step,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    expect(content).toContain(step.append);
  });
  it('should insert text before point into non existing applicationDidBecomeActive', () => {
    let content = mockAppDelegateTemplate;
    const step: AppDelegateModType = {
      type: 'app_delegate',
      method: 'applicationDidBecomeActive',
      before: {
        find: 'random',
        insert: 'inserted code',
      },
    };
    content = appDelegateMod({
      configPath: 'path/to/config',
      task: step,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    expect(content).toContain(step.before.insert);
  });
  it('should insert text after point into non existing applicationDidBecomeActive', () => {
    let content = mockAppDelegateTemplate;
    const step: AppDelegateModType = {
      type: 'app_delegate',
      method: 'applicationDidBecomeActive',
      after: {
        find: 'random',
        insert: 'inserted code',
      },
    };
    content = appDelegateMod({
      configPath: 'path/to/config',
      task: step,
      content,
      packageName: 'test-package',
    });

    expect(content).toContain('applicationDidBecomeActive');
    expect(content).toContain(step.after.insert);
  });
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
  ].forEach(method => {
    it(`should append/prepend/insert after/before text into non existing ${method}`, () => {
      let content = mockAppDelegateTemplate;
      const step: AppDelegateModType = {
        type: 'app_delegate',
        method: method,
        prepend: 'prepended code',
        append: 'appended code',
      };
      content = appDelegateMod({
        configPath: 'path/to/config',
        task: step,
        content,
        packageName: 'test-package',
      });

      // second append on existing method
      const step2: AppDelegateModType = {
        type: 'app_delegate',
        method: method,
        prepend: 'prepended code 2',
        append: 'appended code 2',
      };
      content = appDelegateMod({
        configPath: 'path/to/config',
        task: step2,
        content,
        packageName: 'test-package',
      });

      expect(content).toContain(method);
      // @ts-ignore
      expect(content).toContain(step.prepend);
      // @ts-ignore
      expect(content).toContain(step.append);
      // @ts-ignore
      expect(content).toContain(step2.prepend);
      // @ts-ignore
      expect(content).toContain(step2.append);
    });
  });
});
