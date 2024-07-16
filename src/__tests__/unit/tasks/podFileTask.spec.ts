/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, mockPrompter } = require('../../mocks/mockAll');
const mock = jest.spyOn(require('../../../utils/stringSplice'), 'stringSplice');

import path from 'path';
import { Constants } from '../../../constants';
import { podFileTask, runTask } from '../../../tasks/podFileTask';
import { PodFileTaskType } from '../../../types/mod.types';

describe('podFileTask', () => {
  it('should prepend text into empty body ', async () => {
    let content = '';
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: "target 'TestApp'",
          append: 'config = use_native_modules!',
          prepend: 'config = use_native_modules!',
        },
      ],
    };
    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await podFileTask({
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
  it('should prepend text into empty body without block', async () => {
    let content = '';
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          append: 'config = use_native_modules!',
          prepend: 'config = use_native_modules!',
        },
      ],
    };
    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
config = use_native_modules!
`);
  });
  it('should skip insert when ifNotPresent exists', async () => {
    const content = `
target 'TestApp' do 
  config = use_native_modules!
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
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

    await podFileTask({
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
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          prepend: 'config = use_native_modules!',
        },
      ],
    };

    content = await podFileTask({
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
  it('should prepend text into existing body ', async () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
  end
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          prepend: 'config2 = use_native_modules!',
        },
      ],
    };

    content = await podFileTask({
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
  it('should append text into existing body ', async () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
  end
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          append: 'config2 = use_native_modules!',
        },
      ],
    };
    content = await podFileTask({
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
  it('should insert text after point with comment', async () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    config = use_native_modules!
  end
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          after: 'config',
          prepend: 'config2 = use_native_modules!',
          comment: 'test comment',
        },
      ],
    };

    content = await podFileTask({
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
  it('should insert text when empty', async () => {
    let content = `
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          after: 'random',
          prepend: 'config2 = use_native_modules!;',
        },
      ],
    };

    content = await podFileTask({
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
  it('should insert text before point', async () => {
    let content = `
target 'TestApp' do 
  pre_install do |installer| 
    test1;
    test3;
  end
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          before: { regex: 'test3' },
          append: 'test2;',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`test1;
    test2;
    test3;`);
  });
  it('should throw when insertion point not found with strict', async () => {
    const content = `
target 'TestApp' do 
  pre_install do |installer| 
    test1;
    test3;
  end
end
`;
    const taskInsertBefore: PodFileTaskType = {
      task: 'podfile',
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
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          before: 'random',
          append: 'test2;',
        },
      ],
    };

    await expect(
      podFileTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      podFileTask({
        configPath: 'path/to/config',
        task: taskInsertBeforeNonStrict,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('insertion point');
    const taskInsertAfter: PodFileTaskType = {
      task: 'podfile',
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
      task: 'podfile',
      actions: [
        {
          block: 'target.pre_install',
          after: 'random',
          prepend: 'test2;',
        },
      ],
    };

    await expect(
      podFileTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      podFileTask({
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
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: "target 'Test'.pre_install",
          prepend: 'random;',
        },
      ],
    };

    await expect(
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('block could not be inserted');
  });
  it('should throw when block does not exist', async () => {
    const content = '';
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'target',
          prepend: 'random;',
        },
      ],
    };

    await expect(
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('target not found');
  });
  it('should skip if condition not met', async () => {
    const content = '';
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          when: { test: 'random' },
          block: 'target',
          prepend: 'random;',
        },
      ],
    };

    await expect(
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('target not found');
  });
  it('should throw invalid block', async () => {
    const content = '';
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          block: 'random',
          prepend: 'random;',
        },
      ],
    };

    await expect(
      podFileTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('invalid block');
  });
  it('should define string static library', async () => {
    let content = `
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          staticLibrary: 'TestPod',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
target 'TestApp' do 
  $static_libs = [
    'TestPod'
  ]
end
`);
  });
  it('should define array static library', async () => {
    let content = `
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          staticLibrary: ['TestPod', 'TestPod2', 'TestPod3'],
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
target 'TestApp' do 
  $static_libs = [
    'TestPod',
    'TestPod2',
    'TestPod3'
  ]
end
`);
  });
  it('should define array static library with existing libs', async () => {
    let content = `
target 'TestApp' do 
  $static_libs = [
    'TestPod',
    'TestPod2'
  ]
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          staticLibrary: ['TestPod', 'TestPod3'],
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
target 'TestApp' do 
  $static_libs = [
    'TestPod',
    'TestPod2',
    'TestPod3'
  ]
end
`);
  });
  it('should define use frameworks static when linkage exists', async () => {
    let content = `
linkage = 'something'
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          useFrameworks: 'static',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
linkage = 'static'
target 'TestApp' do end
`);
  });
  it('should define use frameworks static when no linkage exists', async () => {
    let content = `
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          useFrameworks: 'static',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
use_frameworks! :linkage => :static
target 'TestApp' do end
`);
  });
  it('should not define use frameworks static when linkage is dynamic', async () => {
    let content = `
use_frameworks! :linkage => :dynamic
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          useFrameworks: 'static',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
use_frameworks! :linkage => :dynamic
target 'TestApp' do end
`);
  });
  it('should not define use frameworks static when new linkage is dynamic', async () => {
    let content = `
linkage = 'dynamic'
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          useFrameworks: 'static',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
linkage = 'dynamic'
target 'TestApp' do end
`);
  });
  it('should define use frameworks dynamic when linkage exists', async () => {
    let content = `
linkage = 'something'
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          useFrameworks: 'dynamic',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
linkage = 'dynamic'
target 'TestApp' do 
  $static_libs = []

  pre_install do |installer| 
    Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}
    installer.pod_targets.each do |pod|
      if $static_libs.include?(pod.name)
        def pod.build_type;
          Pod::BuildType.static_library
        end
      end
    end
  end
end
`);
  });
  it('should define use frameworks dynamic when no linkage exists', async () => {
    let content = `
target 'TestApp' do end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          useFrameworks: 'dynamic',
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
use_frameworks! :linkage => :dynamic
target 'TestApp' do 
  $static_libs = []

  pre_install do |installer| 
    Pod::Installer::Xcode::TargetValidator.send(:define_method, :verify_no_static_framework_transitive_dependencies) {}
    installer.pod_targets.each do |pod|
      if $static_libs.include?(pod.name)
        def pod.build_type;
          Pod::BuildType.static_library
        end
      end
    end
  end
end
`);
  });
  it('should disable flipper when no flipper_config exists', async () => {
    let content = `
target 'TestApp' do 
    :flipper_configuration => anything,
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          disableFlipper: true,
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
target 'TestApp' do 
    :flipper_configuration => FlipperConfiguration.disabled,
end
`);
  });
  it('should disable flipper when flipper_config exists', async () => {
    let content = `
flipper_config = anything
target 'TestApp' do 
    :flipper_configuration => flipper_config,
end
`;
    const task: PodFileTaskType = {
      task: 'podfile',
      actions: [
        {
          disableFlipper: true,
        },
      ],
    };

    content = await podFileTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
flipper_config = FlipperConfiguration.disabled
target 'TestApp' do 
    :flipper_configuration => flipper_config,
end
`);
  });

  describe('runTask', () => {
    it('should read and write pod file file', async () => {
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
        task: 'podfile',
        actions: [
          {
            block: 'target.pre_install',
            prepend: 'test2;',
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(podFilePath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when pod file does not exist', async () => {
      const task: PodFileTaskType = {
        task: 'podfile',
        actions: [
          {
            block: 'target.pre_install',
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
      ).rejects.toThrowError('Pod file not found');
    });
  });
});
