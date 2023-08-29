/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
const mocks = {
  app_delegate: {
    runTask: jest.fn(),
  },
  plist: {
    runTask: jest.fn(),
  },
};
jest.mock('../../../tasks/appDelegateTask', () => mocks.app_delegate);
jest.mock('../../../tasks/plistTask', () => mocks.plist);

import path from 'path';
import { ModTask } from '../../../types/mod.types';
import { runTask } from '../../../utils/runTask';
import { mockIntegrateYml } from '../../mocks/mockIntegrateYml';

describe('runTask', () => {
  ['app_delegate' as const, 'plist' as const].map(taskType => {
    it(`should run ${taskType} task`, () => {
      mocks[taskType].runTask.mockClear();

      const integrateYmlPath = path.resolve(
        __dirname,
        '../mock-project/node_modules/test-package/integrate.yml'
      );

      mockFs.writeFileSync(integrateYmlPath, mockIntegrateYml);

      const task: ModTask = {
        type: taskType,
      } as any;

      runTask({
        configPath: integrateYmlPath,
        task,
        packageName: 'test',
      });
      expect(mocks[taskType].runTask).toHaveBeenCalledTimes(1);
    });
  });
  [
    'validate' as const,
    'build_gradle' as const,
    'app_build_gradle' as const,
    'android_manifest' as const,
    'add_resource' as const,
  ].map(taskType => {
    it(`should run ${taskType} task`, () => {
      mocks.app_delegate.runTask.mockClear();

      const integrateYmlPath = path.resolve(
        __dirname,
        '../mock-project/node_modules/test-package/integrate.yml'
      );

      mockFs.writeFileSync(integrateYmlPath, mockIntegrateYml);

      const task: ModTask = {
        type: taskType,
      } as any;

      runTask({
        configPath: integrateYmlPath,
        task,
        packageName: 'test',
      });
      expect(mocks.app_delegate.runTask).toHaveBeenCalledTimes(0);
    });
  });
});
