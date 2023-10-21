/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

const mockWaitForFile = jest.spyOn(
  require('../../../utils/waitForFile'),
  'waitForFile'
);

import path from 'path';
import { xcodeTask, runTask } from '../../../tasks/xcode/xcodeTask';
import { XcodeTaskType } from '../../../types/mod.types';
import { getPbxProjectPath } from '../../../utils/getIosProjectPath';
import { getProjectPath } from '../../../utils/getProjectPath';
import { variables } from '../../../variables';
import { mockPrompter } from '../../mocks/mockAll';
import { mockPbxProjTemplate } from '../../mocks/mockPbxProjTemplate';
import xcode from 'xcode';

describe('xcodeTask', () => {
  beforeEach(() => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockWaitForFile.mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
  });
  it('should not change project', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const contentBefore = proj.writeSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          random: 'value',
        } as any,
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toEqual(contentBefore);
  });
  it('should add notification service to project', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          name: 'notification.service',
          addTarget: 'test',
          type: 'notification-service',
        },
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(/\{.*?\bNotificationService\.m.*?}/s);
    expect(variables.get('notification.service.target')).toEqual('test');

    mockPrompter.log.message.mockReset();
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped adding target')
    );
  });
  it('should add multiple notification services to project', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addTarget: 'test',
          type: 'notification-service',
        },
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(/\{.*?\bNotificationService\.m.*?}/s);

    mockPrompter.log.message.mockReset();

    mockPrompter.text.mockReset().mockImplementationOnce(() => 'test2');

    const task2: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addTarget: 'test2',
          type: 'notification-service',
        },
      ],
    };
    const children = proj.getPBXGroupByKey(
      proj.getFirstProject().firstProject.mainGroup
    ).children;
    children.splice(
      children.findIndex(x => x.comment == 'Products'),
      1
    );
    await xcodeTask({
      configPath: 'path/to/config',
      task: task2,
      content: proj,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).not.toHaveBeenCalledWith(
      expect.stringContaining('skipped adding target')
    );
  });
  it('should add notification content to project', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addTarget: 'test',
          type: 'notification-content',
        },
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(/\{.*?\bNotificationViewController\.m.*?}/s);

    mockPrompter.log.message.mockReset();
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped adding target')
    );
  });
  it('should add notification content to project even if products section does not exist', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(
      pbxFilePath,
      mockPbxProjTemplate.replace(/\/\* Products \*\//g, '/* SomethingElse */')
    );

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addTarget: 'test',
          type: 'notification-content',
        },
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(/\{.*?\bNotificationViewController\.m.*?}/s);
  });
  it('should add notification content to project', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addTarget: 'test',
          type: 'notification-content',
        },
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(/\{.*?\bNotificationViewController\.m.*?}/s);

    mockPrompter.log.message.mockReset();
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped adding target')
    );
  });
  it('should add capabilities to project', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addCapability: 'push',
          target: {
            name: 'ReactNativeCliTemplates',
            path: '',
          },
        },
        {
          addCapability: 'groups',
          target: 'app',
          groups: ['group.test'],
        },
        {
          addCapability: 'keychain-sharing',
          target: 'app',
          groups: ['group.test'],
        },
        {
          addCapability: 'background-mode',
          target: 'app',
          modes: ['fetch'],
        },
        {
          addCapability: 'game-controllers',
          target: 'app',
          controllers: ['directional'],
        },
        {
          addCapability: 'maps',
          target: 'app',
          routing: ['car', 'bus'],
        },
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(
      /\{.*?\bReactNativeCliTemplates\.entitlements.*?}/s
    );
    const targetName = 'ReactNativeCliTemplates';
    const entitlementsContent = mockFs.readFileSync(
      path.join(
        getProjectPath(),
        'ios',
        targetName,
        targetName + '.entitlements'
      )
    );
    const infoContent = mockFs.readFileSync(
      path.join(getProjectPath(), 'ios', targetName, 'Info.plist')
    );

    expect(entitlementsContent).toContain('aps-environment');
    expect(entitlementsContent).toContain(
      'com.apple.security.application-groups'
    );
    expect(entitlementsContent).toContain('keychain-access-groups');
    expect(infoContent).toContain('UIBackgroundModes');
    expect(infoContent).toContain('DirectionalGamepad');
    expect(infoContent).toContain('MKDirectionsModeBus');
  });
  it('should add resource to root', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addFile: 'GoogleService-Info.plist',
        },
      ],
    };
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(
      /83CBB9F61A601CBA00E9B192 = \{.*?GoogleService-Info\.plist.*?}/s
    );

    mockPrompter.log.message.mockReset();
    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped adding resource')
    );
  });
  it('should add resource to app', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addFile: 'GoogleService-Info.plist',
          target: 'app',
        },
      ],
    };

    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(
      /ReactNativeCliTemplates \*\/ = \{.*?GoogleService-Info\.plist.*?}/s
    );
  });
  it('should skip if condition not met', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          when: { test: 'random' },
          addFile: 'GoogleService-Info.plist',
          target: 'app',
        },
      ],
    };

    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).not.toMatch(
      /ReactNativeCliTemplates \*\/ = \{.*?GoogleService-Info\.plist.*?}/s
    );
  });
  it('should add resource to custom group', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addFile: 'GoogleService-Info.plist',
          target: {
            name: 'Resources',
            path: '',
          },
        },
      ],
    };

    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(
      /Resources \*\/ = \{.*?GoogleService-Info\.plist.*?}/s
    );
  });
  it('should add resource to root with no resources group', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    proj.removePbxGroup('Resources');

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addFile: 'GoogleService-Info.plist',
        },
      ],
    };

    await xcodeTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(
      /83CBB9F61A601CBA00E9B192 = \{.*?GoogleService-Info\.plist.*?}/s
    );
  });
  it('should throw on random error', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);
    mockWaitForFile.mockReset().mockImplementationOnce(() => {
      throw new Error('some random error');
    });

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    proj.removePbxGroup('Resources');

    const task: XcodeTaskType = {
      type: 'xcode',
      actions: [
        {
          addFile: 'GoogleService-Info.plist',
        },
      ],
    };

    await expect(() =>
      xcodeTask({
        configPath: 'path/to/config',
        task: task,
        content: proj,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('random error');
  });

  describe('runTask', () => {
    it('should read and write plist file', async () => {
      const pbxFilePath = getPbxProjectPath();
      mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

      const task: XcodeTaskType = {
        type: 'xcode',
        actions: [
          {
            addFile: 'GoogleService-Info.plist',
            target: 'app',
          },
        ],
      };
      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(pbxFilePath) as string;
      expect(content).toMatch(
        /ReactNativeCliTemplates \*\/ = \{.*?GoogleService-Info\.plist.*?}/s
      );
    });
    it('should throw when plist does not exist', async () => {
      const task: XcodeTaskType = {
        type: 'xcode',
        actions: [
          {
            addFile: 'GoogleService-Info.plist',
            target: 'app',
          },
        ],
      };

      // noinspection SpellCheckingInspection
      await expect(() =>
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('project.pbxproj file not found');
    });
    it('should throw when project does not exist', async () => {
      const mock = jest.spyOn(mockFs, 'readdirSync').mockImplementation(() => {
        throw new Error('Directory not found');
      });
      const task: XcodeTaskType = {
        type: 'xcode',
        actions: [
          {
            addFile: 'GoogleService-Info.plist',
            target: 'app',
          },
        ],
      };

      await expect(() =>
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
