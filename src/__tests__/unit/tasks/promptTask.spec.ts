import { promptTask } from '../../../tasks/promptTask';
import { PromptTaskType } from '../../../types/mod.types';
import { variables } from '../../../variables';

const mock = jest.spyOn(require('../../../utils/runPrompt'), 'runPrompt');

describe('promptTask', () => {
  it('should handle unexpected error', async () => {
    mock.mockImplementationOnce(() => {
      throw new Error('unexpected error');
    });

    const task: PromptTaskType = {
      type: 'prompt',
      actions: [
        {
          name: 'test',
          text: 'test',
          type: 'text',
        },
      ],
    };

    await expect(
      promptTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('unexpected error');

    expect(variables.get('test')).toEqual('error');

    mock.mockReset();
  });
});
