/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

import path from 'path';
import { getProjectPath } from '../../../utils/getProjectPath';
import {
  getPackageUpgradeConfig,
  writePackageUpgradeConfig,
} from '../../../utils/packageUpgradeConfig';

describe('getPackageUpgradeConfig', () => {
  it('should handle invalid json', () => {
    const projectPath = getProjectPath();
    const upgradeJsonPath = path.join(
      projectPath,
      '.upgrade',
      'packages',
      'test-package',
      'upgrade.json'
    );
    mockFs.writeFileSync(upgradeJsonPath, 'invalid json');

    const result = getPackageUpgradeConfig('test-package');
    expect(result).toEqual({});
  });
});
describe('writePackageUpgradeConfig', () => {
  it('should handle invalid json', () => {
    const projectPath = getProjectPath();
    const upgradeJsonPath = path.join(
      projectPath,
      '.upgrade',
      'packages',
      'test-package',
      'upgrade.json'
    );
    mockFs.writeFileSync(upgradeJsonPath, 'invalid json');

    expect(() => writePackageUpgradeConfig('test-package', {})).not.toThrow();
  });
});
