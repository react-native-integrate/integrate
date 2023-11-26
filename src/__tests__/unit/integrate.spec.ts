/* eslint-disable @typescript-eslint/no-unsafe-call */
const {
  mockFs,
  writeMockAppDelegate,
  writeMockLock,
} = require('../mocks/mockAll');

const mockRunTask = jest.spyOn(require('../../utils/runTask'), 'runTask');
const mockParseConfig = jest.spyOn(
  require('../../utils/parseConfig'),
  'parseConfig'
);

import path from 'path';
import { Constants } from '../../constants';
import { integrate } from '../../integrate';
import { mockPrompter, writeMockProject } from '../mocks/mockAll';

describe('integrate', () => {
  it('should not run tasks when lock does not exist (first run)', async () => {
    const spinner = mockPrompter.spinner();
    spinner.stop.mockReset();
    const appDelegatePath = writeMockAppDelegate();

    await integrate();

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).not.toContain('[FIRApp configure];');
    expect(spinner.stop).toHaveBeenCalledWith(
      expect.stringContaining('first run')
    );
  });
  it('should run tasks when lock exists', async () => {
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    const appDelegatePath = writeMockAppDelegate();

    await integrate();
    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');

    const lockContent = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(lockContent);
    expect(lockData.packages['mock-package']).toEqual({
      version: '^1.2.3',
      integrated: true,
    });
  });
  it('should run tasks for a package when lock does not exist', async () => {
    const lockPath = path.resolve(
      __dirname,
      `../mock-project/${Constants.LOCK_FILE_NAME}`
    );
    const appDelegatePath = writeMockAppDelegate();

    await integrate('mock-package');

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');
    const lockContent = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(lockContent);
    expect(lockData.packages['mock-package']).toEqual({
      version: '^1.2.3',
      integrated: true,
    });
  });
  it('should run tasks for a package when lock exist', async () => {
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    const appDelegatePath = writeMockAppDelegate();

    await integrate('mock-package');

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');
    const lockContent = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(lockContent);
    expect(lockData.packages['mock-package']).toEqual({
      version: '^1.2.3',
      integrated: true,
    });
  });
  it('should handle package that doesnt exist', async () => {
    const appDelegatePath = writeMockAppDelegate();

    await integrate('random-package');

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).not.toContain('[FIRApp configure];');
  });
  it('should handle package that doesnt have config', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-fail': '^1.2.3',
      },
    });
    const appDelegatePath = writeMockAppDelegate();

    await integrate('mock-package-fail');

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).not.toContain('[FIRApp configure];');
  });
  it('should handle deleted packages', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {},
    });
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
    mockPrompter.log.step.mockReset();
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
  it('should handle task errors', async () => {
    mockRunTask.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    mockPrompter.log.error.mockReset();
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });

    await integrate();

    const content = mockFs.readFileSync(lockPath);

    expect(mockPrompter.log.error).toHaveBeenCalledWith(
      expect.stringContaining('test error')
    );
    expect(content).not.toContain('[FIRApp configure];');
  });
  it('should handle non error obj task errors', async () => {
    mockRunTask.mockImplementationOnce(() => {
      throw 'test error';
    });
    mockPrompter.log.error.mockReset();
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });

    await integrate();

    const content = mockFs.readFileSync(lockPath);

    expect(mockPrompter.log.error).toHaveBeenCalledWith(
      expect.stringContaining('error occurred')
    );
    expect(content).not.toContain('[FIRApp configure];');
  });
  it('should handle parse error', async () => {
    mockParseConfig.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    mockPrompter.log.error.mockReset();
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });

    await integrate();

    const content = mockFs.readFileSync(lockPath);

    expect(mockPrompter.log.error).toHaveBeenCalledWith(
      expect.stringContaining('test error')
    );
    expect(content).not.toContain('[FIRApp configure];');
  });
  it('should add dependencies to integration queue', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-deps': '^1.2.3',
        'dep-package': '^1.2.3',
        'dep-package-2': '^1.2.3',
      },
    });
    const appDelegatePath = writeMockAppDelegate();
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });

    await integrate();

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');
    expect(content).toContain('// with-deps');
  });
  it('should skip dependencies when already integrated', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-deps': '^1.2.3',
        'dep-package': '^1.2.3',
        'dep-package-2': '^1.2.3',
      },
    });
    const appDelegatePath = writeMockAppDelegate();
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'dep-package': {
          version: '1.2.3',
          integrated: true,
        },
        'dep-package-2': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });

    await integrate();

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).not.toContain('[FIRApp configure];');
    expect(content).toContain('// with-deps');
  });
  it('should add installed but non integrated dependencies to integration queue', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-deps': '^1.2.3',
        'dep-package': '^1.2.3',
        'dep-package-2': '^1.2.3',
      },
    });
    const appDelegatePath = writeMockAppDelegate();
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'dep-package': {
          version: '1.2.3',
          integrated: false,
        },
        'dep-package-2': {
          version: '1.2.3',
          integrated: false,
        },
      },
    });
    mockPrompter.log.info.mockClear();

    await integrate();

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');
    expect(content).toContain('// with-deps');
    expect(mockPrompter.log.info).toHaveBeenCalledWith(
      expect.stringContaining('has dependencies that require integration')
    );
  });
  it('should warn and exit when dependencies is not installed', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-deps': '^1.2.3',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    mockPrompter.log.warning.mockClear();

    await integrate();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('please install it first and try again')
    );
  });
  it('should warn and exit when minimum rn version is not installed', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-min-rn': '^1.2.3',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    mockPrompter.log.warning.mockClear();

    await integrate();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
  it('should warn and exit when minimum rn version is less than installed one', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-min-rn': '^1.2.3',
        'react-native': '^0.0.0',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    mockPrompter.log.warning.mockClear();

    await integrate();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
  it('should not warn and exit when minimum rn version is higher than installed one', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-min-rn': '^1.2.3',
        'react-native': '^1.0.0',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    mockPrompter.log.warning.mockClear();

    await integrate();

    expect(mockPrompter.log.warning).not.toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
  it('should not warn and exit when minimum rn version is invalid', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-invalid-min-rn': '^1.2.3',
        'react-native': '^invalid',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {},
    });
    mockPrompter.log.warning.mockClear();

    await integrate();

    expect(mockPrompter.log.warning).not.toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
});
