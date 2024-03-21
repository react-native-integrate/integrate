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
tasks:
  - type: app_delegate
    label: AppDelegate.mm modification
    actions:
      - append: test`
    );

    const result = await runUpgradeTasks();

    expect(result.didRun).toBeTruthy();
    expect(mockRunTask).toHaveBeenCalledWith({
      configPath: path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      packageName: 'upgrade.yml',
      task: {
        type: 'app_delegate',
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
tasks:
  - type: app_delegate
    when:
      value: false
    actions:
      - append: test`
    );

    const result = await runUpgradeTasks();

    expect(result.didRun).toBeTruthy();
    expect(mockRunTask).not.toHaveBeenCalled();
  });
  it('should handle not finding upgrade.yml', async () => {
    const result = await runUpgradeTasks();

    expect(result.didRun).toBeFalsy();
  });
  it('should handle invalid upgrade.yml', async () => {
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      'random'
    );
    const result = await runUpgradeTasks();

    expect(result.didRun).toBeFalsy();
  });
  it('should handle failed tasks', async () => {
    mockRunTask.mockRejectedValueOnce(new Error('random'));
    mockFs.writeFileSync(
      path.join(getProjectPath(), '.upgrade/upgrade.yml'),
      `
tasks:
  - type: app_delegate
    actions:
      - append: test`
    );

    const result = await runUpgradeTasks();

    expect(result.didRun).toBeTruthy();
    if (result.didRun) {
      expect(result.failedTaskCount).toBe(1);
    }
  });
});
