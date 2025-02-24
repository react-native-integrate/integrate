require('../mocks/mockAll');

import { resolve } from 'path';
import * as process from 'process';
import { options } from '../../options';

process.argv.splice(0, process.argv.length);

describe('upgrade-cli', () => {
  it('should exist', () => {
    options.get = jest.fn(() => ({
      debug: false,
      manual: true,
    }));
    const mock = jest.spyOn(require('../../upgrade'), 'upgrade');
    const cli = require(resolve(__dirname, '../../upgrade-cli'));

    expect(cli).toBeTruthy();
    expect(mock).toHaveBeenCalled();
  });
});
