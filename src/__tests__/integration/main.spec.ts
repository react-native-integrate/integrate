require('../mocks/mockAll');

import execa from 'execa';
import { resolve } from 'path';

const bin = resolve(__dirname, './bin.js');

describe('integrate', () => {
  it('should display the help contents', async () => {
    const { stdout } = await execa(bin, ['--help']);

    expect(stdout).toContain('Usage: integrate [options]');
  });
});
