/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

const mockWaitForFile = jest.spyOn(
  require('../../../utils/waitForFile'),
  'waitForFile'
);

import { iosResourcesTask, runTask } from '../../../tasks/iosResourcesTask';
import { IosResourcesTaskType } from '../../../types/mod.types';
import { XcodeType } from '../../../types/xcode.type';
import { getPbxProjectPath } from '../../../utils/getIosProjectPath';
import { mockPrompter } from '../../mocks/mockAll';
import { mockPbxProjTemplate } from '../../mocks/mockPbxProjTemplate';

const xcode: XcodeType = require('xcode');

describe('iosResourcesTask', () => {
  beforeEach(() => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockWaitForFile.mockImplementationOnce(() => {
      return Promise.resolve(true);
    });
  });
  it('should add resource to root', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          addFile: 'GoogleService-Info.plist',
        },
      ],
    };
    await iosResourcesTask({
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
    await iosResourcesTask({
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
    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          addFile: 'GoogleService-Info.plist',
          target: 'app',
        },
      ],
    };

    await iosResourcesTask({
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
  it('should add resource to custom group', async () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          addFile: 'GoogleService-Info.plist',
          target: {
            name: 'Resources',
            path: '',
          },
        },
      ],
    };

    await iosResourcesTask({
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

    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          addFile: 'GoogleService-Info.plist',
        },
      ],
    };

    await iosResourcesTask({
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
  describe('runTask', () => {
    it('should read and write plist file', async () => {
      const pbxFilePath = getPbxProjectPath();
      mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

      const task: IosResourcesTaskType = {
        type: 'ios_resources',
        updates: [
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
      const task: IosResourcesTaskType = {
        type: 'ios_resources',
        updates: [
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
    it('should throw when workspace does not exist', async () => {
      const mock = jest.spyOn(mockFs, 'readdirSync').mockImplementation(() => {
        throw new Error('Directory not found');
      });
      const task: IosResourcesTaskType = {
        type: 'ios_resources',
        updates: [
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
      ).rejects.toThrowError('workspace not found');
      mock.mockRestore();
    });
  });
});
