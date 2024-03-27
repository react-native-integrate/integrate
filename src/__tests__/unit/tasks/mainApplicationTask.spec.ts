/* eslint-disable @typescript-eslint/no-unsafe-call */
const { mockFs } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import path from 'path';
import { Constants } from '../../../constants';
import {
  mainApplicationTask,
  runTask,
} from '../../../tasks/mainApplicationTask';
import { MainApplicationTaskType } from '../../../types/mod.types';
import { mockPrompter } from '../../mocks/mockAll';

describe('mainApplicationTask', () => {
  it('should prepend text into empty body ', async () => {
    let content = '';
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'test',
          append: 'google();',
          prepend: 'google();',
        },
      ],
    };
    content = await mainApplicationTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await mainApplicationTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
test {
  google();
}
`);
  });
  it('should prepend text into empty body without block', async () => {
    let content = '';
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          append: 'google();',
          prepend: 'google();',
        },
      ],
    };
    content = await mainApplicationTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
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

    await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          prepend: 'google();',
        },
      ],
    };

    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          prepend: 'google();',
        },
      ],
    };

    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          append: 'google();',
        },
      ],
    };
    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          search: 'enter',
          replace: 'google();',
        },
      ],
    };
    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
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
    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
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
    content = await mainApplicationTask({
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
  it('should replace all text with existing body exactly', async () => {
    let content = `
buildscript {
  ext {
    jcenter(); // some comment
    jcenter();
  }
}
`;
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          search: {
            regex: 'jcenter\\(\\);',
            flags: 'g',
          },
          exact: true,
          replace: 'google();',
        },
      ],
    };
    content = await mainApplicationTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
buildscript {
  ext {
    google(); // some comment
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
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

    await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'test1',
          prepend: 'test2;',
          comment: 'test comment',
        },
      ],
    };

    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'test1',
          prepend: 'test2;',
        },
      ],
    };

    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          before: { regex: '\n.*?test3;' },
          append: 'test2;',
        },
      ],
    };

    content = await mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          when: { test: 'random' },
          block: 'buildscript.ext',
          before: { regex: '\n.*?test3;' },
          append: 'test2;',
        },
      ],
    };

    content = await mainApplicationTask({
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
    const taskInsertBefore: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          before: 'random',
          append: 'test2;',
          strict: true,
        },
      ],
    };
    const taskInsertBeforeNonStrict: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          before: 'random',
          append: 'test2;',
        },
      ],
    };

    await expect(
      mainApplicationTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      mainApplicationTask({
        configPath: 'path/to/config',
        task: taskInsertBeforeNonStrict,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('insertion point');
    const taskInsertAfter: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'random',
          prepend: 'test2;',
          strict: true,
        },
      ],
    };

    const taskInsertAfterNonStrict: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          after: 'random',
          prepend: 'test2;',
        },
      ],
    };

    await expect(
      mainApplicationTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      mainApplicationTask({
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
    const task: MainApplicationTaskType = {
      task: 'main_application',
      actions: [
        {
          block: 'buildscript.ext',
          prepend: 'random;',
        },
      ],
    };

    await expect(
      mainApplicationTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('block could not be inserted');
  });

  describe('runTask', () => {
    it('should read and write main application file', async () => {
      let content = `
buildscript {
  ext {
    test1;
    test3;
  }
}
`;
      const mainApplicationPath = path.resolve(
        __dirname,
        `../../mock-project/android/app/src/main/java/com/test/${Constants.MAIN_APPLICATION_JAVA_FILE_NAME}`
      );
      mockFs.writeFileSync(mainApplicationPath, content);
      const task: MainApplicationTaskType = {
        task: 'main_application',
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
      content = mockFs.readFileSync(mainApplicationPath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should read and write main application kotlin file', async () => {
      let content = `
buildscript {
  ext {
    test1;
    test3;
  }
}
`;
      const mainApplicationPath = path.resolve(
        __dirname,
        `../../mock-project/android/app/src/main/java/com/test/${Constants.MAIN_APPLICATION_KT_FILE_NAME}`
      );
      mockFs.writeFileSync(mainApplicationPath, content);
      const task: MainApplicationTaskType = {
        task: 'main_application',
        lang: 'kotlin',
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
      content = mockFs.readFileSync(mainApplicationPath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when main application does not exist', async () => {
      let task: MainApplicationTaskType = {
        task: 'main_application',
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
      ).rejects.toThrowError('MainApplication.java file not found');
      task = {
        task: 'main_application',
        lang: 'kotlin',
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
      ).rejects.toThrowError('MainApplication.kt file not found');
    });
  });
});
