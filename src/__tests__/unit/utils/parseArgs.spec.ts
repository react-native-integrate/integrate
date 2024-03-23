/* eslint-disable @typescript-eslint/no-unsafe-call */

require('../../mocks/mockAll');

import { parseArgs } from '../../../utils/parseArgs';

describe('parseArgs', () => {
  it('should parse args correctly', () => {
    const args = parseArgs('arg1 "arg2 arg3" arg4');
    expect(args).toEqual(['arg1', 'arg2 arg3', 'arg4']);
  });
  it('should parse escaped args correctly', () => {
    const args = parseArgs('arg1 "arg\\"2 a\\"rg3"');
    expect(args).toEqual(['arg1', 'arg"2 a"rg3']);
  });
});
