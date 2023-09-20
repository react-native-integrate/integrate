/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
const mocks = {
  app_delegate: {
    runTask: jest.fn(),
  },
  plist: {
    runTask: jest.fn(),
  },
  build_gradle: {
    runTask: jest.fn(),
  },
  xcode: {
    runTask: jest.fn(),
  },
  android_manifest: {
    runTask: jest.fn(),
  },
  podfile: {
    runTask: jest.fn(),
  },
  fs: {
    runTask: jest.fn(),
  },
};
jest.mock('../../../tasks/appDelegateTask', () => mocks.app_delegate);
jest.mock('../../../tasks/plistTask', () => mocks.plist);
jest.mock('../../../tasks/buildGradleTask', () => mocks.build_gradle);
jest.mock('../../../tasks/xcodeTask', () => mocks.xcode);
jest.mock('../../../tasks/androidManifestTask', () => mocks.android_manifest);
jest.mock('../../../tasks/podFileTask', () => mocks.podfile);
jest.mock('../../../tasks/fsTask', () => mocks.fs);

import path from 'path';
import { ModTask } from '../../../types/mod.types';
import { runTask } from '../../../utils/runTask';
import { mockIntegrateYml } from '../../mocks/mockIntegrateYml';

describe('runTask', () => {
  [
    'app_delegate' as const,
    'plist' as const,
    'build_gradle' as const,
    'xcode' as const,
    'android_manifest' as const,
    'podfile' as const,
    'fs' as const,
  ].map(taskType => {
    it(`should run ${taskType} task`, async () => {
      mocks[taskType].runTask.mockReset();

      const integrateYmlPath = path.resolve(
        __dirname,
        '../mock-project/node_modules/test-package/integrate.yml'
      );

      mockFs.writeFileSync(integrateYmlPath, mockIntegrateYml);

      const task: ModTask = {
        type: taskType,
      } as any;

      await runTask({
        configPath: integrateYmlPath,
        task,
        packageName: 'test',
      });
      expect(mocks[taskType].runTask).toHaveBeenCalledTimes(1);
    });
  });
  ['validate' as const].map(taskType => {
    it(`should run ${taskType} task`, async () => {
      mocks.app_delegate.runTask.mockReset();

      const integrateYmlPath = path.resolve(
        __dirname,
        '../mock-project/node_modules/test-package/integrate.yml'
      );

      mockFs.writeFileSync(integrateYmlPath, mockIntegrateYml);

      const task: ModTask = {
        type: taskType,
      } as any;

      await runTask({
        configPath: integrateYmlPath,
        task,
        packageName: 'test',
      });
      expect(mocks.app_delegate.runTask).toHaveBeenCalledTimes(0);
    });
  });
});
