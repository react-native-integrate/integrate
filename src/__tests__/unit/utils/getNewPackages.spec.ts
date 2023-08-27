/* eslint-disable @typescript-eslint/no-unsafe-call */

const { writeMockLock } = require('../../mocks/mockAll');
import { Constants } from '../../../constants';
import { getNewPackages } from '../../../utils/getNewPackages';

describe('getNewPackages', () => {
  it('should get new packages', () => {
    const installedPackages = getNewPackages();
    expect(installedPackages).toBeTruthy();
    expect(installedPackages).toContainEqual(['mock-package', '^1.2.3']);
  });
  it('should not get integrated packages', () => {
    writeMockLock({
      lockfileVersion: Constants.CURRENT_LOCK_VERSION,
      packages: {
        'mock-package': {
          version: '^1.2.3',
          integrated: true,
        },
      },
    });
    const installedPackages = getNewPackages();
    expect(installedPackages).toBeTruthy();
    expect(installedPackages).toEqual([]);
  });
});
