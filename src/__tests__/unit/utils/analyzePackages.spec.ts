/* eslint-disable @typescript-eslint/no-unsafe-call */

const { writeMockLock } = require('../../mocks/mockAll');
import { Constants } from '../../../constants';
import { analyzePackages } from '../../../utils/analyzePackages';

describe('analyzePackages', () => {
  it('should get new packages', () => {
    const { newPackages } = analyzePackages();
    expect(newPackages).toBeTruthy();
    expect(newPackages).toContainEqual(['mock-package', '^1.2.3']);
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
    const { newPackages } = analyzePackages();
    expect(newPackages).toBeTruthy();
    expect(newPackages).toEqual([]);
  });
});
