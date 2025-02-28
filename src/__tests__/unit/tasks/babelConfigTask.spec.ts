import prettier from 'prettier';

const mockPrettierResolve = jest.spyOn(prettier, 'resolveConfig');
const mockPrettierFormat = jest.spyOn(prettier, 'format');
require('../../mocks/mockAll');

import path from 'path';
import { Constants } from '../../../constants';
import { babelConfigTask, runTask } from '../../../tasks/babelConfigTask';
import { BabelConfigTaskType } from '../../../types/mod.types';
import { JsObjectParser } from '../../../utils/jsObjectParser';
import { mockFs } from '../../mocks/mockFs';

describe('babelConfigTask', () => {
  it('should modify blocks correctly', async () => {
    let content = new JsObjectParser(`module.exports = {
  presets: ['item1', ['item2'], {'item3'}],
};
`);

    const task: BabelConfigTaskType = {
      task: 'babel_config',
      actions: [
        {
          set: {
            presets: [{ $prepend: 'item0' }],
          },
        },
        {
          set: {
            presets: ['item4'],
          },
        },
        {
          set: {
            presets: [{ $search: 'item2', $replace: 'item21' }],
          },
        },
        {
          mode: 'text',
          prepend: 'require("something");',
        },
      ],
    };
    content = await babelConfigTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.stringify()).toMatchInlineSnapshot(`
      "require("something");
      module.exports = {
        presets: ["item0", 'item1', "item21", {'item3'}, "item4"],
      };
      "
    `);
  });
  it('should skip when condition not met', async () => {
    const content = new JsObjectParser(`module.exports = {
  presets: ['item1', ['item2'], {'item3'}],
};
`);

    const task: BabelConfigTaskType = {
      task: 'babel_config',
      actions: [
        {
          when: { random: 'value' },
          set: {
            presets: [{ $prepend: 'item0' }],
          },
        },
      ],
    };
    const newContent = await babelConfigTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(newContent).toEqual(content);
  });

  describe('runTask', () => {
    it('should read and write babel config file', async () => {
      let content = `module.exports = {
  presets: ['item1', 'item2', 'item3'],
};
`;
      const babelConfigPath = path.resolve(
        __dirname,
        `../../mock-project/${Constants.BABEL_CONFIG_FILE_NAME}`
      );
      mockFs.writeFileSync(babelConfigPath, content);
      const task: BabelConfigTaskType = {
        task: 'babel_config',
        actions: [
          {
            set: {
              presets: ['test'],
            },
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      content = mockFs.readFileSync(babelConfigPath);
      // @ts-ignore
      expect(content).toMatchInlineSnapshot(`
        "module.exports = {
          presets: ['item1', 'item2', 'item3', 'test'],
        };
        "
      `);
    });
    it('should run prettier with default parser', async () => {
      const content = `module.exports = {
  presets: ['item1', 'item2', 'item3'],
};
`;
      mockPrettierResolve.mockResolvedValueOnce(null);
      const babelConfigPath = path.resolve(
        __dirname,
        `../../mock-project/${Constants.BABEL_CONFIG_FILE_NAME}`
      );
      mockFs.writeFileSync(babelConfigPath, content);
      const task: BabelConfigTaskType = {
        task: 'babel_config',
        actions: [
          {
            set: {
              presets: ['test'],
            },
          },
        ],
      };

      await runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });

      expect(mockPrettierFormat).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          parser: 'babel',
        })
      );
    });
    it('should throw when babel config does not exist', async () => {
      const task: BabelConfigTaskType = {
        task: 'babel_config',
        actions: [
          {
            set: {
              presets: [{ $prepend: 'item0' }],
            },
          },
        ],
      };

      await expect(
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('babel.config.js file not found');
    });
  });
});
