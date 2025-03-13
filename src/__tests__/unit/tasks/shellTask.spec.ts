require('../../mocks/mockAll');
const mockSpawn = jest.spyOn(require('child_process'), 'spawn');

import { shellTask } from '../../../tasks/shellTask';
import { ShellTaskType } from '../../../types/mod.types';
import { variables } from '../../../variables';
import { mockPrompter } from '../../mocks/mockPrompter';

describe('shellTask', () => {
  it('should run command', async () => {
    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: (...args: any[]) => void) => {
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

    const task: ShellTaskType = {
      task: 'shell',
      actions: [
        {
          name: 'test',
          command: 'test',
          cwd: 'test',
        },
      ],
    };

    await shellTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });

    expect(mockSpawn).toHaveBeenCalled();
    expect(variables.get('test.output')).toBe('stdoutstderr');

    mockSpawn.mockReset();
  });
  it('should run command with args', async () => {
    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: (...args: any[]) => void) => {
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

    const task: ShellTaskType = {
      task: 'shell',
      actions: [
        {
          name: 'test',
          command: 'test',
          args: ['arg1', 'arg2 arg3'],
        },
      ],
    };

    await shellTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });

    expect(mockSpawn).toHaveBeenCalledWith(
      'test',
      ['arg1', 'arg2 arg3'],
      expect.anything()
    );

    mockSpawn.mockReset();
  });
  it('should handle unexpected error', async () => {
    mockSpawn.mockImplementationOnce(() => {
      throw new Error('unexpected error');
    });

    const task: ShellTaskType = {
      task: 'shell',
      actions: [
        {
          name: 'test',
          command: 'test',
        },
      ],
    };

    await expect(
      shellTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('unexpected error');

    expect(variables.get('test')).toEqual('error');

    mockSpawn.mockReset();
  });
  it('should handle invalid cwd', async () => {
    mockSpawn.mockImplementationOnce(() => {
      throw new Error('unexpected error');
    });

    const task: ShellTaskType = {
      task: 'shell',
      actions: [
        {
          name: 'test',
          command: 'test',
          cwd: '../../',
        },
      ],
    };

    await expect(
      shellTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('invalid cwd path');

    expect(variables.get('test')).toEqual('error');

    mockSpawn.mockReset();
  });
  it('should handle non zero exit code', async () => {
    mockSpawn.mockReset();
    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: (...args: any[]) => void) => {
        cb(1);
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

    const task: ShellTaskType = {
      task: 'shell',
      actions: [
        {
          name: 'test',
          command: 'test',
        },
      ],
    };

    await expect(
      shellTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('non zero exit code');

    expect(variables.get('test')).toEqual('error');

    mockSpawn.mockReset();
  });
  it('should skip when condition does not meet', async () => {
    mockSpawn.mockReset();
    const task: ShellTaskType = {
      task: 'shell',
      actions: [
        {
          when: { random: false },
          name: 'test',
          command: 'test',
        },
      ],
    };

    await shellTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });

    expect(mockSpawn).not.toHaveBeenCalled();

    mockSpawn.mockReset();
  });
  it('should skip when execution not allowed', async () => {
    mockSpawn.mockReset();
    mockPrompter.confirm.mockClear();
    mockPrompter.confirm.mockReturnValueOnce(false);

    const task: ShellTaskType = {
      task: 'shell',
      actions: [
        {
          name: 'test',
          command: 'test',
        },
      ],
    };

    await shellTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });

    expect(mockSpawn).not.toHaveBeenCalled();

    mockSpawn.mockReset();
    mockPrompter.confirm.mockReset();
  });
});
