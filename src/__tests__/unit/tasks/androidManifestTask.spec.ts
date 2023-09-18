/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

import path from 'path';
import { Constants } from '../../../constants';
import {
  androidManifestTask,
  runTask,
} from '../../../tasks/androidManifestTask';
import { AndroidManifestTaskType } from '../../../types/mod.types';
import { mockPrompter } from '../../mocks/mockAll';
import { mockAndroidManifestTemplate } from '../../mocks/mockAndroidManifestTemplate';

describe('androidManifestTask', () => {
  it('should throw if setting attributes with empty block', () => {
    const content = '';
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          attributes: {
            test: 1,
          },
        },
      ],
    };
    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('you must set block');
  });
  it('should skip if condition not met', () => {
    const content = '';
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          when: { test: 'random' },
          attributes: {
            test: 1,
          },
        },
      ],
    };
    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).not.toThrow();
  });
  it('should throw if block is invalid', () => {
    const content = '';
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'random' as any,
        },
      ],
    };
    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('Invalid block');
  });
  it('should throw text into empty body ', () => {
    const content = '';
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'activity',
          append: '<test />',
        },
      ],
    };
    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('block could not be found');
  });
  it('should prepend text into empty body without block', () => {
    let content = '';
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          prepend: '<test />',
          append: '<test />',
        },
      ],
    };

    content = androidManifestTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    content = androidManifestTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
<test />
`);
  });
  it('should skip insert when ifNotPresent exists', () => {
    const content = mockAndroidManifestTemplate;

    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'activity',
          ifNotPresent: 'intent-filter',
          append: '<test />',
        },
        {
          block: 'activity',
          ifNotPresent: 'intent-filter',
          append: '<test />',
        },
      ],
    };

    androidManifestTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should prepend text into existing body ', () => {
    let content = `
<manifest>
  <test3 />
  <application>
      <activity>
          <test1 />
      </activity>
  </application>
</manifest>
`;
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'application',
          prepend: '<test />',
        },
      ],
    };

    content = androidManifestTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
<manifest>
  <test3 />
  <application>
      <test />
      <activity>
          <test1 />
      </activity>
  </application>
</manifest>
`);
  });
  it('should set, replace and delete attributes', () => {
    let content = `
<manifest>
  <test3 />
  <application
      test2="not ok"
      test3="replace me">
      <activity>
          <test1 />
      </activity>
  </application>
</manifest>
`;
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'application',
          attributes: {
            test2: { $delete: true },
            nonExisting: { $delete: true },
            test3: 'OK',
            test: 'OK',
          },
        },
      ],
    };

    content = androidManifestTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
<manifest>
  <test3 />
  <application
      test3="OK"
      test="OK">
      <activity>
          <test1 />
      </activity>
  </application>
</manifest>
`);
  });
  it('should append text into existing body ', () => {
    let content = `
<manifest>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</manifest>
`;
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'manifest',
          append: '<test />',
        },
      ],
    };

    content = androidManifestTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
<manifest>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
    <test />
</manifest>
`);
  });
  it('should insert text after point with comment', () => {
    let content = `
<manifest>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</manifest>
`;
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'manifest',
          after: 'test3',
          prepend: '<test />',
          comment: 'test comment',
        },
      ],
    };

    content = androidManifestTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
<manifest>
    <test3 />
    <!-- test comment -->
    <test />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</manifest>
`);
  });
  it('should insert text before point', () => {
    let content = `
<manifest>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</manifest>
`;
    const task: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'manifest',
          before: { regex: 'test3' },
          append: '<test />',
        },
      ],
    };

    content = androidManifestTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
<manifest>
    <test />
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</manifest>
`);
  });
  it('should throw when insertion point not found with strict', () => {
    const content = `
<manifest>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</manifest>
`;
    const taskInsertBefore: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'manifest',
          before: 'random',
          append: '<test />',
          strict: true,
        },
      ],
    };
    const taskInsertBeforeNonStrict: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'manifest',
          before: 'random',
          append: '<test />',
        },
      ],
    };

    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: taskInsertBeforeNonStrict,
        content,
        packageName: 'test-package',
      })
    ).not.toThrowError('insertion point');
    const taskInsertAfter: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'manifest',
          after: 'random',
          prepend: '<test2 />',
          strict: true,
        },
      ],
    };

    const taskInsertAfterNonStrict: AndroidManifestTaskType = {
      type: 'android_manifest',
      actions: [
        {
          block: 'manifest',
          after: 'random',
          prepend: '<test2s />',
        },
      ],
    };

    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('insertion point');
    expect(() =>
      androidManifestTask({
        configPath: 'path/to/config',
        task: taskInsertAfterNonStrict,
        content,
        packageName: 'test-package',
      })
    ).not.toThrowError('insertion point');
  });

  describe('runTask', () => {
    it('should read and write android manifest file', () => {
      let content = `
<manifest>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</manifest>
`;
      const manifestPath = path.resolve(
        __dirname,
        `../../mock-project/${Constants.ANDROID_MAIN_FILE_PATH}/${Constants.ANDROID_MANIFEST_FILE_NAME}`
      );
      mockFs.writeFileSync(manifestPath, content);
      const task: AndroidManifestTaskType = {
        type: 'android_manifest',
        actions: [
          {
            block: 'manifest',
            prepend: '<test />',
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(manifestPath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when android manifest does not exist', () => {
      const task: AndroidManifestTaskType = {
        type: 'android_manifest',
        actions: [
          {
            block: 'manifest',
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
      }).toThrowError('AndroidManifest.xml file not found');
    });
  });
});
