import { options } from '../../options';

// generate tests for options get and set method
describe('options', () => {
  it('should get and set the default value', () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    options.set({ test: true } as any);
    expect(options.get()).toEqual({ test: true });
  });
});
