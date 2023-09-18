/* eslint-disable @typescript-eslint/no-unsafe-call */

import { satisfies } from '../../../utils/satisfies';

describe('satisfies', () => {
  it('should satisfy null', () => {
    expect(satisfies(null, null)).toBe(true);
  });
  it('should satisfy undefined', () => {
    expect(satisfies(undefined, undefined)).toBe(true);
  });
  it('should satisfy undefined field', () => {
    expect(satisfies({ test: undefined }, { test: undefined })).toBe(true);
  });
  it('should partially satisfy field', () => {
    expect(satisfies({ test: 1, test2: 2 }, { test: 1 })).toBe(true);
  });
  it('should deep equal', () => {
    expect(
      satisfies(
        { test: { test2: { test3: 1, test4: [1, 2, 3] } } },
        { test: { $eq: { test2: { test3: 1, test4: [1, 2, 3] } } } }
      )
    ).toBe(true);
  });
  it('should not deep equal when array different', () => {
    expect(
      satisfies(
        { test: { test2: { test3: 1, test4: [1, 2, { x: 1 }] } } },
        { test: { $eq: { test2: { test3: 1, test4: [1, 2, { x: 2 }] } } } }
      )
    ).toBe(false);
  });
  it('should not deep equal when array size different', () => {
    expect(
      satisfies(
        { test: { test2: { test3: 1, test4: [1, 2, { x: 1 }] } } },
        { test: { $eq: { test2: { test3: 1, test4: [1, 2] } } } }
      )
    ).toBe(false);
  });
  it('should not deep equal when one side is not array', () => {
    expect(
      satisfies(
        { test: { test2: { test3: 1, test4: [1, 2, { x: 1 }] } } },
        { test: { $eq: { test2: { test3: 1, test4: { x: 1 } } } } }
      )
    ).toBe(false);
  });
  it('should not deep equal when keys do not match', () => {
    expect(
      satisfies(
        { test: { test2: { test3: 1, test4: [1, 2, { x: 1 }] } } },
        { test: { $eq: { test2: { test3: 1, test7: [1, 2, { x: 2 }] } } } }
      )
    ).toBe(false);
  });
  it('should not deep equal when key size different', () => {
    expect(
      satisfies(
        { test: { test2: { test3: 1, test4: [1, 2, { x: 1 }] } } },
        { test: { $eq: { test2: { test3: 1 } } } }
      )
    ).toBe(false);
  });
  it('should not satisfy primitive - object', () => {
    expect(satisfies(1, { x: 1 })).toBe(false);
  });
  it('should not satisfy object - primitive', () => {
    expect(satisfies({ x: 1 }, 1)).toBe(false);
  });
  it('should satisfy array - object', () => {
    expect(satisfies([{ x: 1 }, { x: 2 }, { x: 3 }], { x: 1 })).toBe(true);
  });
  it('should satisfy array - array', () => {
    expect(satisfies([{ x: 1 }, { x: 2 }], [{ x: 1 }, { x: 2 }])).toBe(true);
  });
  it('should satisfy array - primitive', () => {
    expect(satisfies([1, 2, 3], 1)).toBe(true);
  });
  it('should not satisfy non array - array', () => {
    expect(satisfies(1, [1, 2, 3])).toBe(false);
  });

  describe('common operands', () => {
    it('should satisfy $eq', () => {
      expect(satisfies({ test: 1, test2: 2 }, { test: { $eq: 1 } })).toBe(true);
    });
    it('should satisfy $not', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { test: { $not: { $eq: 2 } } })
      ).toBe(true);
    });
    it('should not satisfy $not', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { test: { $not: { $eq: 1 } } })
      ).toBe(false);
    });
    it('should not satisfy $ne', () => {
      expect(satisfies({ test: 1, test2: 2 }, { test: { $ne: 1 } })).toBe(
        false
      );
    });
    it('should satisfy $and', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { $and: [{ test: 1 }, { test2: 2 }] })
      ).toBe(true);
    });
    it('should satisfy $and as object', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { $and: { test: 1, test2: 2 } })
      ).toBe(true);
    });
    it('should not satisfy $and', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { $and: [{ test: 1 }, { test2: 3 }] })
      ).toBe(false);
    });
    it('should satisfy $or', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { $or: [{ test: 1 }, { test2: 3 }] })
      ).toBe(true);
    });
    it('should satisfy $or as object', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { $or: { test: 1, test2: 3 } })
      ).toBe(true);
    });
    it('should not satisfy $or', () => {
      expect(
        satisfies({ test: 1, test2: 2 }, { $or: [{ test: 4 }, { test2: 3 }] })
      ).toBe(false);
    });
    it('should not satisfy $or when null', () => {
      expect(satisfies({ test: 1, test2: 2 }, { $or: null })).toBe(false);
    });
  });

  describe('array operands', () => {
    it('should satisfy $elemMatch', () => {
      expect(
        satisfies(
          {
            test: [
              { x: 1, y: 1 },
              { x: 2, y: 1 },
            ],
          },
          { test: { $elemMatch: { x: 2 } } }
        )
      ).toBe(true);
    });
    it('should not satisfy $elemMatch', () => {
      expect(
        satisfies(
          {
            test: [
              { x: 1, y: 1 },
              { x: 2, y: 1 },
            ],
          },
          { test: { $elemMatch: { x: 4 } } }
        )
      ).toBe(false);
    });
    it('should satisfy $all', () => {
      expect(
        satisfies(
          {
            test: [
              { x: 1, y: 1 },
              { x: 2, y: 1 },
            ],
          },
          { test: { $all: { y: 1 } } }
        )
      ).toBe(true);
    });
    it('should satisfy $all with array', () => {
      expect(
        satisfies(
          {
            test: [1, 2],
          },
          { test: { $all: [1, 2] } }
        )
      ).toBe(true);
    });
    it('should not satisfy $all with array', () => {
      expect(
        satisfies(
          {
            test: [1, 2],
          },
          { test: { $all: [1, 2, 3] } }
        )
      ).toBe(false);
    });
    it('should satisfy $any', () => {
      expect(
        satisfies(
          {
            test: [
              { x: 1, y: 1 },
              { x: 2, y: 1 },
            ],
          },
          { test: { $any: { x: 1 } } }
        )
      ).toBe(true);
    });
    it('should satisfy $any with array', () => {
      expect(
        satisfies(
          {
            test: [1, 2],
          },
          { test: { $any: [1, 2, 3] } }
        )
      ).toBe(true);
    });
    it('should not satisfy $any with array', () => {
      expect(
        satisfies(
          {
            test: [1, 2],
          },
          { test: { $any: [4, 3] } }
        )
      ).toBe(false);
    });
    it('should satisfy $size', () => {
      expect(
        satisfies(
          {
            test: [
              { x: 1, y: 1 },
              { x: 2, y: 1 },
            ],
          },
          { test: { $size: 2 } }
        )
      ).toBe(true);
    });
    it('should not satisfy $size', () => {
      expect(
        satisfies(
          {
            test: [
              { x: 1, y: 1 },
              { x: 2, y: 1 },
            ],
          },
          { test: { $size: 3 } }
        )
      ).toBe(false);
    });
    it('should not satisfy $size, $all, $elemMatch when null', () => {
      expect(
        satisfies(
          {
            test: null,
          },
          { test: { $size: 3, $elemMatch: { x: 1 }, $all: { x: 1 } } }
        )
      ).toBe(false);
    });
  });

  describe('non array operands', () => {
    it('should not satisfy $gt', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $gt: 1 } } }
        )
      ).toBe(false);
    });
    it('should satisfy $gte', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $gte: 1 } } }
        )
      ).toBe(true);
    });
    it('should not satisfy $gte', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $gte: 2 } } }
        )
      ).toBe(false);
    });
    it('should satisfy $lt', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $lt: 2 } } }
        )
      ).toBe(true);
    });
    it('should not satisfy $lt', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $lt: 1 } } }
        )
      ).toBe(false);
    });
    it('should satisfy $lte', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $lte: 1 } } }
        )
      ).toBe(true);
    });
    it('should not satisfy $lte', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $lte: 0 } } }
        )
      ).toBe(false);
    });
    it('should not satisfy $lte when undefined', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          {
            test: {
              $or: [
                { x: { $gt: undefined } },
                { x: { $gte: undefined } },
                { x: { $lt: undefined } },
                { x: { $lte: undefined } },
              ],
            },
          }
        )
      ).toBe(false);
    });
    it('should satisfy $in', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $in: [1, 2] } } }
        )
      ).toBe(true);
    });
    it('should not satisfy $in', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $in: [3, 2] } } }
        )
      ).toBe(false);
    });
    it('should not satisfy $in when no array', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $in: 'random' } } }
        )
      ).toBe(false);
    });
    it('should satisfy $nin', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $nin: [3, 2] } } }
        )
      ).toBe(true);
    });
    it('should not satisfy $nin', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $nin: [1, 2] } } }
        )
      ).toBe(false);
    });
    it('should satisfy $nin when no array', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $nin: 'random' } } }
        )
      ).toBe(true);
    });
    it('should satisfy $exists', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $exists: true } } }
        )
      ).toBe(true);
    });
    it('should not satisfy $exists', () => {
      expect(
        satisfies(
          {
            test: { x: 1, y: 2 },
          },
          { test: { x: { $exists: false } } }
        )
      ).toBe(false);
    });
    it('should satisfy $regex', () => {
      expect(
        satisfies(
          {
            test: { x: 'value' },
          },
          { test: { x: { $regex: 'VAL', $options: 'i' } } }
        )
      ).toBe(true);
    });
    it('should satisfy $regex with non string options', () => {
      expect(
        satisfies(
          {
            test: { x: 'value' },
          },
          { test: { x: { $regex: 'val' } } }
        )
      ).toBe(true);
    });
    it('should satisfy $regex with non string left side', () => {
      expect(
        satisfies(
          {
            test: { x: null },
          },
          { test: { x: { $regex: 'val' } } }
        )
      ).toBe(false);
    });
  });
});
