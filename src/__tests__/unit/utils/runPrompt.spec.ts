/* eslint-disable @typescript-eslint/no-unsafe-call */

import { getValidate } from '../../../utils/runPrompt';

describe('getValidate', () => {
  it('should get success validation fn', () => {
    const fn = getValidate([
      {
        regex: '.*test.*',
        message: 'must contain test',
      },
    ]);
    expect(fn).not.toBeUndefined();
    if (!fn) return;

    expect(fn('random test random')).toBeUndefined();
  });
  it('should get failed validation fn', () => {
    const fn = getValidate([
      {
        regex: '.*test.*',
        message: 'must contain test',
      },
    ]);
    expect(fn).not.toBeUndefined();
    if (!fn) return;

    expect(fn('random')).toBe('must contain test');
  });
  it('should handle undefined', () => {
    const fn = getValidate(undefined);
    expect(fn).toBeUndefined();
  });
});
