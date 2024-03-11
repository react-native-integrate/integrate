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

import { Constants } from '../../constants';
import { upgrade } from '../../upgrade';
import { mockPrompter, writeMockProject } from '../mocks/mockAll';

describe('upgrade', () => {
  it('should not run tasks when lock does not exist', async () => {
    const spinner = mockPrompter.spinner();
    spinner.stop.mockReset();
    const appDelegatePath = writeMockAppDelegate();

    await upgrade();

    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).not.toContain('[FIRApp configure];');
    expect(spinner.stop).toHaveBeenCalledWith(
      expect.stringContaining('integrate-lock.json not found')
    );
  });
  it('should run tasks when lock exists', async () => {
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package': {
          version: '^1.2.3',
          integrated: true,
        },
      },
    });
    const appDelegatePath = writeMockAppDelegate();

    await upgrade();
    const content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');

    const lockContent = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(lockContent);
    expect(lockData.packages['mock-package']).toEqual({
      version: '^1.2.3',
      integrated: true,
    });
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

    await upgrade();

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
      packages: {
        'mock-package-fail': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });

    await upgrade();

    const content = mockFs.readFileSync(lockPath);
    const lockData = JSON.parse(content);
    // console.log('mockFs',mockFs.getStore());
    expect(lockData.packages['mock-package']).toEqual(undefined);
  });
  it('should handle task errors', async () => {
    mockRunTask.mockImplementationOnce(() => {
      throw new Error('test error');
    });
    mockPrompter.log.error.mockReset();
    const lockPath = writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });

    await upgrade();

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
      packages: {
        'mock-package': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });

    await upgrade();

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
      packages: {
        'mock-package': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });

    await upgrade();

    const content = mockFs.readFileSync(lockPath);

    expect(mockPrompter.log.error).toHaveBeenCalledWith(
      expect.stringContaining('test error')
    );
    expect(content).not.toContain('[FIRApp configure];');
  });
  it('should re-integrate dependencies when already integrated', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-deps': '^1.2.3',
        'react-native': '^0.0.0',
        'dep-package': '^1.2.3',
        'dep-package-2': '^1.2.3',
      },
    });
    const appDelegatePath = writeMockAppDelegate();
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package-with-deps': {
          version: '1.2.3',
          integrated: true,
        },
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

    let content = mockFs.readFileSync(appDelegatePath);
    expect(content).not.toContain('[FIRApp configure];');

    await upgrade();

    content = mockFs.readFileSync(appDelegatePath);
    expect(content).toContain('[FIRApp configure];');
    expect(content).toContain('// with-deps');
  });
  it('should warn and exit when package is not installed', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {},
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('is not installed')
    );
  });
  it('should warn and exit when dependencies is not installed', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-deps': '^1.2.3',
        'react-native': '^0.0.0',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package-with-deps': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('is not integrated')
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
      packages: {
        'mock-package-with-min-rn': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('React Native not installed')
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
      packages: {
        'mock-package-with-min-rn': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

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
      packages: {
        'mock-package-with-min-rn': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

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
        'react-native': '^1.2.3',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package-with-invalid-min-rn': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).not.toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
  it('should not warn and exit when rn version is invalid', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-min-rn': '^1.2.3',
        'react-native': '^invalid',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package-with-min-rn': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).not.toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
  it('should warn and exit when minimum package version is not installed', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-min-v': '^0.0.0',
        'react-native': '^0.0.0',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package-with-min-v': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('requires version')
    );
  });
  it('should not warn and exit when minimum package version is higher than installed one', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-min-v': '^1.2.3',
        'react-native': '^0.0.0',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package-with-min-v': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).not.toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
  it('should not warn and exit when minimum package version is invalid', async () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
      dependencies: {
        'mock-package-with-invalid-min-v': '^invalid',
        'react-native': '^0.0.0',
      },
    });
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package-with-invalid-min-v': {
          version: '1.2.3',
          integrated: true,
        },
      },
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).not.toHaveBeenCalledWith(
      expect.stringContaining('requires React Native')
    );
  });
});
