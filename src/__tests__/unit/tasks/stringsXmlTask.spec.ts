/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

import path from 'path';
import { Constants } from '../../../constants';
import { stringsXmlTask, runTask } from '../../../tasks/stringsXmlTask';
import { StringsXmlTaskType } from '../../../types/mod.types';
import { mockPrompter } from '../../mocks/mockAll';
import { mockStringsXmlTemplate } from '../../mocks/mockStringsXmlTemplate';

describe('stringsXmlTask', () => {
  it('should skip insert when ifNotPresent exists', async () => {
    const content = mockStringsXmlTemplate;

    const task: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          ifNotPresent: 'app_name',
          append: '<test />',
        },
        {
          ifNotPresent: 'app_name',
          append: '<test />',
        },
      ],
    };

    await stringsXmlTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(mockPrompter.log.message).toHaveBeenCalledWith(
      expect.stringContaining('found existing ')
    );
  });
  it('should prepend text into existing body ', async () => {
    let content = `
<resources>
    <test3 />
    <application>
        <activity>
            <test1 />
        </activity>
    </application>
</resources>
`;
    const task: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          prepend: '<test />',
        },
      ],
    };

    content = await stringsXmlTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
<resources>
    <test />
    <test3 />
    <application>
        <activity>
            <test1 />
        </activity>
    </application>
</resources>
`);
  });
  it('should skip if condition not met', async () => {
    let content = `
<resources>
    <test3 />
    <application>
        <activity>
            <test1 />
        </activity>
    </application>
</resources>
`;
    const task: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          when: { test: 'random' },
          prepend: '<test />',
        },
      ],
    };

    content = await stringsXmlTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
<resources>
    <test3 />
    <application>
        <activity>
            <test1 />
        </activity>
    </application>
</resources>
`);
  });
  it('should append text into existing body ', async () => {
    let content = `
<resources>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</resources>
`;
    const task: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          append: '<test />',
        },
      ],
    };

    content = await stringsXmlTask({
      configPath: 'path/to/config',
      task,
      content,
      packageName: 'test-package',
    });
    expect(content).toEqual(`
<resources>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
    <test />
</resources>
`);
  });
  it('should insert text after point with comment', async () => {
    let content = `
<resources>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</resources>
`;
    const task: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          after: 'test3',
          prepend: '<test />',
          comment: 'test comment',
        },
      ],
    };

    content = await stringsXmlTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
<resources>
    <test3 />
    <!-- test comment -->
    <test />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</resources>
`);
  });
  it('should insert text before point', async () => {
    let content = `
<resources>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</resources>
`;
    const task: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          before: { regex: 'test3' },
          append: '<test />',
        },
      ],
    };

    content = await stringsXmlTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toContain(`
<resources>
    <test />
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</resources>
`);
  });
  it('should throw when insertion point not found with strict', async () => {
    const content = `
<resources>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</resources>
`;
    const taskInsertBefore: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          before: 'random',
          append: '<test />',
          strict: true,
        },
      ],
    };
    const taskInsertBeforeNonStrict: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          before: 'random',
          append: '<test />',
        },
      ],
    };

    await expect(
      stringsXmlTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      stringsXmlTask({
        configPath: 'path/to/config',
        task: taskInsertBeforeNonStrict,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('insertion point');
    const taskInsertAfter: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          after: 'random',
          prepend: '<test2 />',
          strict: true,
        },
      ],
    };

    const taskInsertAfterNonStrict: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          after: 'random',
          prepend: '<test2s />',
        },
      ],
    };

    await expect(
      stringsXmlTask({
        configPath: 'path/to/config',
        task: taskInsertAfter,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('insertion point');
    await expect(
      stringsXmlTask({
        configPath: 'path/to/config',
        task: taskInsertAfterNonStrict,
        content,
        packageName: 'test-package',
      })
    ).resolves.not.toThrowError('insertion point');
  });
  it('should throw when resources block not found', async () => {
    const content = `
<random>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</random>
`;
    const taskInsertBefore: StringsXmlTaskType = {
      task: 'strings_xml',
      actions: [
        {
          append: '<test />',
        },
      ],
    };

    await expect(
      stringsXmlTask({
        configPath: 'path/to/config',
        task: taskInsertBefore,
        content,
        packageName: 'test-package',
      })
    ).rejects.toThrowError('block could not be found');
  });

  describe('runTask', () => {
    it('should read and write android manifest file', async () => {
      let content = `
<resources>
    <test3 />
    <application>
      <activity>
        <test1 />
      </activity>
    </application>
</resources>
`;
      const manifestPath = path.resolve(
        __dirname,
        `../../mock-project/${Constants.ANDROID_MAIN_FILE_PATH}/res/values/${Constants.STRINGS_XML_FILE_NAME}`
      );
      mockFs.writeFileSync(manifestPath, content);
      const task: StringsXmlTaskType = {
        task: 'strings_xml',
        actions: [
          {
            prepend: '<test />',
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(manifestPath);
      // @ts-ignore
      expect(content).toContain(task.actions[0].prepend);
    });
    it('should throw when android manifest does not exist', async () => {
      const task: StringsXmlTaskType = {
        task: 'strings_xml',
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
      ).rejects.toThrowError('strings.xml file not found');
    });
  });
});
