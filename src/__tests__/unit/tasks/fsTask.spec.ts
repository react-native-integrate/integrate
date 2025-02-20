/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

const mockWaitForFile = jest.spyOn(
  require('../../../utils/waitForFile'),
  'waitForFile'
);

import path from 'path';
import { fsTask, runTask } from '../../../tasks/fsTask';
import { FsTaskType } from '../../../types/mod.types';
import { getProjectPath } from '../../../utils/getProjectPath';
import { variables } from '../../../variables';
import { mockPrompter } from '../../mocks/mockAll';

const projectFullPath = path.resolve(__dirname, '../../mock-project');

describe('fsTask', () => {
  beforeEach(() => {
    mockFs.writeFileSync('/test/file.json', 'test-content');
  });
  it('should handle upgrade when file is not in .upgrade folder', async () => {
    variables.set('__UPGRADE__', true);
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter mock file path
    mockPrompter.text.mockImplementationOnce(() => '/test/file.json');
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.text).toHaveBeenCalled();

    expect(
      mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
    ).toEqual('test-content');
    variables.clear();
  });
  it('should handle upgrade when file is in upgrade.json but not in files folder', async () => {
    variables.set('__UPGRADE__', true);
    mockFs.writeFileSync(
      path.join(
        getProjectPath(),
        '.upgrade',
        'packages',
        'test-package',
        'upgrade.json'
      ),
      JSON.stringify(
        {
          files: {
            'android/file.json': 'file.json',
          },
        },
        null,
        2
      )
    );
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter mock file path
    mockPrompter.text.mockImplementationOnce(() => '/test/file.json');
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.text).toHaveBeenCalled();

    expect(
      mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
    ).toEqual('test-content');
    variables.clear();
  });
  it('should handle upgrade when file is in upgrade.json and in files folder', async () => {
    variables.set('__UPGRADE__', true);
    mockFs.writeFileSync(
      path.join(
        getProjectPath(),
        '.upgrade',
        'packages',
        'test-package',
        'upgrade.json'
      ),
      JSON.stringify(
        {
          files: {
            'android/file.json': 'file.json',
          },
        },
        null,
        2
      )
    );
    mockFs.writeFileSync(
      path.join(
        getProjectPath(),
        '.upgrade',
        'packages',
        'test-package',
        'files',
        'file.json'
      ),
      'test-upgrade-content'
    );
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter mock file path
    mockPrompter.text.mockImplementationOnce(() => '/test/file.json');
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.text).not.toHaveBeenCalled();

    expect(
      mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
    ).toEqual('test-upgrade-content');
    variables.clear();
  });
  it('should copy entered file to destination', async () => {
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter mock file path
    mockPrompter.text.mockImplementationOnce(() => '/test/file.json');
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.text).toHaveBeenCalled();

    expect(
      mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
    ).toEqual('test-content');
  });
  it('should throw when copy destination is out of project', async () => {
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: '../somewhere/file.json',
        },
      ],
    };

    // enter mock file path
    mockPrompter.text.mockImplementationOnce(() => '/test/file.json');
    await expect(
      fsTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('invalid destination path');
  });
  it('should skip if condition not met', async () => {
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          when: { test: 'random' },
          copyFile: 'file.json',
          destination: '../somewhere/file.json',
        },
      ],
    };

    // enter mock file path
    mockPrompter.text.mockImplementationOnce(() => '/test/file.json');
    await expect(
      fsTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).resolves.not.toThrow();
  });
  it('should skip if waitForFile throws', async () => {
    mockPrompter.text.mockReset();
    mockPrompter.confirm.mockReset();
    mockPrompter.log.message.mockReset();

    // simulate file exists in path
    mockFs.writeFileSync(
      path.join(projectFullPath, 'android', 'file.json'),
      'test-content'
    );

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter empty string
    mockPrompter.text.mockImplementationOnce(() => '');
    mockPrompter.confirm.mockImplementationOnce(() => true);

    mockWaitForFile.mockImplementationOnce(() => {
      return Promise.reject(new Error('skip'));
    });
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped copy operation')
    );
  });
  it('should wait for user to copy file to destination when not exists', async () => {
    mockPrompter.text.mockReset();
    mockPrompter.confirm.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter empty string
    mockPrompter.text.mockImplementationOnce(() => '');
    mockPrompter.confirm.mockImplementationOnce(() => true);

    mockWaitForFile.mockImplementationOnce(() => {
      // simulate manually writing file
      mockFs.writeFileSync(
        path.join(projectFullPath, 'android', 'file.json'),
        'test-content'
      );

      return Promise.resolve(true);
    });
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.text).toHaveBeenCalled();

    expect(
      mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
    ).toEqual('test-content');
  });
  it('should wait for user to copy file to destination when exists', async () => {
    mockPrompter.text.mockReset();
    mockPrompter.confirm.mockReset();
    mockPrompter.log.message.mockReset();

    // simulate file exists in path
    mockFs.writeFileSync(
      path.join(projectFullPath, 'android', 'file.json'),
      'test-content'
    );

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter empty string
    mockPrompter.text.mockImplementationOnce(() => '');
    mockPrompter.confirm.mockImplementationOnce(() => true);

    mockWaitForFile.mockImplementationOnce(() => {
      return Promise.resolve(false);
    });
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.text).toHaveBeenCalled();
    expect(mockPrompter.confirm).toHaveBeenCalled();
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('file was updated')
    );

    expect(
      mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
    ).toEqual('test-content');
  });
  it('should handle when user skip copying a file to destination when exists', async () => {
    mockPrompter.text.mockReset();
    mockPrompter.confirm.mockReset();
    mockPrompter.log.message.mockReset();

    // simulate file exists in path
    mockFs.writeFileSync(
      path.join(projectFullPath, 'android', 'file.json'),
      'test-content'
    );

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          copyFile: 'file.json',
          destination: 'android/file.json',
        },
      ],
    };

    // enter empty string
    mockPrompter.text.mockImplementation(() => '');
    mockPrompter.confirm.mockImplementationOnce(() => false);

    mockWaitForFile.mockImplementationOnce(() => {
      return Promise.resolve(false);
    });
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });
    expect(mockPrompter.text).toHaveBeenCalled();
    expect(mockPrompter.confirm).toHaveBeenCalled();
    expect(mockPrompter.confirm).toReturnWith(false);
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped copy operation')
    );

    expect(
      mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
    ).toEqual('test-content');
  });
  it('should remove entered file', async () => {
    mockFs.writeFileSync(
      path.join(projectFullPath, 'android', 'file-to-delete.json'),
      'test-content'
    );
    mockPrompter.log.message.mockReset();

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          removeFile: 'android/file-to-delete.json',
        },
      ],
    };

    // enter mock file path
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });

    expect(
      mockFs.existsSync(
        path.join(projectFullPath, 'android', 'file-to-delete.json')
      )
    ).toEqual(false);
  });
  it('should skip remove entered file when not exists', async () => {
    mockPrompter.log.message.mockReset();

    expect(
      mockFs.existsSync(
        path.join(projectFullPath, 'android', 'file-to-delete.json')
      )
    ).toEqual(false);

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          removeFile: 'file-to-delete.json',
        },
      ],
    };

    // enter mock file path
    await fsTask({
      configPath: 'path/to/config',
      task: task,
      packageName: 'test-package',
    });

    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('skipped remove operation')
    );
  });
  it('should throw when strict remove file not exists', async () => {
    mockPrompter.log.message.mockReset();

    expect(
      mockFs.existsSync(
        path.join(projectFullPath, 'android', 'file-to-delete.json')
      )
    ).toEqual(false);

    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          removeFile: 'file-to-delete.json',
          strict: true,
        },
      ],
    };

    // enter mock file path
    await expect(
      fsTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('does not exist');
  });
  it('should throw when remove destination is out of project', async () => {
    const task: FsTaskType = {
      task: 'fs',
      actions: [
        {
          removeFile: '../somewhere/file-to-delete.json',
        },
      ],
    };

    // enter mock file path
    await expect(
      fsTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('invalid path to remove');
  });

  describe('runTask', () => {
    it('should run fs tasks', async () => {
      const task: FsTaskType = {
        task: 'fs',
        actions: [
          {
            copyFile: 'file.json',
            destination: 'android/file.json',
          },
        ],
      };

      // enter mock file path
      mockPrompter.text.mockImplementationOnce(() => '/test/file.json');
      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      expect(
        mockFs.readFileSync(path.join(projectFullPath, 'android', 'file.json'))
      ).toEqual('test-content');
    });
  });
});
