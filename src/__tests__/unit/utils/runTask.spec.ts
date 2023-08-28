/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
const mocks = {
  appDelegate: {
    runTask: jest.fn(),
  },
};
jest.mock('../../../tasks/appDelegateTask', () => mocks.appDelegate);

import path from 'path';
import { AppDelegateModType, ModTask } from '../../../types/mod.types';
import { runTask } from '../../../utils/runTask';
import { mockIntegrateYml } from '../../mocks/mockIntegrateYml';

describe('runTask', () => {
  it('should run app_delegate task', () => {
    mocks.appDelegate.runTask.mockClear();

    const integrateYmlPath = path.resolve(
      __dirname,
      '../mock-project/node_modules/test-package/integrate.yml'
    );

    mockFs.writeFileSync(integrateYmlPath, mockIntegrateYml);

    const task: AppDelegateModType = {
      type: 'app_delegate',
      imports: ['<Firebase.h>'],
      method: 'didFinishLaunchingWithOptions',
      prepend: '[FIRApp configure];',
    };

    runTask({
      configPath: integrateYmlPath,
      task,
      packageName: 'test',
    });
    expect(mocks.appDelegate.runTask).toHaveBeenCalledTimes(1);
  });
  [
    'plist' as const,
    'validate' as const,
    'build_gradle' as const,
    'app_build_gradle' as const,
    'android_manifest' as const,
    'add_resource' as const,
  ].map(taskType => {
    it(`should run ${taskType} task`, () => {
      mocks.appDelegate.runTask.mockClear();

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
      expect(mocks.appDelegate.runTask).toHaveBeenCalledTimes(0);
    });
  });
});
