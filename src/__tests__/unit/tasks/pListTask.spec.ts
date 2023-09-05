/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');
import { plistTask, runTask } from '../../../tasks/plistTask';
import { PlistTaskType } from '../../../types/mod.types';
import { writeMockPList } from '../../mocks/mockAll';

describe('pListTask', () => {
  it('should set value', () => {
    // noinspection SpellCheckingInspection
    let content: Record<string, any> = {
      CFBundleName: 'test',
      CFBundlePackageType: 'APPL',
      CFBundleShortVersionString: '1.2.3',
      CFBundleSignature: 'test',
      CFBundleVersion: '1.2.3',
    };
    const task: PlistTaskType = {
      type: 'plist',
      updates: [
        {
          set: {
            CFBundleName: 'test2',
          },
        },
      ],
    };
    content = plistTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.CFBundleName).toEqual('test2');
  });
  it('should assign value', () => {
    let content: Record<string, any> = {
      first: {
        second: {
          third: 'test',
        },
      },
    };
    const task: PlistTaskType = {
      type: 'plist',
      updates: [
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
    content = plistTask({
      configPath: 'path/to/config',
      task: task,
      content,
      packageName: 'test-package',
    });
    expect(content.first).toEqual({
      assigned: 'test2',
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
    const task: PlistTaskType = {
      type: 'plist',
      updates: [
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
    content = plistTask({
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
    const task: PlistTaskType = {
      type: 'plist',
      updates: [
        {
          set: {
            first: {
              assigned: 'test2',
              other: ['test2'],
            },
          },
          strategy: 'merge_concat',
        },
      ],
    };
    content = plistTask({
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
      other: ['test', 'test2'],
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
    const task: PlistTaskType = {
      type: 'plist',
      updates: [
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

    content = plistTask({
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
  it('should set index value', () => {
    let content: Record<string, any> = {
      first: {
        second: [{ third: 'test' }, { forth: 'test2' }],
      },
    };
    const task: PlistTaskType = {
      type: 'plist',
      updates: [
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

    content = plistTask({
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

  describe('runTask', () => {
    it('should read and write plist file', () => {
      const pListPath = writeMockPList();
      const task: PlistTaskType = {
        type: 'plist',
        updates: [
          {
            set: {
              CFBundleDisplayName: 'test2',
            },
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(pListPath);
      expect(content).toContain('test2');
    });
    it('should read and write plist file of custom target', () => {
      const pListPath = writeMockPList('custom');
      const task: PlistTaskType = {
        type: 'plist',
        target: 'custom',
        updates: [
          {
            set: {
              CFBundleDisplayName: 'test2',
            },
          },
        ],
      };

      runTask({
        configPath: 'path/to/config',
        task: task,
        packageName: 'test-package',
      });
      const content = mockFs.readFileSync(pListPath);
      expect(content).toContain('test2');
    });
    it('should throw when plist does not exist', () => {
      const task: PlistTaskType = {
        type: 'plist',
        updates: [
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
      }).toThrowError('Plist file not found');
    });
    it('should throw when workspace does not exist', () => {
      const mock = jest.spyOn(mockFs, 'readdirSync').mockImplementation(() => {
        throw new Error('Directory not found');
      });
      const task: PlistTaskType = {
        type: 'plist',
        updates: [
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
      }).toThrowError('workspace not found');
      mock.mockRestore();
    });
  });
});
