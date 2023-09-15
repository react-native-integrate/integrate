/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

const mockWaitForFile = jest.spyOn(
  require('../../../utils/waitForFile'),
  'waitForFile'
);

import path from 'path';
import { fsTask, runTask } from '../../../tasks/fsTask';
import { FsTaskType } from '../../../types/mod.types';
import { mockPrompter } from '../../mocks/mockAll';

const projectFullPath = path.resolve(__dirname, '../../mock-project');

describe('fsTask', () => {
  beforeEach(() => {
    mockFs.writeFileSync('/test/file.json', 'test-content');
  });
  it('should copy entered file to destination', async () => {
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      type: 'fs',
      updates: [
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
  it('should throw when destination is out of project', async () => {
    mockPrompter.text.mockReset();

    const task: FsTaskType = {
      type: 'fs',
      updates: [
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
  it('should wait for user to copy file to destination when not exists', async () => {
    mockPrompter.text.mockReset();
    mockPrompter.confirm.mockReset();

    const task: FsTaskType = {
      type: 'fs',
      updates: [
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

    // simulate file exists in path
    mockFs.writeFileSync(
      path.join(projectFullPath, 'android', 'file.json'),
      'test-content'
    );

    const task: FsTaskType = {
      type: 'fs',
      updates: [
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
      type: 'fs',
      updates: [
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

  describe('runTask', () => {
    it('should run fs tasks', async () => {
      const task: FsTaskType = {
        type: 'fs',
        updates: [
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
