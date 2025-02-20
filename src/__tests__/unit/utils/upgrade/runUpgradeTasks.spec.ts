require('../../../mocks/mockAll');
const mockRunTask = jest.spyOn(require('../../../../utils/runTask'), 'runTask');

import path from 'path';
import { getProjectPath } from '../../../../utils/getProjectPath';
import { runUpgradeTasks } from '../../../../utils/upgrade/runUpgradeTasks';
import { mockFs } from '../../../mocks/mockFs';

describe('runUpgradeTasks', () => {
  afterEach(() => {
    mockRunTask.mockReset();
  });
  it('should execute upgrade.yml tasks', async () => {
    mockRunTask.mockResolvedValueOnce(undefined);
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
env:
  value: true
steps:
  - task: app_delegate
    label: AppDelegate.mm modification
    actions:
      - append: test`
    );

    const result = await runUpgradeTasks(undefined);

    expect(result.didRun).toBeTruthy();
    expect(mockRunTask).toHaveBeenCalledWith({
      configPath: path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      packageName: 'upgrade.yml',
      task: {
        task: 'app_delegate',
        label: 'AppDelegate.mm modification',
        actions: [{ append: 'test' }],
      },
    });
  });
  it('should not execute when tasks does not meet condition', async () => {
    mockRunTask.mockResolvedValueOnce(undefined);
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
env:
  value: true
steps:
  - task: app_delegate
    when:
      value: false
    actions:
      - append: test`
    );

    const result = await runUpgradeTasks(undefined);

    expect(result.didRun).toBeTruthy();
    expect(mockRunTask).not.toHaveBeenCalled();
  });
  it('should handle not finding upgrade.yml', async () => {
    const result = await runUpgradeTasks(undefined);

    expect(result.didRun).toBeFalsy();
  });
  it('should handle invalid upgrade.yml', async () => {
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      'random'
    );
    const result = await runUpgradeTasks(undefined);

    expect(result.didRun).toBeFalsy();
  });
  it('should handle failed tasks', async () => {
    mockRunTask.mockRejectedValueOnce(new Error('random'));
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
steps:
  - task: app_delegate
    actions:
      - append: test`
    );

    const result = await runUpgradeTasks(undefined);

    expect(result.didRun).toBeTruthy();
    if (result.didRun) {
      expect(result.failedTaskCount).toBe(1);
    }
  });
  it('should execute upgrade.yml imports', async () => {
    mockFs.writeFileSync('/oldProject/path/some.file', 'random');
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
imports:
  - path
  - path/some.file`
    );

    const result = await runUpgradeTasks('/oldProject');

    expect(result.didRun).toBeTruthy();
    expect(mockFs.readFileSync(getProjectPath() + '/path/some.file')).toBe(
      'random'
    );
  });
  it('should skip non existing upgrade.yml imports', async () => {
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
imports:
  - path/some.file`
    );
    mockFs.lstatSync.mockClear();
    const result = await runUpgradeTasks('/oldProject');

    expect(result.didRun).toBeTruthy();
    expect(mockFs.lstatSync).not.toHaveBeenCalled();
  });
  it('should skip when no old project path specified', async () => {
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
imports:
  - path/some.file`
    );
    mockFs.lstatSync.mockClear();
    const result = await runUpgradeTasks(undefined);

    expect(result.didRun).toBeTruthy();
    expect(mockFs.lstatSync).not.toHaveBeenCalled();
  });
  it('should handle copy error', async () => {
    mockFs.writeFileSync('/oldProject/path/some.file', 'random');
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
imports:
  - path/some.file`
    );
    mockFs.copyFile.mockImplementationOnce(
      (_from: string, _to: string, cb: (e?: Error) => void) => {
        cb(new Error('random'));
      }
    );
    await expect(runUpgradeTasks('/oldProject')).rejects.toThrow('random');
  });
});
