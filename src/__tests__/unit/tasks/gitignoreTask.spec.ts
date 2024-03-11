/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');

import path from 'path';
import { Constants } from '../../../constants';
import { gitignoreTask, runTask } from '../../../tasks/gitignoreTask';
import { GitignoreTaskType } from '../../../types/mod.types';

describe('gitignoreTask', () => {
  it('should prepend text into empty body ', async () => {
    let content = '';
    const task: GitignoreTaskType = {
      type: 'gitignore',
      actions: [
        {
          append: 'ignoredfile',
          prepend: 'ignoredfile',
        },
      ],
    };
    content = await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
ignoredfile
`);
  });
  it('should prepend text into empty body without block', async () => {
    let content = '';
    const task: GitignoreTaskType = {
      type: 'gitignore',
      actions: [
        {
          append: 'ignoredfile',
          prepend: 'ignoredfile',
        },
      ],
    };
    content = await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
ignoredfile
`);
  });
  it('should skip insert when ifNotPresent exists', async () => {
    const content = `
someignored
`;
    const task: GitignoreTaskType = {
      type: 'gitignore',
      actions: [
        {
          ifNotPresent: 'someignored',
          prepend: 'ignored',
        },
        {
          ifNotPresent: 'someignored',
          append: 'ignored',
        },
      ],
    };

    await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should prepend text into partial body ', async () => {
    let content = `
ignoredfile
`;
    const task: GitignoreTaskType = {
      type: 'gitignore',
      actions: [
        {
          prepend: 'ignoredfile',
        },
      ],
    };

    content = await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
ignoredfile
`);
  });
  it('should append text into existing body ', async () => {
    let content = `
ignoredfile
`;
    const task: GitignoreTaskType = {
      type: 'gitignore',
      actions: [
        {
          append: 'config2 = use_native_modules!',
        },
      ],
    };
    content = await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
ignoredfile
config2 = use_native_modules!
`);
  });
  it('should insert text after point with comment', async () => {
    let content = `
ignoredfile
`;
    const task: GitignoreTaskType = {
      type: 'gitignore',
      actions: [
        {
          after: 'config',
          prepend: 'config2 = use_native_modules!',
          comment: 'test comment',
        },
      ],
    };

    content = await gitignoreTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
ignoredfile
`);
  });

  it('should skip if condition not met', async () => {
    const content = '';
    const task: GitignoreTaskType = {
      type: 'gitignore',
      actions: [
        {
          when: { test: 'random' },
          prepend: 'random;',
        },
      ],
    };

    await expect(
      gitignoreTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('target not found');
  });

  describe('runTask', () => {
    it('should read and write gitignore file', async () => {
      let content = `
test1;
test3;
`;
      const gitignorePath = path.resolve(
        __dirname,
        `../../mock-project/${Constants.GITIGNORE_FILE_NAME}`
      );
      mockFs.writeFileSync(gitignorePath, content);
      const task: GitignoreTaskType = {
        type: 'gitignore',
        actions: [
          {
            prepend: 'test2;',
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(gitignorePath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when insertion point not found with strict', async () => {
      const content = `
test1;
test3;
`;
      const taskInsertBefore: GitignoreTaskType = {
        type: 'gitignore',
        actions: [
          {
            before: 'random',
            append: 'test2;',
            strict: true,
          },
        ],
      };
      const taskInsertBeforeNonStrict: GitignoreTaskType = {
        type: 'gitignore',
        actions: [
          {
            before: 'random',
            append: 'test2;',
          },
        ],
      };

      await expect(
        gitignoreTask({
          configPath: 'path/to/config',
          task: taskInsertBefore,
          content,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('insertion point');
      await expect(
        gitignoreTask({
          configPath: 'path/to/config',
          task: taskInsertBeforeNonStrict,
          content,
          packageName: 'test-package',
        })
      ).resolves.not.toThrowError('insertion point');
      const taskInsertAfter: GitignoreTaskType = {
        type: 'gitignore',
        actions: [
          {
            after: 'random',
            prepend: 'test2;',
            strict: true,
          },
        ],
      };

      const taskInsertAfterNonStrict: GitignoreTaskType = {
        type: 'gitignore',
        actions: [
          {
            after: 'random',
            prepend: 'test2;',
          },
        ],
      };

      await expect(
        gitignoreTask({
          configPath: 'path/to/config',
          task: taskInsertAfter,
          content,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('insertion point');
      await expect(
        gitignoreTask({
          configPath: 'path/to/config',
          task: taskInsertAfterNonStrict,
          content,
          packageName: 'test-package',
        })
      ).resolves.not.toThrowError('insertion point');
    });
    it('should throw when block is used', async () => {
      const content = `
test1;
test3;
`;
      const taskInsertBefore: GitignoreTaskType = {
        type: 'gitignore',
        actions: [
          {
            block: 'test',
            before: 'random',
            append: 'test2;',
            strict: true,
          },
        ],
      };
      await expect(
        gitignoreTask({
          configPath: 'path/to/config',
          task: taskInsertBefore,
          content,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('block is not supported');
    });
    it('should work when gitignore does not exist', async () => {
      const task: GitignoreTaskType = {
        type: 'gitignore',
        actions: [
          {
            prepend: 'test2;',
          },
        ],
      };

      await expect(
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        })
      ).resolves.toBeUndefined();
    });
  });
});
