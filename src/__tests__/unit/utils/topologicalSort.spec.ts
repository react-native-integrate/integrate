/* eslint-disable @typescript-eslint/no-unsafe-call */

import { PackageWithConfig } from '../../../types/mod.types';
import { topologicalSort } from '../../../utils/topologicalSort';

describe('topologicalSort', () => {
  it('should sort by deps', () => {
    const packages: PackageWithConfig[] = [
      {
        packageName: 'y',
        configPath: 'path/to/config',
        config: {
          tasks: [],
          dependencies: ['x'],
        },
        version: '1.2.3',
      },
      {
        packageName: 'x',
        configPath: 'path/to/config',
        config: {
          tasks: [],
        },
        version: '1.2.3',
      },
    ];
    expect(topologicalSort(packages)[0].packageName).toEqual('x');
  });
});
