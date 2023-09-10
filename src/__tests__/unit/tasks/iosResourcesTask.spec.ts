/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
import { iosResourcesTask, runTask } from '../../../tasks/iosResourcesTask';
import { IosResourcesTaskType } from '../../../types/mod.types';
import { XcodeType } from '../../../types/xcode.type';
import { getPbxProjectPath } from '../../../utils/getIosProjectPath';
import { mockPrompter } from '../../mocks/mockAll';
import { mockPbxProjTemplate } from '../../mocks/mockPbxProjTemplate';

const xcode: XcodeType = require('xcode');

describe('iosResourcesTask', () => {
  it('should add resource to root', () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();

    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          add: 'GoogleService-Info.plist',
        },
      ],
    };
    iosResourcesTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    const content = proj.writeSync();
    expect(content).toMatch(
      /83CBB9F61A601CBA00E9B192 = \{.*?GoogleService-Info\.plist.*?}/s
    );

    mockPrompter.log.message.mockClear();
    iosResourcesTask({
      configPath: 'path/to/config',
      task: task,
      content: proj,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped adding resource')
    );
  });
  it('should add resource to app', () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          add: 'GoogleService-Info.plist',
          target: 'app',
        },
      ],
    };

    iosResourcesTask({
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
  it('should add resource to custom group', () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          add: 'GoogleService-Info.plist',
          target: {
            name: 'Resources',
            path: '',
          },
        },
      ],
    };

    iosResourcesTask({
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
  it('should add resource to root with no resources group', () => {
    const pbxFilePath = getPbxProjectPath();
    mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

    const proj = xcode.project(pbxFilePath);
    proj.parseSync();
    proj.removePbxGroup('Resources');

    const task: IosResourcesTaskType = {
      type: 'ios_resources',
      updates: [
        {
          add: 'GoogleService-Info.plist',
        },
      ],
    };

    iosResourcesTask({
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
    it('should read and write plist file', () => {
      const pbxFilePath = getPbxProjectPath();
      mockFs.writeFileSync(pbxFilePath, mockPbxProjTemplate);

      const task: IosResourcesTaskType = {
        type: 'ios_resources',
        updates: [
          {
            add: 'GoogleService-Info.plist',
            target: 'app',
          },
        ],
      };
      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(pbxFilePath) as string;
      expect(content).toMatch(
        /ReactNativeCliTemplates \*\/ = \{.*?GoogleService-Info\.plist.*?}/s
      );
    });
    it('should throw when plist does not exist', () => {
      const task: IosResourcesTaskType = {
        type: 'ios_resources',
        updates: [
          {
            add: 'GoogleService-Info.plist',
            target: 'app',
          },
        ],
      };

      // noinspection SpellCheckingInspection
      expect(() => {
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        });
      }).toThrowError('project.pbxproj file not found');
    });
    it('should throw when workspace does not exist', () => {
      const mock = jest.spyOn(mockFs, 'readdirSync').mockImplementation(() => {
        throw new Error('Directory not found');
      });
      const task: IosResourcesTaskType = {
        type: 'ios_resources',
        updates: [
          {
            add: 'GoogleService-Info.plist',
            target: 'app',
          },
        ],
      };

      expect(() => {
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        });
      }).toThrowError('workspace not found');
      mock.mockRestore();
    });
  });
});
