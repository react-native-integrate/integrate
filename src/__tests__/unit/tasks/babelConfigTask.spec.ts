const prettier = require('prettier');
const mockPrettierResolve = jest.spyOn(prettier, 'resolveConfig');
const mockPrettierFormat = jest.spyOn(prettier, 'format');
require('../../mocks/mockAll');

import path from 'path';
import { Constants } from '../../../constants';
import {
  babelConfigTask,
  babelParser,
  getReducedContext,
  runTask,
  shouldApplyInsertion,
} from '../../../tasks/babelConfigTask';
import { BabelConfigTaskType } from '../../../types/mod.types';
import { getProjectPath } from '../../../utils/getProjectPath';
import { mockFs } from '../../mocks/mockFs';

describe('babelConfigTask', () => {
  it('should modify blocks correctly', async () => {
    let content = `module.exports = {
  presets: ['item1', ['item2'], {'item3'}],
};
`;

    const task: BabelConfigTaskType = {
      task: 'babel_config',
      actions: [
        {
          block: 'presets',
          prepend: 'item0',
        },
        {
          block: 'presets',
          append: 'item4',
        },
        {
          block: 'presets',
          search: 'item2',
          replace: 'item21',
        },
      ],
    };
    content = await babelConfigTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content).toMatchInlineSnapshot(`
      "module.exports = {
        presets: ['item0', 'item1', 'item21', {'item3'}, 'item4'],
      };
      "
    `);
  });
  it('should skip when condition not met', async () => {
    const content = `module.exports = {
  presets: ['item1', ['item2'], {'item3'}],
};
`;

    const task: BabelConfigTaskType = {
      task: 'babel_config',
      actions: [
        {
          when: { random: 'value' },
          block: 'presets',
          prepend: 'item0',
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
  it('should throw when insertion point not found with strict', async () => {
    const content = `module.exports = {
  presets: ['item1', ['item2'], {'item3'}],
};
`;
    for (const criteria of ['before', 'after', 'search']) {
      const task: BabelConfigTaskType = {
        task: 'babel_config',
        actions: [
          {
            block: 'presets',
            [criteria]: 'item0',
            strict: true,
          },
        ],
      };
      await expect(
        babelConfigTask({
          configPath: 'path/to/config',
          task: task,
          content,
          packageName: 'test-package',
        })
      ).rejects.toThrowError('insertion point');
    }
  });
  describe('getReducedContext', () => {
    const array = ['item1', 'item2', 'item3'];
    it('should return correctly with before', () => {
      const result = getReducedContext(array, {
        before: 'item2',
      });
      expect(result).toMatchInlineSnapshot(`
        Array [
          0,
          1,
        ]
      `);
    });
    it('should return correctly with after', () => {
      const result = getReducedContext(array, {
        after: 'item2',
      });
      expect(result).toMatchInlineSnapshot(`
        Array [
          2,
          3,
        ]
      `);
    });
    it('should return correctly with search', () => {
      const result = getReducedContext(array, {
        search: 'item2',
      });
      expect(result).toMatchInlineSnapshot(`
        Array [
          1,
          2,
        ]
      `);
    });
    it('should ignore when criterias not found', () => {
      const result = getReducedContext(array, {
        before: 'random',
        after: 'random',
        search: 'random',
      });
      expect(result).toMatchInlineSnapshot(`
        Array [
          0,
          3,
        ]
      `);
    });
    it('should throw with strict', () => {
      expect(() =>
        getReducedContext(array, {
          search: 'random',
          strict: true,
        })
      ).toThrowError('insertion point');
    });
  });

  describe('shouldApplyInsertion', () => {
    const array = ['item1', 'item2', 'item3'];
    it('should return true', () => {
      const result = shouldApplyInsertion(
        array,
        {
          name: 'some name',
        },
        '4'
      );
      expect(result).toBeTruthy();
    });
    it('should return false when ifNotPresent exists', () => {
      const result = shouldApplyInsertion(
        array,
        {
          name: 'some name',
          ifNotPresent: 'item3',
        },
        'item4'
      );
      expect(result).toBeFalsy();
    });
    it('should return false when item exists', () => {
      const result = shouldApplyInsertion(
        array,
        {
          name: 'some name',
        },
        'item3'
      );
      expect(result).toBeFalsy();
    });
  });
  describe('babelParser', () => {
    it('should handle unexpected error', async () => {
      const babelConfig = `module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
};
`;
      const parsed = babelParser.parse(babelConfig);
      parsed.plugins.push('some plugin');
      parsed.presets.push('some preset');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      let prettierConfig = await prettier.resolveConfig(getProjectPath());
      if (!prettierConfig) prettierConfig = {};
      if (!prettierConfig.parser) prettierConfig.parser = 'babel';
      expect(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await prettier.format(babelParser.stringify(parsed), prettierConfig)
      ).toMatchInlineSnapshot(`
        "module.exports = {
          presets: ['module:metro-react-native-babel-preset', 'some preset'],
          plugins: ['some plugin'],
        };
        "
      `);
    });
    it('should throw with no exports', () => {
      const babelConfig = '';

      const parsed = babelParser.parse(babelConfig);
      parsed.presets.push('anything');
      expect(() => babelParser.stringify(parsed)).toThrowError('exports start');
    });
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
            prepend: 'require("somthing")',
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
        "require('somthing');
        module.exports = {
          presets: ['item1', 'item2', 'item3'],
        };
        "
      `);
    });
    it('should run prettier with default parser', async () => {
      const content = `module.exports = {
  presets: ['item1', 'item2', 'item3'],
};
`;
      mockPrettierResolve.mockReturnValueOnce(null);
      const babelConfigPath = path.resolve(
        __dirname,
        `../../mock-project/${Constants.BABEL_CONFIG_FILE_NAME}`
      );
      mockFs.writeFileSync(babelConfigPath, content);
      const task: BabelConfigTaskType = {
        task: 'babel_config',
        actions: [
          {
            prepend: 'require("somthing")',
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
            block: 'presets',
            prepend: 'item0;',
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
