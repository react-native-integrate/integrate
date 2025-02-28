/* eslint-disable @typescript-eslint/no-unsafe-call */

import prettier from 'prettier';
import { getProjectPath } from '../../../utils/getProjectPath';
import { JsObjectParser } from '../../../utils/jsObjectParser';

describe('jsObjectParser', () => {
  let prettierConfig: any;
  beforeAll(async () => {
    prettierConfig = await prettier.resolveConfig(getProjectPath());
    if (!prettierConfig) prettierConfig = {};
    if (!prettierConfig.parser) prettierConfig.parser = 'babel';
  });
  it('should merge spread', async () => {
    const content =
      "module.exports = { extend: ['ok', ...some, 1], addobj: {}, addarr: [], overarr: 1, overobj: [] };";
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        newpri: 3,
        newobj: { yep: ['yes'] },
        extend: [2, { ok: 1 }],
        addobj: {
          new: 1,
        },
        addarr: ['new'],
        overarr: [1],
        overobj: { over: 'ok' },
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = {
        extend: ['ok', ...some, 1, 2, { ok: 1 }],
        addobj: { new: 1 },
        addarr: ['new'],
        overarr: [1],
        overobj: { over: 'ok' },
        newpri: 3,
        newobj: { yep: ['yes'] },
      };
      "
    `);
  });
  it('should insert', async () => {
    const content = 'module.exports = { test: [4] };';
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge(
      {
        'module.exports': {
          test: [0, 1],
        },
      },
      { insert: 0 }
    );
    parser.merge(
      {
        'module.exports': {
          test: [2],
        },
      },
      { insert: 2 }
    );
    parser.merge(
      {
        'module.exports': {
          test: [3],
        },
      },
      { insert: 3 }
    );
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = { test: [0, 1, 2, 3, 4] };
      "
    `);
  });
  it('should merge assign', async () => {
    const content =
      "module.exports = { ok: 1, test: [4], obj: {t1: {t2: ''}}, obj2: {t1: 1} };";
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge(
      {
        'module.exports': {
          test: [0, 1],
          obj: { clear: true },
          obj2: { t1: { t2: '' } },
        },
      },
      { strategy: 'assign' }
    );
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = {
        ok: 1,
        test: [0, 1],
        obj: { clear: true },
        obj2: { t1: { t2: '' } },
      };
      "
    `);
  });
  it('should support partial', async () => {
    const content = "module.exports = { obj2: {t1: {t2: ''}, t3: 1 }};";
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        obj2: { t1: { $assignTo: { t3: '' } } },
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = { obj2: { t1: { t3: '' }, t3: 1 } };
      "
    `);
  });
  it('should force assign', async () => {
    const content = "module.exports = { obj2: {t1: {t2: ''}, t3: 1 }};";
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        obj2: { t1: { $assignTo: { t3: '' } } },
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = { obj2: { t1: { t3: '' }, t3: 1 } };
      "
    `);
  });
  it('should force delete', async () => {
    const content = "module.exports = { obj2: {t1: {t2: ''}, t3: 1 }};";
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        obj2: { t1: { $delete: true } },
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = { obj2: { t3: 1 } };
      "
    `);
  });
  it('should merge', async () => {
    const content = "module.exports = { obj: [[['test']]]};";
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        obj: [[['test']]],
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = { obj: [[['test']], [['test']]] };
      "
    `);
  });
  it('should search replace array', async () => {
    const content = "module.exports = { arr: ['one', ['_two_'], 'three']};";
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        arr: [{ $search: 'two', $replace: 'gone' }],
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = { arr: ['one', 'gone', 'three'] };
      "
    `);
  });
  it('should search delete in array', async () => {
    const content = `module.exports = { 
    arr: ['one', ['_two_'], 'three'],
    arr2: ['one', ['_two_'], 'three'],
    arr3: ['one', ['_two_'], 'three'],
    arr4: ['one', ['_two_'], 'three', 'four'],
    arr5: ['one', ['_two_'], 'three', 'four'],
    arr6: ['one', ['_two_'], 'three', 'four'],
    arr7: ['one', ['_two_'], 'three', 'four'],
    arr8: ['one', ['_two_'], 'three', 'four'],
    arr9: ['one', ['_two_'], 'three', 'four'],
    };`;
    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        arr: [{ $search: 'two', $delete: true }],
        arr2: [{ $search: 'one', $delete: true }],
        arr3: [{ $search: 'three', $delete: true }],
        arr4: [{ $before: 'one', $delete: true }],
        arr5: [{ $after: 'two', $delete: true }],
        arr6: [{ $before: 'two', $prepend: 'zero' }],
        arr7: [{ $before: 'two', $append: 'zero' }],
        arr8: [{ $after: 'two', $prepend: 'five' }],
        arr9: [{ $after: 'two', $append: 'five' }],
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = {
        arr: ['one', 'three'],
        arr2: [['_two_'], 'three'],
        arr3: ['one', ['_two_']],
        arr4: ['one', ['_two_'], 'three', 'four'],
        arr5: ['one', ['_two_']],
        arr6: ['zero', 'one', ['_two_'], 'three', 'four'],
        arr7: ['one', 'zero', ['_two_'], 'three', 'four'],
        arr8: ['one', ['_two_'], 'five', 'three', 'four'],
        arr9: ['one', ['_two_'], 'three', 'four', 'five'],
      };
      "
    `);
  });
  it('should match content with wrapper', async () => {
    const content = `module.exports = wrapper( wrapper2({
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    'react-native-reanimated/plugin',
  ],
}));
`;

    const parser = new JsObjectParser();
    parser.parse(content);
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = wrapper(
        wrapper2({
          presets: ['module:metro-react-native-babel-preset'],
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            'react-native-reanimated/plugin',
          ],
        })
      );
      "
    `);
  });
  it('should match content with other objects', async () => {
    const content = `
    const someUnused = { test: 1, some: true }
    
    module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', {legacy: true}],
    'react-native-reanimated/plugin',
  ],
};
`;

    const parser = new JsObjectParser();
    parser.parse(content);
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "const someUnused = { test: 1, some: true };

      module.exports = {
        presets: ['module:metro-react-native-babel-preset'],
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          'react-native-reanimated/plugin',
        ],
      };
      "
    `);
  });
  it('should match content', async () => {
    const content = `
    const someFunction = () => {};
    module.exports = {
    };
`;

    const parser = new JsObjectParser();
    parser.parse(content);
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "const someFunction = () => {};
      module.exports = {};
      "
    `);
  });
  it('should multiple merge work', async () => {
    const content = `
    module.exports = {
    };
`;

    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        env: { plugins: ['test'] },
      },
    });
    parser.merge({
      'module.exports': {
        env: { plugins: ['test2'] },
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = {
        env: { plugins: ['test', 'test2'] },
      };
      "
    `);
  });
  it('should not conflict', async () => {
    const content = `
    const someFunction = sth({one: 1}, {two: 2});
    module.exports = {
    };
`;

    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      someFunction: {
        ok: 2,
      },
      'module.exports': {
        newpri: 3,
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "const someFunction = sth({ one: 1, ok: 2 }, { two: 2 });
      module.exports = {
        newpri: 3,
      };
      "
    `);
  });
  it('should merge property', async () => {
    const content = `
    module.exports = {
    };
`;

    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        test: true,
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = {
        test: true,
      };
      "
    `);
  });
  it('should merge array', async () => {
    const content = `module.exports = {
    plugins: [
          { __$raw: 'require.resolve("anything")' },
          'replace_me'
        ],
}`;

    const parser = new JsObjectParser();
    parser.parse(content);
    parser.merge({
      'module.exports': {
        plugins: [
          {
            $search: 'replace_me',
            $replace: { __$raw: 'require.resolve("replaced")' },
          },
        ],
        env: {
          development: {
            plugins: ['react-native-some/plugin'],
          },
        },
      },
    });
    parser.merge({
      'module.exports': {
        plugins: [
          { __$raw: 'require.resolve("some")' },
          { root: ['./'], alias: { app: './app' } },
        ],
        env: {
          development: {
            plugins: ['react-native-some/plugin'],
          },
        },
      },
    });
    expect(await prettier.format(parser.stringify(), prettierConfig))
      .toMatchInlineSnapshot(`
      "module.exports = {
        plugins: [
          require.resolve('anything'),
          require.resolve('replaced'),
          require.resolve('some'),
          { root: ['./'], alias: { app: './app' } },
        ],
        env: {
          development: {
            plugins: ['react-native-some/plugin', 'react-native-some/plugin'],
          },
        },
      };
      "
    `);
  });
});
