/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs, writeMockProject } = require('../../mocks/mockAll');
import { getInstalledPackages } from '../../../utils/getInstalledPackages';

describe('getInstalledPackages', () => {
  it('should get installed packages', () => {
    const installedPackages = getInstalledPackages();
    expect(installedPackages).toBeTruthy();
    expect(installedPackages).toContainEqual(['mock-package', '^1.2.3']);
  });
  it('should work with zero dependencies', () => {
    writeMockProject({
      name: 'mock-project',
      version: '0.0.0',
      description: 'Mock project',
    });

    const installedPackages = getInstalledPackages();
    expect(installedPackages).toBeTruthy();
    expect(installedPackages).toEqual([]);
  });
  it('should return an empty array if there is no package.json', () => {
    mockFs.reset();
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-empty-function

    expect(() => {
      getInstalledPackages();
    }).toThrowError('program exited');
  });
});
