require('../mocks/mockAll');

import { resolve } from 'path';
import * as process from 'process';
import { options } from '../../options';

process.argv.splice(0, process.argv.length);

describe('cli', () => {
  beforeEach(() => {
    options.get().manual = true;
  });
  it('should exist', () => {
    const mock = jest.spyOn(require('../../integrate'), 'integrate');
    const cli = require(resolve(__dirname, '../../cli'));

    expect(cli).toBeTruthy();
    expect(mock).toHaveBeenCalled();
  });
});
