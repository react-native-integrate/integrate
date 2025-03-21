/* eslint-disable @typescript-eslint/no-unsafe-call */
const {
  mockFs,
  writeMockAppDelegate,
  writeMockLock,
} = require('../mocks/mockAll');
const mockSpawn = jest.spyOn(require('child_process'), 'spawn');

const mockRunTask = jest.spyOn(require('../../utils/runTask'), 'runTask');
const mockParseConfig = jest.spyOn(
  require('../../utils/parseConfig'),
  'parseConfig'
);
const mockRestoreBackupFiles = jest.spyOn(
  require('../../utils/upgrade/restoreBackupFiles'),
  'restoreBackupFiles'
);
const mockRunUpgradeTasks = jest.spyOn(
  require('../../utils/upgrade/runUpgradeTasks'),
  'runUpgradeTasks'
);

import { Constants } from '../../constants';
import { options } from '../../options';
import { upgrade } from '../../upgrade';
import { mockPrompter, writeMockProject } from '../mocks/mockAll';

describe('upgrade', () => {
  beforeEach(() => {
    options.get().manual = true;
    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: (exitCode: number) => void) => {
        cb(0);
      },
      stdout: {
        on: (_event: string, cb: (...args: any[]) => void) => {
          cb('stdout');
        },
      },
      stderr: {
        on: (_event: string, cb: (...args: any[]) => void) => {
          cb('stderr');
        },
      },
    }));
    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: (exitCode: number) => void) => {
        cb(0);
      },
      stdout: {
        on: (_event: string, cb: (...args: any[]) => void) => {
          cb('stdout');
        },
      },
      stderr: {
        on: (_event: string, cb: (...args: any[]) => void) => {
          cb('stderr');
        },
      },
    }));
  });
  it('should skip import when import path is empty', async () => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockPrompter.log.message.mockClear();

    await upgrade();

    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipping import from old project')
    );
  });
  it('should restore files', async () => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockRestoreBackupFiles.mockReturnValueOnce(Promise.resolve(true));

    await upgrade();

    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipping import from old project')
    );
  });
  it('should handle restore error', async () => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockRestoreBackupFiles.mockRejectedValueOnce(new Error('test'));

    await upgrade();

    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipping import from old project')
    );
  });
  it('should execute upgrade.yml', async () => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockRunUpgradeTasks.mockResolvedValueOnce({
      didRun: true,
      completedTaskCount: 1,
    });
    mockPrompter.log.info.mockClear();

    await upgrade();

    expect(mockPrompter.log.info).toHaveBeenCalledWith(
      expect.stringContaining('task(s) successfully')
    );
  });
  it('should handle upgrade.yml execution error', async () => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockRunUpgradeTasks.mockRejectedValueOnce(new Error('test'));
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('test')
    );
  });
  it('should handle upgrade.yml failed tasks', async () => {
    mockPrompter.text.mockImplementationOnce(() => '');
    mockRunUpgradeTasks.mockResolvedValueOnce({
      didRun: true,
      failedTaskCount: 1,
    });
    mockPrompter.log.warning.mockClear();

    await upgrade();

    expect(mockPrompter.log.warning).toHaveBeenCalledWith(
      expect.stringContaining('task(s) - please complete upgrade manually')
    );
  });
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

    const lockContent = mockFs.readFileSync(lockPath) as string;
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

    const content = mockFs.readFileSync(lockPath) as string;
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

    const content = mockFs.readFileSync(lockPath) as string;
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

    const content = mockFs.readFileSync(lockPath) as string;

    expect(mockPrompter.log.error).toHaveBeenCalledWith(
      expect.stringContaining('test error')
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

    const content = mockFs.readFileSync(lockPath) as string;

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
