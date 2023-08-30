/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import path from 'path';
import { Constants } from '../../../constants';
import { buildGradleTask, runTask } from '../../../tasks/buildGradleTask';
import { BuildGradleModType } from '../../../types/mod.types';
import { mockPrompter } from '../../mocks/mockAll';

describe('buildGradleTask', () => {
  it('should prepend text into empty body ', () => {
    let content = '';
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      append: 'google();',
      prepend: 'google();',
      before: {
        find: { regex: 'google();' },
        insert: 'google();',
      },
      after: {
        find: { regex: 'google();' },
        insert: 'google();',
      },
    };
    content = buildGradleTask({
      isInAppFolder: false,
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = buildGradleTask({
      isInAppFolder: false,
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
  it('should prepend text into empty body without path', () => {
    let content = '';
    const task: BuildGradleModType = {
      type: 'build_gradle',
      append: 'google();',
      prepend: 'google();',
      before: {
        find: { regex: 'google();' },
        insert: 'google();',
      },
      after: {
        find: { regex: 'google();' },
        insert: 'google();',
      },
    };
    content = buildGradleTask({
      isInAppFolder: false,
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = buildGradleTask({
      isInAppFolder: false,
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
google();
`);
  });
  it('should skip insert when ifNotPresent exists', () => {
    const content = `
buildscript {
    ext {
        jcenter();
    }
}
`;

    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      append: 'google();',
      prepend: 'google();',
      before: {
        find: { regex: 'jcenter' },
        insert: 'google();',
      },
      after: {
        find: { regex: 'jcenter' },
        insert: 'google();',
      },
      ifNotPresent: 'jcenter',
    };
    buildGradleTask({
      isInAppFolder: false,
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should prepend text into partial body ', () => {
    let content = `
buildscript {}
`;
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      append: 'google();',
      prepend: 'google();',
    };
    content = buildGradleTask({
      isInAppFolder: false,
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
  it('should prepend text into existing body ', () => {
    let content = `
buildscript {
    ext {
        jcenter();
    }
}
`;
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      prepend: 'google();',
    };
    content = buildGradleTask({
      isInAppFolder: false,
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
  it('should append text into existing body ', () => {
    let content = `
buildscript {
    ext {
        jcenter();
    }
}
`;
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      append: 'google();',
    };
    content = buildGradleTask({
      isInAppFolder: false,
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
  it('should insert text after point with comment', () => {
    let content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      comment: 'test comment',
      after: {
        find: { regex: 'test1' },
        insert: 'test2;',
      },
    };
    content = buildGradleTask({
      isInAppFolder: false,
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
  it('should insert text when empty', () => {
    let content = `
buildscript {}
`;
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      after: {
        find: { regex: 'test1' },
        insert: 'test2;',
      },
    };
    content = buildGradleTask({
      isInAppFolder: false,
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
  it('should insert text before point', () => {
    let content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      before: {
        find: { regex: '\n.*?test3;' },
        insert: 'test2;',
      },
    };
    content = buildGradleTask({
      isInAppFolder: false,
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`test1;
        test2;
        test3;`);
  });
  it('should throw when insertion point not found with strict', () => {
    const content = `
buildscript {
    ext {
        test1;
        test3;
    }
}
`;
    const taskInsertBefore: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      before: {
        find: 'random',
        insert: 'test2;',
        strict: true,
      },
    };
    const taskInsertBeforeNonStrict: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      before: {
        find: 'random',
        insert: 'test2;',
      },
    };

    expect(() =>
      buildGradleTask({
        isInAppFolder: false,
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    expect(() =>
      buildGradleTask({
        isInAppFolder: false,
        configPath: 'path/to/config',
        task: taskInsertBeforeNonStrict,
        content,
        packageName: 'test-package',
      })
    ).not.toThrowError('insertion point');
    const taskInsertAfter: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      after: {
        find: 'random',
        insert: 'test2;',
        strict: true,
      },
    };
    const taskInsertAfterNonStrict: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      after: {
        find: 'random',
        insert: 'test2;',
      },
    };

    expect(() =>
      buildGradleTask({
        isInAppFolder: false,
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    expect(() =>
      buildGradleTask({
        isInAppFolder: false,
        configPath: 'path/to/config',
        task: taskInsertAfterNonStrict,
        content,
        packageName: 'test-package',
      })
    ).not.toThrowError('insertion point');
  });
  it('should throw when block could not be added', () => {
    const content = '';
    mock.mockImplementationOnce(content => content);
    const task: BuildGradleModType = {
      type: 'build_gradle',
      path: 'buildscript.ext',
      prepend: 'random',
    };

    expect(() =>
      buildGradleTask({
        isInAppFolder: false,
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('block could not be inserted');
  });

  describe('runTask', () => {
    it('should read and write build gradle file', () => {
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
      const task: BuildGradleModType = {
        type: 'build_gradle',
        path: 'buildscript.ext',
        prepend: 'test2;',
      };
      runTask({
        isInAppFolder: false,
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(buildGradlePath);
      expect(content).toContain(task.prepend);
    });
    it('should read and write app build gradle file', () => {
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
      const task: BuildGradleModType = {
        type: 'build_gradle',
        path: 'buildscript.ext',
        prepend: 'test2;',
      };
      runTask({
        isInAppFolder: true,
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(buildGradlePath);
      expect(content).toContain(task.prepend);
    });
    it('should throw when build gradle does not exist', () => {
      const task: BuildGradleModType = {
        type: 'build_gradle',
        path: 'buildscript.ext',
        prepend: 'test2;',
      };
      expect(() => {
        runTask({
          isInAppFolder: false,
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        });
      }).toThrowError('build.gradle file not found');
    });
  });
});
