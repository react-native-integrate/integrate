require('../mocks/mockAll');

import { resolve } from 'path';
import * as process from 'process';

process.argv.splice(0, process.argv.length);

describe('cli', () => {
  it('should exist', () => {
    const mockIntegrate = {
      integrate: jest.fn(),
    };
    const mock = jest.mock('../../integrate', () => mockIntegrate);
    const cli = require(resolve(__dirname, '../../cli'));

    expect(cli).toBeTruthy();
    expect(mockIntegrate.integrate).toHaveBeenCalled();
    mock.restoreAllMocks();
  });
});
