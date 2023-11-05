/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import path from 'path';
import { Constants } from '../../../constants';
import { buildGradleTask, runTask } from '../../../tasks/buildGradleTask';
import { BuildGradleTaskType } from '../../../types/mod.types';
import { mockPrompter } from '../../mocks/mockAll';

describe('buildGradleTask', () => {
  it('should prepend text into empty body ', async () => {
    let content = '';
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          append: 'google();',
          prepend: 'google();',
        },
      ],
    };
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
    ext {
        google();
    }
}
`);
  });
  it('should prepend text into empty body without block', async () => {
    let content = '';
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          append: 'google();',
          prepend: 'google();',
        },
      ],
    };
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
google();
`);
  });
  it('should skip insert when ifNotPresent exists', async () => {
    const content = `
buildscript {
    ext {
        jcenter();
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          ifNotPresent: 'jcenter',
          append: 'google();',
        },
        {
          block: 'buildscript.ext',
          ifNotPresent: 'jcenter',
          prepend: 'google();',
        },
      ],
    };

    await buildGradleTask({
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
buildscript {}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          prepend: 'google();',
        },
      ],
    };

    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
    ext {
        google();
    }
}
`);
  });
  it('should prepend text into existing body ', async () => {
    let content = `
buildscript {
    ext {
        jcenter();
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          prepend: 'google();',
        },
      ],
    };

    content = await buildGradleTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
    ext {
        google();
        jcenter();
    }
}
`);
  });
  it('should append text into existing body ', async () => {
    let content = `
buildscript {
    ext {
        jcenter();
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          append: 'google();',
        },
      ],
    };
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
    ext {
        jcenter();
        google();
    }
}
`);
  });
  it('should replace text with existing body ', async () => {
    let content = `
buildscript {
    ext {
        jcenter();
        jcenter();
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          search: 'jcenter();',
          replace: 'google();',
        },
      ],
    };
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
    ext {
        google();
        jcenter();
    }
}
`);
  });
  it('should append text exactly with existing body ', async () => {
    let content = `
buildscript {
    ext {
        jcenter();
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript',
          after: 'ext {',
          before: '}',
          search: 'jcenter();',
          replace: 'jcenter();',
          prepend: 'google1();',
          append: 'google3();',
          exact: true,
        },
      ],
    };
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
    ext {
        google1();jcenter();google3();
    }
}
`);
  });
  it('should replace all text with existing body ', async () => {
    let content = `
buildscript {
    ext {
        jcenter();
        jcenter();
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          search: {
            regex: 'jcenter\\(\\);',
            flags: 'g',
          },
          replace: 'google();',
        },
      ],
    };
    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
    ext {
        google();
        google();
    }
}
`);
  });
  it('should skip replace when ifNotPresent exists', async () => {
    const content = `
buildscript {
    ext {
        jcenter();
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          ifNotPresent: 'jcenter',
          search: 'jcenter();',
          replace: 'google();',
        },
        {
          block: 'buildscript.ext',
          ifNotPresent: 'jcenter',
          search: 'jcenter();',
          replace: 'google();',
        },
      ],
    };

    await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should insert text after point with comment', async () => {
    let content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'test1',
          prepend: 'test2;',
          comment: 'test comment',
        },
      ],
    };

    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`test1;
        // test comment
        test2;
        test3;`);
  });
  it('should insert text when empty', async () => {
    let content = `
buildscript {}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'test1',
          prepend: 'test2;',
        },
      ],
    };

    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
buildscript {
    ext {
        test2;
    }
}
`);
  });
  it('should insert text before point', async () => {
    let content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          before: { regex: '\n.*?test3;' },
          append: 'test2;',
        },
      ],
    };

    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`test1;
        test2;
        test3;`);
  });
  it('should skip if condition not met', async () => {
    let content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          when: { test: 'random' },
          block: 'buildscript.ext',
          before: { regex: '\n.*?test3;' },
          append: 'test2;',
        },
      ],
    };

    content = await buildGradleTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).not.toContain(`test1;
        test2;
        test3;`);
  });
  it('should throw when insertion point not found with strict', async () => {
    const content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
    const taskInsertBefore: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          before: 'random',
          append: 'test2;',
          strict: true,
        },
      ],
    };
    const taskInsertBeforeNonStrict: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          before: 'random',
          append: 'test2;',
        },
      ],
    };

    await expect(
      buildGradleTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      buildGradleTask({
        configPath: 'path/to/config',
        task: taskInsertBeforeNonStrict,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('insertion point');
    const taskInsertAfter: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'random',
          prepend: 'test2;',
          strict: true,
        },
      ],
    };

    const taskInsertAfterNonStrict: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'random',
          prepend: 'test2;',
        },
      ],
    };

    await expect(
      buildGradleTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      buildGradleTask({
        configPath: 'path/to/config',
        task: taskInsertAfterNonStrict,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('insertion point');
  });
  it('should throw when block could not be added', async () => {
    const content = '';
    mock.mockImplementationOnce(content => content);
    const task: BuildGradleTaskType = {
      type: 'build_gradle',
      actions: [
        {
          block: 'buildscript.ext',
          prepend: 'random;',
        },
      ],
    };

    await expect(
      buildGradleTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('block could not be inserted');
  });

  describe('runTask', () => {
    it('should read and write build gradle file', async () => {
      let content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
      const buildGradlePath = path.resolve(
        __dirname,
        `../../mock-project/android/${Constants.BUILD_GRADLE_FILE_NAME}`
      );
      mockFs.writeFileSync(buildGradlePath, content);
      const task: BuildGradleTaskType = {
        type: 'build_gradle',
        actions: [
          {
            block: 'buildscript.ext',
            prepend: 'test2;',
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(buildGradlePath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should read and write app build gradle file', async () => {
      let content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
      const buildGradlePath = path.resolve(
        __dirname,
        `../../mock-project/android/app/${Constants.BUILD_GRADLE_FILE_NAME}`
      );
      mockFs.writeFileSync(buildGradlePath, content);
      const task: BuildGradleTaskType = {
        type: 'build_gradle',
        location: 'app',
        actions: [
          {
            block: 'buildscript.ext',
            prepend: 'test2;',
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(buildGradlePath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when build gradle does not exist', async () => {
      const task: BuildGradleTaskType = {
        type: 'build_gradle',
        actions: [
          {
            block: 'buildscript.ext',
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
      ).rejects.toThrowError('build.gradle file not found');
    });
  });
});
