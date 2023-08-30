require('../mocks/mockAll');

import { resolve } from 'path';
import * as process from 'process';

process.argv.splice(0, process.argv.length);

describe('cli', () => {
  it('should exist', () => {
    const mock = jest.spyOn(require('../../integrate'), 'integrate');
    const cli = require(resolve(__dirname, '../../cli'));

    expect(cli).toBeTruthy();
    expect(mock).toHaveBeenCalled();
  });
});
