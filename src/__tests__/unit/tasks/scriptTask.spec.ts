import { scriptTask } from '../../../tasks/scriptTask';
import { ScriptTaskType } from '../../../types/mod.types';
import { taskManager } from '../../../utils/taskManager';
import { variables } from '../../../variables';

describe('scriptTask', () => {
  it('should work', async () => {
    const task: ScriptTaskType = {
      task: 'script',
      actions: [
        {
          script: `
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
});
