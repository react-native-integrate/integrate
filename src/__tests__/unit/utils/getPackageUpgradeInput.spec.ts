/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');

import { handlePackageUpgradeInput } from '../../../utils/getPackageUpgradeInput';
import { writePackageUpgradeConfig } from '../../../utils/packageUpgradeConfig';
import { variables } from '../../../variables';

describe('handlePackageUpgradeInput', () => {
  it('should set variable correctly', () => {
    variables.set('__UPGRADE__', true);
    writePackageUpgradeConfig('test-package', {
      inputs: {
        testInput: 'testValue',
      },
    });
    const result = handlePackageUpgradeInput('test-package', 'testInput');
    expect(result).toBe(true);
    expect(variables.get('testInput')).toBe('testValue');
  });
});
