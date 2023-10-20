/* eslint-disable @typescript-eslint/no-unsafe-call */

const { mockFs } = require('../../mocks/mockAll');

import path from 'path';
import { parseConfig } from '../../../utils/parseConfig';
import { mockIntegrateYml } from '../../mocks/mockIntegrateYml';

describe('parseConfig', () => {
  it('should parse yml file correctly', () => {
    const integrateYmlPath = path.resolve(
      __dirname,
      '../mock-project/node_modules/test-package/integrate.yml'
    );

    mockFs.writeFileSync(integrateYmlPath, mockIntegrateYml);
    const config = parseConfig(integrateYmlPath);
    expect(config).toBeTruthy();
  });
  it('should throw with incorrect yml file', () => {
    const integrateYmlPath = path.resolve(
      __dirname,
      '../mock-project/node_modules/test-package/integrate.yml'
    );

    mockFs.writeFileSync(
      integrateYmlPath,
      mockIntegrateYml.replace('app_delegate', 'random')
    );
    expect(() => {
      parseConfig(integrateYmlPath);
    }).toThrowError('must be equal to constant');
  });
});
