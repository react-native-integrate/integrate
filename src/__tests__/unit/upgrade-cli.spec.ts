require('../mocks/mockAll');

import { resolve } from 'path';
import * as process from 'process';

process.argv.splice(0, process.argv.length);

describe('upgrade-cli', () => {
  it('should exist', () => {
    const mock = jest.spyOn(require('../../upgrade'), 'upgrade');
    const cli = require(resolve(__dirname, '../../upgrade-cli'));

    expect(cli).toBeTruthy();
    expect(mock).toHaveBeenCalled();
  });
});
