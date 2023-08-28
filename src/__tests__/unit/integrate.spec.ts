/* eslint-disable @typescript-eslint/no-unsafe-call */
const {
  mockFs,
  writeMockAppDelegate,
  writeMockLock,
} = require('../mocks/mockAll');

import { Constants } from '../../constants';
import { integrate } from '../../integrate';
import { mockPrompter, writeMockProject } from '../mocks/mockAll';

describe('integrate', () => {
  it('should integrate normally', async () => {
    const appDelegatePath = writeMockAppDelegate();

    await integrate();

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');
  });
  it('should handle deleted packages', async () => {
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'deleted-package': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });

    await integrate();

    const content = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(content);
    expect(lockData.packages).toEqual({});
  });
  it('should handle no changes', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package': '^1.2.3',
      },
    });
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });

    await integrate();

    const content = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(content);
    expect(lockData.packages['mock-package']).toEqual({
      version: '1.2.3',
      integrated: true,
    });
  });
  it('should handle packages with no config', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-fail': '^1.2.3',
      },
    });
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });

    await integrate();

    const content = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(content);
    // console.log('mockFs',mockFs.getStore());
    expect(lockData.packages['mock-package']).toEqual(undefined);
  });
  it('should handle user rejecting to integrate', async () => {
    mockPrompter.confirm.mockImplementationOnce(() => false);
    mockPrompter.log.step.mockClear();
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });

    await integrate();

    const content = mockFs.readFileSync(lockPath);

    expect(mockPrompter.log.step).toHaveBeenCalledWith(
      expect.stringContaining('skipped package integration')
    );
    expect(content).not.toContain('[FIRApp configure];');
  });
});
