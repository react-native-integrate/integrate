import { findLineEnd, findLineStart } from '../../../utils/findLineTools';

describe('findLineStart', () => {
  it('should get line start', () => {
    const index = findLineStart('0\n234\n6', 4);
    expect(index).toBe(2);
  });
  it('should get line start with min index', () => {
    const index = findLineStart('0\n234\n6', 4, 3);
    expect(index).toBe(3);
  });
  it('should get line end', () => {
    const index = findLineEnd('0\n234\n6', 2);
    expect(index).toBe(5);
  });
  it('should get line end with max index', () => {
    const index = findLineEnd('0\n234\n6', 2, 3);
    expect(index).toBe(3);
  });
});
