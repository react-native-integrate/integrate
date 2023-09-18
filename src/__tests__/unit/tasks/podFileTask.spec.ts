/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import path from 'path';
import { Constants } from '../../../constants';
import { podFileTask, runTask } from '../../../tasks/podFileTask';
import { PodFileTaskType } from '../../../types/mod.types';

describe('podFileTask', () => {
  it('should prepend text into empty body ', () => {
    let content = '';
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: "target 'TestApp'",
          append: 'config = use_native_modules!',
          prepend: 'config = use_native_modules!',
        },
      ],
    };
    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
target 'TestApp' do 
  config = use_native_modules!
end
`);
  });
  it('should prepend text into empty body without block', () => {
    let content = '';
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          append: 'config = use_native_modules!',
          prepend: 'config = use_native_modules!',
        },
      ],
    };
    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
config = use_native_modules!
`);
  });
  it('should skip insert when ifNotPresent exists', () => {
    const content = `
target 'TestApp' do 
  config = use_native_modules!
end
`;
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target',
          ifNotPresent: 'use_native_modules',
          prepend: 'config = use_native_modules!',
        },
        {
          block: 'target',
          ifNotPresent: 'use_native_modules',
          append: 'config = use_native_modules!',
        },
      ],
    };

    podFileTask({
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
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          prepend: 'config = use_native_modules!',
        },
      ],
    };

    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
  end
end
`);
  });
  it('should prepend text into existing body ', () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
  end
end
`;
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          prepend: 'config2 = use_native_modules!',
        },
      ],
    };

    content = podFileTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
target 'TestApp' do 
  pre_install do |installer| 
    config2 = use_native_modules!
    config = use_native_modules!
  end
end
`);
  });
  it('should append text into existing body ', () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
  end
end
`;
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          append: 'config2 = use_native_modules!',
        },
      ],
    };
    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
    config2 = use_native_modules!
  end
end
`);
  });
  it('should insert text after point with comment', () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
  end
end
`;
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          after: 'config',
          prepend: 'config2 = use_native_modules!',
          comment: 'test comment',
        },
      ],
    };

    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
    # test comment
    config2 = use_native_modules!
  end
end
`);
  });
  it('should insert text when empty', () => {
    let content = `
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          after: 'random',
          prepend: 'config2 = use_native_modules!;',
        },
      ],
    };

    content = podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
target 'TestApp' do 
  pre_install do |installer| 
    config2 = use_native_modules!;
  end
end
`);
  });
  it('should insert text before point', () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    test1;
    test3;
  end
end
`;
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          before: { regex: 'test3' },
          append: 'test2;',
        },
      ],
    };

    content = podFileTask({
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
target 'TestApp' do 
  pre_install do |installer| 
    test1;
    test3;
  end
end
`;
    const taskInsertBefore: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          before: 'random',
          append: 'test2;',
          strict: true,
        },
      ],
    };
    const taskInsertBeforeNonStrict: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          before: 'random',
          append: 'test2;',
        },
      ],
    };

    expect(() =>
      podFileTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    expect(() =>
      podFileTask({
        configPath: 'path/to/config',
        task: taskInsertBeforeNonStrict,
        content,
        packageName: 'test-package',
      })
    ).not.toThrowError('insertion point');
    const taskInsertAfter: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          after: 'random',
          prepend: 'test2;',
          strict: true,
        },
      ],
    };

    const taskInsertAfterNonStrict: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          after: 'random',
          prepend: 'test2;',
        },
      ],
    };

    expect(() =>
      podFileTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    expect(() =>
      podFileTask({
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
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: "target 'Test'.pre_install",
          prepend: 'random;',
        },
      ],
    };

    expect(() =>
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('block could not be inserted');
  });
  it('should throw when block does not exist', () => {
    const content = '';
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'target',
          prepend: 'random;',
        },
      ],
    };

    expect(() =>
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('target not found');
  });
  it('should skip if condition not met', () => {
    const content = '';
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          when: { test: 'random' },
          block: 'target',
          prepend: 'random;',
        },
      ],
    };

    expect(() =>
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).not.toThrowError('target not found');
  });
  it('should throw invalid block', () => {
    const content = '';
    const task: PodFileTaskType = {
      type: 'podfile',
      actions: [
        {
          block: 'random',
          prepend: 'random;',
        },
      ],
    };

    expect(() =>
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('invalid block');
  });

  describe('runTask', () => {
    it('should read and write pod file file', () => {
      let content = `
target 'TestApp' do 
  pre_install do |installer| 
    test1;
    test3;
  end
end
`;
      const podFilePath = path.resolve(
        __dirname,
        `../../mock-project/ios/${Constants.POD_FILE_NAME}`
      );
      mockFs.writeFileSync(podFilePath, content);
      const task: PodFileTaskType = {
        type: 'podfile',
        actions: [
          {
            block: 'target.pre_install',
            prepend: 'test2;',
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(podFilePath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when pod file does not exist', () => {
      const task: PodFileTaskType = {
        type: 'podfile',
        actions: [
          {
            block: 'target.pre_install',
            prepend: 'test2;',
          },
        ],
      };

      expect(() => {
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        });
      }).toThrowError('Pod file not found');
    });
  });
});
