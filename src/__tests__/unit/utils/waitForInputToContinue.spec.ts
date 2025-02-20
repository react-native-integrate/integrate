/* eslint-disable @typescript-eslint/no-unsafe-call */

const stdout = {
  write: jest.fn(),
  clearLine: jest.fn(),
  cursorTo: jest.fn(),
};
const stdin = {
  isTTY: true,
  setRawMode: jest.fn(),
  off: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  on: jest.fn((_, listener: (data: string) => void) => listener('')),
};

describe('waitForInputToContinue', () => {
  const rollBack: (() => void)[] = [];
  beforeAll(() => {
    Object.entries(stdout).forEach(([key, value]) => {
      // @ts-ignore
      const orig = process.stdout[key];
      rollBack.push(() => {
        // @ts-ignore
        process.stdout[key] = orig;
      });
      // @ts-ignore
      process.stdout[key] = value;
    });
    Object.entries(stdin).forEach(([key, value]) => {
      // @ts-ignore
      const orig = process.stdin[key];
      rollBack.push(() => {
        // @ts-ignore
        process.stdin[key] = orig;
      });
      // @ts-ignore
      process.stdin[key] = value;
    });
  });
  afterAll(() => {
    rollBack.forEach(x => x());
  });

  it('should resolve', async () => {
    const {
      waitInputToContinue,
    } = require('../../../utils/waitInputToContinue');

    expect(process.stdin.isTTY).toBe(true);
    await expect(waitInputToContinue()).resolves.toBe('');
  });
  it('should reject if user cancels', async () => {
    // @ts-ignore
    process.stdin.on = jest.fn((_, listener: (data: string) => void) =>
      listener(decodeURI('%03'))
    );
    const {
      waitInputToContinue,
    } = require('../../../utils/waitInputToContinue');

    expect(process.stdin.isTTY).toBe(true);
    await expect(waitInputToContinue()).rejects.toThrowError('');
  });
  it('should resolve with keys', async () => {
    // @ts-ignore
    process.stdin.on = jest.fn((_, listener: (data: string) => void) => {
      listener('x'); //should ignore random input
      listener('y'); //should accept y or n
    });

    const {
      waitInputToContinue,
    } = require('../../../utils/waitInputToContinue');

    expect(process.stdin.isTTY).toBe(true);
    await expect(waitInputToContinue('', 'yn')).resolves.toBe('y');
  });
  it('should resolve with case sensitive keys', async () => {
    // @ts-ignore
    process.stdin.on = jest.fn((_, listener: (data: string) => void) => {
      listener('x'); //should ignore random input
      listener('İ'); //should accept y or n
    });

    const {
      waitInputToContinue,
    } = require('../../../utils/waitInputToContinue');

    expect(process.stdin.isTTY).toBe(true);
    await expect(waitInputToContinue('', 'İı')).resolves.toBe('İ');
  });

  describe('listenForKeys', () => {
    it('should resolve', () => {
      jest.useFakeTimers();
      // @ts-ignore
      process.stdin.on = jest.fn((_, listener: (data: string) => void) => {
        listener('s'); // should accept s
      });
      const { listenForKeys } = require('../../../utils/waitInputToContinue');

      const onKey = jest.fn();
      const release = listenForKeys('s', onKey);

      jest.advanceTimersByTime(0);
      release();

      expect(process.stdin.isTTY).toBe(true);
      expect(onKey).toHaveBeenCalledWith('s');
    });
    it('should resolve with case sensitive keys', () => {
      jest.useFakeTimers();
      // @ts-ignore
      process.stdin.on = jest.fn((_, listener: (data: string) => void) => {
        listener('x'); //should ignore random input
        listener('İ'); //should accept y or n
      });
      const { listenForKeys } = require('../../../utils/waitInputToContinue');

      const onKey = jest.fn();
      const release = listenForKeys('İı', onKey);

      jest.advanceTimersByTime(0);
      release();

      expect(process.stdin.isTTY).toBe(true);
      expect(onKey).toHaveBeenCalledWith('İ');
    });
  });
});
