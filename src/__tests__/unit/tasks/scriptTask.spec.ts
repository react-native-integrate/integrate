require('../../mocks/mockAll');

import path from 'path';
import { scriptTask } from '../../../tasks/scriptTask';
import { ScriptTaskType } from '../../../types/mod.types';
import { taskManager } from '../../../utils/taskManager';
import { variables } from '../../../variables';
import { mockFs } from '../../mocks/mockFs';

describe('scriptTask', () => {
  it('should work', async () => {
    const task: ScriptTaskType = {
      task: 'script',
      actions: [
        {
          script: `
          const fs = require('fs');
            set('script', 'working')
          `,
        },
      ],
    };

    await scriptTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
      taskManager,
    });

    expect(variables.get('script')).toEqual('working');
  });
  it('should require plugin', async () => {
    mockFs.writeFileSync(
      path.join(__dirname, '../../mocks/mockTestPlugin.js'),
      'dummy'
    );
    const task: ScriptTaskType = {
      task: 'script',
      actions: [
        {
          module: '../../src/__tests__/mocks/mockTestPlugin.js',
        },
      ],
    };

    await scriptTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
      taskManager,
    });

    expect(variables.get('script')).toEqual('working');
  });
  it('should download non existing plugin', async () => {
    mockFs.writeFileSync(
      path.join(__dirname, '../../mocks/mockTestPlugin.js'),
      'dummy'
    );
    const task: ScriptTaskType = {
      task: 'script',
      actions: [
        {
          module: '../../src/__tests__/mocks/mockTestPlugin.js',
        },
      ],
    };

    mockFs.existsSync.mockImplementationOnce(() => false);

    await scriptTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
      taskManager,
    });

    expect(fetch as jest.Mock).toHaveBeenCalledWith(
      expect.stringContaining('mockTestPlugin.js')
    );

    expect(variables.get('script')).toEqual('working');
  });
});
