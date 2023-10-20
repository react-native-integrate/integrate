/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

const mockObjectEntries = jest.spyOn(Object, 'entries');

import { jsonTask, runTask } from '../../../tasks/jsonTask';
import { JsonTaskType } from '../../../types/mod.types';
import { writeMockJson } from '../../mocks/mockAll';

describe('jsonTask', () => {
  it('should set value', () => {
    // noinspection SpellCheckingInspection
    let content: Record<string, any> = {
      test: 'value',
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            test2: 'value2',
          },
        },
      ],
    };
    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.test2).toEqual('value2');
  });
  it('should assign value', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              assigned: 'test2',
            },
          },
          strategy: 'assign',
        },
      ],
    };
    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first).toEqual({
      assigned: 'test2',
    });
  });
  it('should append value if not exists', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              assigned: 'test2',
            },
            forth: {
              foo: 'bar',
            },
          },
          strategy: 'append',
        },
      ],
    };
    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first).toEqual({
      second: {
        third: 'test',
      },
    });
    expect(content.forth).toEqual({
      foo: 'bar',
    });
  });
  it('should merge value', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
        other: ['test'],
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              assigned: 'test2',
              other: ['test2'],
            },
          },
          strategy: 'merge',
        },
      ],
    };
    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first).toEqual({
      second: {
        third: 'test',
      },
      assigned: 'test2',
      other: ['test2'],
    });
  });
  it('should merge and concat value', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
        other: ['test'],
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              assigned: 'test2',
              other: ['test', 'test2'],
            },
          },
          strategy: 'merge_concat',
        },
      ],
    };
    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first).toEqual({
      second: {
        third: 'test',
      },
      assigned: 'test2',
      other: ['test', 'test', 'test2'],
    });
  });
  it('should merge distinct values', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
        other: [{ test: 1 }],
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              assigned: 'test2',
              other: [{ test: 1 }, { test2: 1 }],
            },
          },
          strategy: 'merge_distinct',
        },
      ],
    };
    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first).toEqual({
      second: {
        third: 'test',
      },
      assigned: 'test2',
      other: [{ test: 1 }, { test2: 1 }],
    });
  });
  it('should assign inner value', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              second: {
                assigned: 'test2',
                other: ['test2'],
                $assign: true,
              },
            },
          },
          strategy: 'merge_concat',
        },
      ],
    };

    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first.second).toEqual({
      assigned: 'test2',
      other: ['test2'],
    });
  });
  it('should append inner value if it is new', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              second: {
                assigned: 'test2',
                $append: true,
              },
            },
          },
          strategy: 'merge_concat',
        },
      ],
    };

    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first.second).toEqual({
      third: 'test',
    });
  });
  it('should set index value', () => {
    let content: Record<string, any> = {
      first: {
        second: [{ third: 'test' }, { forth: 'test2' }],
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              second: {
                $index: 0,
                assigned: 'test2',
              },
            },
          },
          strategy: 'merge_concat',
        },
      ],
    };

    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first.second).toEqual([
      { third: 'test', assigned: 'test2' },
      { forth: 'test2' },
    ]);
  });
  it('should skip if condition not met', () => {
    let content: Record<string, any> = {
      first: {
        second: [{ third: 'test' }, { forth: 'test2' }],
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          when: { test: 'random' },
          set: {
            first: {
              second: {
                $index: 0,
                assigned: 'test2',
              },
            },
          },
          strategy: 'merge_concat',
        },
      ],
    };

    content = jsonTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first.second).not.toEqual([
      { third: 'test', assigned: 'test2' },
      { forth: 'test2' },
    ]);
  });
  it('should throw on random error', () => {
    mockObjectEntries.mockImplementationOnce(() => {
      throw new Error('some random error');
    });

    const content: Record<string, any> = {
      first: {
        second: [{ third: 'test' }, { forth: 'test2' }],
      },
    };
    const task: JsonTaskType = {
      type: 'json',
      path: 'test.json',
      actions: [
        {
          set: {
            first: {
              second: {
                $index: 0,
                assigned: 'test2',
              },
            },
          },
          strategy: 'merge_concat',
        },
      ],
    };

    expect(() =>
      jsonTask({
        configPath: 'path/to/config',
        task: task,
        content,
        packageName: 'test-package',
      })
    ).toThrowError('random error');
    jest.unmock('lodash.mergewith');
  });

  describe('runTask', () => {
    it('should read and write json file', () => {
      const jsonPath = writeMockJson();
      const task: JsonTaskType = {
        type: 'json',
        path: 'test.json',
        actions: [
          {
            set: {
              test2: 'value2',
            },
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(jsonPath);
      expect(content).toContain('test2');
    });
    it('should read and write json file of custom target', () => {
      const jsonPath = writeMockJson('custom.json');
      const task: JsonTaskType = {
        type: 'json',
        path: 'custom.json',
        actions: [
          {
            set: {
              test2: 'value2',
            },
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(jsonPath);
      expect(content).toContain('test2');
    });
    it('should not throw when json does not exist', () => {
      const task: JsonTaskType = {
        type: 'json',
        path: 'test.json',
        actions: [
          {
            set: {
              CFBundleDisplayName: 'test2',
            },
          },
        ],
      };

      expect(() => {
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        });
      }).not.toThrow();
    });
    it('should throw when path is out of project', () => {
      const task: JsonTaskType = {
        type: 'json',
        path: '../somewhere/test.json',
        actions: [
          {
            set: {
              CFBundleDisplayName: 'test2',
            },
          },
        ],
      };

      expect(() => {
        runTask({
          configPath: 'path/to/config',
          task: task,
          packageName: 'test-package',
        });
      }).toThrowError('invalid destination path');
    });
  });
});
