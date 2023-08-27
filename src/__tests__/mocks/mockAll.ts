/* eslint-disable @typescript-eslint/no-unsafe-call */

import path from 'path';
import { Constants } from '../../constants';
import { LockData } from '../../types/integrator.types';
import { mockAppDelegateTemplate } from './mockAppDelegateTemplate';

require('./mockProjectPath');
const { mockFs } = require('./mockFs');

function writeMockProject(projectJson: Record<any, any>): void {
  const packageJsonPath = path.resolve(
    __dirname,
    `../mock-project/${Constants.PACKAGE_JSON_FILE_NAME}`
  );
  mockFs.writeFileSync(packageJsonPath, JSON.stringify(projectJson), null, 2);
}

function writeMockLock(lockData: LockData): void {
  const lockPath = path.resolve(
    __dirname,
    `../mock-project/${Constants.LOCK_FILE_NAME}`
  );
  mockFs.writeFileSync(lockPath, JSON.stringify(lockData), null, 2);
}
function writeMockAppDelegate(): void {
  const appDelegatePath = path.resolve(
    __dirname,
    `../mock-project/ios/MockProject/${Constants.APP_DELEGATE_FILE_NAME}`
  );
  mockFs.writeFileSync(appDelegatePath, mockAppDelegateTemplate);
}

let didSetup = false;
if (!didSetup) {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    jest.spyOn(console, 'error').mockImplementation(() => {});

    mockFs.reset();

    // add package.json to mockFs
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package': '^1.2.3',
      },
    });
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  didSetup = true;
}

export { mockFs, writeMockProject, writeMockLock, writeMockAppDelegate };
