require('../mocks/mockAll');
const mockSpawn = jest.spyOn(require('child_process'), 'spawn');

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
    mockSpawn.mockImplementationOnce(() => ({
      on: (_event: string, cb: (exitCode: number) => void) => {
        cb(0);
      },
      stdout: {
        on: (_event: string, cb: (...args: any[]) => void) => {
          cb('stdout');
        },
      },
      stderr: {
        on: (_event: string, cb: (...args: any[]) => void) => {
          cb('stderr');
        },
      },
    }));
    const mock = jest.spyOn(require('../../upgrade'), 'upgrade');
    const cli = require(resolve(__dirname, '../../upgrade-cli'));

    expect(cli).toBeTruthy();
    expect(mock).toHaveBeenCalled();
  });
});
