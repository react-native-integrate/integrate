/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');

import path from 'path';
import { Constants } from '../../../constants';
import {
  gradlePropertiesTask,
  runTask,
} from '../../../tasks/gradlePropertiesTask';
import { GradlePropertiesTaskType } from '../../../types/mod.types';

describe('gradlePropertiesTask', () => {
  it('should prepend text into empty body ', async () => {
    let content = '';
    const task: GradlePropertiesTaskType = {
      task: 'gradle_properties',
      actions: [
        {
          append: 'ignoredfile',
          prepend: 'ignoredfile',
        },
      ],
    };
    content = await gradlePropertiesTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await gradlePropertiesTask({
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
    const task: GradlePropertiesTaskType = {
      task: 'gradle_properties',
      actions: [
        {
          append: 'ignoredfile',
          prepend: 'ignoredfile',
        },
      ],
    };
    content = await gradlePropertiesTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await gradlePropertiesTask({
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
    const task: GradlePropertiesTaskType = {
      task: 'gradle_properties',
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

    await gradlePropertiesTask({
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
    const task: GradlePropertiesTaskType = {
      task: 'gradle_properties',
      actions: [
        {
          prepend: 'ignoredfile',
        },
      ],
    };

    content = await gradlePropertiesTask({
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
    const task: GradlePropertiesTaskType = {
      task: 'gradle_properties',
      actions: [
        {
          append: 'config2 = use_native_modules!',
        },
      ],
    };
    content = await gradlePropertiesTask({
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
    const task: GradlePropertiesTaskType = {
      task: 'gradle_properties',
      actions: [
        {
          after: 'config',
          prepend: 'config2 = use_native_modules!',
          comment: 'test comment',
        },
      ],
    };

    content = await gradlePropertiesTask({
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
    const task: GradlePropertiesTaskType = {
      task: 'gradle_properties',
      actions: [
        {
          when: { test: 'random' },
          prepend: 'random;',
        },
      ],
    };

    await expect(
      gradlePropertiesTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('target not found');
  });

  describe('runTask', () => {
    it('should read and write gradleProperties file', async () => {
      let content = `
test1;
test3;
`;
      const gradlePropertiesPath = path.resolve(
        __dirname,
        `../../mock-project/android/${Constants.GRADLE_PROPERTIES_FILE_NAME}`
      );
      mockFs.writeFileSync(gradlePropertiesPath, content);
      const task: GradlePropertiesTaskType = {
        task: 'gradle_properties',
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
      content = mockFs.readFileSync(gradlePropertiesPath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when insertion point not found with strict', async () => {
      const content = `
test1;
test3;
`;
      const taskInsertBefore: GradlePropertiesTaskType = {
        task: 'gradle_properties',
        actions: [
          {
            before: 'random',
            append: 'test2;',
            strict: true,
          },
        ],
      };
      const taskInsertBeforeNonStrict: GradlePropertiesTaskType = {
        task: 'gradle_properties',
        actions: [
          {
            before: 'random',
            append: 'test2;',
          },
        ],
      };

      await expect(
        gradlePropertiesTask({
          configPath: 'path/to/config',
          task: taskInsertBefore,
          content,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('insertion point');
      await expect(
        gradlePropertiesTask({
          configPath: 'path/to/config',
          task: taskInsertBeforeNonStrict,
          content,
          packageName: 'test-package',
        })
      ).resolves.not.toThrowError('insertion point');
      const taskInsertAfter: GradlePropertiesTaskType = {
        task: 'gradle_properties',
        actions: [
          {
            after: 'random',
            prepend: 'test2;',
            strict: true,
          },
        ],
      };

      const taskInsertAfterNonStrict: GradlePropertiesTaskType = {
        task: 'gradle_properties',
        actions: [
          {
            after: 'random',
            prepend: 'test2;',
          },
        ],
      };

      await expect(
        gradlePropertiesTask({
          configPath: 'path/to/config',
          task: taskInsertAfter,
          content,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('insertion point');
      await expect(
        gradlePropertiesTask({
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
      const taskInsertBefore: GradlePropertiesTaskType = {
        task: 'gradle_properties',
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
        gradlePropertiesTask({
          configPath: 'path/to/config',
          task: taskInsertBefore,
          content,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('block is not supported');
    });
    it('should work when gradleProperties does not exist', async () => {
      const task: GradlePropertiesTaskType = {
        task: 'gradle_properties',
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
